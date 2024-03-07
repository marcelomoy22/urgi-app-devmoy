import { change } from 'redux-form';

import React from 'react';
import { Dimensions } from 'react-native';
import { changeRegion, changePageStatus } from './rider/home';
import { fetchAddressFromCoordinatesAsync } from './rider/confirmRide';
import config from '../../config';

export const SET_AUTOCOMPLETE_RESULTS = 'SET_AUTOCOMPLETE_RESULTS';
export const CLEAR_AUTOCOMPLETE_RESULTS = 'CLEAR_AUTOCOMPLETE_RESULTS';
export const SET_FORMATTED_ADDRESS = 'SET_FORMATTED_ADDRESS';
export const SET_DEST_LOC = 'SET_DEST_LOC';
export const HIDE_SUGGESTIONS = 'HIDE_SUGGESTIONS';
export const SRC_VALIDATOR = 'SRC_VALIDATOR';
export const DEST_VALIDATOR = 'DEST_VALIDAOR';

let googlePlacesQueryResult = [];
let googlePlacesQueryResultLabels = [];

const { width, height } = Dimensions.get('window');

const aspectRatio = width / height;

export function setGooglePlacesResults(results) {
  return {
    type: SET_AUTOCOMPLETE_RESULTS,
    payload: results,
  };
}

export function setGooglePlacesFormattedAddress(address) {
  return {
    type: SET_FORMATTED_ADDRESS,
    payload: address,
  };
}

export function setGooglePlacesDestLoc(loc) {
  return {
    type: SET_DEST_LOC,
    payload: loc,
  };
}

export function clearGooglePlacesBar() {
  return {
    type: CLEAR_AUTOCOMPLETE_RESULTS,
  };
}

export function hideSuggestions() {
  return {
    type: HIDE_SUGGESTIONS,
  };
}

export function setSrcValidator(data) {
    return {
      type: SRC_VALIDATOR,
      payload: data
    }
}

export function setDestValidator(data) {
    return {
      type: DEST_VALIDATOR,
      payload: data
    }
}

export function startSearch(region, searchInputText, edit) {
  return (dispatch, getState) => {
    dispatch(change('captureTicket', 'destAddress', 'error'));
    dispatch(change('saveLocation', 'address', 'error'));

    const param = {
      input: searchInputText,
      location: region,
      radius: '100000', // 100 KM
      strictbounds: true,
      key: 'AIzaSyDii65UXo0SBSWHtQgAXO8vpOAm0vzA97w',
      fields: ['name', 'geometry.location', 'place_id', 'formatted_address'],
    };

    let url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?';

    url += Object.keys(param).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(param[k])}`).join('&');

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
          .then((responseJson) => {
            let results;

            if (googlePlacesQueryResultLabels.length > 0) {
              googlePlacesQueryResultLabels = [];
              googlePlacesQueryResult = [];
            }

            for (let i = 0; i < responseJson.predictions.length; i++) {
              googlePlacesQueryResultLabels.push(responseJson.predictions[i].description);
              googlePlacesQueryResult.push(responseJson.predictions[i].reference);
            }

            if (searchInputText === '') {
              results = {
                resultLables: googlePlacesQueryResultLabels,
                result: googlePlacesQueryResult,
                show: false,
                edit,
              };
            } else {
              results = {
                resultLables: googlePlacesQueryResultLabels,
                result: googlePlacesQueryResult,
                show: true,
                edit,
              };
            }

            dispatch(setGooglePlacesResults(results));
          });
  };
}

export function onDropdownSelect(i) {
  return (dispatch, getState) => {
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?reference=${googlePlacesQueryResult[i]}&sensor=true&key=AIzaSyDii65UXo0SBSWHtQgAXO8vpOAm0vzA97w`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
          .then((responseJson) => {
            const accessToken = getState().driver.appState.jwtAccessToken;
            const data = { coordinates: [responseJson.result.geometry.location.lat, responseJson.result.geometry.location.lng] };
            fetch(`${config.serverSideUrl}:${config.port}/api/zones/cover`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: accessToken,
              },
              body: JSON.stringify(data),
            })
                  .then(resp => resp.json())
                  .then((resp) => {
                    if (resp.success) {
                      const region = {
                        latitude: responseJson.result.geometry.location.lat,
                        longitude: responseJson.result.geometry.location.lng,
                        latitudeDelta: 0.022,
                        longitudeDelta: 0.013 * aspectRatio,
                      };

                      if (getState().rider.appState.isLoggedIn) { // rider home
                        if (getState().rider.appState.pageStatus === 'home') {
                          dispatch(clearGooglePlacesBar());
                          dispatch(changeRegion(region));
                          dispatch(changePageStatus('confirmRide'));
                          dispatch(setGooglePlacesDestLoc(responseJson.result.geometry.location));
                          return;
                        } else if (getState().autocomplete.edit) {
                          dispatch(fetchAddressFromCoordinatesAsync(region.latitude, region.longitude));
                          dispatch(hideSuggestions());
                          dispatch(changeRegion(region));
                          dispatch(setSrcValidator(true));
                          return;
                        }
                      }

                      // rider confirmRide or driver captureTicket
                      dispatch(change('captureTicket', 'destAddress', responseJson.result.formatted_address));
                      dispatch(change('saveLocation', 'address', responseJson.result.formatted_address));
                      dispatch(setGooglePlacesFormattedAddress(responseJson.result.formatted_address));
                      dispatch(setGooglePlacesDestLoc(responseJson.result.geometry.location));
                      dispatch(setDestValidator(true));
                    } else { alert(resp.message); }
                  }).catch(e => console.log('failed', e));
          });
  };
}
