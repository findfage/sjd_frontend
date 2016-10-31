// Templates
import Home from '../pages';
import SignIn from '../pages/user/signin';
// import SignUp from '../pages/user/signup';
import SignOut from '../pages/user/signout';
import ResetPassword from '../pages/user/reset-password';
import Customers from '../pages/customer';
import CustomerActivities from '../pages/customer/activities';
import Activities from '../pages/activity';
import Orders from '../pages/order';
import Withdrawals from '../pages/withdrawal';
import Statistics from '../pages/statistic';
import Complaints from '../pages/complaint';
import PageNotFound from '../pages/error/404';

export const routes = {
  '/': {
    name: 'home',
    component: Home,
    auth: true,
  },
  '/signin': {
    name: 'signin',
    component: SignIn,
  },
  // '/signup': {
  //   name: 'signup',
  //   component: SignUp,
  // },
  '/signout': {
    name: 'signout',
    component: SignOut,
  },
  '/reset-password': {
    name: 'reset-password',
    component: ResetPassword,
  },
  '/customers': {
    name: 'customers',
    component: Customers,
    auth: true,
  },
  '/customer/:id/activities': {
    name: 'customer-activities',
    component: CustomerActivities,
    auth: true,
  },
  '/activities': {
    name: 'activities',
    component: Activities,
    auth: true,
  },
  '/orders': {
    name: 'orders',
    component: Orders,
    auth: true,
  },
  '/withdrawals': {
    name: 'withdrawals',
    component: Withdrawals,
    auth: true,
  },
  '/statistics': {
    name: 'statistics',
    component: Statistics,
    auth: true,
  },
  '/complaints': {
    name: 'complaints',
    component: Complaints,
    auth: true,
  },
  '/404': {
    name: '404',
    component: PageNotFound,
  },
};

export const aliases = {
  '/login': '/signin',
  // '/register': '/signup',
  '/logout': '/signout',
  '/customer': '/customers',
  '/activity': '/activities',
  '/complaint': '/complaints',
};

export const redirections = {
  '*': '/404',
};
