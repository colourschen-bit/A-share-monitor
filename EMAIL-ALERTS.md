# Gmail 价格提醒

复用当前 index.html 中的数据加载顺序及 app.js 的 value / executionText；默认只检查15只核心。网页关闭也能检查，不需要 Google 表格或 Apps Script。

## 启用（只操作一次）

1. 在 Google 账号创建名为 `A-share-monitor` 的应用密码，需要已开启两步验证。官方说明：https://support.google.com/accounts/answer/185833 。不要使用主密码，也不要把应用密码发到聊天或写进代码。如果账号不提供应用密码，先停止此配置。
2. 在仓库 Settings → Secrets and variables → Actions → New repository secret 添加两个密钥：
   - `GMAIL_ADDRESS`：接收提醒的 Gmail 完整地址；脚本用同一邮箱向自己发送。
   - `GMAIL_APP_PASSWORD`：刚生成的应用密码。
3. 确保本改动在 main 分支。进入 Actions → Price alerts to Gmail → Run workflow，mode 选择 `test`。收到测试邮件后，在交易日下午14点附近运行一次 `check` 建立基线。
4. 后续周一至周五北京时间14:05左右自动检查，GitHub可能延迟，不承诺实时或盘中每次穿越必达。超过20分钟的旧报价跳过。交易所节假日当日没有报价时不会使用前一日价格发信。

## 提醒含义

- 进入条件关注区：保留 executionHold、经营/估值待核提示，不显示为已批准买入。
- 跌到区间下沿以下：提示先检查风险。
- 超过模型基准现值/对照值：提醒减仓/退出复核，明确不自动构成卖点；没有实际持仓，不能给减仓股数。
- 已到模型复核日、模型缺失、论点失效或报价不合格：跳过并记日志。
- 港股原币阈值按看板已有研究汇率换算，不是实时外汇行情。

## 去重与限制

首次有效观察只建立基线，不把全部现存状态当成新变化；同一区间持续停留不重复发送。离开再进入、或跨入另一提醒区才发送。更新估值模型后重新建基线，不伪称价格穿越。失败/陈旧报价不重置旧状态。

GitHub Actions cache 存储上次观察状态；缓存被清理时会重建基线。SMTP提交成功后才保存新状态；邮件已被服务器接收但缓存保存失败时，后续仍可能重复。SMTP接收不保证进入收件箱，请检查垃圾邮件。

`dry-run` 不发邮件、不更新基线；`test` 只测试邮箱；`check` 执行正式检查。零合格报价或缺密钥会使任务失败，不伪报启用。任务日志不输出密钥。

暂停：Actions 中禁用该工作流；撤销邮件权限：在 Google 账号删除该应用密码。此前 Google 表格任务仍独立存在；确认新邮件通道可用后，可在 Apps Script 触发器页面删除旧任务避免双重提醒。

## 本地验证

```
node scripts/test-email-alerts.cjs
python scripts/test_email_alerts.py
```

测试不联网、不发送邮件。真实抓取和邮件投递需启用后在 GitHub 上验证。
