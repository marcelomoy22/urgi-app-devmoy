import config from '../../../config';
import {Alert} from 'react-native';

export const MY_HISTORYTICKETPROCESS = 'MY_HISTORYTICKETPROCESS';
export const CONFIRM_SEND_INFO = 'CONFIRM_SEND_INFO';




export function historyTicketProcess(historyTicketProcess) {
  return {
    type: MY_HISTORYTICKETPROCESS,
    payload: historyTicketProcess,
  };
}

export function searchHistory() {  // Buscar Historial Facturas
  return (dispatch, getState) => {
    const data ={data: getState().driver.user._id}
    return fetch(`${config.serverSideUrl}:${config.port}/api/ticketProcess/myHistoryTicketProcess`,{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
      })
      .then( (res) => res.json() )
      .then((res)=>{
      dispatch(historyTicketProcess(res))
      })
    }
  }

  export function sendInfo(data) {  // pregunta antes de facturar
    return (dispatch, getState) => {  
      Alert.alert(
        'Aviso',
        'Seguro que desea hacer el cobro de ' + data.processMonto + ' a el folio ' + data.folio + ' ? . Porque se mandara un correo al cliente con su ticket',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {text: 'OK', onPress: () => dispatch(confirmSendInfo(data)) },
        ],
        {cancelable: false},
      );
    }
  }

  export function confirmSendInfo(dataFolio) {
    return (dispatch, getState) => {
      return fetch(`${config.serverSideUrl}:${config.port}/api/ticketProcess/processToPay`,{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataFolio)
        })
        .then( (res) => res.json() )
        .then((res)=>{
        dispatch(searchHistory())
        })
      }
  }