import $ from 'jquery';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app';
import store from './store';
import api from './common/api';
import messages from './common/messages';
import constants from './common/constants';
import { Location, LocalStorage, translateType } from './utilities';
import { routes, aliases, redirections } from './app/routes';
import { formatDate, formatText, asterisk, imagify, pricify } from './filters';

const jWeixin = window.jWeixin;
const location = window.location;
const debug = location.hostname === 'localhost';
let initializable = true;


// Initialize openid
// -------------------------

if (!debug && jWeixin) {
  const visitor = store.state.visitor;
  const query = Location.query();

  if (visitor && visitor.openId) {
    const router = LocalStorage.getItem('router');

    if (visitor.expires && visitor.expires <= Date.now()) {
      LocalStorage.removeItem('visitor');
    }

    if (router) {
      LocalStorage.removeItem('router');
    }

    if (query.activity && query.type) {
      let hash = `#!activity/${translateType(query.type)}/${query.activity}`;

      if (query.joiner > 0) {
        hash += `/joiner/${query.joiner}`;
      }

      location.hash = hash;
    } else if (router && router.path) {
      location.hash = `#!${router.path}`;
    }
  } else if (query.code && query.state === constants.domain) {
    initializable = false;

    $.get(api.wechatAccess, {
      code: query.code,
    }).then((response) => {
      if (response.code) {
        $(document.body).tooltip(messages[response.code], 'danger');
        return;
      }

      if (response.data && response.data.open_id) {
        LocalStorage.setItem('visitor', {
          openId: response.data.open_id,
          expires: Date.now() + (24 * 60 * 60 * 1000),
        });

        location.replace(location.href.replace(/[\?&]?code=[^&#]+(&state=?[^&#]*)?/i, ''));
      }
    });
  } else {
    const url = location.href;
    const authUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
    const parts = url.split(/#!?/);
    const params = [
      'appid=wx5429f96d1f04975b',
      `redirect_uri=${window.encodeURIComponent(parts[0])}`,
      'response_type=code',
      'scope=snsapi_base',
      `state=${constants.domain}`,
    ];

    if (parts[1]) {
      LocalStorage.setItem('router', {
        path: parts[1],
      });
    }

    initializable = false;
    location.replace(`${authUrl}?${params.join('&')}#wechat_redirect`);
  }
}


// Initialize Vue application
// -------------------------

if (initializable) {
  Vue.config.debug = debug;

  // Register custom filters
  Vue.filter('formatDate', formatDate);
  Vue.filter('formatText', formatText);
  Vue.filter('asterisk', asterisk);
  Vue.filter('imagify', imagify);
  Vue.filter('pricify', pricify);

  // Initialize router
  const router = new VueRouter();

  router.map(routes);
  router.alias(aliases);
  router.redirect(redirections);
  router.beforeEach((transition) => {
    if (store.state.user) {
      if (/(signin|signup|reset-password)/.test(transition.to.path)) {
        transition.redirect('/activities');
      } else {
        transition.next();
      }
    } else if (transition.to.auth) {
      transition.redirect(`/signin?next=${window.encodeURIComponent(transition.to.path)}`);
    } else {
      transition.next();
    }
  });

  if (!debug && jWeixin) {
    router.afterEach(() => {
      jWeixin.hideMenuItems({
        menuList: [
          'menuItem:copyUrl',
          'menuItem:openWithQQBrowser',
          'menuItem:openWithSafari',
          'menuItem:share:qq',
          'menuItem:share:QZone',
          'menuItem:share:weiboApp',
          'menuItem:share:facebook',
        ],
      });
    });

    $.get(api.wechatSignature, {
      url: location.href.split('#')[0],
    }).then((response) => {
      if (response.code) {
        $(document.body).tooltip(messages[response.code], 'danger');
        return;
      }

      if (response.data) {
        const wechat = response.data;
        let started = false;

        jWeixin.config({
          // debug: true,
          appId: wechat.app_id,
          timestamp: wechat.timestamp,
          nonceStr: wechat.nonce_str,
          signature: wechat.signature,
          jsApiList: [
            'hideMenuItems',
            'onMenuShareAppMessage',
            'onMenuShareTimeline',
            'chooseWXPay',
          ],
        });

        jWeixin.ready(() => {
          if (!started) {
            started = true;
            router.start(Vue.extend(App), 'html');
          }
        });

        jWeixin.error(() => {
          location.reload();
        });
      }
    });
  } else {
    router.start(Vue.extend(App), 'html');
  }
}
