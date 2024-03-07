import config from '../../../config';

export const START_SENDING_MSG = 'START_SENDING_MSG';
export const END_SENDING_MSG = 'END_SENDING_MSG';
export const SET_MESSAGES = 'SET_MESSAGES';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const SET_IS_TYPING = 'SET_IS_TYPING';
export const SET_NEW_MSG_COUNT = 'SET_NEW_MSG_COUNT';
export const CLEAR_MSG_COUNTER = 'CLEAR_MSG_COUNTER';

export function setMessages(data) {
  return {
    type: SET_MESSAGES,
    payload: data,
  };
}

export function clearMessages() {
  return {
    type: CLEAR_MESSAGES,
  };
}

export function setMsgCounter(data) {
  return {
    type: SET_NEW_MSG_COUNT,
    payload: data,
  };
}
export function clearMsgCounter() {
  return {
    type: CLEAR_MSG_COUNTER,
  };
}

export function fetchMessages(conversationId) {
  return (dispatch, getState) => {
    const newData = {
      jwtAccessToken: getState().rider.appState.jwtAccessToken,
      conversationId,
    };

    fetch(`${config.serverSideUrl}:${config.port}/api/conversations/getMessages`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: newData.jwtAccessToken,
      },
      body: JSON.stringify(newData),
    })
    .then(resp => resp.json())
    .then((resp) => {
      dispatch(setMessages(resp));
    })
    .catch(err => console.log(err));
  };
}

export function sendMessage(msg, conversationId, toUser) {
  return (dispatch, getState) => {
    const data = {
      jwtAccessToken: getState().rider.appState.jwtAccessToken || getState().driver.appState.jwtAccessToken,
      conversationId,
      toUser,
      msg,
    };

    dispatch({ type: START_SENDING_MSG });

    fetch(`${config.serverSideUrl}:${config.port}/api/conversations/sendMessage`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: data.jwtAccessToken,
      },
      body: JSON.stringify(data),
    })
            .then(resp => resp.json())
            .catch(err => console.log(err));
  };
}
