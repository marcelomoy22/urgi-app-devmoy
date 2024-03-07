import { SET_LOCATION_LIST } from '../../actions/rider/savedLocations';

const initialState = {
  list: [],
};

const savedLocations = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATION_LIST:
      return { ...state, list: action.payload };

    default:
      return state;
  }
};

export default savedLocations;
