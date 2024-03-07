import config from "../../../config";
import { logOutUserAsync } from "../common/signin";
import { setErrorAlertMsg, setSuccessAlertMsg } from "../alerts";
import {
  DRIVER_HOME_ODOMETER_ALERT_SUCCESS,
  DRIVER_HOME_ODOMETER_ALERT_TOO_LARGE,
  DRIVER_HOME_ODOMETER_ALERT_UNDER_MIN,
  ZONE_DOES_NOT_ALLOW_CASH,
} from "../../textStrings";

export const SHOW_ODOMETER_INPUT = "SHOW_ODOMETER_INPUT";
export const IS_ODOMETER_INIT = "IS_ODOMETER_INIT";

export function showOdometerInput(data) {
  return {
    type: SHOW_ODOMETER_INPUT,
    payload: data,
  };
}

export function isOdometerInit(data) {
  return {
    type: IS_ODOMETER_INIT,
    payload: data,
  };
}

export function updateUnitOdometer(data) {
  return (dispatch, getState) => {
    fetch(`${config.serverSideUrl}:${config.port}/api/unit/updateOdometer`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: data.jwtAccessToken,
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.code === 1)
          dispatch(
            setErrorAlertMsg({
              msg: DRIVER_HOME_ODOMETER_ALERT_UNDER_MIN,
              global: true,
            })
          );
        else if (resp.code === 2)
          dispatch(
            setErrorAlertMsg({
              msg: DRIVER_HOME_ODOMETER_ALERT_TOO_LARGE,
              global: true,
            })
          );
        else if (resp.code === 3) {
          dispatch(
            setSuccessAlertMsg({
              msg: DRIVER_HOME_ODOMETER_ALERT_SUCCESS,
              global: true,
            })
          );

          dispatch(showOdometerInput(false));
          dispatch(isOdometerInit(false));

          if (!resp.init)
            dispatch(logOutUserAsync(data.jwtAccessToken, "driver"));
        }
      })
      .catch((e) => console.log("failed to update odometer", e));
  };
}
