import mixin from './mixin';

export default {
  mixins: [mixin],
  route: {
    data() {
      const that = this;

      that.$nextTick(() => {
        that.alert();

        // 判断本地缓存的报名用户是否还在当前拼团里面（未被商家移除）
        if (that.joiner && that.my.self) {
          let existed = that.myGroup.leader_mobile === that.joiner.mobile;

          if (!existed) {
            that.myGroup.joiners.forEach((joiner) => {
              if (joiner.mobile === that.joiner.mobile) {
                existed = true;
              }
            });
          }

          if (!existed) {
            const activities = that.joiner.activities;

            activities.forEach((activity) => {
              if (activity.joinerId === that.joinerId) {
                that.joinOut(activity.joinerId);
              }
            });
          }
        }
      });
    },
  },
  data() {
    return {
      personal: true,
    };
  },
  computed: {
    completed() {
      const that = this;
      let completed = false;
      let max = 0;

      if (that.activity) {
        that.activity.prizes.groups.forEach((group) => {
          max = Math.max(group.limit, max);
        });

        completed = that.myGroup.joined_num >= max;
      }

      return completed;
    },
  },
  methods: {
    alert() {
      const that = this;

      if (that.completed) {
        that.showDialog({
          title: '提示',
          content: that.my.self ? '你的拼团已满员' : 'TA的拼团已满员',
          confirm: true,
        });
      }
    },
    click(e) {
      const that = this;
      const myJoinerId = that.my.joinerId;

      // 是否开团
      that.opening = e.target.dataset.action === 'open';

      if (that.my.self) {
        if (that.completed) {
          that.alert();
        } else {
          that.showSharer();
        }
      } else if (myJoinerId) {
        that.$router.go({
          name: 'group-joiner',
          params: {
            id: that.activityId,
            joinerId: myJoinerId,
          },
        });
      } else {
        that.visible = true;

        setTimeout(() => {
          that.joining = true;
        }, 0);
      }
    },
  },
};
