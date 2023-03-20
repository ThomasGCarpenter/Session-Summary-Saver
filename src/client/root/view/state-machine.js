const ROOT_VIEW_STATES = {
  WELCOME: 'WELCOME',
  SIGN_IN: 'SIGN_IN',
  HOME: 'HOME',
  FILM: 'FILM',
  SETTINGS: 'SETTINGS'
};
const ROOT_VIEW_CHANGE = 'ROOT_VIEW_CHANGE';

const INITIAL_STATE = ROOT_VIEW_STATES.HOME;

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ROOT_VIEW_CHANGE:
      return action.payload;
    default:
      return state;
  }
}

function changeView(view) {
  return {
    type: ROOT_VIEW_CHANGE,
    payload: view
  };
}

export const actions = {
  changeView
};
