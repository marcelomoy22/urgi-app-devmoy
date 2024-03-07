
import { ADDRESS_FETCHED, SET_TRIP_REQUEST, ZONE_NAME, ADD_VIP_DATA} from '../../actions/rider/confirmRide';
import { TRIP_REQUEST_UPDATED, NO_NEARBY_DRIVER, CANCEL_RIDE, DRIVER_LOCATION_UPDATED } from '../../actions/rider/rideBooked';
import { CLEAR_REDUCER_STATE } from '../../actions/rider/receipt';
import { CHANGE_REGION, TRIP_REQUEST_SYNC_COMPLETED, NOT_IN_ANY_CURRENT_RIDE, TRIP_REQUEST_RECEIVED } from '../../actions/rider/home';
import {
  TRIPREQUEST_STATUS_ARRIVED,
  TRIPREQUEST_STATUS_ARRIVED_SUBTEXT,
  TRIPREQUEST_STATUS_ARRIVING,
  TRIPREQUEST_STATUS_ARRIVING_SUBTEXT,
  TRIPREQUEST_STATUS_CANCELLED,
  TRIPREQUEST_STATUS_CANCELLED_SUBTEXT,
  TRIPREQUEST_STATUS_DRIVER_IS_WAITING,
  TRIPREQUEST_STATUS_ENDTRIP,
  TRIPREQUEST_STATUS_ENDTRIP_SUBTEXT,
  TRIPREQUEST_STATUS_ONTRIP,
  TRIPREQUEST_STATUS_ONTRIP_SUBTEXT,
  TRIPREQUEST_STATUS_ROUTE,
  TRIPREQUEST_STATUS_ROUTE_SUBTEXT,
} from '../../textStrings';

const initialState = {
  riderId: undefined,
  driverId: undefined,
  tripId: undefined,
  latitudeDelta: 0.022,
  longitudeDelta: undefined,
  pickUpAddress: undefined,
  srcLoc: [19.123456, 72.23456],
  destLoc: [],
  destAddress: 'GeekyAnts',
  tripRequestStatus: undefined,
  tripIssue: undefined,
  requestTripFrom: 'PrivautoApp',
  received: false,
  zonaName: undefined,
  vipData: undefined,
};


const tripRequest = (state = initialState, action) => {
  console.log('ACTION TR', action);
  switch (action.type) {
    case CHANGE_REGION:
      return { ...state,
        srcLoc: [action.payload.latitude, action.payload.longitude],
        latitudeDelta: action.payload.latitudeDelta,
        longitudeDelta: action.payload.longitudeDelta,
      };

    case TRIP_REQUEST_SYNC_COMPLETED:
      return action.payload;

    case NOT_IN_ANY_CURRENT_RIDE:
      return { ...initialState, srcLoc: action.payload };

    case SET_TRIP_REQUEST:
      return { ...state, tripRequestStatus: action.payload };

    case ADDRESS_FETCHED:
      return { ...state, pickUpAddress: action.payload };

    case ZONE_NAME:
      return { ...state, zonaName: action.payload };
      
    case ADD_VIP_DATA:
      console.log( action.payload)
      return { ...state, vipData: action.payload };
      
    case TRIP_REQUEST_UPDATED:
      return action.payload;

    case NO_NEARBY_DRIVER:
      return { ...state, tripRequestStatus: undefined };

    case DRIVER_LOCATION_UPDATED:
      return { ...state, driver: { ...state.driver, gpsLoc: action.payload.gpsLoc, carDetails: action.payload.carDetails } };

    case CANCEL_RIDE:
      return { ...state, tripRequestStatus: 'cancelled' };

    case TRIP_REQUEST_RECEIVED:
      return { ...state, received: action.payload };


    case CLEAR_REDUCER_STATE:
      return initialState;
    default:
      return state;
  }
};

export const tripView = (state) => {
  let { tripRequestStatus } = state.rider.tripRequest;
  let { tripStatus } = state.rider.trip;

  if (!tripRequestStatus) {
    return {
      loadSpinner: false,
    };
  }

  if (tripStatus) {
      tripRequestStatus = null;
  }

  if (tripRequestStatus === 'request') {
    return {
      loadSpinner: true,
    };
  }

  if (tripRequestStatus === 'enRoute') {
    return {
      heading: TRIPREQUEST_STATUS_ROUTE,
      subText: TRIPREQUEST_STATUS_ROUTE_SUBTEXT,
      showFooter: true,
      loadSpinner: false,
      backButton: false,
      cancelButton: false,
    };
  } else if (tripRequestStatus === 'arriving') {
    return {
      heading: TRIPREQUEST_STATUS_ARRIVING,
      subText: TRIPREQUEST_STATUS_ARRIVING_SUBTEXT,
      showFooter: true,
      loadSpinner: false,
      backButton: false,
      cancelButton: false,
    };
  } else if (tripRequestStatus === 'arrived') {
    return {
      heading: TRIPREQUEST_STATUS_ARRIVED,
      subText: TRIPREQUEST_STATUS_ARRIVED_SUBTEXT,
      showFooter: true,
      loadSpinner: false,
      backButton: false,
      cancelButton: false,
    };
  } else if (tripRequestStatus === 'cancelled') {
    return {
      heading: TRIPREQUEST_STATUS_CANCELLED,
      subText: TRIPREQUEST_STATUS_CANCELLED_SUBTEXT,
      showFooter: false,
      loadSpinner: false,
      backButton: true,
      cancelButton: false,
    };
  } else if (tripStatus === 'onTrip') {
    return {
      heading: TRIPREQUEST_STATUS_ONTRIP,
      subText: TRIPREQUEST_STATUS_ONTRIP_SUBTEXT,
      showFooter: false,
      loadSpinner: false,
      backButton: false,
      cancelButton: false,
    };
  } else if (tripStatus === 'endTrip') {
    return {
      heading: TRIPREQUEST_STATUS_ENDTRIP,
      subText: TRIPREQUEST_STATUS_ENDTRIP_SUBTEXT,
      showFooter: false,
      loadSpinner: false,
      backButton: false,
      cancelButton: false,
    };
  }
  return {
    heading: TRIPREQUEST_STATUS_ARRIVED,
    subText: TRIPREQUEST_STATUS_DRIVER_IS_WAITING,
    showFooter: true,
    loadSpinner: false,
    backButton: false,
    cancelButton: false,

  };
};
export default tripRequest;
