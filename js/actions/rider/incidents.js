import config from '../../../config';
import { setSuccessAlertMsg } from '../alerts';
import { popRoute } from '../route';

export const START_INCIDENCE_REQUEST = 'START_INCIDENCE_REQUEST';
export const END_INCIDENCE_REQUEST = 'END_INCIDENCE_REQUEST';
export const SET_INCIDENT_LIST = 'SET_INCIDENT_LIST';
export const SELECT_INCIDENCE = 'SELECT_INCIDENCE';
export const CLEAR_INCIDENTS = 'CLEAR_INCIDENTS';

export function setIncidents(data) {
  return {
    type: SET_INCIDENT_LIST,
    payload: data,
  };
}

export function selectIncidence(data) {
  return {
    type: SELECT_INCIDENCE,
    payload: data,
  };
}

export function clearIncidents() {
  return {
    type: CLEAR_INCIDENTS,
  };
}

export function fetchTripIncidents(tripId) {
  return (dispatch, getState) => {
    const data = {
      jwtAccessToken: getState().rider.appState.jwtAccessToken,
      tripId,
    };

    fetch(`${config.serverSideUrl}:${config.port}/api/tripIncidents/getIncidents`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: data.jwtAccessToken,
      },
      body: JSON.stringify(data),
    })
    .then(resp => resp.json())
    .then((resp) => {
      dispatch(setIncidents(resp.list));
    })
    .catch(err => console.log(err));
  };
}

export function reportIncident(values) {
  return (dispatch, getState) => {
    const incident = {
      jwtAccessToken: getState().rider.appState.jwtAccessToken,
      userId: getState().rider.user._id,
      pageStatus: getState().rider.appState.pageStatus,
      tripId: getState().rider.history.selected._id,
      comment: values.comment,
    };

    dispatch({ type: START_INCIDENCE_REQUEST });

    fetch(`${config.serverSideUrl}:${config.port}/api/tripIncidents/report`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: incident.jwtAccessToken,
      },
      body: JSON.stringify(incident),
    })
    .then(resp => resp.json())
    .then((data) => {
      dispatch(popRoute());
      dispatch(fetchTripIncidents(incident.tripId));
      dispatch(setSuccessAlertMsg({ msg: data.message, global: true }));
      dispatch({ type: END_INCIDENCE_REQUEST });
    })
    .catch(err => console.log(err));
  };
}

export function respondToIncidence(comment) {
  return (dispatch, getState) => {
    const incident = {
      jwtAccessToken: getState().rider.appState.jwtAccessToken,
      userId: getState().rider.user._id,
      incidenceId: getState().rider.incidents.selected._id,
      comment,
    };

    dispatch({ type: START_INCIDENCE_REQUEST });

    fetch(`${config.serverSideUrl}:${config.port}/api/tripIncidents/respond`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: incident.jwtAccessToken,
      },
      body: JSON.stringify(incident),
    })
            .then(resp => resp.json())
            .catch(err => console.log(err));
  };
}
