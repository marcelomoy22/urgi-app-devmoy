
import config from '../../../config.js';

export const SOS_SEND = 'SOS_SEND';

export function sosSend(data) {
  return {
    type: SOS_SEND,
    payload: data,
  };
}

export function sendSOS(userDetails) {  
  return (dispatch, getState) => {
    userDetails.jwtAccessToken = getState().rider.appState.jwtAccessToken || getState().driver.appState.jwtAccessToken;
    fetch(`${config.serverSideUrl}:${config.port}/api/users`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: userDetails.jwtAccessToken,
      },
      body: JSON.stringify(userDetails),
    })
        .then(resp => resp.json())
        .then((data) => {
          dispatch(sosSend(data));
        })
        .catch(e => e);
  };
}
