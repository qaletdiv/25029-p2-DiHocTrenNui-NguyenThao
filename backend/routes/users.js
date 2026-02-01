
const express = require('express');
const router = express.Router(); //router này sẽ kế thừa middleware từ app chính khi được import

const usersList = require('./../data/users');


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
})

module.exports = router;