
import { CHANGE_PAGE_STATUS } from './home';
import { cancelRideByRider } from '../../services/ridersocket';
import { ALERT_NO_NEARBY_DRIVERS, ZONE_DOES_NOT_ALLOW_CASH, ZONE_DOES_NOT_ALLOW_CASH_SCHEDULED } from '../../textStrings';
import { setErrorAlertMsg } from '../../actions/alerts';

export const TRIP_REQUEST_UPDATED = 'TRIP_REQUEST_UPDATED';
export const DRIVER_LOCATION_UPDATED = 'DRIVER_LOCATION_UPDATED';
export const CANCEL_RIDE = 'CANCEL_RIDE';
export const TRIP_UPDATED = 'TRIP_UPDATED';
export const NO_NEARBY_DRIVER = 'NO_NEARBY_DRIVER';
export const ETA_TIMER_DIGITS = 'ETA_TIMER_DIGITS';
export const ETA_TIMER_FORMAT = 'ETA_TIMER_FORMAT';
export const ETA_TIMER_RESET = 'ETA_TIMER_RESET';

export function etaTimerDigits(digit) {
  return {
    type: ETA_TIMER_DIGITS,
    payload: digit,
  };
}

export function etaTimerFormat(format) {
  return {
    type: ETA_TIMER_FORMAT,
    payload: format,
  };
}

export function etaTimerReset() {
  return { type: ETA_TIMER_RESET };
}

export function tripRequestUpdated(tripRequest) {
  return (dispatch) => {
    switch (tripRequest.tripRequestStatus) {
      case 'cashNotAccepted':
        dispatch(setErrorAlertMsg({ msg: ZONE_DOES_NOT_ALLOW_CASH, global: true }));
        dispatch({ type: NO_NEARBY_DRIVER });
        dispatch({ type: CHANGE_PAGE_STATUS, payload: 'home' });
        break;
      case 'cashNotAcceptedForScheduled':
        dispatch(setErrorAlertMsg({ msg: ZONE_DOES_NOT_ALLOW_CASH_SCHEDULED, global: true }));
        dispatch({ type: NO_NEARBY_DRIVER });
        dispatch({ type: CHANGE_PAGE_STATUS, payload: 'home' });
        break;
      case 'noNearByDriver':
        alert(ALERT_NO_NEARBY_DRIVERS);
        dispatch({ type: NO_NEARBY_DRIVER });
        dispatch({ type: CHANGE_PAGE_STATUS, payload: 'home' });
        break;
      case 'enRoute':
        dispatch({ type: TRIP_REQUEST_UPDATED, payload: tripRequest });
        dispatch({ type: CHANGE_PAGE_STATUS, payload: 'rideBooked' });
        break;
      case 'cancelled':
        dispatch({ type: CHANGE_PAGE_STATUS, payload: 'home' });
        break;
      default:
        dispatch({ type: TRIP_REQUEST_UPDATED, payload: tripRequest });
    }
  };
}
export function driverLocationUpdated(gpsLoc) {
  return {
    type: DRIVER_LOCATION_UPDATED,
    payload: gpsLoc,
  };
}
export function cancelRide() {
  return (dispatch, getState) => {
    dispatch({ type: CANCEL_RIDE });
    cancelRideByRider(getState().rider.tripRequest); // socket call
  };
}
export function tripUpdated(trip) {
  return (dispatch) => {
    switch (trip.tripStatus) {
      case 'endTrip':
        dispatch({ type: TRIP_UPDATED, payload: trip });
        dispatch({ type: CHANGE_PAGE_STATUS, payload: 'receipt' });
        break;
      default:
        dispatch({ type: TRIP_UPDATED, payload: trip });

    }
  };
}
