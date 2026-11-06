"""Gmail notifications; credentials only from GitHub Actions secrets."""
import argparse
import json
import os
from pathlib import Path
import smtplib
import ssl
import subprocess
from datetime import datetime
from zoneinfo import ZoneInfo
from email.message import EmailMessage

STATE = Path('.alert-state/state.json')
LABELS = {'below': '低于关注区下沿：风险复核', 'zone': '进入条件关注区', 'above': '高于估值参照：减仓/退出复核'}

def transitions(previous, rows):
    events = []
    updated = dict(previous)
    for row in rows:
        old = previous.get(row['key'])
        # First observation establishes a baseline; model changes are not price crossings.
        if old and old['modelKey'] == row['modelKey'] and old['bucket'] != row['bucket'] and row['bucket'] in LABELS:
            events.append(row)
        updated[row['key']] = {'bucket': row['bucket'], 'modelKey': row['modelKey']}
    return events, updated

def send_mail(subject, body):
    sender = os.environ.get('GMAIL_ADDRESS', '').strip()
    password = os.environ.get('GMAIL_APP_PASSWORD', '').replace(' ', '').strip()
    if not sender or not password:
        raise RuntimeError('Missing GMAIL_ADDRESS or GMAIL_APP_PASSWORD secrets')
    message = EmailMessage()
    message['From'] = sender
    message['To'] = sender
    message['Subject'] = subject
    message.set_content(body)
    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=ssl.create_default_context(), timeout=30) as smtp:
        smtp.login(sender, password)
        refused = smtp.send_message(message)
        if refused:
            raise RuntimeError('SMTP rejected recipient')

def body_for(events):
    blocks = ['价格提醒，不是自动交易指令。首笔/仓位/现金限制仍以看板为准。']
    for row in events:
        d = 3 if row['price'] < 10 else 2
        unit = 'HKD' if row['market'] == 'HK' else 'CNY'
        blocks.append(f"{row['name']} ({row['code']})：{LABELS[row['bucket']]}\n"
                      f"行情：{row['price']:.{d}f} {unit}；腾讯时间 {row['time']}（北京时间）；{row.get('freshness', '可能延迟')}\n"
                      f"条件区：{row['low']:.3f}–{row['high']:.3f} {unit}；估值参照：{row['reference']:.3f} {unit}\n"
                      f"条件：{row['condition']}\n下一核验：{row['next']}")
    blocks.append('高于模型参照不等于已形成卖点；缺少实际持仓，无法判断应减仓数量。\n港股换算沿用看板研究汇率，并非实时汇率。\nhttps://colourschen-bit.github.io/A-share-monitor/')
    return '\n\n'.join(blocks)

def daily_report(data, events):
    rows, skipped = data['rows'], data['skipped']
    matches = [r for r in rows if r['bucket'] in LABELS]
    header = (f"本次检查：{data.get('total', len(rows)+len(skipped))}项；"
              f"有效比较：{len(rows)}项；跳过：{len(skipped)}项；新增跨区：{len(events)}项。\n"
              '以下是当前价格位置汇总，含首次建立基线或持续处于区间的项目，不表示今天新出现的买卖信号。')
    if not rows:
        header += '\n本次未获得任何可用比较结果，不能据此判断没有机会或风险。'
    body = body_for(matches) if matches else ('有效比较项目中，目前无关注区/风险下沿/估值上沿提醒。' if rows else '请检查下列数据问题。')
    failures = '\n'.join(f"{r['key']}：{r['reason']}" for r in skipped)
    return header + '\n\n' + body + ('\n\n未完成项目：\n' + failures if failures else '')

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--test-email', action='store_true')
    args = parser.parse_args()
    if args.test_email:
        if not args.dry_run:
            send_mail('A股看板邮件连接测试', '邮件通道已连通。这是测试邮件，不包含交易信号。\nhttps://colourschen-bit.github.io/A-share-monitor/')
        print('Test email dry-run' if args.dry_run else 'SMTP accepted test email')
        return
    data = json.loads(subprocess.check_output(['node', 'scripts/alert-quotes.cjs'], text=True))
    previous = json.loads(STATE.read_text()) if STATE.exists() else {}
    events, updated = transitions(previous, data['rows'])
    print(f"Validated quotes: {len(data['rows'])}; skipped: {len(data['skipped'])}; alerts: {len(events)}")
    for row in data['skipped']:
        print(f"Skip {row['key']}: {row['reason']}")
    day = datetime.now(ZoneInfo('Asia/Shanghai')).date().isoformat()
    needs_summary = previous.get('_lastDigestDate') != day
    report = daily_report(data, events)
    if args.dry_run:
        print(report)
        return
    # Verify configuration even on a baseline run, so missing setup never looks enabled.
    if not os.environ.get('GMAIL_ADDRESS') or not os.environ.get('GMAIL_APP_PASSWORD'):
        raise RuntimeError('Configure both Gmail repository secrets first')
    if needs_summary:
        send_mail(f"A股看板日检 {day}：有效{len(data['rows'])}项 / 待检查{len(data['skipped'])}项", report)
        updated['_lastDigestDate'] = day
        print('SMTP accepted daily inspection email')
    elif events:
        send_mail(f'A股看板：{len(events)}项价格区间变化', body_for(events))
        print('SMTP accepted alert email')
    STATE.parent.mkdir(exist_ok=True)
    temp = STATE.with_suffix('.tmp')
    temp.write_text(json.dumps(updated, ensure_ascii=False))
    temp.replace(STATE)
    if not data['rows']:
        raise RuntimeError('Inspection failed: zero usable comparisons; diagnostic email sent or already reported today')

if __name__ == '__main__':
    main()
