
import { DRIVER_LOGIN_SUCCESS, LOGOUT_USER } from '../../actions/common/signin';
import { DRIVER_REGISTER_SUCCESS } from '../../actions/common/register';
import { SET_USER_LOCATION, SET_INITIAL_USER_LOCATION, CHANGE_BUSY_STATUS } from '../../actions/driver/home';
import { SET_DRIVER_COUPON } from '../../actions/common/coupons';
import { PROFILE_UPDATED } from '../../actions/common/settings';

const initialState = {
  _id: undefined,
  email: undefined,
  password: undefined,
  userType: undefined,
  fname: undefined,
  lname: undefined,
  dob: undefined,
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
  gpsLoc: [],
  userRating: undefined,
  phoneNo: undefined,
  phoneNo2: undefined,
  profileUrl: undefined,
  currTripId: undefined,
  currTripState: undefined,
  loginStatus: undefined,
  createdAt: undefined,
  homeAddress: undefined,
  workAddress: undefined,
  coupon: undefined,
  speed: 0,
  sos: {
    status: undefined,
  },
  heading: 0,
  busy: false,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case DRIVER_LOGIN_SUCCESS:
      return action.payload.data.user;

    case DRIVER_REGISTER_SUCCESS:
      return action.payload.data.user;

    case PROFILE_UPDATED:
      return { ...state, phoneNo2: action.payload.data.phoneNo2 };

    case LOGOUT_USER:
      return initialState;

    case SET_INITIAL_USER_LOCATION:
      return { ...state, gpsLoc: [action.payload.latitude, action.payload.longitude], speed: action.speed, heading: action.heading };

    case SET_USER_LOCATION:
      return { ...state, gpsLoc: [action.payload.latitude, action.payload.longitude], speed: action.speed, heading: action.heading };

    case SET_DRIVER_COUPON:
      return { ...state, coupon: action.payload };

    case CHANGE_BUSY_STATUS:
      return { ...state, busy: action.payload };

    default:
      return state;
  }
};
export default user;
