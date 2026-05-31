const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const token = JSON.parse(data).data.accessToken;
    
    const req2 = http.request({
      hostname: 'localhost',
      port: 5001,
      path: '/students',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }, (res2) => {
      let data2 = '';
      res2.on('data', (chunk) => data2 += chunk);
      res2.on('end', () => console.log('POST Response:', data2));
    });
    
    req2.write(JSON.stringify({
      full_name: "Test Student " + Date.now(),
      date_of_birth: "2015-03-01",
      gender: "Male",
      address: "Bản Nà Lốc, Xã Nùng Nàng, Lai Châu",
      school: "Tiểu Học Nùng Nàng",
      status: "ACTIVE",
      family_condition: "Gia đình khó khăn"
    }));
    req2.end();
  });
});

req.write(JSON.stringify({ email: 'thao@gmail.com', password: 'password123' }));
req.end();
