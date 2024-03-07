import { SET_FAVORITE_DRIVERS, SET_FAVORITE_SEARCH_RESULTS, CLEAR_FAVORITE_SEARCH_RESULTS } from '../../actions/rider/favorites';

const initialState = {
  driversList: [],
  searchResults: [],
};

const favorites = (state = initialState, action) => {
  switch (action.type) {
    case SET_FAVORITE_DRIVERS:
      return { ...state, driversList: action.payload };
    case SET_FAVORITE_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };
    case CLEAR_FAVORITE_SEARCH_RESULTS:
      return { ...state, searchResults: [] };
    default:
      return state;
  }
};

export default favorites;
