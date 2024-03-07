import config from '../../../config';
import { setErrorAlertMsg } from '../alerts';
import { changePageStatus, changeRegion } from './home';
import { setGooglePlacesFormattedAddress, setGooglePlacesDestLoc } from '../autoComplete';

export const SET_LOCATION_LIST = 'SET_LOCATION_LIST';

export function setLocationList(list) {
  return {
    type: SET_LOCATION_LIST,
    payload: list,
  };
}

export function fetchLocationList(data) {
  return dispatch =>
        fetch(`${config.serverSideUrl}:${config.port}/api/users/getLocations`, {
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
              dispatch(setLocationList(resp));
            })
            .catch(err => console.log(err));
}

export function updateLocationList(value) {
  return (dispatch, getState) => {
    const data = {
      element: value,
      jwtAccessToken: getState().rider.appState.jwtAccessToken,
      _id: getState().rider.user._id,
    };

    fetch(`${config.serverSideUrl}:${config.port}/api/users/updateLocations`, {
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
            if (!resp.error) {
              dispatch(setLocationList(resp));
            } else dispatch(setErrorAlertMsg({ msg: resp.error, global: true }));
          })
          .catch(err => console.log(err));
  };
}

export function gotoLocation(location) {
  return (dispatch, getState) => {
    const pageStatus = getState().rider.appState.pageStatus;
    const region = {
      latitude: location.location[0],
      longitude: location.location[1],
      latitudeDelta: 0.022,
      longitudeDelta: 0.013,
    };

    if (pageStatus === 'home') {
      dispatch(changeRegion(region));
      dispatch(changePageStatus('confirmRide'));
    } else {
      dispatch(setGooglePlacesFormattedAddress(location.address));
      dispatch(setGooglePlacesDestLoc({lat: location.location[0], lng: location.location[1]}));
    }
  };
}
