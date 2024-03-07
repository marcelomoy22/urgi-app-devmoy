import config from '../../../config';
import { updateScheduledTripsMap } from '../../services/driversocket';

export const SET_SCH_TRIPS = 'SET_SCH_TRIPS';
export const CLEAN_SCH_TRIPS = 'CLEAN_SCH_TRIPS';
export const UPDATING_SCH_TRIPS = 'UPDATING_SCH_TRIPS';
export const SCH_TRIPS_UPDATED = 'SCH_TRIPS_UPDATED';

export function setScheduledTrips(data) {
  return {
    type: SET_SCH_TRIPS,
    payload: data,
  };
}

export function cleanScheduledTrips() {
  return {
    type: CLEAN_SCH_TRIPS,
  };
}

export function getScheduledTrips(auth) {
  return (dispatch) => {
    const filter = {
      hours: 24,
      status: 'scheduled',
      filter: 'unassigned',
    };

    fetch(`${config.serverSideUrl}:${config.port}/api/futureTrips/filters`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      body: JSON.stringify(filter),
    })
            .then(resp => resp.json())
            .then((data) => {
              dispatch(setScheduledTrips(data));
            })
            .catch((e) => {
              alert(JSON.stringify(e));
            });
  };
}

export function asignTripAsync(auth, id, data) {
  return (dispatch) => {
    dispatch({ type: UPDATING_SCH_TRIPS });
    fetch(`${config.serverSideUrl}:${config.port}/api/futureTrips/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      body: JSON.stringify(data),
    })
            .then(resp => resp.json())
            .then((data) => {
              dispatch({ type: SCH_TRIPS_UPDATED });
              updateScheduledTripsMap(); // socket emit to update all drivers scheduled map
            })
            .catch((e) => {
              alert(JSON.stringify(e));
            });
  };
}
