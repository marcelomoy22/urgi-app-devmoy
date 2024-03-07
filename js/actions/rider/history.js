
import config from '../../../config.js';
import { setErrorAlertMsg } from '../alerts';
import { ZONE_DOES_NOT_ALLOW_CASH } from '../../textStrings';

export const TRIP_HISTORY_FETCHED = 'TRIP_HISTORY_FETCHED';
export const START_FETCHING_HISTORY = 'START_FETCHING_HISTORY';
export const END_FETCHING_HISTORY = 'END_FETCHING_HISTORY';
export const SET_SELECTED_TRIP = 'SET_SELECTED_TRIP';
export const CLEAR_TRIPS = 'CLEAR_TRIPS';
export const TRIP_NUMBERS = 'TRIP_NUMBERS';

export function tripNumers(dataObj) {
  return {
    type: TRIP_NUMBERS,
    payload: dataObj,
  }
}

export function tripHistoryFetched(dataObj) {
  return {
    type: TRIP_HISTORY_FETCHED,
    payload: dataObj.data,
  };
}

export function setSelectedTrip(trip) {
  return {
    type: SET_SELECTED_TRIP,
    payload: trip,
  };
}

export function clearTrips() {
  return {
    type: CLEAR_TRIPS,
  };
}

export function fetchTripHistoryAsync(data) {
  return (dispatch) => {
    dispatch({ type: START_FETCHING_HISTORY });
    fetch(`${config.serverSideUrl}:${config.port}/api/trips/history`, {
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
        dispatch({ type: END_FETCHING_HISTORY });
        dispatch(tripHistoryFetched(resp));
      })
      .catch(e => e);
  };
}

export function fetchNextTripsAsync(jwtAccessToken) {
  return (dispatch) => {
    dispatch({ type: START_FETCHING_HISTORY });
    fetch(`${config.serverSideUrl}:${config.port}/api/trips/history?nextTrips=true`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwtAccessToken,
      },
    })
      .then(resp => resp.json())
      .then((data) => {
        dispatch({ type: END_FETCHING_HISTORY });
        dispatch(tripHistoryFetched(data));
        dispatch(tripNumers(data));
      })
      .catch(e => e
      );
  };
}

export function fetchSendTripNow(jwtAccessToken, tripRequestObj) {
  return (dispatch) => {
    dispatch({ type: START_FETCHING_HISTORY });
    const rider = tripRequestObj.riderId;
    tripRequestObj.riderId = tripRequestObj.riderId._id;
    if (tripRequestObj.driverId) {
      tripRequestObj.driverId = tripRequestObj.driverId._id;
    }
    const payload = {
      tripRequest: tripRequestObj,
      rider,
    };
    console.log(payload);
    fetch(`${config.serverSideUrl}:${config.port}/api/futureTrips/sendNow/`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwtAccessToken,
      },
    })
      .then(resp => resp.json())
      .then((data) => {
        dispatch({ type: END_FETCHING_HISTORY });
        if (!data.errorMsg) dispatch(tripHistoryFetched(data));
        else dispatch(setErrorAlertMsg({ msg: data.errorMsg, global: true }));
      })
      .catch((e) => {
        console.log('error', e);
      }
      );
  };
}
