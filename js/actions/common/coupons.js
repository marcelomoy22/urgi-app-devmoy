import config from '../../../config';
import { setErrorAlertMsg, setSuccessAlertMsg } from '../alerts';

export const SET_COUPONS = 'SET_COUPONS';
export const SET_DRIVER_COUPON = 'SET_DRIVER_COUPON';
export const SELECT_COUPON = 'SELECT_COUPON';
export const DESELECT_COUPON = 'DESELECT_COUPON';

function setCouponList(data) {
  return {
    type: SET_COUPONS,
    payload: data,
  };
}

export function selectCoupon(id) {
  return {
    type: SELECT_COUPON,
    payload: id,
  };
}

export function deselectCoupon() {
  return { type: DESELECT_COUPON };
}

export function deleteCoupon(couponId) {
  return (dispatch, getState) => {
    // clear coupon selected
    dispatch(deselectCoupon());

    const data = {
      jwtAccessToken: getState().rider.appState.jwtAccessToken,
      userId: getState().rider.user._id,
      couponId,
    };

    fetch(`${config.serverSideUrl}:${config.port}/api/coupons/deleteCouponFromUserList`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: data.jwtAccessToken,
      },
      body: JSON.stringify(data),
    })
          .then(resp => resp.json())
          .then((list) => {
            dispatch(setCouponList(list));
          })
          .catch(err => console.log(err));
  };
}

export function fetchCouponList(data) {
  return dispatch =>
    fetch(`${config.serverSideUrl}:${config.port}/api/coupons/getCoupons`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: data.jwtAccessToken,
      },
      body: JSON.stringify(data),
    })
        .then(resp => resp.json())
        .then((list) => {
          dispatch(setCouponList(list));
        })
        .catch(err => console.log(err));
}

export function validateCoupon(data) {
  return dispatch =>
        fetch(`${config.serverSideUrl}:${config.port}/api/coupons/registerCoupon`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: data.jwtAccessToken,
          },
          body: JSON.stringify(data),
        })
            .then(resp => resp.json())
            .then((resp) => {
              if (resp.code === 0) {
                dispatch(setCouponList(resp.list));
              } else {
                dispatch(setErrorAlertMsg({ msg: resp.msg, global: true }));
              }
            })
            .catch(err => console.log(err));
}

export function saveCoupon(data) {
  return dispatch =>
        fetch(`${config.serverSideUrl}:${config.port}/api/coupons/saveCoupon`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: data.jwtAccessToken,
          },
          body: JSON.stringify(data),
        })
            .then(resp => resp.json())
            .then((res) => {
              if (res.error_code) dispatch(setErrorAlertMsg({ msg: res.msg, global: true }));
              else {
                dispatch({ type: SET_DRIVER_COUPON, payload: res.coupon });
                dispatch(setSuccessAlertMsg({ msg: res.msg, global: true }));
              }
            }).catch(err => console.log(err));
}
