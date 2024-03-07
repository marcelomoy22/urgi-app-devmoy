import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import Geolocation from '@react-native-community/geolocation';

import config from '../../../config';
import { rideRequestReceived, updateLocation } from '../../services/driversocket';

export const SET_USER_LOCATION = 'SET_USER_LOCATION';
export const NEW_RIDE_REQUEST = 'NEW_RIDE_REQUEST';
export const SOCKET_DISCONNECTED = 'SOCKET_DISCONNECTED';
export const CHANGE_PAGE_STATUS = 'CHANGE_PAGE_STATUS';
export const TRIP_REQUEST_SYNC_COMPLETED = 'TRIP_REQUEST_SYNC_COMPLETED';
export const TRIP_SYNC_COMPLETED = 'TRIP_SYNC_COMPLETED';
export const NOT_IN_ANY_CURRENT_RIDE = 'NOT_IN_ANY_CURRENT_RIDE';
export const SET_INITIAL_USER_LOCATION = 'SET_INITIAL_USER_LOCATION';
export const SET_DEVICE_ID_AND_PUSH_TOKEN = 'SET_DEVICE_ID_AND_PUSH_TOKEN';
export const DRIVER_HAS_ARRIVED = 'DRIVER_HAS_ARRIVED';
export const LOCATION_NOT_FOUND = 'LOCATION_NOT_FOUND';
export const CHANGE_BUSY_STATUS = 'CHANGE_BUSY_STATUS';

export function setUserLocation(position) {
  console.log('SET_POSITION', position)
  return {
    type: SET_USER_LOCATION,
    payload: position.coords,
    speed: position.coords.speed,
    heading: position.coords.heading,
  };
}

export function setInitialUserLocation(position) {
  return {
    type: SET_INITIAL_USER_LOCATION,
    payload: position.coords,
    speed: position.coords.speed,
    heading: position.coords.heading,
  };
}
export function newRideRequest(tripRequest) {
  return (dispatch) => {
    rideRequestReceived(tripRequest.riderId);
    dispatch({ type: NEW_RIDE_REQUEST, payload: tripRequest });
    dispatch({ type: CHANGE_PAGE_STATUS, payload: 'rideRequest' });
  };
}
export function socketDisconnected(flag) {
  return {
    type: SOCKET_DISCONNECTED,
    payload: flag,
  };
}
export function changePageStatus(newPage) {
  return {
    type: CHANGE_PAGE_STATUS,
    payload: newPage,
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
export function changeBusyStatus(status) {
  return {
    type: CHANGE_BUSY_STATUS,
    payload: status,
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
        //(data);
        if (data.success === true && data.data.tripRequest != null && data.data.trip === null) {
          if (data.data.tripRequest.tripRequestStatus === 'searching') {
            //console.log(data.data.tripRequest);
            data.data.tripRequest.tripRequestStatus = 'tripre'; // FIXME
            dispatch(newRideRequest(data.data.tripRequest));
          } else if (data.data.tripRequest.tripRequestStatus === 'arrived') {
            dispatch({ type: DRIVER_HAS_ARRIVED, payload: data.data.tripRequest });
          } else {
            dispatch(tripRequestSyncCompleted(data.data.tripRequest));
          }
        } else if (data.success === true && data.data.tripRequest === null && data.data.trip != null) {
          dispatch(tripSyncCompleted(data.data.trip));
        } else {
          const gpsLoc = getState().driver.user.gpsLoc;
          dispatch(notInAnyCurrentRide(gpsLoc));
          dispatch(changePageStatus('driverHome'));
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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    );
    this.watchID = Geolocation.watchPosition((position) => {
      dispatch(setUserLocation(position));
      updateLocation(getState().driver.user);
    });
  };
}

export function stopGeoWatch() {
  Geolocation.clearWatch(this.watchID);
}

export function mapDeviceIdToUser(jwtAccessToken, deviceId, pushToken) {
  return (dispatch, getState) => {
    const requestObj = {
      jwtAccessToken,
      deviceId,
      pushToken,
      fname: getState().driver.user.fname,
      lname: getState().driver.user.lname,
      phoneNo: getState().driver.user.phoneNo,
      version: DeviceInfo.getVersion(),
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
      .then((data) => {
        dispatch({ type: SET_DEVICE_ID_AND_PUSH_TOKEN, deviceId, pushToken });
      })
      .catch((e) => console.log('failed to set device id', e));
  };
}

export async function updateBackgroundLocation(user) {
  // get user data from asyncStorage
  const id = await AsyncStorage.getItem('id').catch((error) => console.log(error));
  const token = await AsyncStorage.getItem('token').catch((error) => console.log(error));
  const carDetails = await AsyncStorage.getItem('car').catch((error) => console.log(error));

  // set user id, car details and token with data
  user._id = id;
  user.isBackgroundService = true;
  user.carDetails = JSON.parse(carDetails);

  console.log('fetching...');
  fetch(`${config.serverSideUrl}:${config.port}/api/users/app`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(user),
  })
    .then((resp) => resp.json())
    .then(() => {
      console.log('Location updated in background');
    })
    .catch((e) => console.log('failed to update location in backgorund', e));
}

export function setToBusyState(state) {
  return (dispatch, getState) => {
    const data = {
      jwtAccessToken: getState().driver.appState.jwtAccessToken,
      userId: getState().driver.user._id,
      unit: getState().driver.user.carDetails,
      busy: state,
    };

    fetch(`${config.serverSideUrl}:${config.port}/api/users/changeBusyState`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: data.jwtAccessToken,
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((status) => {
        dispatch(changeBusyStatus(status));
      })
      .catch((e) => console.log('failed to update state', e));
  };
}
