import { ETA_TIMER_DIGITS, ETA_TIMER_FORMAT, ETA_TIMER_RESET } from '../../actions/rider/rideBooked';

const initialState = {
  timeDigits: 0,
  timeFormat: '',
};

const etaTimer = (state = initialState, action) => {
  switch (action.type) {
    case ETA_TIMER_DIGITS:
      return { ...state, timeDigits: action.payload };
    case ETA_TIMER_FORMAT:
      return { ...state, timeFormat: action.payload };
    case ETA_TIMER_RESET:
      return initialState;
    default:
      return state;
  }
};

export default etaTimer;
