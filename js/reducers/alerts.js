import { CLEAR_ALERT_MSG, SET_ERROR_ALERT_MSG, SET_SUCCESS_ALERT_MSG } from '../actions/alerts';

const initialState = {
  successMsg: undefined,
  errorMsg: undefined,
  global: undefined,
};

const getMsg = (state = initialState, action) => {
  switch (action.type) {
    case SET_SUCCESS_ALERT_MSG:
      return {
        successMsg: action.payload.msg,
        global: action.payload.global,
      };

    case SET_ERROR_ALERT_MSG:
      return {
        errorMsg: action.payload.msg,
        global: action.payload.global,
      };

    case CLEAR_ALERT_MSG:
      return { initialState };

    default:
      return state;
  }
};

export default getMsg;
