import { 
  MY_HISTORYTICKETPROCESS,
  CONFIRM_SEND_INFO
} from '../../actions/driver/makePayment';

const initialState = {
  historyTicketProcess: undefined,
  dataFolio: undefined
  };

const makePayment = (state = initialState, action) => {
  switch (action.type) {  
    case MY_HISTORYTICKETPROCESS:
      return { ...state, historyTicketProcess: action.payload };
      case CONFIRM_SEND_INFO:
        return { ...state, dataFolio: action.payload };
    default:
      return state;
  }
};

export default makePayment
;