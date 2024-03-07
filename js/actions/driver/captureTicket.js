import config from '../../../config.js';
import { Image } from 'react-native';
import ImageEditor from "@react-native-community/image-editor";
import ImgToBase64 from "react-native-image-base64";
import { setSuccessAlertMsg } from "../alerts";
import {
    CAPTURE_TICKET_ERROR_MSG_SEND,
    CAPTURE_TICKET_ERROR_MSG_BASE64,
    CAPTURE_TICKET_ERROR_MSG_CROP,
    CAPTURE_TICKET_SUCCESS,
} from "../../textStrings";

export const SET_TICKET_DATA = 'SET_TICKET_DATA';
export const START_GET_TICKET_DATA = 'START_GET_TICKET_DATA';
export const END_GET_TICKET_DATA = 'END_GET_TICKET_DATA';
export const DELETE_TICKET_DATA = 'DELETE_TICKET_DATA';

export function setTicketData(data) {
  return {
    type: SET_TICKET_DATA,
    payload: data,
  };
}

export function deleteTicket() {
  return {
    type: DELETE_TICKET_DATA,
  };
}

export function ticketAsync(ticketDetails, loc) {
  return (dispatch, getState) => {
    dispatch({ type: START_GET_TICKET_DATA });
    ticketDetails.jwtAccessToken = getState().driver.appState.jwtAccessToken;
    if(ticketDetails.camera) ticketAsyncHelperComplete(ticketDetails, loc, getState(), dispatch);
    else ticketAsyncHelperIncomplete(ticketDetails, loc, getState(), dispatch);
  };
}

// used if we have complete data
function ticketAsyncHelperComplete(ticketDetails, loc, getState, dispatch) {
    const imageURL = ticketDetails.camera;
    let route;
    Image.getSize(imageURL, (width, height) => {
        const imageSize = {
            offset: { x: 0, y: 0 },
            size: { width: width, height: height },
        };
        //ImageEditor.cropImage(imageURL, imageSize).then((imageURI) => {
            ImgToBase64.getBase64String(imageURL).then((data64) => {
                const requestObj = {
                    driverId: getState.driver.user._id,
                    riderId: getState.driver.user._id,
                    srcLoc: loc.srcLoc,
                    pickUpAddress: loc.pickUpAddress,
                    tripAmt: '0',
                    tripIssue: 'noIssue',
                    tripStatus: 'onTrip',
                    taxiType: getState.driver.user.carDetails.type,
                    unit: getState.driver.user.carDetails._id,
                    options: ['CapturaBoleto'],
                    unitNumber: getState.driver.user.carDetails.name,
                    securityCode: ticketDetails.securityCode,
                    file: data64,
                };

                // check if folio or code
                if (ticketDetails.ticketNumber.length === 21 ||ticketDetails.ticketNumber.length === 12 || ticketDetails.ticketNumber.length === 14) requestObj.folio = ticketDetails.ticketNumber;
                else requestObj.code = ticketDetails.ticketNumber;

                // check if creating a new ticket or updating
                if(ticketDetails.new) {
                    route = 'startTripTicket';
                    requestObj.destLoc = loc.destLoc;
                    requestObj.destAddress = loc.destAddress;
                } else {
                    route = 'completeTicketData';
                    requestObj._id = getState.driver.trip._id;
                }
                fetch(`${config.serverSideUrl}:${config.port}/api/trips/${route}`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: ticketDetails.jwtAccessToken,
                    },
                    body: JSON.stringify(requestObj),
                })
                    .then(resp => resp.json())
                    .then((data) => {
                        if (!data.success) alert(data.message);
                        dispatch(setTicketData(data));
                        dispatch(setSuccessAlertMsg({ msg: CAPTURE_TICKET_SUCCESS, global: true }));

                        dispatch({ type: END_GET_TICKET_DATA });
                    })
                    .catch((e) => {
                        alert(CAPTURE_TICKET_ERROR_MSG_SEND);
                    });
            }, error => alert(CAPTURE_TICKET_ERROR_MSG_BASE64));
        //}, reason => alert(CAPTURE_TICKET_ERROR_MSG_CROP));
    });
}

// used if we only have destAddress
export function ticketAsyncHelperIncomplete(ticketDetails, loc, getState, dispatch) {
    const requestObj = {
        driverId: getState.driver.user._id,
        riderId: getState.driver.user._id,
        srcLoc: loc.srcLoc,
        destLoc: loc.destLoc,
        pickUpAddress: loc.pickUpAddress,
        destAddress: loc.destAddress,
        tripAmt: '0',
        tripIssue: 'noIssue',
        tripStatus: 'onTrip',
        taxiType: getState.driver.user.carDetails.type,
        unit: getState.driver.user.carDetails._id,
        options: ['CapturaBoleto'],
        unitNumber: getState.driver.user.carDetails.name,
    };

    fetch(`${config.serverSideUrl}:${config.port}/api/trips/startTripTicket`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: ticketDetails.jwtAccessToken,
        },
        body: JSON.stringify(requestObj),
    })
        .then(resp => resp.json())
        .then((data) => {
            if (!data.success) alert(data.message);
            dispatch(setTicketData(data));
        })
        .catch((e) => {
            alert(JSON.stringify(e));
        });
}