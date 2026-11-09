# 独立价格提醒调度

GitHub schedule 在2026-11-06与11-09未见触发记录，根因未确认。新增 ChatGPT exact_schedule 工作日北京时间14:05独立触发；原GitHub14:20/35补检保留，邮件脚本按日去重。

每次通过已连接GitHub工具读取main分支的 .github/price-alert-dispatch.json，保留其他文件。将 requestedAt 更新为当前UTC ISO时间、requestedDate为北京时间当天YYYY-MM-DD、source为chatgpt-scheduler。更新时必须用新读取的blob SHA。不写任何密码、邮箱凭据或私人数据。提交该文件将通过price-alerts.yml的push路径过滤运行正式check，不是test。

写入前检查actions/runs中最近的Price alerts to Gmail记录。如果已经有北京时间当天成功的正式检查并明确有SMTP日检发送成功，可只报告已完成；无法确认则触发。同一天重试可使用新requestedAt，发信由现有去重控制。

写入后读回文件及commit，轮询与该commit关联的Price alerts to Gmail运行（每20秒最多8次）；读取monitor日志，报告61项实际有效数、跳过原因、SMTP accepted daily inspection email是否出现。若未出现新的SMTP记录，检查是否同日去重。必要时通过Gmail只读检索 subject:"A股看板日检" 当天邮件确认收件。收件地址沿用已配置的GitHub Secrets，目标colours.chen@gmail.com。不读取/修改密钥，不改变估值区间，不把旧行情当实时。

必须区分：创建触发提交、任务真正运行、SMTP接收、Gmail收件。失败时在任务结果明确记录链接和原因，不宣称自动运行或投递成功。
