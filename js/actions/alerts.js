
export const SET_SUCCESS_ALERT_MSG = 'SET_SUCCESS_ALERT_MSG';
export const SET_ERROR_ALERT_MSG = 'SET_ERROR_ALERT_MSG';
export const CLEAR_ALERT_MSG = 'CLEAR_ALERT_MSG';


export function setSuccessAlertMsg(data) {
  return {
    type: SET_SUCCESS_ALERT_MSG,
    payload: data,
  };
}

export function setErrorAlertMsg(data) {
  return {
    type: SET_ERROR_ALERT_MSG,
    payload: data,
  };
}

export function clearAlertMsg() {
  return {
    type: CLEAR_ALERT_MSG,
  };
}
