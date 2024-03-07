
import { RIDER_LOGIN_SUCCESS, RIDER_LOGIN_ERROR, LOGOUT_USER, REQUEST_LOGIN, LOGIN_RESPONSE_RECEIVED } from '../../actions/common/signin';
import { RIDER_REGISTER_SUCCESS, RIDER_REGISTER_ERROR, REQUEST_REGISTERATION, REGISTRATION_RESPONSE_RECEIVED, CLEAN_REGISTER_ERROR } from '../../actions/common/register';
import { SOCKET_DISCONNECTED, CHANGE_PAGE_STATUS, TRIP_REQUEST_SYNC_COMPLETED, TRIP_SYNC_COMPLETED, NOT_IN_ANY_CURRENT_RIDE, SET_INITIAL_USER_LOCATION, LOCATION_NOT_FOUND } from '../../actions/rider/home';
import { START_PHONE_VALIDATION, END_PHONE_VALIDATION } from '../../actions/common/phoneValidation';
import { CLEAR_REDUCER_STATE } from '../../actions/rider/receipt';
import { NO_NEARBY_DRIVER } from '../../actions/rider/rideBooked';
import { RIDER_PHONE_VERIFICATION_SUCCESS } from '../../actions/common/phoneValidation';
import { START_INCIDENCE_REQUEST, END_INCIDENCE_REQUEST } from '../../actions/rider/incidents';
import { START_FETCHING_HISTORY, END_FETCHING_HISTORY } from '../../actions/rider/history';
import { END_SENDING_MSG, START_SENDING_MSG } from '../../actions/common/chat';


const initialState = {
  isLoggedIn: false,
  jwtAccessToken: undefined,
  loginError: false,
  registerError: false,
  errormsg: undefined,
  socketDisconnected: false,
  pageStatus: 'home',
  loadSpinner: false,
  initialLocationFetched: false,
};

const appState = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_LOGIN:
      return { ...state, loadSpinner: true };

    case LOGIN_RESPONSE_RECEIVED:
      return { ...state, loadSpinner: false };

    case REQUEST_REGISTERATION:
      return { ...state, loadSpinner: true };

    case REGISTRATION_RESPONSE_RECEIVED:
      return { ...state, loadSpinner: false };

    case RIDER_LOGIN_SUCCESS:
      return { ...state,
        isLoggedIn: true,
        jwtAccessToken: action.payload.data.jwtAccessToken,

      };

    case RIDER_REGISTER_SUCCESS:
      return { ...state,
        isLoggedIn: true,
        jwtAccessToken: action.payload.data.jwtAccessToken,

      };

    case RIDER_LOGIN_ERROR:
      return { ...state, loginError: true, errormsg: action.payload.message };

    case RIDER_REGISTER_ERROR:
      return { ...state,
        registerError: true,
        errormsg: action.payload.message,

      };

    case CLEAN_REGISTER_ERROR:
      return { ...state,
        registerError: false,

      };

    case LOGOUT_USER:
      return initialState;

    case SET_INITIAL_USER_LOCATION:
      return { ...state, initialLocationFetched: true, loadSpinner: false };

    case LOCATION_NOT_FOUND:
      return { ...state, initialLocationFetched: true, loadSpinner: false };


    case NO_NEARBY_DRIVER:
      return { ...state, pageStatus: action.payload };

    case TRIP_REQUEST_SYNC_COMPLETED:
      return { ...state, pageStatus: 'rideBooked' };

    case TRIP_SYNC_COMPLETED:
      return { ...state, pageStatus: 'rideBooked' };

    case NOT_IN_ANY_CURRENT_RIDE:
      return { ...state, pageStatus: 'home' };

    case CHANGE_PAGE_STATUS:
      return { ...state, pageStatus: action.payload };

    case CLEAR_REDUCER_STATE:
      return { ...state, pageStatus: undefined };

    case SOCKET_DISCONNECTED:
      return { ...state, socketDisconnected: action.payload };

    case START_PHONE_VALIDATION:
      return { ...state, loadSpinner: true };

    case END_PHONE_VALIDATION:
      return { ...state, loadSpinner: false };

    case START_FETCHING_HISTORY:
      return { ...state, loadSpinner: true };

    case END_FETCHING_HISTORY:
      return { ...state, loadSpinner: false };

    case START_INCIDENCE_REQUEST:
      return { ...state, loadSpinner: true };

    case END_INCIDENCE_REQUEST:
      return { ...state, loadSpinner: false };

    case END_SENDING_MSG:
      return { ...state, loadSpinner: false };

    case START_SENDING_MSG:
      return { ...state, loadSpinner: true };

    default:
      return state;
  }
};
export default appState;

export const getErrormsg = (state) => {
  if (!state.rider.appState.errormsg && !state.driver.appState.errormsg) {
    return '';
  } else if (!state.rider.appState.errormsg && state.driver.appState.errormsg) {
    return state.driver.appState.errormsg;
  }
  return state.rider.appState.errormsg;
};
function createRiderMarker(gpsLoc) {
  if (!(gpsLoc[0] || gpsLoc[1])) { return null; }
  return {
    latitude: gpsLoc[0],
    longitude: gpsLoc[1],
  };
}
function createDriverMarker(gpsLoc) {
  if (!(gpsLoc[0] || gpsLoc[1])) { return null; }
  return {
    latitude: gpsLoc[0],
    longitude: gpsLoc[1],
  };
}
export const getMarkers = (state) => {
  const ridermarker = createRiderMarker(state.rider.user.gpsLoc);
  const drivermarker = createDriverMarker(state.driver.user.gpsLoc);
  let markers = [];
  if (!(ridermarker || drivermarker)) {
    markers = [];
  } else if (!ridermarker) {
    markers = [drivermarker];
  } else if (!drivermarker) {
    markers = [];
  } else {
    markers = [ridermarker, drivermarker];
  }
  return markers;
};
export const isInitialLocationFetched = state =>
  state.rider.appState.initialLocationFetched;

export const isFetching = state =>
   state.rider.appState.loadSpinner;
