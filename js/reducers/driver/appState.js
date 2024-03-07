import { DRIVER_LOGIN_SUCCESS, DRIVER_LOGIN_ERROR, LOGOUT_USER } from '../../actions/common/signin';
import { DRIVER_REGISTER_SUCCESS, DRIVER_REGISTER_ERROR } from '../../actions/common/register';
import { SOCKET_DISCONNECTED, CHANGE_PAGE_STATUS, TRIP_REQUEST_SYNC_COMPLETED, TRIP_SYNC_COMPLETED, NOT_IN_ANY_CURRENT_RIDE, SET_INITIAL_USER_LOCATION, DRIVER_HAS_ARRIVED, LOCATION_NOT_FOUND } from '../../actions/driver/home';
import { CLEAR_REDUCER_STATE } from '../../actions/driver/rateRider';
import { START_GET_TICKET_DATA, END_GET_TICKET_DATA } from '../../actions/driver/captureTicket';
import { START_END_TRIP_REQUEST, STOP_END_TRIP_REQUEST } from '../../actions/driver/dropOff';
import { STARTING_TRIP, TRIP_STARTED } from '../../actions/driver/startRide';
import { PROFILE_UPDATED, UPDATING_PROFILE } from '../../actions/common/settings';
import { SCH_TRIPS_UPDATED, UPDATING_SCH_TRIPS } from '../../actions/driver/scheduledTrips';
import { START_ESTIMATE, END_ESTIMATE } from '../../actions/rider/confirmRide';
import { START_SAVE_CARD, END_SAVE_CARD } from '../../actions/rider/payment';
import { START_SENDING_MSG, END_SENDING_MSG } from '../../actions/common/chat';

const initialState = {
  isLoggedIn: false,
  jwtAccessToken: undefined,
  loginError: false,
  registerError: false,
  errormsg: undefined,
  socketDisconnected: false,
  pageStatus: undefined,
  initialLocationFetched: false,
  loadSpinner: false,

};

const appState = (state = initialState, action) => {
  switch (action.type) {
    case DRIVER_LOGIN_SUCCESS:
      return { ...state,
        isLoggedIn: true,
        jwtAccessToken: action.payload.data.jwtAccessToken,
      };
    case DRIVER_REGISTER_SUCCESS:
      return { ...state,
        isLoggedIn: true,
        jwtAccessToken: action.payload.data.jwtAccessToken,
      };
    case LOGOUT_USER:
      return initialState;

    case SET_INITIAL_USER_LOCATION:
      return { ...state, initialLocationFetched: true };

    case LOCATION_NOT_FOUND:
      return { ...state, initialLocationFetched: true };

    case DRIVER_HAS_ARRIVED:
      return { ...state, pageStatus: 'startRide' };

    case TRIP_REQUEST_SYNC_COMPLETED:
      return { ...state, pageStatus: 'pickRider' };

    case TRIP_SYNC_COMPLETED:
      return { ...state, pageStatus: 'dropOff' };

    case NOT_IN_ANY_CURRENT_RIDE:
      return { ...state, pageStatus: 'home' };

    case DRIVER_REGISTER_ERROR:
      return { ...state, registerError: true, errormsg: action.payload.message };

    case DRIVER_LOGIN_ERROR:
      return { ...state, loginError: true };

    case CHANGE_PAGE_STATUS:
      return { ...state, pageStatus: action.payload };

    case CLEAR_REDUCER_STATE:
      return { ...state, pageStatus: 'home' };

    case SOCKET_DISCONNECTED:
      return { ...state, loadSpinner: false, socketDisconnected: action.payload };

    case TRIP_STARTED:
      return { ...state, loadSpinner: false };

    case STARTING_TRIP:
      return { ...state, loadSpinner: true };

    case END_GET_TICKET_DATA:
      return { ...state, loadSpinner: false };

    case START_GET_TICKET_DATA:
      return { ...state, loadSpinner: true };

    case STOP_END_TRIP_REQUEST:
      return { ...state, loadSpinner: false };

    case START_END_TRIP_REQUEST:
      return { ...state, loadSpinner: true };

    case PROFILE_UPDATED:
      return { ...state, loadSpinner: false };

    case UPDATING_PROFILE:
      return { ...state, loadSpinner: true };

    case SCH_TRIPS_UPDATED:
      return { ...state, loadSpinner: false };

    case UPDATING_SCH_TRIPS:
      return { ...state, loadSpinner: true };

    case END_ESTIMATE:
      return { ...state, loadSpinner: false };

    case START_ESTIMATE:
      return { ...state, loadSpinner: true };

    case END_SAVE_CARD:
      return { ...state, loadSpinner: false };

    case START_SAVE_CARD:
      return { ...state, loadSpinner: true };

    case END_SENDING_MSG:
      return { ...state, loadSpinner: false };

    case START_SENDING_MSG:
      return { ...state, loadSpinner: true };

    default:
      return state;
  }
};
export const isInitialLocationFetched = state =>
  state.driver.appState.initialLocationFetched;

export default appState;

export const isFetching = state =>
    state.driver.appState.loadSpinner;
