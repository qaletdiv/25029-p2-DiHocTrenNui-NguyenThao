## Cách "kế thừa" các cài đặt từ App cho các route con:

**Middleware**: Bất kỳ middleware nào bạn đặt trước dòng ```app.use('/users', ...)``` (như express.json(), cors, auth...) đều sẽ tự động áp dụng cho các route con.

**Biến môi trường/Cấu hình**: Bạn có thể sử dụng ```req.app.get('key')``` bên trong các file route con để truy xuất các biến đã ```set``` ở file ```server.js```.
Ví dụ thực tế:
- Tại file ```server.js``` thiết lập giá trị:
```
const express = require('express');
const app = express();

// Thiết lập các biến "toàn cục" của ứng dụng
app.set('api_version', 'v1.0.2');
app.set('company_name', 'TechCorp');

const usersRoute = require('./routes/users');
app.use('/users', usersRoute);

app.listen(3000);
```

- Tại file route con lấy giá trị:
```
const express = require('express');
const router = express.Router();

router.get('/info', (req, res) => {
    // Truy xuất ngược lại các biến đã set ở server.js
    const version = req.app.get('api_version');
    const company = req.app.get('company_name');

    res.json({
        message: `Welcome to ${company} API`,
        version: version
    });
});

module.exports = router;

```

*Ngoài ra còn có cách sử dụng thư viện để hỗ trợ quét tự động các routes con, chỉ cần tạo file mới trong thư mục routes, API sẽ tự hoạt động mà không cần sửa file chính ```server.js``` => File ```server.js``` sẽ không bị phình to khi dự án có nhiều API.*