
import { SET_AUTOCOMPLETE_RESULTS,
    CLEAR_AUTOCOMPLETE_RESULTS,
    SET_FORMATTED_ADDRESS,
    SET_DEST_LOC,
    HIDE_SUGGESTIONS,
    SRC_VALIDATOR,
    DEST_VALIDATOR } from '../actions/autoComplete';

const initialState = {
  resultLables: [],
  result: [],
  show: false,
  address: undefined,
  destLoc: {},
  edit: false,
  srcValidator: false,
  destValidator: false,
};

const getInfo = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTOCOMPLETE_RESULTS:
      return {
        ...state,
        resultLables: action.payload.resultLables,
        result: action.payload.result,
        show: action.payload.show,
        edit: action.payload.edit,
      };

    case CLEAR_AUTOCOMPLETE_RESULTS:
      return initialState;

    case SET_DEST_LOC:
      return { ...state, destLoc: action.payload };

    case SET_FORMATTED_ADDRESS:
      return { ...state,
        address: action.payload,
        show: false,
      };

    case HIDE_SUGGESTIONS:
      return {
        ...state,
        show: false,
      };

    case SRC_VALIDATOR:
      return {
        ...state,
        srcValidator: action.payload,
      };

    case DEST_VALIDATOR:
      return {
        ...state,
        destValidator: action.payload,
      };

    default:
      return state;
  }
};
export default getInfo;
