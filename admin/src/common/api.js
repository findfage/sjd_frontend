const api = window.location.pathname.replace('/admin/', '/api/admin/');

export default {
  // User
  signIn: `${api}user/login`,
  signUp: `${api}user/register`,
  resetPassword: `${api}user/reset_password`,
  verifyCode: `${api}user/verify_code`,

  // Customer
  customer: {
    list: `${api}customer`,
    disable: `${api}customer/disable`,
    enable: `${api}customer/enable`,
  },

  // Activity
  activity: {
    list: `${api}activity`,
  },

  // Order
  order: {
    list: `${api}order/list`,
  },

  // Widthdrawal
  withdrawal: {
    list: `${api}withdrawal/list`,
    handle: `${api}withdrawal/handle`,
  },

  // Statistic
  statistic: {
    activity: `${api}statistic/activity`,
  },

  // Complaint
  complaint: {
    list: `${api}complaint`,
    handle: `${api}complaint/handle`,
  },
};
