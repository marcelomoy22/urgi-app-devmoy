import { CLEAR_PAYSHEETS, SET_PAYSHEETS, SET_LAST_UPDATED_TIME } from '../../actions/driver/paysheets';

const initialState = {
  data: {},
  updateTime: undefined,
};

const getPaysheets = (state = initialState, action) => {
  switch (action.type) {
    case SET_PAYSHEETS:
      return { ...state, data: action.payload };
    case SET_LAST_UPDATED_TIME:
      return { ...state, updateTime: action.payload };
    case CLEAR_PAYSHEETS:
      return initialState;
    default:
      return state;
  }
};
export default getPaysheets;
