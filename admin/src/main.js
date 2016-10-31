import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'; // eslint-disable-line
import App from './app';
import store from './store';
import { routes, aliases, redirections } from './app/routes';
import { datify, lfify, imagify, pricify, percentage } from './filters';
import { jsonFilter } from './utilities';

Vue.config.debug = window.location.hostname === 'localhost';
Vue.http.options.emulateJSON = true;
Vue.http.interceptors.push((request, next) => {
  next((response) => {
    response.body = jsonFilter(response.body);
  });
});

// Register custom filters
Vue.filter('datify', datify);
Vue.filter('lfify', lfify);
Vue.filter('imagify', imagify);
Vue.filter('pricify', pricify);
Vue.filter('percentage', percentage);

const router = new VueRouter();

router.map(routes);
router.alias(aliases);
router.redirect(redirections);
router.beforeEach((transition) => {
  if (store.state.user) {
    if (/(signin|signup|reset-password)/.test(transition.to.path)) {
      transition.redirect('/');
    } else {
      transition.next();
    }
  } else if (transition.to.auth) {
    transition.redirect(`/signin?next=${window.encodeURIComponent(transition.to.path)}`);
  } else {
    transition.next();
  }
});

router.start(Vue.extend(App), 'html');
