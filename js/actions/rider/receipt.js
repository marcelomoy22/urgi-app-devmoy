import { tripUpdate } from '../../services/ridersocket';

export const CLEAR_REDUCER_STATE = 'CLEAR_REDUCER_STATE';
export const SET_RATING = 'SET_RATING';
export function clearReducerState() {
  return {
    type: CLEAR_REDUCER_STATE,
  };
}
export function setRating(rating) {
  return (dispatch, getState) => {
    dispatch({ type: SET_RATING, payload: rating });
    tripUpdate(getState().rider.trip);
  };
}
