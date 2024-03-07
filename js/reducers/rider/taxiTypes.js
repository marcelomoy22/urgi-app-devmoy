import { SET_TAXI_TYPES, SELECT_TAXI_TYPE } from '../../actions/rider/home';

const initialState = {
  selected: { _id: null }, // chosen type
  type: [], // all available types
};

const taxi = (state = initialState, action) => {
  switch (action.type) {
    case SET_TAXI_TYPES:
      return { ...state, type: action.payload };

    case SELECT_TAXI_TYPE:
      return { ...state, selected: action.payload };

    default:
      return state;
  }
};

export default taxi;
