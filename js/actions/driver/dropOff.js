import { tripUpdate } from '../../services/driversocket';
import { changePageStatus } from '../../actions/driver/home';
import { deleteTicket } from './captureTicket';
import config from '../../../config';

export const START_END_TRIP_REQUEST = 'START_END_TRIP_REQUEST';
export const STOP_END_TRIP_REQUEST = 'STOP_END_TRIP_REQUEST';

export function endTrip() {
  return (dispatch, getState) => {
    dispatch({ type: START_END_TRIP_REQUEST, payload: 'endTrip' });
    tripUpdate(getState().driver.trip); // socket call to notify end trip
  };
}

export function endTicketTrip(data, driverEndTrip) {
  return (dispatch, getState) => {
    dispatch({ type: START_END_TRIP_REQUEST });
    data.driverEndTrip = driverEndTrip;
    data.tripStatus = 'endTrip';
    fetch(`${config.serverSideUrl}:${config.port}/api/trips/endTripTicket`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: getState().driver.appState.jwtAccessToken,
      },
      body: JSON.stringify(data),
    })
            .then(resp => resp.json())
            .then(async (data) => {
              if (data.success) {
                await dispatch(deleteTicket());
                dispatch(changePageStatus('home'));
                dispatch({ type: STOP_END_TRIP_REQUEST });
              } else {
                dispatch({ type: STOP_END_TRIP_REQUEST });
              }

            })
            .catch((e) => {
              console.log(JSON.stringify(e));
            });
  };
}
