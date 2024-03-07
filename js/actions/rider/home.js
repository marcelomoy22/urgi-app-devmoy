import config from '../../../config';
import { updateLocation } from '../../services/ridersocket';
import Geolocation from '@react-native-community/geolocation'

export const SET_INITIAL_USER_LOCATION = 'SET_INITIAL_USER_LOCATION';
export const SET_USER_LOCATION = 'SET_USER_LOCATION';
export const CHANGE_REGION = 'CHANGE_REGION';
export const SOCKET_DISCONNECTED = 'SOCKET_DISCONNECTED';
export const TRIP_REQUEST_SYNC_COMPLETED = 'TRIP_REQUEST_SYNC_COMPLETED';
export const TRIP_SYNC_COMPLETED = 'TRIP_SYNC_COMPLETED';
export const NOT_IN_ANY_CURRENT_RIDE = 'NOT_IN_ANY_CURRENT_RIDE';
export const CLEAR_TRIP_AND_TRIPREQUEST = 'CLEAR_TRIP_AND_TRIPREQUEST';
export const CHANGE_PAGE_STATUS = 'CHANGE_PAGE_STATUS';
export const SET_FAKE_LOCATION = 'SET_FAKE_LOCATION';
export const NEARBY_DRIVERS_LIST = 'NEARBY_DRIVERS_LIST';
export const MAP_DEVICE_ID_TO_USER = 'MAP_DEVICE_ID_TO_USER';
export const SET_DEVICE_ID_AND_PUSH_TOKEN = 'SET_DEVICE_ID_AND_PUSH_TOKEN';
export const LOCATION_NOT_FOUND = 'LOCATION_NOT_FOUND';
export const SET_TAXI_TYPES = 'SET_TAXI_TYPES';
export const SELECT_TAXI_TYPE = 'SELECT_TAXI_TYPE';
export const TRIP_REQUEST_RECEIVED = 'TRIP_REQUEST_RECEIVED';

export function setTripRequestReceivedFalse() {
  return {
    type: TRIP_REQUEST_RECEIVED,
    payload: false,
  };
}

export function setUserLocation(position) {
  return {
    type: SET_USER_LOCATION,
    payload: position.coords,
  };
}

export function setInitialUserLocation(position) {
  return {
    type: SET_INITIAL_USER_LOCATION,
    payload: position.coords,
  };
}

export function clearTripAndTripRequest() {
  return {
    type: CLEAR_TRIP_AND_TRIPREQUEST,
  };
}

export function changePageStatus(newPage) {
  return {
    type: CHANGE_PAGE_STATUS,
    payload: newPage,
  };
}

export function changeRegion(region) {
  return {
    type: CHANGE_REGION,
    payload: region,
  };
}

export function socketDisconnected(flag) {
  return {
    type: SOCKET_DISCONNECTED,
    payload: flag,
  };
}

export function tripRequestSyncCompleted(data) {
  return {
    type: TRIP_REQUEST_SYNC_COMPLETED,
    payload: data,
  };
}

export function tripSyncCompleted(data) {
  return {
    type: TRIP_SYNC_COMPLETED,
    payload: data,
  };
}

export function notInAnyCurrentRide(gpsLoc) {
  return {
    type: NOT_IN_ANY_CURRENT_RIDE,
    payload: gpsLoc,
  };
}

export function setTaxiTypes(types) {
  return {
    type: SET_TAXI_TYPES,
    payload: types,
  };
}

export function selectTaxiType(type) {
  return {
    type: SELECT_TAXI_TYPE,
    payload: type,
  };
}

export function fetchTaxiType(jwtAccessToken) {
  return (dispatch, getState) => {
    const user = {
      jwtAccessToken,
      anonymous: getState().rider.anonymous,
      normal: !getState().rider.anonymous,
    };

    fetch(`${config.serverSideUrl}:${config.port}/api/unitAppTypes/app`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: user.jwtAccessToken,
      },
      body: JSON.stringify(user),
    })
      .then((resp) => resp.json())
      .then((data) => {
        dispatch(setTaxiTypes(data));
      })
      .catch((err) => console.log(err));
  };
}

export function syncDataAsync(jwtAccessToken) {
  return (dispatch, getState) =>
    fetch(`${config.serverSideUrl}:${config.port}/api/syncData`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwtAccessToken,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.success === true && data.data.tripRequest != null && data.data.trip === null) {
          dispatch(tripRequestSyncCompleted(data.data.tripRequest));
        } else if (data.success === true && data.data.tripRequest === null && data.data.trip != null) {
          dispatch(tripSyncCompleted(data.data.trip));
        } else {
          // submit(notInAnyCurrentRide(gpsLoc));
          if (data.data.trip !== null) {
            dispatch(changePageStatus('receipt'));
          } else {
            const gpsLoc = getState().rider.user.gpsLoc;
            dispatch(changePageStatus('home'));
            dispatch(clearTripAndTripRequest());
          }
        }
      })
      .catch((err) => err);
}

export function fetchUserCurrentLocationAsync() {
  return (dispatch, getState) => {
    Geolocation.getCurrentPosition(
      (position) => {
        dispatch(setInitialUserLocation(position));
      },
      () => dispatch({ type: LOCATION_NOT_FOUND }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = Geolocation.watchPosition((position) => {
      dispatch(setUserLocation(position));
      updateLocation(getState().rider.user);
    });
  };
}

export function nearByDriversList(driversArray) {
  return {
    type: NEARBY_DRIVERS_LIST,
    payload: driversArray,
  };
}

export function mapDeviceIdToUser(jwtAccessToken, deviceId, pushToken) {
  return (dispatch, getState) => {
    const requestObj = {
      jwtAccessToken,
      deviceId,
      pushToken,
      fname: getState().rider.user.fname,
      lname: getState().rider.user.lname,
      phoneNo: getState().rider.user.phoneNo,
    };
    fetch(`${config.serverSideUrl}:${config.port}/api/users`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwtAccessToken,
      },
      body: JSON.stringify(requestObj),
    })
      .then((resp) => resp.json())
      .then(() => {
        dispatch({ type: SET_DEVICE_ID_AND_PUSH_TOKEN, deviceId, pushToken });
      })
      .catch((e) => console.log('failed', e));
  };
}

export function zoneIsCovered(data) {
  return (dispatch, getState) => {
    data.accessToken = getState().driver.appState.jwtAccessToken;
    fetch(`${config.serverSideUrl}:${config.port}/api/zones/cover`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: data.accessToken,
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.success) {
          dispatch(changePageStatus('confirmRide'));
        } else {
          alert(resp.message);
        }
      })
      .catch((e) => console.log('failed', e));
  };
}
