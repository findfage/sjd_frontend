export default {
  // Common
  1001: '非法的登录', // illegal login
  1002: '加载数据失败', // get info failed
  1003: '页码无效', // page is invalid
  1004: '每页显示数据条数参数无效', // listrows is invalid

  // User
  1101: '该手机号尚未注册或已被禁用', // user is not exist
  1102: '登录状态已过期，请重新登录', // user status expired
  1103: '类型无效', // type is invalid
  1104: '手机号无效', // mobile is invalid
  1105: '该手机号已被注册', // user is already exist
  1106: '正在处理中，请稍候', // please wait a moment
  1107: '非法的IP地址', // illegal ip address
  1108: '验证码记录失败', // verify code log failed
  1109: '验证码条数已达到每日发送限制', // attain daily request limit
  1110: '验证码无效', // verify code is invalid
  1111: '密码无效', // password is invalid
  1112: '手机号错误', // mobile is wrong
  1113: '验证码错误', // verify code is wrong
  1114: '注册失败', // register failed
  1115: '令牌更新失败', // token update failed
  1116: '密码错误', // password is wrong
  1117: '密码重置失败', // password edit failed
  1118: '验证码发送失败', // get verify code failed
  1119: '用户ID无效', // user id is invalid
  1120: '用户禁用失败', // user disable failed
  1121: '用户解禁失败', // user enable failed
  1122: '机构名称不能为空', // organization is invalid
  1123: '行业不能为空', // industry is invalid
  1124: '省份不能为空', // province is invalid
  1125: '城市不能为空', // city is invalid
  1126: '用户列表为空', // user list is empty

  // Activity
  1201: '标题无效', // title is invalid
  1202: '开始时间无效', // start time is invalid
  1203: '结束时间无效', // end time is invalid
  1204: '活动规则无效', // rules is invalid
  1205: '奖项设置无效', // prizes is invalid
  1206: '领奖信息无效', // receive info is invalid
  1207: '兑换奖品失败', // exchange prizes failed
  1208: '还没有人参与此活动', // nobody join activity
  1209: '机构介绍信息无效', // host info is invalid
  1210: '机构介绍图片无效', // host img is invalid
  1212: '活动创建失败', // activity create failed
  1213: '活动ID无效', // activity id is invalid
  1214: '提交数据为空', // update info is empty
  1215: '活动更新失败', // activity update failed
  1216: '暂无活动数据', // activity list is empty
  1217: '该活动不存在或已删除', // activity is not exist
  1218: '名字无效', // name is invalid
  1219: '您已参加过当前活动', // user has already joined activity
  1220: '参加活动失败', // join activity failed
  1221: '参加者无效', // joiner id is invalid
  1222: '投票失败', // vote failed
  1223: '您已经投过票了', // you have already voted
  1224: '分享标题不能为空', // share title is invalid
  1225: '分享内容不能为空', // share content is invalid
  1226: '分享图片不能为空', // share image is invalid
  1227: '分享信息更新失败', // share info update failed
  1228: '活动未开始', // activity has not started
  1229: '活动已结束', // activity has been completed
  1230: '活动期限错误', // activity duration is wrong
  1231: '活动删除失败', // activity delete failed
  1232: '已经兑换过了', // already exchanged prizes
  1233: '奖品已被领取', // prizes have been received over
  1234: '目标已完成', // target has been completed
  1235: '没人完成目标', // nobody complete
  1236: '活动不匹配', // activity is not match
  1237: '关键词无效', // keyword is invalid
  1238: '搜索结果为空', // search result is empty

  // Complaint
  1301: '投诉内容不能为空', // complaint content is invalid
  1302: '投诉失败', // complaint failed
  1303: '投诉ID无效', // complaint id is invalid
  1304: '投诉记录不存在', // complaint is not existed
  1305: '投诉处理失败', // complaint handle failed

  // WeChat
  1401: '获取签名失败', // get jsapi ticket failed
  1402: '授权码无效', // authorize code is invalid
  1403: '获取开放码失败', // get open id failed
  1404: '开放码无效', // open id is invalid

  // Group
  1501: '标题不能为空', // title is required
  1502: '价格无效', // price is invalid
  1503: '团ID无效', // group id is invalid
  1504: '团不存在', // group is not existed
  1505: '姓名不能为空', // name is required
  1506: '预付金额无效', // amount is invalid
  1507: '添加订单失败', // add order fail
  1508: '你已参加过该活动', // already join the activity
  1509: '订单ID无效', // order id is invalid
  1510: '支付令牌无效', // pay token is invalid
  1511: '订单支付失败', // pay order fail
  1512: '验证支付令牌失败', // verify pay token fail
  1513: '订单号不能为空', // order no is required
  1514: '获取团列表失败', // get groups fail
  1515: '获取活动ID组失败', // get activity ids fail
  1516: '账号不能为空', // account is required
  1517: '添加提现记录失败', // add withdraw log fail
  1518: '手机号不能为空', // mobile is required
  1519: '移除团成员失败', // remove group user fail
  1520: '退款失败', // refund fail
  1521: '微信统一下单失败', // wxpay add order fail
  1522: '活动类型错误', // activity type wrong
  1523: '活动还未结束', // activity has not been completed
  1524: '获取活动总参与人数失败', // get groups total people num fail
  1525: '获取活动总预付金额失败', // get total pay fail
  1526: '提现金额错误', // withdraw amount wrong
  1527: '更新订单失败', // update order fail
  1528: '支付消息无效', // pay message is invalid
  1529: '支付状态无效', // pay status is invalid
  1530: '当前团已满员', // group had been fulled

  // Statistics
  1601: '统计类型无效', // 'statistics type is invalid'
  1602: '统计数据更失败', // 'statistics data update failed'

  1701: '提现ID无效', // withdrawal id is invalid
  1702: '提现记录不存在', // withdrawal is not existed
  1703: '提现处理失败', // withdrawal handle failed
};
