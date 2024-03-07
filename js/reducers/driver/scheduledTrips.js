import { CLEAN_SCH_TRIPS, SET_SCH_TRIPS } from '../../actions/driver/scheduledTrips';

const initialState = {
  data: [],
};

const getTrips = (state = initialState, action) => {
  switch (action.type) {
    case SET_SCH_TRIPS:
      return { data: action.payload };
    case CLEAN_SCH_TRIPS:
      return initialState;
    default:
      return state;
  }
};
export default getTrips;
