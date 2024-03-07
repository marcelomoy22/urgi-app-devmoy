import config from '../../../config';
import { RIDER_RECEIPT_FAVORITE_OVERSIZE } from '../../textStrings';

export const SET_FAVORITE_DRIVERS = 'SET_FAVORITE_DRIVERS';
export const SET_FAVORITE_SEARCH_RESULTS = 'SET_FAVORITE_SEARCH_RESULTS';
export const CLEAR_FAVORITE_SEARCH_RESULTS = 'CLEAR_FAVORITE_SEARCH_RESULTS';

export function setFavoriteDrivers(data) {
  return {
    type: SET_FAVORITE_DRIVERS,
    payload: data,
  };
}

export function favoriteSearchResults(data) {
  return {
    type: SET_FAVORITE_SEARCH_RESULTS,
    payload: data,
  };
}

export function clearFavoriteSearchResults() {
    return { type: CLEAR_FAVORITE_SEARCH_RESULTS }
}

export function fetchFavoriteDriversList(user) {
  return dispatch =>
        fetch(`${config.serverSideUrl}:${config.port}/api/users/getFavorites`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: user.jwtAccessToken,
          },
          body: JSON.stringify(user),
        })
            .then(resp => resp.json())
            .then((data) => {
              dispatch(setFavoriteDrivers(data));
            })
            .catch(err => console.log(err));
}

export function updateFavoriteDriversList(user) {
  return dispatch =>
        fetch(`${config.serverSideUrl}:${config.port}/api/users/addToFavorites`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: user.jwtAccessToken,
          },
          body: JSON.stringify(user),
        })
            .then(resp => resp.json())
            .then((data) => {
              if (data.code === 0) {
                dispatch(setFavoriteDrivers(data.list));
              } else if (data.code === 1) alert(RIDER_RECEIPT_FAVORITE_OVERSIZE);
            })
            .catch(err => console.log(err));
}

export function searchFavorite(data) {
  return dispatch =>
        fetch(`${config.serverSideUrl}:${config.port}/api/users/searchFavorites`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: data.jwtAccessToken,
          },
          body: JSON.stringify(data),
        })
            .then(resp => resp.json())
            .then((results) => {
              dispatch(favoriteSearchResults(results));
            })
            .catch(err => console.log(err));
}
