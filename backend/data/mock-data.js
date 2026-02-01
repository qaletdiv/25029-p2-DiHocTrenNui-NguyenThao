export const originalUsers = [
    { id: 'QTV0001', name: "Nguyen Thao", email: "thao@gmail.com", password: "123456", phone: "0905111111", role: "admin", status: 'active' },
    { id: 'TNV0001', name: "Vu Lien", email: "lien@gmail.com", password: "123456", phone: "0905222222", role: "volunteer", status: 'active' },
    { id: 'TNV0002', name: "Thu Nga", email: "nga@gmail.com", password: "123456", phone: "0905279752", role: "volunteer", status: 'active' },
    { id: 'TNV0003', name: "My Ha", email: "ha@gmail.com", password: "123456", phone: "0901492849", role: "volunteer", status: 'active' },
    { id: 'NHT0001', name: "Trần Phương Hiền", email: "hien@gmail.com", password: "123456", phone: "0905293444", role: "sponsor", status: 'active' },
    { id: 'NHT0002', name: "Nguyễn Văn Minh", email: "minh@gmail.com", password: "123456", phone: "0905777777", role: "sponsor", status: 'active' },
    { id: 'NHT0003', name: "Lê Thị Thu Hoài", email: "hoai@gmail.com", password: "123456", phone: "0905174807", role: "sponsor", status: 'active' },
    { id: 'NHT0004', name: "Phạm Thanh Tùng", email: "tung@gmail.com", password: "123456", phone: "0905174807", role: "sponsor", status: 'active' },
    { id: 'NHT0005', name: "Vũ Ngọc Lan", email: "lan@gmail.com", password: "123456", phone: "090393049", role: "sponsor", status: 'active' },
    { id: 'GVN0001', name: "Ngoc Thu", email: "thu@gmail.com", password: "123456", phone: "0905458294", role: "teacher", status: 'active' },
    { id: 'GVN0002', name: "Minh Chau", email: "chau@gmail.com", password: "123456", phone: "0905572017", role: "teacher", status: 'active' },
    { id: 'GVN0003', name: "My Linh", email: "linh@gmail.com", password: "123456", phone: "0905839930", role: "teacher", status: 'active' },
    { id: 'GVN0004', name: "Huu Hoang", email: "hoang@gmail.com", password: "123456", phone: "0905483939", role: "teacher", status: 'inactive' },
];


export const accessControlList = {
    'admin': {
        configUser: true,
        viewStudent: true,
        editStudent: true,
        viewSponsor: true,
        editSponsor: true,
        viewSchool: true,
        editSchool: true,
        viewTransactionRecord: true,
        editTransactionRecord: true,
        viewReport: true
    },
    'volunteer': {
        configUser: false,
        viewStudent: true,
        editStudent: true,
        viewSponsor: true,
        editSponsor: true,
        viewSchool: true,
        editSchool: true,
        viewTransactionRecord: true,
        editTransactionRecord: true,
        viewReport: true
    },
    'sponsor': {
        configUser: false,
        viewStudent: true,
        editStudent: false,
        viewSponsor: true,
        editSponsor: false,
        viewSchool: false,
        editSchool: false,
        viewTransactionRecord: true,
        editTransactionRecord: false,
        viewReport: true
    },
    'teacher': {
        configUser: false,
        viewStudent: true,
        editStudent: true,
        viewSponsor: false,
        editSponsor: false,
        viewSchool: true,
        editSchool: true,
        viewTransactionRecord: false,
        editTransactionRecord: false,
        viewReport: true
    },
}

