import { DELETE_TICKET_DATA, SET_TICKET_DATA } from '../../actions/driver/captureTicket';

const initialState = {
  data: undefined,
};

const getTicket = (state = initialState, action) => {
  switch (action.type) {
    case SET_TICKET_DATA:
      return action.payload;
    case DELETE_TICKET_DATA:
      return initialState;
    default:
      return state;
  }
};
export default getTicket;
