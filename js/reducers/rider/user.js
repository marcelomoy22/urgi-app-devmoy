import { RIDER_LOGIN_SUCCESS, LOGOUT_USER } from '../../actions/common/signin';
import { RIDER_REGISTER_SUCCESS } from '../../actions/common/register';
import { SET_USER_LOCATION, NEARBY_DRIVERS_LIST, SET_DEVICE_ID_AND_PUSH_TOKEN, SET_INITIAL_USER_LOCATION } from '../../actions/rider/home';
import { PROFILE_UPDATED } from '../../actions/common/settings';
import { RIDER_PHONE_VERIFICATION_SUCCESS } from '../../actions/common/phoneValidation';

const initialState = {
  _id: undefined,
  email: undefined,
  password: undefined,
  userType: undefined,
  fname: undefined,
  lname: undefined,
  dob: undefined,
  deviceId: undefined,
  pushToken: undefined,
  address: undefined,
  city: undefined,
  state: undefined,
  country: undefined,
  emergencyDetails: [{
    phone: undefined,
    name: undefined,
    imgUrl: undefined,
  }],
  recoveryEmail: undefined,
  latitudeDelta: 0.022,
  longitudeDelta: undefined,
  gpsLoc: [0, 0],
  userRating: undefined,
  phoneNo: undefined,
  profileUrl: undefined,
  currTripId: undefined,
  currTripState: undefined,
  loginStatus: undefined,
  createdAt: undefined,
  homeAddress: undefined,
  workAddress: undefined,
  driversList: [],
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case RIDER_LOGIN_SUCCESS:
      return action.payload.data.user;

    case RIDER_REGISTER_SUCCESS:
      return action.payload.data.user;

    case RIDER_PHONE_VERIFICATION_SUCCESS:
      return action.payload.user;

    case LOGOUT_USER:
      return initialState;

    case SET_USER_LOCATION:
      return { ...state, gpsLoc: [action.payload.latitude, action.payload.longitude] };

    case SET_INITIAL_USER_LOCATION:
      return { ...state, gpsLoc: [action.payload.latitude, action.payload.longitude] };

    case NEARBY_DRIVERS_LIST:
      return { ...state, driversList: action.payload };

    case SET_DEVICE_ID_AND_PUSH_TOKEN:
      return { ...state, deviceId: action.deviceId, pushToken: action.pushToken };

    case PROFILE_UPDATED:
      return { ...state,
        fname: action.payload.data.fname,
        lname: action.payload.data.lname,
        email: action.payload.data.email,
        phoneNo: action.payload.data.phoneNo,
      };
    default:
      return state;
  }
};

export const getUserType = (state) => {
  const rider = state.rider.user.userType;
  const driver = state.driver.user.userType;
  if (!rider && !driver) {
    return null;
  } else if (!rider) {
    return driver;
  }
  return rider;
};
export const getNearbyDriversLocation = (state) => {
  console.log('getNearbyDriversLocation');
  const driversList = state.rider.user.driversList;
  if (!driversList) {
    return undefined;
  }
  const array = [];
  driversList.forEach((driver) => {
    const data = {
      name: driver.fname,
      coordinate: {
        latitude: driver.gpsLoc[1],
        longitude: driver.gpsLoc[0],
      },
      color: driver.groups_docs.color,
    };

    array.push(data);
  });
  return array;
};
export default user;
