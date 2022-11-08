export const MAX_SIZE_IMAGE_UPLOAD = 5000000;

export const STORAGE_KEY = {
  ACCESS_TOKEN: 'access_token',
  ROLE: 'role',
  USER_INFO: 'user_info',
  ADMIN_ROLE: 'admin_role',
  ADMIN_PERMISSION: 'admin_permission'
}

export const JOB_PERCENT_TRAVEL_TYPE = [
  { id: 0, value: '0-25%', min: 0, max: 25 },
  { id: 1, value: '26-50%', min: 26, max: 50 },
  { id: 2, value: '51-75%', min: 51, max: 75 },
  { id: 3, value: '75-100%', min: 75, max: 100 }
]

export const JOB_NUMBER_OPENING_RANGE = {
  MIN: 1,
  MAX: 99
}
export const ASSESSMENT_POINT_RANGE = {
  MIN: 1,
  MAX: 100
}
export const STATUS_CODE = {
  SUCCESS: 200,
  UNAUTHRRIZED: 401
}

export const API_STATUS = {
  SUCCESS: 1,
  ERROR: 0
}

export const PAGING = {
  MAX_ITEM: 10
}

export const TYPE_SORTED = {
  OLDEST: 'Oldest',
  LATEST: 'Latest',
  A_Z: 'A-Z',
  Z_A: 'Z-A',
}

export const ACCOUNT_TYPE = {
  EMPLOYER: 0,
  JOB_SEEKER: 1
}

export const REPORT_MESSAGE = {
  FRAUD: 'Fraud',
  TYPE_OTHER: 'Other reasons',
  TYPE_HARASSING_THE_APP: 'Harassing the applicants',
  TYPE_WRONG_OR_MISLEADING_INFORMATIOn: 'Wrong or misleading information'
}

export const JOB_STATUS = {
  Draft: 0,
  Active: 1,
  Inactive: 2,
  Closed: 3,
  UnPaid: 4
};

export const CHAT_CONTENT_TYPE = {
  Text: 0,
  Image: 1,
  File: 2,
  Complex: 3
};

export const GROUP_TYPE = {
  Support: 0,
  Nomal: 1
};

export const TYPE_JOBSEEKER_PAYMENT = [
  { id: '', name: 'All' },
  { id: 2, name: 'Top Up' },
  { id: 0, name: 'Validate test' },
  { id: 1, name: 'Retry test' }
]


export const TYPE_EMPLOYER_PAYMENT = [
  { id: 1, name: 'Standard Job' },
  { id: 2, name: 'Standard Job & Feature Job' },
]

export const CARD_IMAGE = [
  { key: 'VISA', value: './../../assets/images/payment_icon/visa.png' },
  { key: 'MC', value: './../../assets/images/payment_icon/mastercard.png' },
  { key: 'JCB', value: './../../assets/images/payment_icon/jcb.png' },
  { key: 'DISC', value: './../../assets/images/payment_icon/discover.png' },
  { key: 'DC', value: './../../assets/images/payment_icon/diners-club.png' },
  { key: 'AMEX', value: './../../assets/images/payment_icon/american-express.png' }
]
export const ADMIN_TYPE = {
  NORMAL_ADMIN: '1',
  SUPER_ADMIN: '0'
};

export const OPTIONAL_REGION = {
  US: 'en-US'
}

export const PERCENT_TRAVEL = {
  ONSITE: 0,
  REMOTE: 1,
  HYBRID: 2
}

export const JOB_BONUS = {
  SigningBonus: 0,
  ComissionPay: 1,
  BonusPay: 2,
  Tips: 3,
  Other: 4,
}
export const JOB_BENEFITS = {
  HealthInsurance: 0,
  PaidTimeOff: 1,
  DentalInsurance: 2,
  K401: 3,
  VisionInsurance: 4,
  FlexibleSchdule: 5,
  TutionReimbursement: 6,
  LifeInsurance: 7,
  K401Matching: 8,
  DisabilityInsurance: 9,
  RentirementPlan: 10,
  ReferralProgram: 11,
  EmployeeDiscount: 12,
  FlexibleSpendingAccount: 13
}
export const JOB_SCHEDULE = {
  EightHourShift: 0,
  TenHourShift: 1,
  TwelveHourShift: 2,
  Weekends: 3,
  MondayToFriday: 4,
  OnCall: 5,
  Holidays: 6,
  NightShift: 7,
  Overtime: 8,
  DayShift: 9,
  Other: 10
}

export const OTHER_OPTION = {
  bonus: 4,
  schedule: 10
}

export const BONUS = [
  {
    id: 0,
    title: 'Signing Bonus',
    isSelected: false
  },
  {
    id: 1,
    title: 'Commission Pay',
    isSelected: false
  },
  {
    id: 2,
    title: 'Bonus Pay',
    isSelected: false
  },
  {
    id: 3,
    title: 'Tips',
    isSelected: false
  },
  {
    id: 4,
    title: null,
    isSelected: false
  }
]

export const SCHEDULE_JOB = [
  { id: 0, title: 'Eight (8) Hour Shift', isSelected: false },
  { id: 1, title: 'Ten (10) Hour Shift', isSelected: false },
  { id: 2, title: 'Twelve (12) Hour Shift', isSelected: false },
  { id: 4, title: 'Monday through Friday', isSelected: false },
  { id: 11, title: 'Monday through Thursday', isSelected: false },
  { id: 3, title: 'Weekends', isSelected: false },
  { id: 9, title: 'Day Shift', isSelected: false },
  { id: 12, title: 'Mornings', isSelected: false },
  { id: 13, title: 'Afternoons', isSelected: false },
  { id: 14, title: 'Evenings', isSelected: false },
  { id: 7, title: 'Night Shift', isSelected: false },
  { id: 5, title: 'On Call', isSelected: false },
  { id: 6, title: 'Holidays', isSelected: false },
  { id: 8, title: 'Overtime', isSelected: false },
  {
    id: 10,
    title: null,
    isSelected: false
  },
]

