import {
    SET_CUSTOMER_ID,
    UPDATE_CARD_LIST,
    DELETE_CARD_LIST,
    SELECT_CARD,
    SELECT_CASH,
} from '../../actions/rider/payment';

const initialState = {
  customerId: undefined,
  selectedCard: { id: '666' },
  cards: [],
};

const payment = (state = initialState, action) => {
  switch (action.type) {

    case SET_CUSTOMER_ID:
      return { ...state, customerId: action.payload };

    case UPDATE_CARD_LIST:
      return { ...state, cards: action.payload };

    case SELECT_CARD:
      return { ...state, selectedCard: action.payload };

    case SELECT_CASH:
      return { ...state, selectedCard: initialState.selectedCard };

    case DELETE_CARD_LIST:
      return initialState;

    default:
      return state;
  }
};

export default payment;
