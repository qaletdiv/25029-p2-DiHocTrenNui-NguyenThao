const STUDENT_STATUS = {
  GETTING_INFO: 'gettingInfor',
  GETTING_CONNECTION: 'gettingConnection',
  IN_PROGRESS: 'inProgress',
  DROPPED_OUT: 'droppedOut',
  GRADUATED: 'graduated',
  LEFT: 'left',
  CANCELED: 'canceled',
};

const SPONSOR_STATUS = {
  GETTING_INFO: 'gettingInfor',
  GETTING_CONNECTION: 'gettingConnection',
  IN_PROGRESS: 'inProgress',
  ENDED: 'ended',
  CANCELED: 'canceled',
};

const TRANSACTION_STATUS = {
  OPENED: 'opened',
  APPROVED: 'approved',
  CANCEL: 'cancel',
};

const STUDENT_STATUS_TRANSLATIONS = {
  [STUDENT_STATUS.GETTING_INFO]: 'Đang lấy thông tin',
  [STUDENT_STATUS.GETTING_CONNECTION]: 'Chờ kết nối NHT',
  [STUDENT_STATUS.IN_PROGRESS]: 'Đang hỗ trợ',
  [STUDENT_STATUS.DROPPED_OUT]: 'Đã nghỉ học',
  [STUDENT_STATUS.GRADUATED]: 'Đã tốt nghiệp cấp 3',
  [STUDENT_STATUS.LEFT]: 'Rời chương trình',
  [STUDENT_STATUS.CANCELED]: 'Hủy',
};

const SPONSOR_STATUS_TRANSLATIONS = {
  [SPONSOR_STATUS.GETTING_INFO]: 'Đang xác minh',
  [SPONSOR_STATUS.GETTING_CONNECTION]: 'Chờ kết nối HS',
  [SPONSOR_STATUS.IN_PROGRESS]: 'Đang hỗ trợ',
  [SPONSOR_STATUS.ENDED]: 'Đã kết thúc',
  [SPONSOR_STATUS.CANCELED]: 'Hủy',
};

module.exports = {
  STUDENT_STATUS,
  SPONSOR_STATUS,
  TRANSACTION_STATUS,
  STUDENT_STATUS_TRANSLATIONS,
  SPONSOR_STATUS_TRANSLATIONS,
};
