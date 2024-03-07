import config from '../../../config.js';
import { setSuccessAlertMsg } from "../alerts";

export const PROFILE_UPDATED = 'PROFILE_UPDATED';
export const UPDATING_PROFILE = 'UPDATING_PROFILE';

export function profileUpdated(data) {
  return {
    type: PROFILE_UPDATED,
    payload: data,
  };
}

export function updateUserProfileAsync(userDetails) {
  return (dispatch, getState) => {
    dispatch({ type: UPDATING_PROFILE });
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
          dispatch(setSuccessAlertMsg({ msg: data.message, global: true }));
          dispatch(profileUpdated(data));
        })
        .catch(e => console.log(e));
  };
}
