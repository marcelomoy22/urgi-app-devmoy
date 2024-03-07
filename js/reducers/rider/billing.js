import { 
    SEARCH_BILLING,
    LOAD_SPINNER,
    VALIDATION_DATA,
    CLEAN_DATA,
    MY_HISTORY,
    DATA_SEARCH,
    CODE_BASE,
} from '../../actions/rider/billing';

const initialState = {
    RFC: undefined,
    loading: undefined,
    dataFolio: undefined,
    clanData: undefined,
    historyBilling: undefined,
    dataSearch: undefined,
    codeBase64: undefined
  };

const billing = (state = initialState, action) => {
  switch (action.type) {
  
    case SEARCH_BILLING:
      return { ...state, RFC: action.payload };
    case LOAD_SPINNER:
      return { ...state, loading: action.payload };
    case VALIDATION_DATA:
      return { ...state, dataFolio: action.payload };
    case CLEAN_DATA:
      return { ...state, cleanData: action.payload };
    case MY_HISTORY:
      return { ...state, historyBilling: action.payload };
    case DATA_SEARCH:
      return { ...state, dataSearch: action.payload };
    case CODE_BASE:
      return { ...state, codeBase64: action.payload };
    default:
      return state;
  }
};

export default billing;