const ROLES = require('./roles');

const users = [
    { id: 'QTV0001', name: "Nguyen Thao", email: "thao@gmail.com", password: "123456", phone: "0905111111", role: ROLES.ADMIN, status: 'active' },
    { id: 'TNV0001', name: "Vu Lien", email: "lien@gmail.com", password: "123456", phone: "0905222222", role: ROLES.VOLUNTEER, status: 'active' },
    { id: 'TNV0002', name: "Thu Nga", email: "nga@gmail.com", password: "123456", phone: "0905279752", role: ROLES.VOLUNTEER, status: 'active' },
    { id: 'TNV0003', name: "My Ha", email: "ha@gmail.com", password: "123456", phone: "0901492849", role: ROLES.VOLUNTEER, status: 'active' },
    { id: 'NHT0001', name: "Trần Phương Hiền", email: "hien@gmail.com", password: "123456", phone: "0905293444", role: ROLES.SPONSOR, status: 'active' },
    { id: 'NHT0002', name: "Nguyễn Văn Minh", email: "minh@gmail.com", password: "123456", phone: "0905777777", role: ROLES.SPONSOR, status: 'active' },
    { id: 'NHT0003', name: "Lê Thị Thu Hoài", email: "hoai@gmail.com", password: "123456", phone: "0905174807", role: ROLES.SPONSOR, status: 'active' },
    { id: 'NHT0004', name: "Phạm Thanh Tùng", email: "tung@gmail.com", password: "123456", phone: "0905174807", role: ROLES.SPONSOR, status: 'active' },
    { id: 'NHT0005', name: "Vũ Ngọc Lan", email: "lan@gmail.com", password: "123456", phone: "090393049", role: ROLES.SPONSOR, status: 'active' },
    { id: 'GVN0001', name: "Ngoc Thu", email: "thu@gmail.com", password: "123456", phone: "0905458294", role: ROLES.TEACHER, status: 'active' },
    { id: 'GVN0002', name: "Minh Chau", email: "chau@gmail.com", password: "123456", phone: "0905572017", role: ROLES.TEACHER, status: 'active' },
    { id: 'GVN0003', name: "My Linh", email: "linh@gmail.com", password: "123456", phone: "0905839930", role: ROLES.TEACHER, status: 'active' },
    { id: 'GVN0004', name: "Huu Hoang", email: "hoang@gmail.com", password: "123456", phone: "0905483939", role: ROLES.TEACHER, status: 'inactive' },
];
    
module.exports = users;