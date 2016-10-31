import { pathify } from '../utilities';

const api = `${pathify(window.location.pathname)}api/`;

export default {
  user: {
    signIn: `${api}v1/user/login`,
    signUp: `${api}v1/user/register`,
    resetPassword: `${api}v1/user/reset_password`,
    verifyCode: `${api}v1/user/verify_code`,
  },
  activity: {
    root: `${api}v1/activity`,
    vote: `${api}v1/activity/vote`,
    join: `${api}v1/activity/join`,
    share: `${api}v1/activity/share`,
    joiner: `${api}v1/activity/joiner`,
    joiners: `${api}v1/activity/joiners`,
    ranking: `${api}v1/activity/ranking`,
    complete: `${api}v1/activity/complete`,
    exchange: `${api}v1/activity/exchange`,
    search: `${api}v1/activity/search`,
    statistics: `${api}v1/activity/statistics`,
  },
  group: {
    root: `${api}v1/group`,
    order: `${api}v1/group/order`,
    pay: `${api}v1/group/pay`,
    my: `${api}v1/group/mygroup`,
    one: `${api}v1/group/onegroup`,
    all: `${api}v1/group/allgroups`,
    joiners: `${api}v1/group/joiners`,
    complete: `${api}v1/group/complete`,
    incomplete: `${api}v1/group/incomplete`,
    withdraw: `${api}v1/group/withdraw`,
    remove: `${api}v1/group/remove`,
  },
  statistic: {
    activity: `${api}v1/statistic/activity`,
  },
  complaint: {
    root: `${api}v1/complaint`,
    type: `${api}v1/complaint/type`,
  },
  upload: {
    signature: `${api}v1/upload/signature`,
  },
  wechat: {
    access: `${api}v1/wechat/access`,
    signature: `${api}v1/wechat/signature`,
  },
};
