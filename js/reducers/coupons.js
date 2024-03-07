import { SET_COUPONS, SELECT_COUPON, DESELECT_COUPON } from '../actions/common/coupons';

const initialState = {
  list: [],
  selected: null,
};

const coupons = (state = initialState, action) => {
  switch (action.type) {
    case SET_COUPONS:
      return { ...state, list: action.payload };

    case SELECT_COUPON:
      return { ...state, selected: action.payload };

    case DESELECT_COUPON:
      return { ...state, selected: null };

    default:
      return state;
  }
};

export default coupons;
