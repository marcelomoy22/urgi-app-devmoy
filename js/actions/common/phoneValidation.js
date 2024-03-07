import config from '../../../config';
import { RIDER_HOME_VALIDATION_MODAL_ERROR } from '../../textStrings';
import { setErrorAlertMsg } from '../alerts';

export const START_PHONE_VALIDATION = 'START_PHONE_VALIDATION';
export const END_PHONE_VALIDATION = 'END_PHONE_VALIDATION';
export const RIDER_PHONE_VERIFICATION_SUCCESS = 'RIDER_PHONE_VERIFICATION_SUCCESS';

export function riderPhoneVerificationSuccess(data) {
  return {
    type: RIDER_PHONE_VERIFICATION_SUCCESS,
    payload: data,
  };
}

export function phoneValidation(code) {
  return (dispatch, getState) => {
    const user = getState().rider.user;
    const validationData = {
      code,
      email: user.email,
    };

    dispatch({ type: START_PHONE_VALIDATION });
    fetch(`${config.serverSideUrl}:${config.port}/api/users/verifyPhoneNumber`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: user.jwtAccessToken,
      },
      body: JSON.stringify(validationData),
    })
    .then(resp => resp.json())
    .then((data) => {
      dispatch({ type: END_PHONE_VALIDATION });
      if (data !== null) {
        const userData = {
          user: data,
        };

        dispatch(riderPhoneVerificationSuccess(userData));
      } else {
        dispatch(setErrorAlertMsg({ msg: RIDER_HOME_VALIDATION_MODAL_ERROR, global: true }));
      }
    })
    .catch((e) => {
      dispatch({ type: END_PHONE_VALIDATION });
    });
  };
}

export function resendValidationCode(phoneNo) {
  return (dispatch, getState) => {
    const user = getState().rider.user;
    const sendData = {
      phoneNo,
      email: user.email,
    };

    dispatch({ type: START_PHONE_VALIDATION });

    fetch(`${config.serverSideUrl}:${config.port}/api/users/resendValidationCode`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: user.jwtAccessToken,
      },
      body: JSON.stringify(sendData),
    })
            .then(resp => resp.json())
            .then((err) => {
              if (err.code === 1) dispatch(setErrorAlertMsg(err.msg));
              else if (err.code === 2) dispatch(setErrorAlertMsg(err.msg));

              dispatch({ type: END_PHONE_VALIDATION });
            })
            .catch((e) => {
              dispatch({ type: END_PHONE_VALIDATION });
            });
  };
}
