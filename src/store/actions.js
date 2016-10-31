// Dialog
// -------------------------

export const showDialog = ({ dispatch }, data) => dispatch('SHOW_DIALOG', data);
export const hideDialog = ({ dispatch }, callback) => dispatch('HIDE_DIALOG', callback);


// Loading
// -------------------------

export const showLoading = ({ dispatch }, text) => dispatch('SHOW_LOADING', text);
export const hideLoading = ({ dispatch }) => dispatch('HIDE_LOADING');


// Page
// -------------------------

export const pageIn = ({ dispatch }, page) => {
  dispatch('PAGE_IN', page);
};


// User
// -------------------------

export const signIn = ({ dispatch }, user) => {
  dispatch('SIGN_IN', user);
};
export const signOut = ({ dispatch }) => {
  dispatch('SIGN_OUT');
};


// Joiner
// -------------------------

export const joinIn = ({ dispatch }, data) => {
  dispatch('JOIN_IN', data);
};

export const joinOut = ({ dispatch }, data) => {
  dispatch('JOIN_OUT', data);
};


// Voter
// -------------------------

export const voteIn = ({ dispatch }, data) => {
  dispatch('VOTE_IN', data);
};


// Sharable
// -------------------------

export const toggleSharable = ({ dispatch }) => {
  dispatch('TOGGLE_SHARABLE');
};


// Reminder
// -------------------------

export const toggleReminder = ({ dispatch }) => {
  dispatch('TOGGLE_REMINDER');
};
