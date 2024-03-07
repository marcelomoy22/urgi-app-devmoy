import AsyncStorage from "@react-native-community/async-storage";
import BackgroundJob from "react-native-background-job";
import OneSignal from "react-native-onesignal";

import config from "../../../config.js";
import { socketDisconnectDriver } from "../../services/driversocket";
import { socketDisconnectRider } from "../../services/ridersocket";
import { stopGeoWatch } from "../driver/home";
import { clearPaysheets } from "../driver/paysheets";
import { isOdometerInit, showOdometerInput } from "../driver/unitOdometerInput";
import { deleteCardList } from "../rider/payment";
import { resetRoute } from "../route";
import { closeDrawer } from "../drawer.ts";

export const RIDER_LOGIN_SUCCESS = "RIDER_LOGIN_SUCCESS";
export const DRIVER_LOGIN_SUCCESS = "DRIVER_LOGIN_SUCCESS";
export const RIDER_LOGIN_ERROR = "RIDER_LOGIN_ERROR";
export const DRIVER_LOGIN_ERROR = "DRIVER_LOGIN_ERROR";
export const LOGOUT_USER = "LOGOUT_USER";
export const REQUEST_LOGIN = "REQUEST_LOGIN";
export const LOGIN_RESPONSE_RECEIVED = "LOGIN_RESPONSE_RECEIVED";

export function riderSigninSuccess(data) {
  return {
    type: RIDER_LOGIN_SUCCESS,
    payload: data,
  };
}
export function driverSigninSuccess(data) {
  return {
    type: DRIVER_LOGIN_SUCCESS,
    payload: data,
  };
}
export function riderSigninError(error) {
  return {
    type: RIDER_LOGIN_ERROR,
    payload: error,
  };
}
export function driverSigninError(error) {
  return {
    type: DRIVER_LOGIN_ERROR,
    payload: error,
  };
}
export function logOutUser() {
  return {
    type: LOGOUT_USER,
  };
}
export function logOutUserAsync(jwtAccessToken, userType) {
  return (dispatch) => {
    fetch(`${config.serverSideUrl}:${config.port}/api/auth/logout`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: jwtAccessToken,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        // cancel all background jobs
        if (BackgroundJob) {
          BackgroundJob.cancelAll();
        }

        // remove data from AsyncStorage
        AsyncStorage.clear();

        if (userType == "driver") dispatch(clearPaysheets());

        // remove push notifications event listeners
        OneSignal.removeEventListener("ids", this.onIds);
        OneSignal.removeEventListener("received", this.onReceived);
        //OneSignal.removeEventListener("registered", this.onRegistered);
        OneSignal.removeEventListener("opened", this.onOpened);

        // reset reducers payment data
        dispatch(deleteCardList());

        // stop map watch
        stopGeoWatch();

        // disconnect from socket
        if (userType == "rider") socketDisconnectRider();

        // userType undefined for logout in many window
        if (userType == "driver" || userType === undefined)
          socketDisconnectDriver();

        // set route to login
        dispatch(logOutUser());
        dispatch(resetRoute());
      })
      .catch((error) => {
        console.log("LOGOUT", error);
        alert("Error at login");
      });
  };
}
export function signinAsync(obj, router) {
  const userCredentials = obj;
  if (!userCredentials.checkbox) {
    userCredentials.userType = "rider";
  } else {
    userCredentials.userType = "driver";
  }
  return (dispatch) => {
    dispatch({ type: REQUEST_LOGIN });
    fetch(`${config.serverSideUrl}:${config.port}/api/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    })
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({ type: LOGIN_RESPONSE_RECEIVED });
        if (data.success === false) {
          alert("BAD_LOGIN" + data.message);
        }
        if (data.success === true && userCredentials.userType === "rider") {
          dispatch(riderSigninSuccess(data));
          dispatch(router.replace({ id: "riderStartupService" }));
          // dispatch(replaceRoute('riderStartupService'));
        }
        if (data.success === true && userCredentials.userType === "driver") {
          dispatch(driverSigninSuccess(data));
          dispatch(router.replace({ id: "driverStartupService" }));
          // dispatch(replaceRoute('driverStartupService'));
          dispatch(showOdometerInput(true));
          dispatch(isOdometerInit(true));
        }
        if (data.success === false && userCredentials.userType === "rider") {
          dispatch(riderSigninError(data));
        }
        if (data.success === false && userCredentials.userType === "driver") {
          dispatch(driverSigninError(data));
        }
      })
      .catch((e) => {
        console.log(e);
        dispatch({ type: LOGIN_RESPONSE_RECEIVED });
      });
  };
}
