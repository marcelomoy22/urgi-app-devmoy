import config from '../../../config';
import { Alert } from 'react-native';
import { FARE_ESTIMATE, OK, DURATION, DISTANCE, PROMO, PRICE, KM, MXN, BLOCKED_ZONE } from '../../textStrings';
import { requestTrip, scheduleTrip } from '../../services/ridersocket';
import { CHANGE_PAGE_STATUS, clearTripAndTripRequest, TRIP_REQUEST_RECEIVED } from '../../actions/rider/home';
import { createOpenPayCustomerCharge, createOpenPayDirectCharge } from './payment';
import { tripRequestUpdated } from './rideBooked';
import { deselectCoupon } from "../common/coupons";
import { setSuccessAlertMsg, setErrorAlertMsg } from '../alerts';
import moment from 'moment-timezone';

export const ADDRESS_FETCHED = 'ADDRESS_FETCHED';
export const SET_TRIP_REQUEST = 'SET_TRIP_REQUEST';
export const START_ESTIMATE = 'START_ESTIMATE';
export const END_ESTIMATE = 'END_ESTIMATE';
export const ZONE_NAME = 'ZONE_NAME';
export const ADD_VIP_DATA = 'ADD_VIP_DATA';

export function zonaName(zonaName) {
  return {
    type: ZONE_NAME,
    payload: zonaName,
  };
}

export function vipData(vipData) {
  return {
    type: ADD_VIP_DATA,
    payload: vipData,
  };
}

export function zoneStart() {
  return (dispatch, getState) => {
    dispatch(zonaName(undefined))
  }
}

export function startEstimate() {
  return { type: START_ESTIMATE };
}

export function addressFetched(address) {
  return {
    type: ADDRESS_FETCHED,
    payload: address.results[0].formatted_address,
  };
}
export function setTripRequest(status) {
  return {
    type: SET_TRIP_REQUEST,
    payload: status,
  };
}

export function addVipData(addVipData) {
  return (dispatch, getState) => {
    dispatch(vipData(addVipData))
  }
}

export function fetchAddressFromCoordinatesAsync(latitude, longitude) {
  return dispatch => fetch(`https:/maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCj_j0M_P9qh2f8PI9SJwaqS4p_GVqdZTc`, {
    method: 'GET',
  })
    .then(resp => resp.json())
    .then(address =>
        dispatch(addressFetched(address)))
    .catch(e => e);
}

export function isInsideZone(data) {
  return (dispatch, getState) => {
    // check if estimate or start trip
    if (data.tripRequest) { data.coordinates = [data.origin[0], data.origin[1]]; } else { data.coordinates = [data.dest[0], data.dest[1]]; }

    // fetch destination zone id
    fetch(`${config.serverSideUrl}:${config.port}/api/zones/isInside`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: data.accessToken,
      },
      body: JSON.stringify(data),
    })
    .then(resp => resp.json())
    .then((zone) => {
      if (zone.blocked && data.tripRequest) {
        dispatch({ type: END_ESTIMATE });
        dispatch({ type: CHANGE_PAGE_STATUS, payload: 'home' });
        return alert(BLOCKED_ZONE);
      }

      // save destination zone id to our data
      data.toZone = zone._id;

      // check if estimate or start trip
      if (data.tripRequest) dispatch(confirmTrip(data));
      else dispatch(getEstimate(data));
    }).catch((e) => {
      console.log('failed', e);
      dispatch({ type: END_ESTIMATE });
    });
  };
}

export function originDestZone(data) {
  return (dispatch, getState) => {

    fetch(`${config.serverSideUrl}:${config.port}/api/zones/originDestZone`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: data.accessToken,
      },
      body: JSON.stringify(data),
    })
    .then(resp => resp.json())
    .then((zone) => {
        dispatch(zonaName(zone.name))
    })
  }
}

