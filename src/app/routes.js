// Templates
import Home from '../pages';
import SignIn from '../pages/user/signin';
import SignUp from '../pages/user/signup';
import SignOut from '../pages/user/signout';
import ResetPassword from '../pages/user/reset-password';
import Activities from '../pages/activity';
import Categories from '../pages/activity/categories';
import Vote from '../pages/activity/vote';
import VoteJoiner from '../pages/activity/vote/joiner';
import VoteEditor from '../pages/activity/vote/editor';
import Star from '../pages/activity/star';
import StarJoiner from '../pages/activity/star/joiner';
import StarEditor from '../pages/activity/star/editor';
import Bargain from '../pages/activity/bargain';
import BargainJoiner from '../pages/activity/bargain/joiner';
import BargainEditor from '../pages/activity/bargain/editor';
import Group from '../pages/activity/group';
import GroupJoiner from '../pages/activity/group/joiner';
import GroupEditor from '../pages/activity/group/editor';
import GroupJoiners from '../pages/activity/group/joiners';
import GroupGuide from '../pages/activity/group/guide';
import GroupGroups from '../pages/activity/group/groups';
import GroupMembers from '../pages/activity/group/members';
import GroupWithdraw from '../pages/activity/group/withdraw';
import Moon from '../pages/activity/moon';
import MoonJoiner from '../pages/activity/moon/joiner';
import MoonEditor from '../pages/activity/moon/editor';
import Nation from '../pages/activity/nation';
import NationJoiner from '../pages/activity/nation/joiner';
import NationEditor from '../pages/activity/nation/editor';
import Joiners from '../pages/activity/joiners';
import Statistics from '../pages/activity/statistics';
import Complaint from '../pages/activity/complaint';
import PageNotFound from '../pages/error/404';

export const routes = {
  '/': {
    name: 'home',
    component: Home,
  },
  '/signin': {
    name: 'signin',
    component: SignIn,
  },
  '/signup': {
    name: 'signup',
    component: SignUp,
  },
  '/signout': {
    name: 'signout',
    component: SignOut,
  },
  '/reset-password': {
    name: 'reset-password',
    component: ResetPassword,
  },
  '/activities': {
    name: 'activities',
    component: Activities,
    auth: true,
  },
  '/activity/categories': {
    name: 'categories',
    component: Categories,
  },
  '/activity/vote/:id': {
    name: 'vote',
    component: Vote,
  },
  '/activity/vote/:id/joiner/:joinerId': {
    name: 'vote-joiner',
    component: VoteJoiner,
  },
  '/activity/vote/:id/editor': {
    name: 'vote-editor',
    component: VoteEditor,
    auth: true,
  },
  '/activity/star/:id': {
    name: 'star',
    component: Star,
  },
  '/activity/star/:id/joiner/:joinerId': {
    name: 'star-joiner',
    component: StarJoiner,
  },
  '/activity/star/:id/editor': {
    name: 'star-editor',
    component: StarEditor,
    auth: true,
  },
  '/activity/bargain/:id': {
    name: 'bargain',
    component: Bargain,
  },
  '/activity/bargain/:id/joiner/:joinerId': {
    name: 'bargain-joiner',
    component: BargainJoiner,
  },
  '/activity/bargain/:id/editor': {
    name: 'bargain-editor',
    component: BargainEditor,
    auth: true,
  },
  '/activity/group/:id': {
    name: 'group',
    component: Group,
  },
  '/activity/group/:id/joiner/:joinerId': {
    name: 'group-joiner',
    component: GroupJoiner,
  },
  '/activity/group/:id/editor': {
    name: 'group-editor',
    component: GroupEditor,
    auth: true,
  },
  '/activity/group/:id/joiners': {
    name: 'group-joiners',
    component: GroupJoiners,
  },
  '/activity/group/:id/guide': {
    name: 'group-guide',
    component: GroupGuide,
  },
  '/activity/group/:id/groups': {
    name: 'group-groups',
    component: GroupGroups,
    auth: true,
  },
  '/activity/group/:id/members': {
    name: 'group-members',
    component: GroupMembers,
    auth: true,
  },
  '/activity/group/:id/withdraw': {
    name: 'group-withdraw',
    component: GroupWithdraw,
    auth: true,
  },
  '/activity/moon/:id': {
    name: 'moon',
    component: Moon,
  },
  '/activity/moon/:id/joiner/:joinerId': {
    name: 'moon-joiner',
    component: MoonJoiner,
  },
  '/activity/moon/:id/editor': {
    name: 'moon-editor',
    component: MoonEditor,
    auth: true,
  },
  '/activity/nation/:id': {
    name: 'nation',
    component: Nation,
  },
  '/activity/nation/:id/joiner/:joinerId': {
    name: 'nation-joiner',
    component: NationJoiner,
  },
  '/activity/nation/:id/editor': {
    name: 'nation-editor',
    component: NationEditor,
    auth: true,
  },
  '/activity/:id/joiners': {
    name: 'joiners',
    component: Joiners,
    auth: true,
  },
  '/activity/:id/statistics': {
    name: 'statistics',
    component: Statistics,
    auth: true,
  },
  '/activity/:id/complaint': {
    name: 'complaint',
    component: Complaint,
  },
  '/404': {
    name: '404',
    component: PageNotFound,
  },
};

export const aliases = {
  '/login': '/signin',
  '/register': '/signup',
  '/logout': '/signout',
  '/activity': '/activities',
  '/activity/vote/new': '/activity/vote/0/editor',
  '/activity/star/new': '/activity/star/0/editor',
  '/activity/bargain/new': '/activity/bargain/0/editor',
  '/activity/group/new': '/activity/group/0/editor',
  '/activity/moon/new': '/activity/moon/0/editor',
  '/activity/nation/new': '/activity/nation/0/editor',
};

export const redirections = {
  '*': '/404',
};
