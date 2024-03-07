import { storeObj } from '../setup';
import config from '../../config.js';
import { newRideRequest, socketDisconnected, syncDataAsync } from '../actions/driver/home';
import { tripRequestUpdated } from '../actions/driver/pickRider';
import { tripStarted } from '../actions/driver/startRide';
import { newTripUpdate } from '../actions/driver/rateRider';
import { responseTimedOut, responseByDriver } from '../actions/driver/rideRequest';
import { changePageStatus } from '../actions/driver/home';
import { STOP_END_TRIP_REQUEST } from '../actions/driver/dropOff';
import { cleanScheduledTrips, getScheduledTrips } from '../actions/driver/scheduledTrips';
import '../UserAgent';
import { END_SENDING_MSG, SET_IS_TYPING, setMsgCounter, fetchMessages } from '../actions/common/chat';

const Sound = require('react-native-sound');
const io = require('socket.io-client/dist/socket.io');

let socket = null;
let whoosh;
export function socketDriverInit() {
  const { dispatch, getState } = storeObj.store;

  socket = io(`${config.serverSideUrl}:${config.port}`, { jsonp: false, transports: ['websocket', 'polling'], query: `token=${storeObj.store.getState().driver.appState.jwtAccessToken}` });

  socket.on('connect', () => {
    dispatch(syncDataAsync(getState().driver.appState.jwtAccessToken));
    dispatch(socketDisconnected(false));
  });
  socket.on('disconnect', () => {
    dispatch(socketDisconnected(true));
  });
  socket.on('connect_error', (error) => {
    console.log('connect_error', error);
  });
  socket.on('requestDriver', (tripRequest) => {
    dispatch(newRideRequest(tripRequest));
  });
  socket.on('tripRequestUpdated', (tripRequest) => {
    dispatch(tripRequestUpdated(tripRequest));
  });
  socket.on('tripUpdated', (trip) => {
    dispatch(newTripUpdate(trip));
  });
  socket.on('responseTimedOut', () => {
    dispatch(responseTimedOut());
  });
  socket.on('endTrip', () => {
    dispatch(changePageStatus('rateRider'));
    dispatch({ type: STOP_END_TRIP_REQUEST });
  });
  socket.on('tooSoonJunior', () => {
    alert('Aun no puede terminar el viaje');
    dispatch({ type: STOP_END_TRIP_REQUEST });
  });
  socket.on('updateScheduledTripsMap', () => {
    dispatch(cleanScheduledTrips());
    dispatch(getScheduledTrips());
  });
  socket.on('riderCancelledTripRequest', () => {
    dispatch(responseByDriver('cancelled'));
  });
  socket.on('receiveMessage', (conversation) => {
    dispatch({ type: END_SENDING_MSG });

    if (conversation.usedIn === 'tripRequest') {
      const conversationId = getState().driver.tripRequest.conversation._id || getState().driver.tripRequest.conversation;

      // update conversation if user is seeing
      if (conversation._id === conversationId) {
        dispatch(fetchMessages(conversation._id));
      }
    }
  });
  socket.on('newMessage', () => {
    dispatch(setMsgCounter(1));
  });
  socket.on('isTyping', (isTyping) => {
    dispatch({ type: SET_IS_TYPING, payload: isTyping });
  });
  socket.on('arrivedToPickup', () => {
    whoosh = new Sound('starttripnotification.mp3', Sound.MAIN_BUNDLE, (error) => {
      whoosh.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          whoosh.reset();
        }
      });
    });
  });
  socket.on('arrivedToDest', () => {
    whoosh = new Sound('endtripnotification.mp3', Sound.MAIN_BUNDLE, (error) => {
      whoosh.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          whoosh.reset();
        }
      });
    });
  });
}

export function updateLocation(user) {
  const { getState } = storeObj.store;
  if (user._id == null) {
    user._id = getState().driver.user._id;
  }
  socket.emit('updateLocation', user);
}

export function sendSOS(user) {
  console.log(user);
  socket.emit('sosEvent', user);
}

export function requestDriverResponse(tripRequest) {
  socket.emit('requestDriverResponse', tripRequest);
}

// tell rider driver already received trip request
export function rideRequestReceived(riderId) {
  socket.emit('rideRequestReceived', riderId);
}

export function tripRequestUpdate(tripRequest) {
  socket.emit('tripRequestUpdate', tripRequest);
}

export function startTrip(tripRequest) {
  socket.emit('startTrip', tripRequest, (trip) => {
    storeObj.store.dispatch(tripStarted(trip));
  });
}

export function tripUpdate(trip) {
  socket.emit('tripUpdate', trip);
}

export function updateScheduledTripsMap() {
  socket.emit('updateScheduledTripsMap');
}
export function driverIsTyping(isTyping, riderId) {
  socket.emit('isTyping', isTyping, riderId);
}
export function socketDisconnectDriver() {
  socket.disconnect();
}