export const originalStudents = [
    {
        id: 'DH92.001',
        name: 'Trần Văn Mạnh',
        address: 'Bản Nà Lốc - Xã Nùng Nàng - Huyện Tam Đường - Lai Châu',
        birthday: '2015-03-12',
        people: 'Dao',
        situation: 'Gia đình đông con, bố mẹ làm nương rẫy, kinh tế rất khó khăn. Mẹ bị bệnh tim bẩm sinh.',
        recommender: 'Thầy Nguyễn Hữu Hoàng',
        status: 'inProgress',
        startDate: '2025-10-01',
        endDate: '',
        funds: '3000000',
        balance: '1500000',
        remark: '',
        currentClass: '5',
        currentSchool: 'TR001',
        currentSponsor: 'NHT0001',
        currentVolunteer: 'TNV0001',
        currentTeacher: 'GVN0001'
    },
    {
        id: 'DH92.002',
        name: 'Phan Thị Hoa',
        address: 'Thôn 3 - Xã Trà Mai - Huyện Nam Trà My - Quảng Nam',
        birthday: '2014-08-25',
        people: 'Cor',
        situation: 'Mồ côi cha, mẹ đi làm thuê nhưng bị tai nạn lao động, mất khả năng lao động. Sống cùng bà ngoại già yếu.',
        recommender: 'Cô Trần Thị Thu Hà',
        status: 'inProgress',
        startDate: '2025-09-01',
        endDate: '',
        funds: '4000000',
        balance: '2000000',
        remark: 'Hỗ trợ thêm chi phí khám bệnh cho mẹ.',
        currentClass: '6',
        currentSchool: 'TR002',
        currentSponsor: 'NHT0001',
        currentVolunteer: 'TNV0001',
        currentTeacher: 'GVN0002'
    },
    {
        id: 'DH92.003',
        name: 'Võ Văn Hùng',
        address: 'Xã Ia Băng - Huyện Chư Prông - Gia Lai',
        birthday: '2016-04-07',
        people: 'Jrai',
        situation: 'Bố mất sớm do tai nạn giao thông, mẹ đi làm xa, Hùng ở với gia đình bác ruột có 4 người con.',
        recommender: 'Ông A Sinh',
        status: 'inProgress',
        startDate: '2025-11-01',
        endDate: '',
        funds: '1000000',
        balance: '0',
        remark: '',
        currentClass: '4',
        currentSchool: 'TR001',
        currentSponsor: 'NHT0002',
        currentVolunteer: 'TNV0001',
        currentTeacher: 'GVN0001'
    },
    {
        id: 'DH92.004',
        name: 'Lê Thị Thu',
        address: 'Bản Pa Vệ Sủ - Xã Pa Vệ Sủ - Huyện Mường Tè - Lai Châu',
        birthday: '2017-01-19',
        people: 'La Hủ',
        situation: 'Bố mẹ nghiện rượu, không có khả năng nuôi con. Thu sống với ông bà ngoại trong căn nhà tranh tre.',
        recommender: 'Cô Nguyễn Thị Lý',
        status: 'inProgress',
        startDate: '2025-04-01',
        endDate: '',
        funds: '5000000',
        balance: '500000',
        remark: '',
        currentClass: '3',
        currentSchool: 'TR001',
        currentSponsor: 'NHT0003',
        currentVolunteer: 'TNV0001',
        currentTeacher: 'GVN0001'
    },
    {
        id: 'DH92.005',
        name: 'Giàng A Sính',
        address: 'Thôn Lùng Cát - Xã Cán Chu Phìn - Huyện Mèo Vạc - Hà Giang',
        birthday: '2013-02-03',
        people: 'Mông',
        situation: 'Gia đình quá nghèo, nhà có 5 anh chị em. Sính phải nghỉ học để giúp bố mẹ làm nương rẫy.',
        recommender: 'Anh Đinh Văn Trưởng',
        status: 'inProgress',
        startDate: '2025-01-01',
        endDate: '',
        funds: '6000000',
        balance: '0',
        remark: 'Đã nhận hỗ trợ học phí và sách vở.',
        currentClass: '7',
        currentSchool: 'TR002',
        currentSponsor: 'NHT0003',
        currentVolunteer: 'TNV0001',
        currentTeacher: 'GVN0002'
    },
    {
        id: 'DH92.006',
        name: 'Điểu K Rô',
        address: 'Sóc Bù Gia Mập - Xã Bù Gia Mập - Huyện Bù Gia Mập - Bình Phước',
        birthday: '2015-05-15',
        people: 'S\'tiêng',
        situation: 'Bố bị tai biến, mẹ phải chăm sóc bố, không có khả năng làm việc nặng. K Rô sống với gia đình cô ruột.',
        recommender: 'Cô Ngô Thị Hải',
        status: 'inProgress',
        startDate: '2025-09-01',
        endDate: '',
        funds: '6000000',
        balance: '4000000',
        remark: '',
        currentClass: '5',
        currentSchool: 'TR001',
        currentSponsor: 'NHT0003',
        currentVolunteer: 'TNV0001',
        currentTeacher: 'GVN0001'
    },
    {
        id: 'DH92.007',
        name: 'Vũ Thị Minh',
        address: 'Bản Chiềng Bương - Xã Chiềng Công - Huyện Mường La - Sơn La',
        birthday: '2014-09-29',
        people: 'Khơ Mú',
        situation: 'Bố đi làm thuê bị tai nạn mất, mẹ bỏ đi từ lâu. Minh sống cùng bà ngoại già yếu, không ai chăm sóc.',
        recommender: 'Thầy Trịnh Công Đức',
        status: 'inProgress',
        startDate: '2025-11-01',
        endDate: '',
        funds: '3000000',
        balance: '2000000',
        remark: '',
        currentClass: '6',
        currentSchool: 'TR002',
        currentSponsor: 'NHT0004',
        currentVolunteer: 'TNV0001',
        currentTeacher: 'GVN0002'
    },
    {
        id: 'DH92.008',
        name: 'Ka H\'Nông',
        address: 'Thôn Kleng - Xã Chư Răng - Huyện Ia Pa - Gia Lai',
        birthday: '2017-04-10',
        people: 'Jrai',
        situation: 'Mồ côi bố, mẹ bệnh nặng. H\'Nông sống cùng em trai, được người thân giúp đỡ ít nhiều.',
        recommender: 'Chị Nguyễn Thị Phương',
        status: 'inProgress',
        startDate: '2025-06-01',
        endDate: '',
        funds: '3000000',
        balance: '-500000',
        remark: '',
        currentClass: '3',
        currentSchool: 'TR001',
        currentSponsor: 'NHT0005',
        currentVolunteer: 'TNV0001',
        currentTeacher: 'GVN0001'
    },
    {
        id: 'DH92.009',
        name: 'Trương Văn Hải',
        address: 'Thôn 1 - Xã A Túc - Huyện Hướng Hóa - Quảng Trị',
        birthday: '2015-06-05',
        people: 'Tà Ôi',
        situation: 'Bố mẹ ly hôn, Hải sống với bố nghiện rượu. Cuộc sống của Hải thiếu thốn tình cảm và vật chất.',
        recommender: 'Thầy Nguyễn Đức Tài',
        status: 'inProgress',
        startDate: '2025-03-01',
        endDate: '',
        funds: '6000000',
        balance: '2500000',
        remark: '',
        currentClass: '5',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0005',
        currentVolunteer: 'TNV0001',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.010',
        name: 'Lò Thị Thủy',
        address: 'Bản Phù Lá - Xã Nùng Nàng - Huyện Tam Đường - Lai Châu',
        birthday: '2013-02-19',
        people: 'Phù Lá',
        situation: 'Bố bị bệnh tâm thần, mẹ bị mù. Thủy là trụ cột chính trong gia đình, phải chăm sóc bố mẹ và em trai.',
        recommender: 'Thầy Phạm Văn Ánh',
        status: 'inProgress',
        startDate: '2025-08-01',
        endDate: '',
        funds: '3000000',
        balance: '500000',
        remark: '',
        currentClass: '7',
        currentSchool: 'TR002',
        currentSponsor: 'NHT0006',
        currentVolunteer: 'TNV0001',
        currentTeacher: 'GVN0002'
    },
    {
        id: 'DH92.011',
        name: 'Thào Văn Lợi',
        address: 'Thôn Dốc Mới - Xã Lũng Cú - Huyện Đồng Văn - Hà Giang',
        birthday: '2016-07-21',
        people: 'Lô Lô',
        situation: 'Mồ côi cả cha lẫn mẹ, sống với bà nội già yếu. Lợi rất ngoan ngoãn và chăm học.',
        recommender: 'Chị Đỗ Thị Lan',
        status: 'inProgress',
        startDate: '2025-04-01',
        endDate: '',
        funds: '4500000',
        balance: '0',
        remark: '',
        currentClass: '4',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0007',
        currentVolunteer: 'TNV0002',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.012',
        name: 'Vũ Thị Thanh',
        address: 'Bản Tà Tổng - Xã Tà Tổng - Huyện Mường Tè - Lai Châu',
        birthday: '2015-01-05',
        people: 'Cống',
        situation: 'Bố mẹ đi làm thuê ở miền xuôi, gửi con cho ông bà. Cuộc sống thiếu thốn tình cảm của cha mẹ.',
        recommender: 'Thầy Lê Văn Hùng',
        status: 'inProgress',
        startDate: '2025-07-01',
        endDate: '',
        funds: '2000000',
        balance: '-1000000',
        remark: '',
        currentClass: '5',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0007',
        currentVolunteer: 'TNV0002',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.013',
        name: 'Nguyễn Thị Hương',
        address: 'Thôn 2 - Xã Lát - Huyện Lạc Dương - Lâm Đồng',
        birthday: '2015-01-05',
        people: 'Cil',
        situation: 'Gia đình đông con, bố mẹ làm rẫy, thu nhập thấp. Hương phải chăm sóc các em nhỏ.',
        recommender: 'Chị Trần Thị Huyền',
        status: 'inProgress',
        startDate: '2025-07-01',
        endDate: '',
        funds: '3000000',
        balance: '0',
        remark: '',
        currentClass: '5',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0008',
        currentVolunteer: 'TNV0002',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.014',
        name: 'Sùng Thị Mỵ',
        address: 'Bản Đề Xua - Xã Tả Giàng Phình - Huyện Sa Pa - Lào Cai',
        birthday: '2014-12-12',
        people: 'Mông',
        situation: 'Mồ côi cả cha lẫn mẹ, sống với chú thím, có 3 người con nhỏ. Cuộc sống rất khó khăn.',
        recommender: 'Cô Nguyễn Thị Hoa',
        status: 'inProgress',
        startDate: '2025-02-01',
        endDate: '',
        funds: '5500000',
        balance: '0',
        remark: '',
        currentClass: '6',
        currentSchool: 'TR002',
        currentSponsor: 'NHT0009',
        currentVolunteer: 'TNV0002',
        currentTeacher: 'GVN0002'
    },
    {
        id: 'DH92.015',
        name: 'Lý Văn Phúc',
        address: 'Thôn Cốc Pài - Xã Cán Cấu - Huyện Si Ma Cai - Lào Cai',
        birthday: '2013-09-07',
        people: 'Phù Lá',
        situation: 'Bố bị bệnh nặng, mẹ làm nương rẫy, không đủ tiền thuốc thang. Phúc phải nghỉ học phụ giúp gia đình.',
        recommender: 'Ông Bùi Văn Hải',
        status: 'inProgress',
        startDate: '2025-11-01',
        endDate: '',
        funds: '2000000',
        balance: '1000000',
        remark: '',
        currentClass: '7',
        currentSchool: 'TR002',
        currentSponsor: 'NHT0009',
        currentVolunteer: 'TNV0002',
        currentTeacher: 'GVN0002'
    },
    {
        id: 'DH92.016',
        name: 'Hồ Thị Kim',
        address: 'Bản Trà Leng - Xã Trà Leng - Huyện Nam Trà My - Quảng Nam',
        birthday: '2015-01-01',
        people: 'Cor',
        situation: 'Mồ côi cả cha lẫn mẹ, sống with bà ngoại già yếu. Gia đình rất nghèo khó.',
        recommender: 'Thầy Nguyễn Văn Minh',
        status: 'inProgress',
        startDate: '2025-09-01',
        endDate: '',
        funds: '3000000',
        balance: '1000000',
        remark: '',
        currentClass: '5',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0009',
        currentVolunteer: 'TNV0002',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.017',
        name: 'A Diệu',
        address: 'Làng Kênh - Xã Pờ Y - Huyện Ngọc Hồi - Kon Tum',
        birthday: '2014-08-25',
        people: 'Brâu',
        situation: 'Bố mất do tai nạn, mẹ bị bệnh hiểm nghèo. A Diệu sống với gia đình chú ruột có 5 người con.',
        recommender: 'Cô Trần Thị Thu',
        status: 'inProgress',
        startDate: '2025-10-01',
        endDate: '',
        funds: '1500000',
        balance: '0',
        remark: '',
        currentClass: '6',
        currentSchool: 'TR002',
        currentSponsor: 'NHT0010',
        currentVolunteer: 'TNV0002',
        currentTeacher: 'GVN0002'
    },
    {
        id: 'DH92.018',
        name: 'Lý A Phủ',
        address: 'Thôn 2 - Xã Lùng Thàng - Huyện Sìn Hồ - Lai Châu',
        birthday: '2016-03-12',
        people: 'H\'Mông',
        situation: 'Mẹ bỏ đi, bố đi làm ăn xa. A Phủ sống với bà nội già yếu và em gái.',
        recommender: 'Thầy Lương Văn Quyết',
        status: 'inProgress',
        startDate: '2025-05-01',
        endDate: '',
        funds: '5000000',
        balance: '1000000',
        remark: '',
        currentClass: '4',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0011',
        currentVolunteer: 'TNV0002',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.019',
        name: 'Trần Văn Kiên',
        address: 'Bản Na Tông - Xã Na Ư - Huyện Điện Biên - Điện Biên',
        birthday: '2013-09-07',
        people: 'Thái',
        situation: 'Bố mẹ làm thuê không đủ chi tiêu, Kiên phải phụ giúp gia đình từ nhỏ.',
        recommender: 'Cô Ngô Thị Lý',
        status: 'inProgress',
        startDate: '2025-01-01',
        endDate: '',
        funds: '6000000',
        balance: '0',
        remark: '',
        currentClass: '7',
        currentSchool: 'TR002',
        currentSponsor: 'NHT0011',
        currentVolunteer: 'TNV0002',
        currentTeacher: 'GVN0002'
    },
    {
        id: 'DH92.020',
        name: 'Y Rô',
        address: 'Làng Kênh - Xã Chư Răng - Huyện Ia Pa - Gia Lai',
        birthday: '2017-04-10',
        people: 'Jrai',
        situation: 'Mồ côi cả cha lẫn mẹ, sống với bà nội già yếu, không có ai chăm sóc.',
        recommender: 'Chị Nguyễn Thị Phương',
        status: 'inProgress',
        startDate: '2025-06-01',
        endDate: '',
        funds: '3500000',
        balance: '0',
        remark: '',
        currentClass: '3',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0012',
        currentVolunteer: 'TNV0003',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.021',
        name: 'Đinh Thị Ngân',
        address: 'Thôn Sín Chải - Xã Cán Cấu - Huyện Si Ma Cai - Lào Cai',
        birthday: '2015-11-29',
        people: 'Phù Lá',
        situation: 'Bố mất sớm do tai nạn, mẹ bị bệnh hiểm nghèo. Ngân sống với bà ngoại già yếu.',
        recommender: 'Ông Bùi Văn Hải',
        status: 'inProgress',
        startDate: '2025-11-01',
        endDate: '',
        funds: '1000000',
        balance: '0',
        remark: '',
        currentClass: '5',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0013',
        currentVolunteer: 'TNV0003',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.022',
        name: 'Sùng A Thắng',
        address: 'Bản Huổi Lếch - Xã Chiềng Công - Huyện Mường La - Sơn La',
        birthday: '2014-02-03',
        people: 'Kháng',
        situation: 'Bố mẹ đi làm ăn xa, gửi con lại cho người thân. Thắng sống với gia đình chú ruột đông con.',
        recommender: 'Thầy giáo Trịnh Công Đức',
        status: 'inProgress',
        startDate: '2025-09-01',
        endDate: '',
        funds: '2000000',
        balance: '0',
        remark: '',
        currentClass: '6',
        currentSchool: 'TR002',
        currentSponsor: 'NHT0013',
        currentVolunteer: 'TNV0003',
        currentTeacher: 'GVN0002'
    },
    {
        id: 'DH92.023',
        name: 'Giàng Thị Tú',
        address: 'Xóm Mười Một - Xã Cán Chu Phìn - Huyện Mèo Vạc - Hà Giang',
        birthday: '2016-07-21',
        people: 'Pà Thẻn',
        situation: 'Mồ côi cả cha lẫn mẹ, sống với bà nội già yếu. Gia đình thuộc diện hộ nghèo đặc biệt khó khăn.',
        recommender: 'Bà Đỗ Thị Lan',
        status: 'inProgress',
        startDate: '2025-04-01',
        endDate: '',
        funds: '4500000',
        balance: '0',
        remark: '',
        currentClass: '4',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0014',
        currentVolunteer: 'TNV0003',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.024',
        name: 'Ka Diêu',
        address: 'Thôn Pa Pết - Xã Lát - Huyện Lạc Dương - Lâm Đồng',
        birthday: '2015-01-05',
        people: 'Cil',
        situation: 'Gia đình đông con, bố mẹ làm rẫy thu nhập thấp. Ka Diêu phải phụ giúp việc nhà và chăm sóc các em.',
        recommender: 'Chị Trần Thị Huyền',
        status: 'inProgress',
        startDate: '2025-07-01',
        endDate: '',
        funds: '3000000',
        balance: '0',
        remark: 'Hỗ trợ mua sách vở và đồ dùng học tập.',
        currentClass: '5',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0015',
        currentVolunteer: 'TNV0003',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.025',
        name: 'Hồ Văn Dũng',
        address: 'Bản Rị - Xã Hướng Sơn - Huyện Hướng Hóa - Quảng Trị',
        birthday: '2017-06-14',
        people: 'Bru-Vân Kiều',
        situation: 'Bố mất do bệnh tật, mẹ đi làm thuê nhưng thu nhập không đủ trang trải. Dũng sống cùng mẹ trong căn nhà dột nát.',
        recommender: 'Thầy Nguyễn Đức Tài',
        status: 'inProgress',
        startDate: '2025-03-01',
        endDate: '',
        funds: '6000000',
        balance: '1000000',
        remark: '',
        currentClass: '3',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0015',
        currentVolunteer: 'TNV0003',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.026',
        name: 'Vàng Thị Liên',
        address: 'Thôn Sảng Ma Pho - Xã Nùng Nàng - Huyện Tam Đường - Lai Châu',
        birthday: '2013-02-19',
        people: 'Dao',
        situation: 'Gia đình ly tán, Liên sống với bà ngoại già yếu và thường xuyên đau ốm.',
        recommender: 'Cô Phạm Thị Ánh',
        status: 'inProgress',
        startDate: '2025-08-01',
        endDate: '',
        funds: '3000000',
        balance: '500000',
        remark: '',
        currentClass: '7',
        currentSchool: 'TR002',
        currentSponsor: 'NHT0016',
        currentVolunteer: 'TNV0003',
        currentTeacher: 'GVN0002'
    },
    {
        id: 'DH92.027',
        name: 'Hồ Văn An',
        address: 'Thôn 1 - Trà Dơn - Nam Trà My - Quảng Nam',
        birthday: '2015-01-01',
        people: 'Ca Dong',
        situation: 'Mồ côi cả cha lẫn mẹ, ở với gia đình chị có 2 con nhỏ cùng 6 a chị e khác, rất khó khăn.',
        recommender: 'Thầy Nguyễn Văn Minh',
        status: 'inProgress',
        startDate: '2025-09-01',
        endDate: '',
        funds: '2000000',
        balance: '0',
        remark: '',
        currentClass: '5',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0017',
        currentVolunteer: 'TNV0003',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.028',
        name: 'Bùi Văn Nam',
        address: 'Xã Pờ Y - Huyện Ngọc Hồi - Kon Tum',
        birthday: '2014-08-25',
        people: 'Brâu',
        situation: 'Bố mất do tai nạn, mẹ bị bệnh hiểm nghèo, không có khả năng lao động. Nam sống cùng ông bà đã già yếu.',
        recommender: 'Cô Trần Thị Thu',
        status: 'inProgress',
        startDate: '2025-10-01',
        endDate: '',
        funds: '1500000',
        balance: '0',
        remark: '',
        currentClass: '4',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0018',
        currentVolunteer: 'TNV0003',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.029',
        name: 'Nguyễn Thị Mai',
        address: 'Thôn 2 - Xã Lùng Thàng - Huyện Sìn Hồ - Lai Châu',
        birthday: '2016-03-12',
        people: 'H\'Mông',
        situation: 'Mẹ bỏ đi từ nhỏ, bố thường xuyên đi làm ăn xa. Mai sống với gia đình cô ruột và các anh chị em họ.',
        recommender: 'Thầy Lương Văn Quyết',
        status: 'inProgress',
        startDate: '2025-05-01',
        endDate: '',
        funds: '5000000',
        balance: '1000000',
        remark: '',
        currentClass: '4',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0019',
        currentVolunteer: 'TNV0003',
        currentTeacher: 'GVN0003'
    },
    {
        id: 'DH92.030',
        name: 'Lý Văn Tùng',
        address: 'Bản Na Tông - Xã Na Ư - Huyện Điện Biên - Điện Biên',
        birthday: '2013-09-07',
        people: 'Thái',
        situation: 'Bố mẹ đều làm nông, thu nhập bấp bênh, gia đình có 5 anh chị em nên rất khó khăn.',
        recommender: 'Cô Ngô Thị Lý',
        status: 'inProgress',
        startDate: '2025-01-01',
        endDate: '',
        funds: '6000000',
        balance: '0',
        remark: 'Đã nhận được xe đạp từ chương trình.',
        currentClass: '5',
        currentSchool: 'TR003',
        currentSponsor: 'NHT0020',
        currentVolunteer: 'TNV0003',
        currentTeacher: 'GVN0003'
    }
];

