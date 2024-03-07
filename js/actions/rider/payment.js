import { Buffer } from 'buffer';
import config from '../../../config';
import { setSuccessAlertMsg, setErrorAlertMsg } from '../alerts';
import { requestTrip, scheduleTrip } from '../../services/ridersocket';
import { popRoute } from '../route';
import { NO_NEARBY_DRIVER } from './rideBooked';
import { CHANGE_PAGE_STATUS } from './home';
import moment from 'moment-timezone';

export const SET_CUSTOMER_ID = 'SET_CUSTOMER_ID';
export const UPDATE_CARD_LIST = 'UPDATE_CARD_LIST';
export const START_SAVE_CARD = 'START_SAVE_CARD';
export const END_SAVE_CARD = 'END_SAVE_CARD';
export const DELETE_CARD_LIST = 'DELETE_CARD_LIST';
export const SELECT_CARD = 'SELECT_CARD';
export const SELECT_CASH = 'SELECT_CASH';

export function setCustomerId(id) {
  return {
    type: SET_CUSTOMER_ID,
    payload: id,
  };
}

export function updateCardList(list) {
  return {
    type: UPDATE_CARD_LIST,
    payload: list,
  };
}

export function setSelectedCard(card) {
  return {
    type: SELECT_CARD,
    payload: card,
  };
}

export function setSelectCash() {
  return { type: SELECT_CASH };
}

export function deleteCardList() {
  return {
    type: DELETE_CARD_LIST,
  };
}

// create openpay customer
export function createOpenPayCustomer(registerData) {
  return (dispatch, getState) => {
    const accessToken = getState().rider.appState.jwtAccessToken;

    const customer = {
      id: registerData._id,
      fname: registerData.fname,
      lname: registerData.lname,
      email: registerData.email,
      RFC_Emisor: 'CCR040802SE5',
    };

    fetch(`${config.serverSideUrl}:${config.port}/api/payment/createCustomer`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      Authorization: accessToken,
      body: JSON.stringify(customer),
    })
    .then(resp => resp.json())
    .then((data) => {
      dispatch(setCustomerId(data.id));
    })
    .catch((e) => {
      console.log(e);
    });
  };
}

