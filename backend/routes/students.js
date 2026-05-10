
const express = require('express');
const router = express.Router(); //router này sẽ kế thừa middleware từ app chính khi được import

const studentsList = require('./../data/students');
const PERMISSIONS = require('./../data/permissions');
const { authorize } = require('./../middlewares/authorize');

// --- API Endpoints ---
router.get('/', authorize(PERMISSIONS.STUDENT.READ), (req, res) => {
  res.status(200).json(studentsList);
});

router.get('/:id', authorize(PERMISSIONS.STUDENT.READ), (req, res) => {
    const student = studentsList.find(student => student.id === req.params.id);
    if (student) {
        res.status(200).json(student);
    } else {
        res.status(404).send('Không tìm thấy học sinh');
    }
});

    // {
    //     id: 'DH92.030',
    //     name: 'Lý Văn Tùng',
    //     address: 'Bản Na Tông - Xã Na Ư - Huyện Điện Biên - Điện Biên',
    //     birthday: '2013-09-07',
    //     people: 'Thái',
    //     situation: 'Bố mẹ đều làm nông, thu nhập bấp bênh, gia đình có 5 anh chị em nên rất khó khăn.',
    //     recommender: 'Cô Ngô Thị Lý',
    //     status: 'inProgress',
    //     startDate: '2025-01-01',
    //     endDate: '',
    //     funds: '6000000',
    //     balance: '0',
    //     remark: 'Đã nhận được xe đạp từ chương trình.',
    //     currentClass: '5',
    //     currentSchool: 'TR003',
    //     currentSponsor: 'NHT0020',
    //     currentVolunteer: 'TNV0003',
    //     currentTeacher: 'GVN0003'
    // }

router.post('/', authorize(PERMISSIONS.STUDENT.CREATE), (req, res) => {
    const { name, address, birthday, people, situation, recommender, status, startDate, remark, currentClass, currentSchool } = req.body;
    //validate newUser
    if ((!name) || (!address) || (!birthday) || (!people) || (!situation) ||
            (!recommender) || (!status) || (!startDate) || (!currentClass) || (!currentSchool)) {
        res.status(401).send('Thiếu thông tin học sinh');
        return;
    }
    const existStudent = studentsList.find(student => student.name === name && student.address === address && student.birthday === birthday);
    if (existStudent) {
        res.status(401).send('Học sinh đã tồn tại');
        return;
    }
    //lấy thông tin
    const newStudent = {
        id: getNewId(address), 
        name, 
        address, 
        birthday, 
        people, 
        situation, 
        recommender, 
        status, 
        startDate, 
        endDate: '',
        funds: 0,
        balance: 0,
        remark, 
        currentClass, 
        currentSchool,
        currentSponsor: '',
        currentVolunteer: '',
        currentTeacher: ''
    };
    
    //thêm newStudent vào studentsList
    studentsList.push(newStudent);
    res.status(200).json(newStudent);
});

router.patch('/:id', authorize(PERMISSIONS.STUDENT.UPDATE), (req, res) => {
    const id = req.params.id;
    const { name, address, birthday, people, situation, recommender, status, startDate, endDate, remark, currentClass, currentSchool, currentSponsor, currentVolunteer, currentTeacher } = req.body;

    const index = studentsList.findIndex(student => student.id === id);
    if (index === -1)
    {
        res.status(404).send('Không tìm thấy student');
        return;
    }
    //cập nhật giá trị mới
    studentsList[index] = { ...studentsList[index], name, address, birthday, people, situation, recommender, status, startDate, endDate, remark, currentClass, currentSchool, currentSponsor, currentVolunteer, currentTeacher };
    res.status(200).json(studentsList[index]);
});

router.delete('/:id', authorize(PERMISSIONS.STUDENT.DELETE), (req, res) => {
    const id = req.params.id;
    const index = studentsList.findIndex(student => student.id === id);
    if (index === -1)
    {
        res.status(404).send('Không tìm thấy học sinh');
        return;
    }
    //xóa phần tử thứ index
    studentsList.splice(index, 1);
    res.status(200).send("Xóa học sinh thành công");
})



function getNewId(address) {
    // TODO: xử lý address để lấy mã tương ứng theo tỉnh

    const getNumber = (str) => parseInt(str.split('.').pop());

    const latestStudent = studentsList.reduce((max, current) => getNumber(current.id) > getNumber(max.id) ? current : max);
    const idNumber = getNumber(latestStudent.id) + 1;
    return `DH92.${String(idNumber).padStart(3, '0')}`;
}

module.exports = router;