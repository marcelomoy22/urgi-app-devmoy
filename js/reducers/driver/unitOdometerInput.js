
import { SHOW_ODOMETER_INPUT, IS_ODOMETER_INIT } from '../../actions/driver/unitOdometerInput';

const initialState = {
  show: false,
  init: false,
};

const unitOdometerInput = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ODOMETER_INPUT:
      return { ...state, show: action.payload };

    case IS_ODOMETER_INIT:
      return { ...state, init: action.payload };

    default:
      return state;
  }
};
export default unitOdometerInput;
