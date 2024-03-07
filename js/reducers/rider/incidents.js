import { SET_INCIDENT_LIST, SELECT_INCIDENCE } from '../../actions/rider/incidents';

const initialState = {
  list: [],
  selected: undefined,
};

const incidents = (state = initialState, action) => {
  switch (action.type) {
    case SET_INCIDENT_LIST:
      return { ...state, list: action.payload };
    case SELECT_INCIDENCE:
      return { ...state, selected: action.payload };
    default:
      return state;
  }
};

export default incidents;
