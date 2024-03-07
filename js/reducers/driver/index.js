import { combineReducers } from 'redux';

import appState from './appState';
import camera from './camera';
import captureTicket from './captureTicket';
import user from './user';
import tripRequest from './tripRequest';
import trip from './trip';
import scheduledTrips from './scheduledTrips';
import paysheets from './paysheets';
import unitOdometerInput from './unitOdometerInput';
import makePayment from './makePayment';

const driver = combineReducers({
  appState,
  camera,
  captureTicket,
  paysheets,
  scheduledTrips,
  user,
  trip,
  tripRequest,
  unitOdometerInput,
  makePayment,
});
export default driver;