export const studentStatusTranslated = {
    'gettingInfor': 'Đang lấy thông tin',
    'gettingConnection': 'Chờ kết nối NHT',
    'inProgress': 'Đang hỗ trợ',
    'droppedOut': 'Đã nghỉ học',
    'graduated': 'Đã tốt nghiệp cấp 3',
    'left': 'Rời chương trình',
    'canceled': 'Hủy'
};


export const originalSponsors = [
    {
        id: 'NHT0001',
        name: 'Trần Phương Hiền',
        contact: 'SĐT: 0905293444, FB: https://www.facebook.com/phuonghien/',
        status: 'inProgress',
        totalStudents: '2',
        detailStudents: 'DH92.001,DH92.002',
        startDate: '2025-09-01',
        endDate: '',
        currentVolunteer: 'TNV0001',
        totalDeposit: '7000000',
        balance: '3500000',
        remark: 'Đã hoàn thành đợt hỗ trợ 1'
    },
    {
        id: 'NHT0002',
        name: 'Nguyễn Văn Minh',
        contact: 'SĐT: 0912345678, FB: https://www.facebook.com/vanminh.ng/',
        status: 'inProgress', // Đang hỗ trợ vì endDate trống
        totalStudents: '1',
        detailStudents: 'DH92.003',
        startDate: '2025-11-01',
        endDate: '',
        currentVolunteer: 'TNV0001',
        totalDeposit: '1000000',
        balance: '0',
        remark: 'Hỗ trợ dài hạn cho sinh viên y khoa'
    },
    {
        id: 'NHT0003',
        name: 'Lê Thị Thu Hoài',
        contact: 'SĐT: 0987654321, Email: hoai.lt@gmail.com',
        status: 'ended', // Đã kết thúc vì endDate có giá trị
        totalStudents: '3',
        detailStudents: 'DH92.004,DH92.005,DH92.006',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        currentVolunteer: 'TNV0001',
        totalDeposit: '17000000',
        balance: '4500000',
        remark: 'Hỗ trợ chương trình "Ươm mầm tài năng"'
    },
    {
        id: 'NHT0004',
        name: 'Phạm Thanh Tùng',
        contact: 'SĐT: 0909112233, Zalo: 0909112233',
        status: 'inProgress', // Đang hỗ trợ vì endDate trống
        totalStudents: '1',
        detailStudents: 'DH92.007',
        startDate: '2025-11-01',
        endDate: '',
        currentVolunteer: 'TNV0001',
        totalDeposit: '3000000',
        balance: '2000000',
        remark: 'Ưu tiên hỗ trợ chi phí học tập'
    },
    {
        id: 'NHT0005',
        name: 'Vũ Ngọc Lan',
        contact: 'SĐT: 0977889900, FB: https://www.facebook.com/ngoclan.vu/',
        status: 'inProgress', // Đang hỗ trợ vì endDate trống
        totalStudents: '2',
        detailStudents: 'DH92.008,DH92.009',
        startDate: '2025-03-01',
        endDate: '',
        currentVolunteer: 'TNV0001',
        totalDeposit: '9000000',
        balance: '2000000',
        remark: 'Cam kết hỗ trợ thêm vào cuối năm'
    },
    {
        id: 'NHT0006',
        name: 'Hoàng Đình Đức',
        contact: 'SĐT: 0966554433, Email: duc.hd@yahoo.com',
        status: 'gettingConnection', // Gán ngẫu nhiên
        totalStudents: '1',
        detailStudents: 'DH92.010',
        startDate: '2025-08-01',
        endDate: '',
        currentVolunteer: 'TNV0001',
        totalDeposit: '3000000',
        balance: '500000',
        remark: 'Mới tham gia hỗ trợ'
    },
    {
        id: 'NHT0007',
        name: 'Đặng Thị Mai',
        contact: 'SĐT: 0903123789',
        status: 'ended', // Đã kết thúc vì endDate có giá trị
        totalStudents: '2',
        detailStudents: 'DH92.011,DH92.012',
        startDate: '2025-04-01',
        endDate: '2025-12-31',
        currentVolunteer: 'TNV0001',
        totalDeposit: '6500000',
        balance: '-1000000',
        remark: 'Đã rút hết số dư hỗ trợ'
    },
    {
        id: 'NHT0008',
        name: 'Bùi Xuân Trường',
        contact: 'SĐT: 0918765432, FB: https://www.facebook.com/xuantruong.bui/',
        status: 'inProgress', // Đang hỗ trợ vì endDate trống
        totalStudents: '1',
        detailStudents: 'DH92.013',
        startDate: '2025-07-01',
        endDate: '',
        currentVolunteer: 'TNV0001',
        totalDeposit: '3000000',
        balance: '0',
        remark: 'Tăng mức hỗ trợ từ tháng 5/2023'
    },
    {
        id: 'NHT0009',
        name: 'Trương Ngọc Ánh',
        contact: 'SĐT: 0979888777, Zalo: 0979888777',
        status: 'inProgress', // Đang hỗ trợ vì endDate trống
        totalStudents: '3',
        detailStudents: 'DH92.014,DH92.015,DH92.016',
        startDate: '2025-02-01',
        endDate: '',
        currentVolunteer: 'TNV0001',
        totalDeposit: '10500000',
        balance: '2000000',
        remark: 'Đơn vị hỗ trợ doanh nghiệp'
    },
    {
        id: 'NHT0010',
        name: 'Võ Thanh Sơn',
        contact: 'SĐT: 0905100200, Email: son.vt@abc.com',
        status: 'gettingConnection', // Gán ngẫu nhiên
        totalStudents: '1',
        detailStudents: 'DH92.017',
        startDate: '2025-10-01',
        endDate: '',
        currentVolunteer: 'TNV0001',
        totalDeposit: '1500000',
        balance: '0',
        remark: ''
    },
    {
        id: 'NHT0011',
        name: 'Phan Kim Ngân',
        contact: 'SĐT: 0935556677',
        status: 'ended', // Đã kết thúc vì endDate có giá trị
        totalStudents: '2',
        detailStudents: 'DH92.018,DH92.019',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        currentVolunteer: 'TNV0002',
        totalDeposit: '11000000',
        balance: '1000000',
        remark: 'Tạm ngừng hỗ trợ sau 6 tháng'
    },
    {
        id: 'NHT0012',
        name: 'Dương Văn Hải',
        contact: 'SĐT: 0989123456, FB: https://www.facebook.com/vanhai.duong/',
        status: 'inProgress', // Đang hỗ trợ vì endDate trống
        totalStudents: '1',
        detailStudents: 'DH92.020',
        startDate: '2025-06-01',
        endDate: '',
        currentVolunteer: 'TNV0002',
        totalDeposit: '3500000',
        balance: '0',
        remark: 'Hỗ trợ chi phí sinh hoạt'
    },
    {
        id: 'NHT0013',
        name: 'Ngô Mỹ Linh',
        contact: 'SĐT: 0901223344, Zalo: 0901223344',
        status: 'inProgress', // Đang hỗ trợ vì endDate trống
        totalStudents: '2',
        detailStudents: 'DH92.021,DH92.022',
        startDate: '2025-09-01',
        endDate: '',
        currentVolunteer: 'TNV0002',
        totalDeposit: '3000000',
        balance: '0',
        remark: ''
    },
    {
        id: 'NHT0014',
        name: 'Trần Đại Nghĩa',
        contact: 'SĐT: 0919998877, Email: nghia.td@corp.com',
        status: 'inProgress', // Đang hỗ trợ vì endDate trống
        totalStudents: '1',
        detailStudents: 'DH92.023',
        startDate: '2025-04-01',
        endDate: '',
        currentVolunteer: 'TNV0002',
        totalDeposit: '4500000',
        balance: '0',
        remark: 'Đã sử dụng 5 triệu cho học phí'
    },
    {
        id: 'NHT0015',
        name: 'Hồ Thị Thanh',
        contact: 'SĐT: 0978111222',
        status: 'ended', // Đã kết thúc vì endDate có giá trị
        totalStudents: '2',
        detailStudents: 'DH92.024,DH92.025',
        startDate: '2025-03-01',
        endDate: '10/7/2023',
        currentVolunteer: 'TNV0002',
        totalDeposit: '9000000',
        balance: '1000000',
        remark: 'Kết thúc đợt hỗ trợ 2'
    },
    {
        id: 'NHT0016',
        name: 'Lý Quốc Bảo',
        contact: 'SĐT: 0906665544, FB: https://www.facebook.com/quocbao.ly/',
        status: 'gettingConnection', // Gán ngẫu nhiên
        totalStudents: '1',
        detailStudents: 'DH92.026',
        startDate: '2025-08-01',
        endDate: '',
        currentVolunteer: 'TNV0003',
        totalDeposit: '3000000',
        balance: '500000',
        remark: 'Mức hỗ trợ 500k/tháng'
    },
    {
        id: 'NHT0017',
        name: 'Mai Xuân Hiếu',
        contact: 'SĐT: 0913456789, Email: hieu.mx@web.vn',
        status: 'inProgress', // Đang hỗ trợ vì endDate trống
        totalStudents: '1',
        detailStudents: 'DH92.027',
        startDate: '2025-09-01',
        endDate: '',
        currentVolunteer: 'TNV0003',
        totalDeposit: '2000000',
        balance: '0',
        remark: 'Hỗ trợ học bổng toàn phần'
    },
    {
        id: 'NHT0018',
        name: 'Cao Thị Lan Hương',
        contact: 'SĐT: 0988776655, Zalo: 0988776655',
        status: 'inProgress', // Đang hỗ trợ vì endDate trống
        totalStudents: '1',
        detailStudents: 'DH92.028',
        startDate: '2025-10-01',
        endDate: '',
        currentVolunteer: 'TNV0003',
        totalDeposit: '1500000',
        balance: '0',
        remark: 'Đang theo dõi tiến trình học tập'
    },
    {
        id: 'NHT0019',
        name: 'Đinh Công Tài',
        contact: 'SĐT: 0936111000',
        status: 'ended', // Đã kết thúc vì endDate có giá trị
        totalStudents: '1',
        detailStudents: 'DH92.029',
        startDate: '2025-05-01',
        endDate: '14/9/2023',
        currentVolunteer: 'TNV0003',
        totalDeposit: '5000000',
        balance: '1000000',
        remark: 'Học sinh đã hoàn thành chương trình'
    },
    {
        id: 'NHT0020',
        name: 'Phan Thị Diệu',
        contact: 'SĐT: 0907222333, FB: https://www.facebook.com/dieup.t/',
        status: 'gettingConnection', // Gán ngẫu nhiên
        totalStudents: '1',
        detailStudents: 'DH92.030',
        startDate: '2025-01-01',
        endDate: '',
        currentVolunteer: 'TNV0003',
        totalDeposit: '6000000',
        balance: '0',
        remark: 'Đợt hỗ trợ nhỏ hàng tháng'
    }
];

