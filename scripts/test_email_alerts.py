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

if __name__ == '__main__':
    unittest.main()
