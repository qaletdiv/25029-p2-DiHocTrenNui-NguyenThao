const { STUDENT_STATUS } = require('./constants');

const students = [
  {
    id: 'DH92.001',
    full_name: 'Trần Văn Mạnh',
    date_of_birth: '2015-03-12',
    gender: 'Male',
    phone: '',
    address_id: 1,
    school_id: 1,
    grade: '5',
    family_condition: 'Gia đình đông con, bố mẹ làm nương rẫy, kinh tế rất khó khăn. Mẹ bị bệnh tim bẩm sinh.',
    status_id: 3, // ACTIVE
    monthly_amount: 500000,
    is_active: true,
    created_by: 1,
    created_at: new Date('2025-10-01'),
  },
  {
    id: 'DH92.002',
    full_name: 'Phan Thị Hoa',
    date_of_birth: '2014-08-25',
    gender: 'Female',
    phone: '',
    address_id: 2,
    school_id: 2,
    grade: '6',
    family_condition: 'Mồ côi cha, mẹ đi làm thuê nhưng bị tai nạn lao động, mất khả năng lao động. Sống cùng bà ngoại già yếu.',
    status_id: 3, // ACTIVE
    monthly_amount: 500000,
    is_active: true,
    created_by: 1,
    created_at: new Date('2025-09-01'),
  },
  {
    id: 'DH92.003',
    full_name: 'Võ Văn Hùng',
    date_of_birth: '2016-04-07',
    gender: 'Male',
    phone: '',
    address_id: 3,
    school_id: 1,
    grade: '4',
    family_condition: 'Bố mất sớm do tai nạn giao thông, mẹ đi làm xa, Hùng ở với gia đình bác ruột có 4 người con.',
    status_id: 3, // ACTIVE
    monthly_amount: 500000,
    is_active: true,
    created_by: 1,
    created_at: new Date('2025-11-01'),
  },
  {
    id: 'DH92.004',
    full_name: 'Lê Thị Thu',
    date_of_birth: '2017-01-19',
    gender: 'Female',
    phone: '',
    address_id: 4,
    school_id: 1,
    grade: '3',
    family_condition: 'Bố mẹ nghiện rượu, không có khả năng nuôi con. Thu sống with ông bà ngoại trong căn nhà tranh tre.',
    status_id: 3, // ACTIVE
    monthly_amount: 500000,
    is_active: true,
    created_by: 1,
    created_at: new Date('2025-04-01'),
  },
  {
    id: 'DH92.005',
    full_name: 'Giàng A Sính',
    date_of_birth: '2013-02-03',
    gender: 'Male',
    phone: '',
    address_id: 5,
    school_id: 2,
    grade: '7',
    family_condition: 'Gia đình quá nghèo, nhà có 5 anh chị em. Sính phải nghỉ học để giúp bố mẹ làm nương rẫy.',
    status_id: 3, // ACTIVE
    monthly_amount: 500000,
    is_active: true,
    created_by: 1,
    created_at: new Date('2025-01-01'),
  }
];

module.exports = students;