// export const sponsorStatusTranslated = {
//     'Đang xác minh': 'gettingInfor',
//     'Chờ kết nối HS': 'gettingConnection',
//     'Đang hỗ trợ': 'inProgress',
//     'Đã kết thúc': 'ended',    
//     'Hủy': 'canceled'
// }
export const sponsorStatusTranslated = {
    'gettingInfor': 'Đang xác minh',
    'gettingConnection' : 'Chờ kết nối HS',
    'inProgress': 'Đang hỗ trợ',
    'ended': 'Đã kết thúc',
    'canceled': 'Hủy'
}

export const originalSchools = [
    {
        id: 'TR001',
        name: 'Tiểu Học Nùng Nàng',
        address: 'Xã Nùng Nàng - Huyện Tam Đường - Lai Châu',
        totalStudents: '5',
        currentTeacher: 'GVN0001',
        // status: 'Đang hỗ trợ'
    },
    {
        id: 'TR002',
        name: 'THCS Trà Mai',
        address: 'Xã Trà Mai - Huyện Nam Trà My - Quảng Nam',
        totalStudents: '10',
        currentTeacher: 'GVN0002',
        // status: 'Đang hỗ trợ'
    },
    {
        id: 'TR003',
        name: 'Tiểu Học Hướng Hóa',
        address: 'Xã A Túc - Huyện Hướng Hóa - Quảng Trị',
        totalStudents: '15',
        currentTeacher: 'GVN0003',
        // status: 'Đang hỗ trợ'
    }
]

