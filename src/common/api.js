import { pathify } from '../utilities';

const api = `${pathify(window.location.pathname)}api/`;

export default {
  // User
  signIn: `${api}v1/user/login`,
  signUp: `${api}v1/user/register`,
  resetPassword: `${api}v1/user/reset_password`,
  verifyCode: `${api}v1/user/verify_code`,

  // Activity
  activity: `${api}v1/activity`,
  activityVote: `${api}v1/activity/vote`,
  activityJoin: `${api}v1/activity/join`,
  activityShare: `${api}v1/activity/share`,
  activityJoiner: `${api}v1/activity/joiner`,
  activityJoiners: `${api}v1/activity/joiners`,
  activityRanking: `${api}v1/activity/ranking`,
  activityComplete: `${api}v1/activity/complete`,
  activityExchange: `${api}v1/activity/exchange`,
  activitySearch: `${api}v1/activity/search`,
  activityStatistics: `${api}v1/activity/statistics`,

  // Group
  group: `${api}v1/group`,
  groupOrder: `${api}v1/group/order`,
  groupPay: `${api}v1/group/pay`,
  groupMy: `${api}v1/group/mygroup`,
  groupOne: `${api}v1/group/onegroup`,
  groupAll: `${api}v1/group/allgroups`,
  groupJoiners: `${api}v1/group/joiners`,
  groupComplete: `${api}v1/group/complete`,
  groupIncomplete: `${api}v1/group/incomplete`,
  groupWithdraw: `${api}v1/group/withdraw`,
  groupRemove: `${api}v1/group/remove`,

  // Statistics
  statistic: {
    activity: `${api}v1/statistic/activity`,
  },

  // Complaint
  complaint: `${api}v1/complaint`,
  complaintType: `${api}v1/complaint/type`,

  // Upload
  uploadSignature: `${api}v1/upload/signature`,

  // WeChat
  wechatAccess: `${api}v1/wechat/access`,
  wechatSignature: `${api}v1/wechat/signature`,
};
