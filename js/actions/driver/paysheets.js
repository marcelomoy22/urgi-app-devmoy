import config from '../../../config';
import moment from 'moment-timezone';

export const SET_PAYSHEETS = 'SET_PAYSHEETS';
export const CLEAR_PAYSHEETS = 'CLEAR_PAYSHEETS';
export const SET_LAST_UPDATED_TIME = 'SET_LAST_UPDATED_TIME';

export function setPaysheets(data) {
  return {
    type: SET_PAYSHEETS,
    payload: data,
  };
}

export function clearPaysheets() {
  return {
    type: CLEAR_PAYSHEETS    
  };
}

export function setLastUpdatedTime(time) {
  return {
    type: SET_LAST_UPDATED_TIME,
    payload: time,
  };
}

export function getDriverPaysheet(jwtAccessToken, driverId) {
  return (dispatch, getState) => {    
    let lastFriday,
      nextFriday;

    if (moment().weekday() === 5 && moment().format('HH') <= 12) {
      lastFriday = moment().set('hour', 11).set('minute', 59).set('second', 59).day(moment().day() >= 5 ? 5 : -2).subtract(7, 'days');
      nextFriday = moment().set('hour', 11).set('minute', 59).set('second', 59).day(moment().day() >= 5 ? 5 : -2);
    } else {
      lastFriday = moment().set('hour', 11).set('minute', 59).set('second', 59).day(moment().day() >= 5 ? 5 : -2);
      nextFriday = moment().set('hour', 11).set('minute', 59).set('second', 59).day(moment().day() >= 5 ? 5 : -2).add(7, 'days');
    }

    const data = {
      app: true,
      createDate: nextFriday.format("YYYY-MM-DD"),
      driver: driverId,
      endDate: nextFriday.format("YYYY-MM-DD 11:59:00"),
      startDate: lastFriday.format("YYYY-MM-DD 12:00:00"),
      user: driverId,
      week: moment().week(),
    };

    fetch(`${config.serverSideUrl}:${config.port}/api/paysheetsWeeks/preview`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: jwtAccessToken,
      },
      body: JSON.stringify(data),
    })
      .then(resp => resp.json())
      .then((myPayroll) => {        
        const paysheet = {
          Department: myPayroll[0].Department,
          TypePaysheets: myPayroll[0].TypePaysheets,
          NumberOfTrips: myPayroll[0].NumberOfTrips,
          AmoutOfTrips: myPayroll[0].AmoutOfTrips,
          revenuemin: myPayroll[0].revenuemin,
          revenuemax: myPayroll[0].revenuemax,
          amount: myPayroll[0].amount,
          commission: myPayroll[0].commission,
          bonuses: myPayroll[0].bonuses,
          incidenciasIdsPos: myPayroll[0].incidenciasIdsPos.length,
          incidenciasAmountPos: myPayroll[0].incidenciasAmountPos,
          incidenciasIdsNeg: myPayroll[0].incidenciasIdsNeg.length,
          incidenciasAmountNeg: myPayroll[0].incidenciasAmountNeg,
          conveniosIds: myPayroll[0].conveniosIds,
          conveniosAmount: myPayroll[0].conveniosAmount,
          tripsDuplicated: myPayroll[0].tripsDuplicated.length,
          sueldoVariable: myPayroll[0].sueldoVariable,
          salary: myPayroll[0].salary,
          Total: myPayroll[0].Total,
          folios: myPayroll[0].folios,
        };        
        dispatch(setPaysheets(paysheet));
      })
      .catch(err => console.log(err));
  };
}