export function getEstimate(data) {
  return (dispatch, getState) => {
    data.app = "si"

    fetch(`${config.serverSideUrl}:${config.port}/api/zones/zoneValidation`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: data.accessToken,
      },
    })
    .then(resp => resp.json())
    .then((zone) => {
      if(data.toZone != zone[0]._id){
        var origen = data.origin
        data.origin=data.dest
        data.dest=origen
        data.coordinates = origen
        data.toZone= zone[0]._id
        }

    // calculate a fare estimate with all data
    fetch(`${config.serverSideUrl}:${config.port}/api/zones/getEstimate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: data.accessToken,
      },
      body: JSON.stringify(data),
    })
    .then(resp => resp.json())
    .then((estimate) => {
      let message;

      if (!estimate.error) {
        if (data.dateTime) {
          const date = moment(data.dateTime).tz('America/Mexico_City').format('D/M/YYYY');
          const time = moment(data.dateTime).tz('America/Mexico_City').format('h:mm a');

          if(data.vip==true){
            message = `Programar fecha el dia ${date}, a las ${time} con un precio de ${estimate[0].cost} VIP`;
            dispatch(setSuccessAlertMsg({ msg: message, global: false }));
          }else{
            message = `Programar fecha el dia ${date}, a las ${time} con un precio de ${estimate[0].cost}`;
            dispatch(setSuccessAlertMsg({ msg: message, global: false }));
          }
        } else {
          if(data.vip==true){
            message = ` ${DURATION} ${estimate[0].duration}\n ${DISTANCE} ${estimate[0].distance}\n ${PROMO} ${estimate[0].promo}\n ${'VIP:'} ${'Si'}\n ${PRICE} ${estimate[0].cost} ${MXN}`;
            dispatch(setSuccessAlertMsg({ msg: message, global: true }));
          }else{
            message = ` ${DURATION} ${estimate[0].duration}\n ${DISTANCE} ${estimate[0].distance}\n ${PROMO} ${estimate[0].promo}\n ${'VIP:'} ${'No'}\n ${PRICE} ${estimate[0].cost} ${MXN}`;
            dispatch(setSuccessAlertMsg({ msg: message, global: true }));
          }
        }
      } else {
        message = estimate.error;
        dispatch(setErrorAlertMsg({ msg: message, global: true }));
      }
    });
    dispatch({ type: END_ESTIMATE });
  })
  };
}

export function confirmTrip(data) {
  return (dispatch, getState) => {
    // To make sure any previous trip is not present.
    dispatch(clearTripAndTripRequest());

    // deselectCoupon after use
    dispatch(deselectCoupon());

    // set up payment variables
    const card = getState().rider.payment.selectedCard;
    let cardDetails = null;

    // check if cash or card
    if (card.id !== '666') cardDetails = card;

    // create pre charge with estimate if card selected
    if (cardDetails !== null) {
        // check if its a scheduled trip
      if (data.tripRequest.tripRequestStatus === 'scheduling') {
        dispatch(setTripRequest('scheduled'));
        dispatch(createOpenPayCustomerCharge(cardDetails, data.tripRequest, data.rider));
      } else { // if not a scheduled trip request trip
        dispatch(setTripRequest('request'));
        dispatch(createOpenPayCustomerCharge(cardDetails, data.tripRequest, data.rider));
      }
    } else { // charge with cash only if destination is to airport
      // check if its a scheduled trip
      if (data.tripRequest.tripRequestStatus === 'scheduling') {
        // data.tripRequest.tripRequestStatus = 'cashNotAcceptedForScheduled';
        // dispatch(tripRequestUpdated(data.tripRequest));

        dispatch(setTripRequest('scheduled'));
        dispatch(createOpenPayCustomerCharge(cardDetails, data.tripRequest, data.rider));

      } else { // if not a scheduled trip request trip
        dispatch(setTripRequest('request'));

        // callingSocket
        dispatch(requestTrip({
          tripRequest: data.tripRequest,
          rider: data.rider,
          cash: true,
        }));
      }
    }
  };
}
