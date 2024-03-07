
import { TRIP_HISTORY_FETCHED, TRIP_NUMBERS, SET_SELECTED_TRIP, CLEAR_TRIPS } from '../../actions/rider/history';

const initialState = {
  trips: [],
  selected: {},
};
const history = (state = initialState, action) => {
  switch (action.type) {
    case TRIP_HISTORY_FETCHED:
      return { ...state, trips: action.payload };
    case TRIP_NUMBERS:
      return { ...state, tripNumbers: action.payload };
    case SET_SELECTED_TRIP:
      return { ...state, selected: action.payload };
    case CLEAR_TRIPS:
      return initialState;
    default:
      return state;
  }
};
export default history;
