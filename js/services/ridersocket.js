import { storeObj } from '../setup';
import config from '../../config';
import { logOutUser } from '../actions/common/signin';
import { socketDisconnected, syncDataAsync, nearByDriversList, TRIP_REQUEST_RECEIVED } from '../actions/rider/home';
import { tripRequestUpdated, tripUpdated, driverLocationUpdated } from '../actions/rider/rideBooked';
import { fetchMessages, setMsgCounter, END_SENDING_MSG, SET_IS_TYPING } from '../actions/common/chat';
import '../UserAgent';

const io = require('socket.io-client/dist/socket.io');

let socket = null;

export function socketRiderInit() {
  const { dispatch, getState } = storeObj.store;

  socket = io(`${config.serverSideUrl}:${config.port}`, { jsonp: false, transports: ['websocket', 'polling'], query: `token=${getState().rider.appState.jwtAccessToken}` });

  socket.on('connect', () => {
    dispatch(syncDataAsync(getState().rider.appState.jwtAccessToken));
    dispatch(socketDisconnected(false));
  });
  socket.on('disconnect', () => {
    dispatch(socketDisconnected(true));
  });

  socket.on('unauthorizedToken', () => {
    dispatch(logOutUser());
  });
  socket.on('tripRequestUpdated', (tripRequest) => {
    dispatch(tripRequestUpdated(tripRequest));
  });
  socket.on('tripUpdated', (trip) => {
    dispatch(tripUpdated(trip));
  });
  socket.on('updateDriverLocation', (gpsLoc) => {
    dispatch(driverLocationUpdated(gpsLoc));
  });
  socket.on('socketError', (e) => {
    console.log(e);
  });
  socket.on('nearByDriversList', (driverArray) => {
    dispatch(nearByDriversList(driverArray));
  });
  socket.on('rideRequestReceived', () => {
    dispatch({ type: TRIP_REQUEST_RECEIVED, payload: true });
  });
  socket.on('receiveMessage', (conversation) => {
    dispatch({ type: END_SENDING_MSG });

    if (conversation.usedIn === 'incidents') {
      const conversationId = getState().rider.incidents.selected.conversation;

      if (conversation._id === conversationId) {
        dispatch(fetchMessages(conversation._id));
      }
    } else if (conversation.usedIn === 'tripRequest') {
      const conversationId = getState().rider.tripRequest.conversation;

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
}
export function requestTrip(payload) {
  socket.emit('requestTrip', payload);
}
export function scheduleTrip(payload) {
  socket.emit('scheduleTrip', payload);
}
export function cancelRideByRider(tripRequest) {
  socket.emit('tripRequestUpdate', tripRequest);
}
export function riderCancelledTripRequest(tripRequest) {
  const { dispatch, getState } = storeObj.store;
  const data = {
    tripRequest,
    list: getState().rider.user.driversList,
  };
  socket.emit('riderCancelledTripRequest', data);
}
export function updateLocation(user) {
  socket.emit('updateLocation', user);
}
export function tripUpdate(trip) {
  socket.emit('tripUpdate', trip);
}
export function updatePickupRegion(taxiType, user, region) {
  const typeUserRegion = { taxiType, user, region };
  socket.emit('updatePickupRegion', typeUserRegion); // send also taxiType
}
export function riderIsTyping(isTyping, driverId) {
  socket.emit('isTyping', isTyping, driverId);
}
export function socketDisconnectRider() {
  socket.disconnect();
}
