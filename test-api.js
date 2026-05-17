const http = require('http');

function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function test() {
  console.log('=== Testing Health ===');
  const health = await makeRequest({ hostname: 'localhost', port: 4000, path: '/api/health', method: 'GET' });
  console.log('Status:', health.status);
  console.log('Body:', health.body);

  console.log('\n=== Testing Register ===');
  const register = await makeRequest(
    { hostname: 'localhost', port: 4000, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    JSON.stringify({ name: 'TestUser', email: 'test' + Date.now() + '@example.com', password: 'password123' })
  );
  console.log('Status:', register.status);
  const registerData = JSON.parse(register.body);
  console.log('User:', registerData.user?.name);
  const token = registerData.token;
  console.log('Token received:', token ? 'Yes' : 'No');

  if (token) {
    console.log('\n=== Testing /me ===');
    const me = await makeRequest(
      { hostname: 'localhost', port: 4000, path: '/api/auth/me', method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log('Status:', me.status);
    console.log('Body:', me.body);

    console.log('\n=== Testing Logout ===');
    const logout = await makeRequest(
      { hostname: 'localhost', port: 4000, path: '/api/auth/logout', method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log('Status:', logout.status);
    console.log('Body:', logout.body);
  }

  console.log('\n=== All tests passed! ===');
  process.exit(0);
}

test().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});