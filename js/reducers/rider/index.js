import { combineReducers } from 'redux';

import appState from './appState';
import user from './user';
import tripRequest from './tripRequest';
import trip from './trip';
import history from './history';
import taxi from './taxiTypes';
import payment from './payment';
import billing from './billing';
import favorites from './favorites';
import etaTimer from './etaTimer';
import savedLocations from './savedLocations';
import incidents from './incidents';

const rider = combineReducers({
  appState,
  user,
  trip,
  tripRequest,
  history,
  taxi,
  payment,
  billing,
  favorites,
  etaTimer,
  savedLocations,
  incidents,
});
export default rider;