// create openpay token to generate a card linked to customer
export function createOpenpayToken(data) {
  return (dispatch, getState) => {
    dispatch({ type: START_SAVE_CARD });
    fetch(config.openPay.url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${new Buffer(`${config.openPay.publicKey}:`).toString('base64')}`,
      },
      body: JSON.stringify(data),
    })
    .then(resp => resp.json())
    .then((resp) => {
      if (resp.error_code === undefined) dispatch(createOpenPayCard(resp, data.cvv2));
      else {
        dispatch(setErrorAlertMsg({ msg: 'La tarjeta no es valida', global: true }));
        dispatch({ type: END_SAVE_CARD });
      }
    }).catch((e) => { dispatch(setErrorAlertMsg({ msg: 'Card error', global: true })); dispatch({ type: END_SAVE_CARD }); });
  };
}

export function createOpenPayCard(data, cvv2) {
  return (dispatch, getState) => {
    const ids = {
      id: getState().rider.user._id,
      token_id: data.id,
      device_session_id: getState().rider.user.deviceId.replace(/-/g, ''),
      RFC_Emisor: 'CCR040802SE5',
      cvv2: cvv2,
    };

    fetch(`${config.serverSideUrl}:${config.port}/api/payment/createCard`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ids),
    })
    .then(resp => resp.json())
    .then((resp) => {
      dispatch({ type: END_SAVE_CARD });
      dispatch(popRoute());

      if (resp.message) {
        dispatch(setSuccessAlertMsg({ msg: resp.message, global: true }));
        dispatch(getCardList());
      } else if (resp.error_code === 3001) {
        dispatch(setErrorAlertMsg({ msg: 'La tarjeta fue rechazada', global: true }));
      } else if (resp.error_code === 3002) {
        dispatch(setErrorAlertMsg({ msg: 'La tarjeta ha expirado', global: true }));
      } else if (resp.error_code === 3003) {
        dispatch(setErrorAlertMsg({ msg: 'La tarjeta no tiene fondos suficientes', global: true }));
      } else if (resp.error_code === 3004) {
        dispatch(setErrorAlertMsg({ msg: 'La tarjeta ha sido identificada como una tarjeta robada', global: true }));
      } else if (resp.error_code === 3005) {
        dispatch(setErrorAlertMsg({ msg: 'La tarjeta ha sido rechazada por el sistema antifraudes', global: true }));
      } else if (resp.error_code) dispatch(setErrorAlertMsg({ msg: 'No se pudo guardar la tarjeta', global: true }));

    })
    .catch((e) => {
      console.log(e);
      dispatch({ type: END_SAVE_CARD });
    });
  };
}

// delete card from card list in openpay
export function deleteOpenPayCard(cardData) {
  return (dispatch, getState) => {
    const accessToken = getState().rider.appState.jwtAccessToken;

    const customer = {
      id: getState().rider.user._id,
      card_id: cardData.id,
      RFC_Emisor: 'CCR040802SE5',
    };

    fetch(`${config.serverSideUrl}:${config.port}/api/payment/deleteCard`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      Authorization: accessToken,
      body: JSON.stringify(customer),
    })
    .then((resp) => { resp.json(); })
    .then(() => {
      dispatch(getCardList());
    })
    .catch((e) => {
      console.log(e);
    });
  };
}

// get customer card list from openpay
export function getCardList() {
  return (dispatch, getState) => {
    const accessToken = getState().rider.appState.jwtAccessToken;

    const request = {
      id: getState().rider.user._id,
      RFC_Emisor: 'CCR040802SE5',
    };

    fetch(`${config.serverSideUrl}:${config.port}/api/payment/getCardList`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      Authorization: accessToken,
      body: JSON.stringify(request),
    })
    .then(resp => resp.json())
    .then((list) => {
      dispatch(updateCardList(list));
    })
    .catch((e) => {
      console.log(e);
    });
  };
}

export function createOpenPayCustomerCharge(cardDetails, trip, rider) {
  return (dispatch, getState) => {
    const accessToken = getState().rider.appState.jwtAccessToken;
    const description = `Dirección de Origen - ${trip.pickUpAddress} / Dirección de Destino - ${trip.destAddress}`;

    const send = {
      data: {
        source_id: (cardDetails ? cardDetails.id : null),
        id: rider._id,
        RFC_Emisor: 'CCR040802SE5',
        idSession: rider.deviceId.replace(/-/g, ''),
        correo: rider.email,
        descripcion: description,
        card: {
          holder_name: (cardDetails ? cardDetails.holder_name : null),
        },
        trip: {
          srcLoc: trip.srcLoc,
          destLoc: trip.destLoc,
          pickUpAddress: trip.pickUpAddress,
          destAddress: trip.destAddress,
          unitType: trip.taxiType,
          riderName: rider.fname,
          riderName2: rider.lname,
          phoneNumber: rider.phoneNo,
          requestTime: trip.requestTime,
          status: trip.tripRequestStatus,
          requestTripFrom: trip.requestTripFrom,
          coupon: trip.coupon,
        },
        rider,
      },
    };

if(trip.vipData){
  send.data.trip.vipData=trip.vipData
  var dest=send.data.trip.destLoc
  send.data.trip.destLoc=send.data.trip.srcLoc
  send.data.trip.srcLoc=dest
}

    fetch(`${config.serverSideUrl}:${config.port}/api/payment/createPreCharge`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: JSON.stringify(send),
    })
    .then(resp => resp.json())
    .then((resp) => {
      // error if wrong scheduled
      if (resp.schedule_error) {
        dispatch(setErrorAlertMsg({ msg: resp.schedule_error, global: true }));

        // use no nearby driver to reset loading spinner
        dispatch({ type: NO_NEARBY_DRIVER });

      // error if card fail
      } else if (resp.error_code !== undefined) {
        if (resp.error_code === 2005) {
          dispatch(setErrorAlertMsg({ msg: 'Error en la fecha de expiración', global: true }));
        } else if (resp.error_code === 3001) {
          dispatch(setErrorAlertMsg({ msg: 'La tarjeta fue rechazada', global: true }));
        } else if (resp.error_code === 3002) {
          dispatch(setErrorAlertMsg({ msg: 'La tarjeta ha expirado', global: true }));
        } else if (resp.error_code === 3003) {
          dispatch(setErrorAlertMsg({ msg: 'La tarjeta no tiene fondos suficientes', global: true }));
        } else if (resp.error_code === 3004) {
          dispatch(setErrorAlertMsg({ msg: 'La tarjeta ha sido identificada como una tarjeta robada', global: true }));
        } else if (resp.error_code === 3005) {
          dispatch(setErrorAlertMsg({ msg: 'La tarjeta ha sido rechazada por el sistema antifraudes', global: true }));
        }

        // use no nearby driver to reset loading spinner
        dispatch({ type: NO_NEARBY_DRIVER });
        dispatch({ type: CHANGE_PAGE_STATUS, payload: 'home' });
      } else if (trip.tripRequestStatus === 'scheduling') {
        const formatedDate = moment(trip.requestTime).tz('America/Mexico_City').format('D/M/YYYY');
        const formatedTime = moment(trip.requestTime).tz('America/Mexico_City').format('h:mm a');

        // use no nearby driver to reset loading spinner
        dispatch({ type: NO_NEARBY_DRIVER });
        dispatch({ type: CHANGE_PAGE_STATUS, payload: 'home' });

        dispatch(setSuccessAlertMsg({
          msg: `Viaje programado para la fecha ${formatedDate} a la hora ${formatedTime} con un precio de ${resp.amount} pesos`,
          global: true,
        }));
      } else {
        // callingSocket
        dispatch(requestTrip({
          tripRequest: trip,
          transactionId: resp.id,
          rider,
        }));
      }
    }).catch(e => console.log('failed', e));
  };
}
