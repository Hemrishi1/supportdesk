import json
import os
import tempfile
import threading
import unittest
import urllib.request
import urllib.error
from unittest.mock import patch
import server

class SupportTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.previous_db = server.DB
        server.DB = server.Path(self.temp.name) / 'test.db'
        server.init_db()
        self.http = server.ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        self.thread = threading.Thread(target=self.http.serve_forever, daemon=True)
        self.thread.start()
        self.url = f'http://127.0.0.1:{self.http.server_port}'

    def tearDown(self):
        self.http.shutdown()
        self.http.server_close()
        self.thread.join()
        server.DB = self.previous_db
        self.temp.cleanup()

    def call(self, path, data=None, token=server.TOKEN):
        request = urllib.request.Request(self.url + path, data=json.dumps(data).encode() if data is not None else None,
            headers={'Content-Type':'application/json', 'X-App-Token':token})
        with urllib.request.urlopen(request) as r:
            return json.load(r)

    def test_full_review_and_persistence(self):
        self.call('/api/settings', {'company':'Acme','policy':'Refunds need billing review.'})
        result = self.call('/api/tickets', {'customer':'Maya','subject':'Duplicate charge','message':'I need a refund urgently','mode':'demo'})
        state = self.call('/api/state')
        ticket = state['tickets'][0]
        self.assertEqual(ticket['category'], 'Billing')
        self.assertEqual(ticket['priority'], 'High')
        self.assertIn('Acme', ticket['draft'])
        self.call('/api/review', {'id':result['id'], 'draft':'Reviewed response', 'status':'Approved'})
        server.init_db()
        state = self.call('/api/state')
        self.assertEqual(state['tickets'][0]['status'], 'Approved')
        self.assertEqual(state['tickets'][0]['draft'], 'Reviewed response')
        self.assertEqual(len(state['events']), 2)

    def test_rejects_unauthorized_mutation(self):
        with self.assertRaises(urllib.error.HTTPError) as error:
            self.call('/api/settings', {'company':'Attacker','policy':''}, token='wrong')
        self.assertEqual(error.exception.code,403)

    def test_validation_and_missing_ticket(self):
        with self.assertRaises(urllib.error.HTTPError) as error:
            self.call('/api/tickets', {'customer':'','subject':'x','message':'x','mode':'demo'})
        self.assertEqual(error.exception.code,400)
        with self.assertRaises(urllib.error.HTTPError) as error:
            self.call('/api/review', {'id':99,'draft':'x','status':'Approved'})
        self.assertEqual(error.exception.code,404)
        self.assertEqual(self.call('/api/state')['tickets'], [])

    def test_live_key_required_without_silent_demo_fallback(self):
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaises(urllib.error.HTTPError) as error:
                self.call('/api/tickets', {'customer':'M','subject':'x','message':'x','mode':'live'})
        self.assertEqual(error.exception.code,400)
        self.assertEqual(self.call('/api/state')['tickets'], [])

    def test_live_schema_and_refusal(self):
        result={'category':'Billing','priority':'Normal','summary':'Duplicate invoice','draft':'Please share the invoice reference.','reason':'Requires billing review.'}
        class Response:
            def __enter__(self): return self
            def __exit__(self,*args): pass
            def read(self): return json.dumps({'status':'completed','output':[{'type':'message','content':[{'type':'output_text','text':json.dumps(result)}]}]}).encode()
        with patch.dict(os.environ,{'OPENAI_API_KEY':'test','OPENAI_MODEL':'gpt-5.2','AI_PROVIDER':'openai'}, clear=True), patch('server.urllib.request.urlopen', return_value=Response()) as call:
            self.assertEqual(server.analyze({'message':'refund'},{'company':'Acme','policy':''},'live'),result)
            body=json.loads(call.call_args.args[0].data)
            self.assertFalse(body['store'])
            self.assertTrue(body['text']['format']['strict'])
        with self.assertRaises(ValueError): server.validate_result({**result,'priority':'Bogus'})

    def test_gemini_live_schema(self):
        result={'category':'Technical','priority':'High','summary':'App crash','draft':'We are investigating the crash.','reason':'Technical triage.'}
        class GeminiResponse:
            def __enter__(self): return self
            def __exit__(self,*args): pass
            def read(self):
                return json.dumps({
                    'candidates': [
                        {
                            'content': {
                                'parts': [{'text': json.dumps(result)}]
                            },
                            'finishReason': 'STOP'
                        }
                    ]
                }).encode('utf-8')

        with patch.dict(os.environ, {'GEMINI_API_KEY': 'gemini-secret-123'}, clear=True), patch('server.urllib.request.urlopen', return_value=GeminiResponse()) as call:
            self.assertEqual(server.analyze({'message':'crash on boot'}, {'company':'Acme','policy':''}, 'live'), result)
            req = call.call_args.args[0]
            self.assertIn('gemini-2.5-flash:generateContent', req.full_url)
            self.assertEqual(req.headers['X-goog-api-key'], 'gemini-secret-123')
            body = json.loads(req.data.decode('utf-8'))
            self.assertIn('systemInstruction', body)
            self.assertEqual(body['generationConfig']['responseMimeType'], 'application/json')
            self.assertEqual(body['generationConfig']['responseSchema']['type'], 'OBJECT')

    def test_dotenv_loading(self):
        env_file = server.Path(self.temp.name) / '.env'
        env_file.write_text("GEMINI_API_KEY=test-from-env\nGEMINI_MODEL=gemini-1.5-pro\n# comment\n", encoding='utf-8')
        with patch.dict(os.environ, {}, clear=True):
            server.load_dotenv(env_file)
            provider, model, key = server.get_ai_config()
            self.assertEqual(provider, 'gemini')
            self.assertEqual(model, 'gemini-1.5-pro')
            self.assertEqual(key, 'test-from-env')

    def test_provider_precedence(self):
        with patch.dict(os.environ, {'GEMINI_API_KEY': 'gkey', 'OPENAI_API_KEY': 'okey'}, clear=True):
            p, m, k = server.get_ai_config()
            self.assertEqual(p, 'gemini')
            self.assertEqual(k, 'gkey')
        with patch.dict(os.environ, {'GEMINI_API_KEY': 'gkey', 'OPENAI_API_KEY': 'okey', 'AI_PROVIDER': 'openai'}, clear=True):
            p, m, k = server.get_ai_config()
            self.assertEqual(p, 'openai')
            self.assertEqual(k, 'okey')
        with patch.dict(os.environ, {'EXPLABS_API_KEY': 'ekey'}, clear=True):
            p, m, k = server.get_ai_config()
            self.assertEqual(p, 'experiential')
            self.assertEqual(m, 'gpt-5.6-luna')
            self.assertEqual(k, 'ekey')
        with patch.dict(os.environ, {'OPENAI_MODEL': 'gpt-5.6-luna'}, clear=True):
            p, m, k = server.get_ai_config()
            self.assertEqual(p, 'experiential')
            self.assertEqual(m, 'gpt-5.6-luna')

    def test_experiential_key_missing(self):
        with patch.dict(os.environ, {'OPENAI_MODEL': 'gpt-5.6-luna'}, clear=True):
            with self.assertRaises(ValueError) as ctx:
                server.analyze({'message':'test'}, {'company':'Acme','policy':''}, 'live')
            self.assertIn('EXPLABS_API_KEY is not set. Please create one under Settings -> API Keys and export it.', str(ctx.exception))

    def test_experiential_live_schema(self):
        result={'category':'Account','priority':'Normal','summary':'Reset email','draft':'Here are the instructions.','reason':'Account assistance.'}
        class ExpResponse:
            def __enter__(self): return self
            def __exit__(self,*args): pass
            def read(self):
                return json.dumps({
                    'choices': [{
                        'message': {
                            'role': 'assistant',
                            'content': json.dumps(result)
                        },
                        'finish_reason': 'stop'
                    }],
                    'usage': {'prompt_tokens': 15, 'completion_tokens': 25, 'total_tokens': 40}
                }).encode('utf-8')

        with patch.dict(os.environ, {'EXPLABS_API_KEY': 'test-exp-key', 'OPENAI_MODEL': 'gpt-5.6-luna'}, clear=True), patch('server.urllib.request.urlopen', return_value=ExpResponse()) as call:
            self.assertEqual(server.analyze({'message':'help reset'}, {'company':'Acme','policy':''}, 'live'), result)
            req = call.call_args.args[0]
            self.assertEqual(req.full_url, 'https://api.experientiallabs.ai/v1/chat/completions')
            self.assertEqual(req.headers['Authorization'], 'Bearer test-exp-key')
            body = json.loads(req.data.decode('utf-8'))
            self.assertEqual(body['model'], 'gpt-5.6-luna')

if __name__ == '__main__': unittest.main()
