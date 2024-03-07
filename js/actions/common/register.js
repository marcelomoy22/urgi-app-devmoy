
import { resetRoute, replaceRoute } from '../../actions/route';
import config from '../../../config.js';

export const RIDER_REGISTER_SUCCESS = 'RIDER_REGISTER_SUCCESS';
export const DRIVER_REGISTER_SUCCESS = 'DRIVER_REGISTER_SUCCESS';
export const RIDER_REGISTER_ERROR = 'RIDER_REGISTER_ERROR';
export const DRIVER_REGISTER_ERROR = 'DRIVER_REGISTER_ERROR';
export const REQUEST_REGISTERATION = 'REQUEST_REGISTERATION';
export const REGISTRATION_RESPONSE_RECEIVED = 'REGISTRATION_RESPONSE_RECEIVED';
export const CLEAN_REGISTER_ERROR = 'CLEAN_REGISTER_ERROR';

export function riderRegisterSuccess(data) {
  return {
    type: RIDER_REGISTER_SUCCESS,
    payload: data,
  };
}
export function driverRegisterSuccess(data) {
  return {
    type: DRIVER_REGISTER_SUCCESS,
    payload: data,
  };
}
export function riderRegisterError(error) {
  return {
    type: RIDER_REGISTER_ERROR,
    payload: error,
  };
}
export function driverRegisterError(error) {
  return {
    type: DRIVER_REGISTER_ERROR,
    payload: error,
  };
}
export function cleanRegisterError() {
  return { type: CLEAN_REGISTER_ERROR };
}
export function registerAsync(obj, router) {
  const userCredentials = obj;
  if (!userCredentials.checkbox) {
    userCredentials.userType = 'rider';
  } else {
    userCredentials.userType = 'driver';
  }
  return (dispatch) => {
    dispatch({ type: REQUEST_REGISTERATION });
    fetch(`${config.serverSideUrl}:${config.port}/api/users/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    })
      .then(resp => resp.json())
      .then((data) => {
        dispatch({ type: REGISTRATION_RESPONSE_RECEIVED });
        if (data.success === true && userCredentials.userType === 'rider') {
          dispatch(riderRegisterSuccess(data));
          dispatch(router.replace({ id: 'riderStartupService' }));
          // dispatch(replaceRoute('riderStartupService'));
        }
        if (data.success === true && userCredentials.userType === 'driver') {
          dispatch(driverRegisterSuccess(data));
          dispatch(router.replace({ id: 'driverStartupService' }));
          // dispatch(replaceRoute('driverStartupService'));
        }
        if (data.success === false && userCredentials.userType === 'rider') {
          dispatch(riderRegisterError(data));
        }
        if (data.success === false && userCredentials.userType === 'driver') {
          dispatch(driverRegisterError(data));
        }
      })
      .catch((e) => {
        dispatch({ type: REGISTRATION_RESPONSE_RECEIVED });
      });
  };
}

//
// Registration using fb
//
export function registerAsyncFb(obj, router) {
  const userCredentialsFb = obj;
  if (!userCredentialsFb.checkbox) {
    userCredentialsFb.userType = 'rider';
  } else {
    userCredentialsFb.userType = 'driver';
  }
  return (dispatch, getState) => {
    const state = getState();
    userCredentialsFb.password = state.entrypage.socialLogin.id;
    dispatch({ type: REQUEST_REGISTERATION });
    fetch(`${config.serverSideUrl}:${config.port}/api/users/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentialsFb),
    })
      .then(resp => resp.json())
      .then((data) => {
        dispatch({ type: REGISTRATION_RESPONSE_RECEIVED });
        if (data.success === true && userCredentialsFb.userType === 'rider') {
          dispatch(riderRegisterSuccess(data));
          dispatch(router.replace({ id: 'riderStartupService' }));
        }
        if (data.success === true && userCredentialsFb.userType === 'driver') {
          dispatch(driverRegisterSuccess(data));
          dispatch(router.replace({ id: 'driverStartupService' }));
        }
        if (data.success === false && userCredentialsFb.userType === 'rider') {
          dispatch(riderRegisterError(data));
        }
        if (data.success === false && userCredentialsFb.userType === 'driver') {
          dispatch(driverRegisterError(data));
        }
      })
      .catch((e) => {
        dispatch({ type: REGISTRATION_RESPONSE_RECEIVED });
      });
  };
}

export function registerAnonAsync(router) {
  return (dispatch) => {
    dispatch({ type: REQUEST_REGISTERATION });
    fetch(`${config.serverSideUrl}:${config.port}/api/users/registerAnon`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(resp => resp.json())
      .then((data) => {
        console.log(data);
        dispatch({ type: REGISTRATION_RESPONSE_RECEIVED });
        dispatch(riderRegisterSuccess(data));
        dispatch(router.replace({ id: 'riderStartupService' }));
      })
      .catch((e) => {
        dispatch({ type: REGISTRATION_RESPONSE_RECEIVED });
      });
  };
}
