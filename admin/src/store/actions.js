// Loading
// -------------------------

export const showLoading = ({ dispatch }) => dispatch('SHOW_LOADING');
export const hideLoading = ({ dispatch }) => dispatch('HIDE_LOADING');
export const toggleLoading = ({ dispatch }) => dispatch('TOGGLE_LOADING');


// Page
// -------------------------

export const pageIn = ({ dispatch }, data) => dispatch('PAGE_IN', data);
export const pageOut = ({ dispatch }) => dispatch('PAGE_OUT');


// User
// -------------------------

export const signIn = ({ dispatch }, data) => dispatch('SIGN_IN', data);
export const signOut = ({ dispatch }) => dispatch('SIGN_OUT');
