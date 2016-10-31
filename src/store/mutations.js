import $ from 'jquery';
import { LocalStorage } from '../utilities';

export default {
  SHOW_DIALOG($state, data) {
    $state.dialog = $.isPlainObject(data) ? data : null;
  },
  HIDE_DIALOG($state, action) {
    const callbck = $state.dialog[action];

    $state.dialog = null;

    if ($.isFunction(callbck)) {
      callbck();
    }
  },
  SHOW_LOADING($state, text) {
    if (!$state.loading) {
      $state.loading = text || '数据加载中';
    }
  },
  HIDE_LOADING($state) {
    $state.loading = '';
  },
  SIGN_IN($state, data) {
    if ($.isPlainObject(data)) {
      $state.user = data;
      LocalStorage.setItem('user', data);
    }
  },
  SIGN_OUT($state) {
    LocalStorage.removeItem('user');
    $state.user = null;
  },
  PAGE_IN($state, data) {
    $state.page = $.isPlainObject(data) ? data : {};
  },
  JOIN_IN($state, data) {
    if ($.isPlainObject(data)) {
      if ($state.joiner && $state.joiner.mobile === data.mobile) {
        const now = Date.now();
        const activities = $state.joiner.activities;

        // Clear expired activities
        activities.forEach((activity, i) => {
          const expires = activity.expires || activity.expire;

          if (!expires || expires < now) {
            activities.splice(i, 1);
          }
        });

        activities.push(data.activity);
      } else {
        $state.joiner = {
          activities: [data.activity],
          mobile: data.mobile,
          name: data.name,
        };
      }

      LocalStorage.setItem('joiner', $state.joiner);
    }
  },
  JOIN_OUT($state, data) {
    const joinerId = Number(data);

    if (!isNaN(joinerId) && $state.joiner) {
      const activities = $state.joiner.activities;

      activities.forEach((activity, i) => {
        if (activity.joinerId === joinerId) {
          activities.splice(i, 1);
        }
      });

      LocalStorage.setItem('joiner', $state.joiner);
    }
  },
  VOTE_IN($state, data) {
    if ($.isPlainObject(data)) {
      if ($state.voter) {
        const now = Date.now();
        const joiners = $state.voter.joiners;

        // Clear expired joiners
        joiners.forEach((joiner, i) => {
          const expires = joiner.expires || joiner.expire;

          if (!expires || expires < now) {
            joiners.splice(i, 1);
          }
        });

        joiners.push(data.joiner);
      } else {
        $state.voter = {
          joiners: [data.joiner],
        };
      }

      LocalStorage.setItem('voter', $state.voter);
    }
  },
  TOGGLE_SHARABLE($state) {
    $state.sharable = !$state.sharable;
  },
  TOGGLE_REMINDER($state) {
    $state.reminded = !$state.reminded;
  },
};
