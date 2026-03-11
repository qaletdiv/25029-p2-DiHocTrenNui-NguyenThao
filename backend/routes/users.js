
const express = require('express');
const router = express.Router(); //router này sẽ kế thừa middleware từ app chính khi được import

const usersList = require('./../data/users');

// --- API Endpoints ---
router.get('/', (req, res) => {
  res.status(200).json(usersList);
});

router.get('/:id', (req, res) => {
    const user = usersList.find(user => user.id === req.params.id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).send('Không tìm thấy user');
    }
});

router.post('/', (req, res) => {
    const { name, email, password, phone, role } = req.body;
    //validate newUser
    if ((!name) || (!email) || (!password) || (!phone) || (!role)) {
        res.status(401).send('Thiếu thông tin User');
        return;
    }
    const existUser = usersList.find(user => user.email === email);
    if (existUser) {
        res.status(401).send('Email đã tồn tại');
        return;
    }
    //lấy thông tin
    const newUser = {id: getNewId(role), name, email, password, phone, role, status: 'active'};
    
    //thêm newUser vào usersList
    usersList.push(newUser);
    res.status(200).json(newUser);
});

router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const { name, password, phone, status } = req.body;
    const index = usersList.findIndex(user => user.id === id);
    if (index === -1)
    {
        res.status(404).send('Không tìm thấy user');
        return;
    }
    //cập nhật giá trị mới
    usersList[index] = { ...usersList[index], name, password, phone, status };
    res.status(200).json(usersList[index]);
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const index = usersList.findIndex(user => user.id === id);
    if (index === -1)
    {
        res.status(404).send('Không tìm thấy user');
        return;
    }
    //xóa phần tử thứ index
    usersList.splice(index, 1);
    res.status(200).send("Xóa user thành công");
})



function getNewId(role) {
    const usersByRole = usersList.filter(user => user.role === role);
    if (usersByRole.length === 0) return "";

    const getNumber = (str) => parseInt(str.replace(/^\D+/g, ''));

    const latestUser = usersByRole.reduce((max, current) => getNumber(current.id) > getNumber(max.id) ? current : max);
    const idNumber = getNumber(latestUser.id) + 1;
    switch (role) {
        case 'admin':
            return `QTV${String(idNumber).padStart(4, '0')}`;
        case 'volunteer':
            return `TNV${String(idNumber).padStart(4, '0')}`;
        case 'sponsor':
            return `NHT${String(idNumber).padStart(4, '0')}`;
        case 'teacher':
            return `GVN${String(idNumber).padStart(4, '0')}`;
        default:
            return '';
    }
}

module.exports = router;