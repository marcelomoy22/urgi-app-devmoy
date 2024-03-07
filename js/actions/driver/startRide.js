import { changePageStatus } from '../../actions/driver/home';
import { startTrip } from '../../services/driversocket';

export const TRIP_STARTED = 'TRIP_STARTED';
export const TRIP_UPDATED = 'TRIP_UPDATED';
export const STARTING_TRIP = 'STARTING_TRIP';

export function tripStarted(trip) {
  return (dispatch) => {
    dispatch({ type: TRIP_STARTED, payload: trip });
    dispatch(changePageStatus('dropOff'));
  };
}
export function tripUpdated(status) {
  return {
    type: TRIP_UPDATED,
    payload: status,
  };
}
export function startRide() {
  return (dispatch, getState) => {
    dispatch({ type: STARTING_TRIP });
    startTrip(getState().driver.tripRequest);
  };
}
