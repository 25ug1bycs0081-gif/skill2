(async () => {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@pirateshms.com', password: 'pirates123' }),
  });

  console.log('LOGIN_STATUS', loginRes.status);
  console.log('LOGIN_BODY', await loginRes.text());

  const setCookie = loginRes.headers.get('set-cookie');
  console.log('SET_COOKIE', setCookie);

  const meRes = await fetch('http://localhost:5000/api/auth/me', {
    headers: setCookie ? { Cookie: setCookie.split(';')[0] } : {},
  });

  console.log('ME_STATUS', meRes.status);
  console.log('ME_BODY', await meRes.text());
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
