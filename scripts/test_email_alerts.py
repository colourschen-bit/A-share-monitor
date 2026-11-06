import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('alerts', Path(__file__).with_name('email-alerts.py'))
alerts = importlib.util.module_from_spec(spec)
spec.loader.exec_module(alerts)

class Transitions(unittest.TestCase):
    def row(self, bucket, model='v1'):
        return {'key':'sh600036','bucket':bucket,'modelKey':model}

    def test_baseline_repeat_and_reentry(self):
        events, state = alerts.transitions({}, [self.row('zone')])
        self.assertEqual(events, [])
        self.assertEqual(alerts.transitions(state,[self.row('zone')])[0], [])
        _, outside = alerts.transitions(state,[self.row('between')])
        self.assertEqual(len(alerts.transitions(outside,[self.row('zone')])[0]),1)

    def test_stale_skip_preserves_state(self):
        previous = {'sh600036':{'bucket':'zone','modelKey':'v1'}}
        self.assertEqual(alerts.transitions(previous,[]), ([],previous))

    def test_model_change_does_not_fake_price_crossing(self):
        _, state = alerts.transitions({},[self.row('between')])
        self.assertEqual(alerts.transitions(state,[self.row('above','v2')])[0],[])

    def test_risk_and_exit_review(self):
        _, state = alerts.transitions({},[self.row('zone')])
        for bucket in ['below','above']:
            self.assertEqual(len(alerts.transitions(state,[self.row(bucket)])[0]),1)

    def test_daily_report_distinguishes_failure_from_no_signal(self):
        text = alerts.daily_report({'total':61,'rows':[], 'skipped':[{'key':'hk00700','reason':'stale'}]}, [])
        self.assertIn('未获得任何可用比较结果', text)
        self.assertIn('hk00700', text)
        self.assertNotIn('目前无关注区', text)

    def test_daily_report_includes_existing_price_positions(self):
        row = {**self.row('zone'), 'name':'测试','code':'600036','market':'SH',
               'price':9,'time':'20261106140000','low':8,'high':9,'reference':10,
               'condition':'条件待核验','next':'现金复核'}
        text = alerts.daily_report({'total':1,'rows':[row],'skipped':[]},[])
        self.assertIn('新增跨区：0', text)
        self.assertIn('测试', text)
        self.assertIn('条件待核验', text)

if __name__ == '__main__':
    unittest.main()
