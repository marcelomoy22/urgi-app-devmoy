import { SET_MESSAGES, CLEAR_MESSAGES, SET_IS_TYPING, SET_NEW_MSG_COUNT, CLEAR_MSG_COUNTER } from '../actions/common/chat';

const initialState = {
  messages: [],
  isTyping: false,
  newMsgCounter: 0,
};

const chat = (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGES:
      return { ...state, messages: action.payload };

    case SET_IS_TYPING:
      return { ...state, isTyping: action.payload };

    case SET_NEW_MSG_COUNT:
      return { ...state, newMsgCounter: state.newMsgCounter += action.payload };

    case CLEAR_MSG_COUNTER:
      return { ...state, newMsgCounter: 0 };

    case CLEAR_MESSAGES:
      return initialState;

    default:
      return state;
  }
};

export default chat;