export const BENEFITS = [
  {
    id: 0,
    title: 'Health Insurance',
    isSelected: false
  },
  {
    id: 1,
    title: 'Paid Time Off',
    isSelected: false
  },
  {
    id: 2,
    title: 'Dental Insurance',
    isSelected: false
  },
  {
    id: 3,
    title: '401 (k)',
    isSelected: false
  },
  {
    id: 4,
    title: 'Vision Insurance',
    isSelected: false
  },
  {
    id: 5,
    title: 'Flexible Schedule',
    isSelected: false
  },
  {
    id: 6,
    title: 'Tuition Reimbursement',
    isSelected: false
  },
  {
    id: 7,
    title: 'Life Insurance',
    isSelected: false
  },
  {
    id: 8,
    title: '401 (k) Matching ',
    isSelected: false
  },
  {
    id: 9,
    title: 'Disability Insurance',
    isSelected: false
  },
  {
    id: 10,
    title: 'Retirement Plan',
    isSelected: false
  },
  {
    id: 11,
    title: 'Referral Program',
    isSelected: false
  },
  {
    id: 12,
    title: 'Employee Discount',
    isSelected: false
  },
  {
    id: 13,
    title: 'Flexible Spending Account',
    isSelected: false
  },
]

export const SALARY_TYPE = [
  { id: 4, title: 'Per Hour' },
  { id: 3, title: 'Per Day' },
  { id: 2, title: 'Per Week' },
  { id: 1, title: 'Per Month' },
  { id: 0, title: 'Per Year' }
]

export const PAYMENT_TYPE = {
  ValidateTest: 0,
  RetryValidateTest: 1,
  Topup: 2,
  StandardJob: 3,
  HotJob: 4,
  MultiJobs: 5,
  BuyCredit: 6,
  BuyMorePrivate: 7,
  BuyDmCandidate: 8,
  UpgradeJob: 9,
};

export const IS_PRIVATE_JOB = {
  private: 1
}

export const ASSESSMENT_WEIGHT = {
  good: 80,
  medium: 65,
  bad: 0
}

export const ADMIN_PERMISSION = {
  Message: 0,
  AccessEmployer: 1,
  AccessJobseeker: 2,
  ManageJobPosting: 3,
  SettingPricing: 4,
  ManageAccounting: 5,
}

export const CHECKBOX_ADMIN_PERMISSION = [
  {
    id: 0,
    title: 'Message Jobseekers and Employers',
    isSelected: false
  },
  {
    id: 1,
    title: 'Access Employer Information',
    isSelected: false
  },
  {
    id: 2,
    title: 'Access Jobseeker Information',
    isSelected: false
  },
  {
    id: 3,
    title: 'Manage Job Posts',
    isSelected: false
  },
  {
    id: 4,
    title: 'Change Pricing Settings',
    isSelected: false
  },
  {
    id: 5,
    title: 'View Accounting of Jobseekers and Employers',
    isSelected: false
  },
]
export const EMPLOYMENT_TYPE = [
  {
    id: 0,
    title: 'Full time'
  },
  {
    id: 1,
    title: 'Part time'
  },
  {
    id: 2,
    title: 'Contract'
  },
  {
    id: 3,
    title: 'Temporary'
  },
  {
    id: 4,
    title: 'Intership'
  }
]

export const PROPOSED_TYPE = [
  {
    id: 0,
    title: 'Exact Rate'
  },
  {
    id: 1,
    title: 'Range'
  },
]


export const listImageAcceptMessage = [
  'image/png', 'image/bmp', 'image/jpeg', 'image/tiff', 'image/gif'
]

export const listFileAcceptMessage = [
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain', 'text/csv', 'application/rtf'
]

export const ERROR_MESSAGE = {
  fileNotAllowed: "This file is not allowed."
}

export const SEARCH_REMOTE = 'remote';

export const EXCLUDE_CRAWL = {
  NO: 0,
  AGREE: 1,
  DEGREE: 2
}

export const linkEmbedYoutube = 'https://www.youtube.com/embed/';

export const OTHER_INDUSTRY = 'Other/Not Listed';

export const EMPLOYMENT_TYPE_STR = {
  0: "Full-Time",
  1: "Part-Time",
  2: "Contract",
  3: "Temporary",
  4: "Internship"
}

export const UPLOAD_TYPE = {
  EmployerPhoto: "0",
  EmployerAvatar: "1",
  Chat: "2",
  QuesionImage: "3",
  CompanyAvatar: '4'
};

export const SIZE_IMAGE_EMPLOYER = {
  width: 350,
  height: 150,
}

export const SIZE_ZOOM_IMAGE_EMPLOYER = {
  width: 800,
  height: 400,
}

export const SIZE_IMAGE_COMPANY = {
  width: 350,
  height: 200,
}

export const SIZE_ZOOM_IMAGE_JOBSEEKER = {
  width: 400,
  height: 400,
}

export const SIZE_IMAGE_JOBSEEKER = {
  width: 150,
  height: 150,
}

export const SIZE_ZOOM_IMAGE_COMPANY_LOGO = {
  width: 700,
  height: 400,
}

export const PERMISSION_TYPE = {
  OTHER: 0,
  CHANGE_JOB: 1,
  INFO_COMPANY: 2,
  CHAT: 3,
  BILLING_ANDPAYMENT: 4,
  CANDIDATE: 5
};