export const originalImages = [
    {
        studentId: "DH92.001",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.001",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.001",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.002",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.002",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.002",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.002",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.003",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.003",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.004",
        month: "04/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.004",
        month: "05/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.004",
        month: "06/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.004",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.004",
        month: "08/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.004",
        month: "09/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.004",
        month: "10/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.004",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.004",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.005",
        month: "01/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.005",
        month: "02/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.005",
        month: "03/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.005",
        month: "04/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.005",
        month: "05/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.005",
        month: "06/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.005",
        month: "07/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.005",
        month: "08/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.005",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.005",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.005",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.005",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.006",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.006",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.006",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.006",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.007",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.007",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.008",
        month: "06/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.008",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.008",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.008",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.008",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.008",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.008",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.009",
        month: "03/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.009",
        month: "04/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.009",
        month: "05/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.009",
        month: "06/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.009",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.009",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.009",
        month: "09/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.009",
        month: "10/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.009",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.009",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.010",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.010",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.010",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.010",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.010",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.011",
        month: "04/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.011",
        month: "05/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.011",
        month: "06/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.011",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.011",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.011",
        month: "09/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.011",
        month: "10/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.011",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.011",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.012",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.012",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.012",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.012",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.012",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.012",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.013",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.013",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.013",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.013",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.013",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.013",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.014",
        month: "02/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.014",
        month: "03/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.014",
        month: "04/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.014",
        month: "05/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.014",
        month: "06/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.014",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.014",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.014",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.014",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.014",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.014",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.015",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.015",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.014",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.014",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.014",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.014",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.015",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.015",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.016",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.016",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.016",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.016",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.0.17",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.0.17",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.0.17",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.018",
        month: "05/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.018",
        month: "06/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.018",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.018",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.018",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.018",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.018",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.018",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.019",
        month: "01/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.019",
        month: "02/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.019",
        month: "03/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.019",
        month: "04/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.019",
        month: "05/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.019",
        month: "06/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.019",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.019",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.019",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.019",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.019",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.019",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.020",
        month: "06/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.020",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.020",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.020",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.020",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.020",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.020",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.021",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.021",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.022",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.022",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.022",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.022",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH9223",
        month: "04/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.023",
        month: "05/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.023",
        month: "06/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.023",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.023",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.023",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.023",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.023",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.023",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.024",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.024",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.024",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.4",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.024",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.024",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.025",
        month: "03/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.025",
        month: "04/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.025",
        month: "05/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.025",
        month: "06/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.025",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.025",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.025",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.025",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.025",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.025",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.026",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.026",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.026",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.026",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.026",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.027",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.027",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.027",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.027",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.028",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.028",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.028",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.029",
        month: "05/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.029",
        month: "06/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.029",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.029",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.029",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.029",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.029",
        month: "11/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.029",
        month: "12/2025",
        imageSrc: ""
    },
    {
        studentId: "DH92.030",
        month: "01/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.030",
        month: "02/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.030",
        month: "03/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.030",
        month: "04/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.030",
        month: "05/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.030",
        month: "06/2025",
        imageSrc: "/static/image/ho-tro/gifts-1.jpg"
    },
    {
        studentId: "DH92.030",
        month: "07/2025",
        imageSrc: "/static/image/ho-tro/gifts-2.jpg"
    },
    {
        studentId: "DH92.030",
        month: "08/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
    {
        studentId: "DH92.030",
        month: "09/2025",
        imageSrc: "/static/image/ho-tro/gifts-3.jpg"
    },
    {
        studentId: "DH92.030",
        month: "10/2025",
        imageSrc: "/static/image/ho-tro/gifts-4.jpg"
    },
    {
        studentId: "DH92.030",
        month: "11/2025",
        imageSrc: "/static/image/ho-tro/gifts-5.jpg"
    },
    {
        studentId: "DH92.030",
        month: "12/2025",
        imageSrc: "/static/image/ho-tro/gifts-6.jpg"
    },
]

//status: opened / approved / cancel
export const originalTransactionList = [
    {
        code: "00000001",
        date: "2025-10-01",
        amount: "18000000",
        content: "Chuyen tien cho DH92.001",
        status: "approved",
        sponsorId: "NHT0001",
        studentId: "DH92.001"
    },
    {
        code: "00000002",
        date: "2025-09-01",
        amount: "4000000",
        content: "Chuyen tien cho DH92.002",
        // status: "approved",
        // sponsorId: "NHT0001",
        // studentId: "DH92.002"
        status: "opened",
        sponsorId: "",
        studentId: ""
    },
    {
        code: "00000003",
        date: "2025-11-01",
        amount: "1000000",
        content: "Chuyen tien cho DH92.003",
        status: "approved",
        sponsorId: "NHT0002",
        studentId: "DH92.003"
    },
    {
        code: "00000004",
        date: "2025-04-01",
        amount: "5000000",
        content: "Chuyen tien cho DH92.004",
        status: "approved",
        sponsorId: "NHT0003",
        studentId: "DH92.004"
    },
    {
        code: "00000005",
        date: "2025-01-01",
        amount: "6000000",
        content: "Chuyen tien cho DH92.005",
        status: "approved",
        sponsorId: "NHT0003",
        studentId: "DH92.005"
    },
    {
        code: "00000006",
        date: "2025-09-01",
        amount: "6000000",
        content: "Chuyen tien cho DH92.006",
        status: "approved",
        sponsorId: "NHT0003",
        studentId: "DH92.006"
    },
    {
        code: "00000007",
        date: "2025-11-01",
        amount: "3000000",
        content: "Chuyen tien cho DH92.007",
        status: "approved",
        sponsorId: "NHT0004",
        studentId: "DH92.007"
    },
    {
        code: "00000008",
        date: "2025-06-01",
        amount: "3000000",
        content: "Chuyen tien cho DH92.008",
        status: "approved",
        sponsorId: "NHT0005",
        studentId: "DH92.008"
    },
    {
        code: "00000009",
        date: "2025-06-01",
        amount: "6000000",
        content: "Chuyen tien cho DH92.009",
        status: "approved",
        sponsorId: "NHT0005",
        studentId: "DH92.009"
    },
    {
        code: "00000010",
        date: "2025-08-01",
        amount: "3000000",
        content: "Chuyen tien cho DH92.010",
        status: "approved",
        sponsorId: "NHT0006",
        studentId: "DH92.010"
    },
    {
        code: "00000011",
        date: "2025-04-01",
        amount: "4500000",
        content: "Chuyen tien cho DH92.011",
        status: "approved",
        sponsorId: "NHT0007",
        studentId: "DH92.011"
    },
    {
        code: "00000012",
        date: "2025-07-01",
        amount: "2000000",
        content: "Chuyen tien cho DH92.012",
        status: "approved",
        sponsorId: "NHT0007",
        studentId: "DH92.012"
    },
    {
        code: "00000013",
        date: "2025-07-01",
        amount: "3000000",
        content: "Chuyen tien cho DH92.013",
        status: "approved",
        sponsorId: "NHT0008",
        studentId: "DH92.013"
    },
    {
        code: "00000014",
        date: "2025-02-01",
        amount: "5500000",
        content: "Chuyen tien cho DH92.014",
        status: "approved",
        sponsorId: "NHT0009",
        studentId: "DH92.014"
    },
    {
        code: "00000015",
        date: "2025-11-01",
        amount: "2000000",
        content: "Chuyen tien cho DH92.015",
        status: "approved",
        sponsorId: "NHT0009",
        studentId: "DH92.015"
    },
    {
        code: "00000016",
        date: "2025-09-01",
        amount: "3000000",
        content: "Chuyen tien cho DH92.016",
        status: "approved",
        sponsorId: "NHT0009",
        studentId: "DH92.016"
    },
    {
        code: "00000017",
        date: "2025-10-01",
        amount: "1500000",
        content: "Chuyen tien cho DH92.017",
        status: "approved",
        sponsorId: "NHT0010",
        studentId: "DH92.017"
    },
    {
        code: "00000018",
        date: "2025-05-01",
        amount: "5000000",
        content: "Chuyen tien cho DH92.018",
        status: "approved",
        sponsorId: "NHT0011",
        studentId: "DH92.018"
    },
    {
        code: "00000019",
        date: "2025-01-01",
        amount: "6000000",
        content: "Chuyen tien cho DH92.019",
        status: "approved",
        sponsorId: "NHT0011",
        studentId: "DH92.019"
    },
    {
        code: "00000020",
        date: "2025-06-01",
        amount: "3500000",
        content: "Chuyen tien cho DH92.020",
        status: "approved",
        sponsorId: "NHT0012",
        studentId: "DH92.020"
    },
    {
        code: "00000021",
        date: "2025-11-01",
        amount: "1000000",
        content: "Chuyen tien cho DH92.021",
        status: "approved",
        sponsorId: "NHT0013",
        studentId: "DH92.021"
    },
    {
        code: "00000022",
        date: "2025-09-01",
        amount: "2000000",
        content: "Chuyen tien cho DH92.022",
        status: "approved",
        sponsorId: "NHT0013",
        studentId: "DH92.022"
    },
    {
        code: "00000023",
        date: "2025-04-01",
        amount: "4500000",
        content: "Chuyen tien cho DH92.023",
        status: "approved",
        sponsorId: "NHT0014",
        studentId: "DH92.023"
    },
    {
        code: "00000024",
        date: "2025-07-01",
        amount: "3000000",
        content: "Chuyen tien cho DH92.024",
        status: "approved",
        sponsorId: "NHT0015",
        studentId: "DH92.024"
    },
    {
        code: "00000025",
        date: "2025-03-01",
        amount: "6000000",
        content: "Chuyen tien cho DH92.025",
        status: "approved",
        sponsorId: "NHT0015",
        studentId: "DH92.025"
    },
    {
        code: "00000026",
        date: "2025-08-01",
        amount: "3000000",
        content: "Chuyen tien cho DH92.026",
        status: "approved",
        sponsorId: "NHT0016",
        studentId: "DH92.026"
    },
    {
        code: "00000027",
        date: "2025-09-01",
        amount: "2000000",
        content: "Chuyen tien cho DH92.027",
        status: "approved",
        sponsorId: "NHT0017",
        studentId: "DH92.027"
    },
    {
        code: "00000028",
        date: "2025-10-01",
        amount: "1500000",
        content: "Chuyen tien cho DH92.028",
        status: "approved",
        sponsorId: "NHT0018",
        studentId: "DH92.028"
    },
    {
        code: "00000029",
        date: "2025-05-01",
        amount: "5000000",
        content: "Chuyen tien cho DH92.029",
        status: "approved",
        sponsorId: "NHT0019",
        studentId: "DH92.029"
    },
    {
        code: "00000030",
        date: "2025-01-01",
        amount: "6000000",
        content: "Chuyen tien cho DH92.030",
        status: "approved",
        sponsorId: "NHT0020",
        studentId: "DH92.030"
    },
]