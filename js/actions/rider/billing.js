import config from '../../../config';
import {Alert} from 'react-native';

export const SEARCH_BILLING = 'SEARCH_BILLING';
export const LOAD_SPINNER = 'LOAD_SPINNER';
export const VALIDATION_DATA = 'VALIDATION_DATA';
export const CLEAN_DATA = 'CLEAN_DATA';
export const MY_HISTORY = 'MY_HISTORY';
export const DATA_SEARCH = 'DATA_SEARCH';
export const CODE_BASE = 'CODE_BASE';

export function searchBilling(RFC) {
  return {
    type: SEARCH_BILLING,
    payload: RFC,
  };
}

export function spinner(loading) {
  return {
    type: LOAD_SPINNER,
    payload: loading,
  };
}

export function validationData(dataFolio) {
  return {
    type: VALIDATION_DATA,
    payload: dataFolio,
  };
}

export function cleanData(cleanData) {
  return {
    type: CLEAN_DATA,
    payload: cleanData,
  };
}

export function historyBilling(historyBilling) {
  return {
    type: MY_HISTORY,
    payload: historyBilling,
  };
}

export function dataSearch(dataSearch) {
  return {
    type: DATA_SEARCH,
    payload: dataSearch,
  };
}

export function codeBase64(codeBase64) {
  return {
    type: CODE_BASE,
    payload: codeBase64,
  };
}

export function searchData(data) {
  if(!data.RFC){
    alert("Ups! Ingresar el RFC para buscar datos")
  } else {
    return (dispatch, getState) => {
    return fetch(`${config.serverSideUrl}:${config.port}/api/billing/filterByRFC`,{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
      })
      .then( (res) => res.json() )
      .then((RFC)=>{
        if(RFC.length>0){
          dispatch(searchBilling(RFC[RFC.length-1]))
        }else{
          dispatch(searchBilling(undefined))
          alert("Ups! RFC no encontrado, crear nueva informacion")
        }
      })
      .catch((e) => {
          console.log(e);
      })
    }
  }
}
  
export function validationFolio(data){ // validation billing
  return (dispatch, getState) => {
    if(!data.razonSocial || !data.RFC || !data.street || !data.numberExt || !data.suburb || !data.city || !data.state || !data.postalCode || !data.email || !data.CFDI || !data.folio || !data.monto){
      dispatch(spinner(undefined))
      alert('Ups!, Favor de completar los campos')
    }else{
      const accessToken = getState().rider.user._id;
      data.createdby = accessToken

      return fetch(`${config.serverSideUrl}:${config.port}/api/billing/validation`,{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then( (res) => res.json() )
      .then((res)=>{
        if(res){
          res.usoCFDI = 'G03'
          res.createdby = data.createdby
          res.RFC = data.RFC.trim().toUpperCase()
          res.address = {
            street : data.street.trim(),
            numberExt : data.numberExt.trim(),
            numberInt : data.numberInt,
            suburb : data.suburb.trim(),
            city : data.city.trim(),
            state : data.state.trim(),
            postalCode : data.postalCode.trim()
          }
          res.email = data.email.trim()
          res.folio = data.folio.trim()
          res.monto = data.monto.trim()
          res.razonSocial = data.razonSocial.trim()
          res.tripsId = res._id

          if (res.billing) {
            dispatch(spinner(undefined))
            alert('El servicio ya fue Facturado');
          } else {

            Alert.alert(
              'Aviso',
              'Desea facturar el servicio: '+ data.folio + ' , con RFC: ' + data.RFC + ' y Razon Social: ' + data.razonSocial + ' ?',
              [
                {
                  text: 'Cancelar',
                  style: 'cancel',
                  onPress: () => dispatch(spinner(undefined))
                },
                {text: 'OK', onPress: () => dispatch(validationData(res)) && dispatch(spinner(undefined)) },
              ],
              {cancelable: false},
            );
          }
        }else{
          dispatch(spinner(undefined))
          alert('Ups! Folio no existe. Espere 24 hrs apartir de que solicito el servicio.')
        }
      })
      .catch((e) => {
        console.log(e);
      })
    }
  }
}

export function question(data) {  // pregunta antes de facturar
  return (dispatch, getState) => {

  Alert.alert(
    'Aviso',
    'Facturar ?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: () => dispatch(spinner(undefined))
      },
      {text: 'OK', onPress: () => dispatch(addBill(data)) },
    ],
    {cancelable: false},
  );

  }
}

export function addBill(data) {  // create billing
  return (dispatch, getState) => {

    return fetch(`${config.serverSideUrl}:${config.port}/api/billing/mergeData`,{
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
    })
    .then( (res) => res.json() )
    .then((res)=>{
      dispatch(cleanData(true))
      dispatch(searchBilling(undefined))
      dispatch(spinner(undefined))
      if(res.ModelState){ //esto es error
        alert ("Error RFC no valido, no se pudo facturar.")
      }else{
        alert('Facturada, Se envió un PDF y XML a su Email  ' + res.email)
      }
    })
  }
}

export function searchHistory() {  // Buscar Historial Facturas
return (dispatch, getState) => {
  const data ={data: getState().rider.user._id}

  return fetch(`${config.serverSideUrl}:${config.port}/api/billing/myHistory`,{
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
    })
    .then( (res) => res.json() )
    .then((res)=>{
    dispatch(historyBilling(res))
    })
  }
}

export function filterBilling(data) {  // Me filtra el folio a buscar
  return (dispatch, getState) => {
    if(!data || !data.folio || !data.RFC || !data.monto){
      alert("Ups, Completa todos los datos")
    } else{

    return fetch(`${config.serverSideUrl}:${config.port}/api/billing/filterBilling`,{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
      })
      .then( (res) => res.json() )
      .then((res)=>{
        if(res[0]){
        dispatch(dataSearch(res))
        } else{
          alert("Ups, No se encotraron datos")
        }
      })
    }
  }  
}

export function sendBilling(data, billing) {  // mandar email con el pdf de factura
  return (dispatch, getState) => {
    dispatch(spinner(true))
  if(!data){
    dispatch(spinner(undefined))
    alert('Ups, Ingrese el Email para enviar.')
  } else{
    alert('Enviando...')
    const send ={data:data.trim(),
      billing: billing
    } 
    return fetch(`${config.serverSideUrl}:${config.port}/api/billing/sendBilling`,{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(send)
      })
      .then( (res) => res.json() )
      .then((res)=>{
        dispatch(spinner(undefined))
        alert("PDF y XML Enviado a: " + data)
      })
    }
  }
}

export function downloadBilling(data) {  // descargar pdf con factura
return (dispatch, getState) => {
  alert('Ups, No esta disponible por el momento')
  const send ={ data:data } 
  return fetch(`${config.serverSideUrl}:${config.port}/api/billing/downloadBilling`,{
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(send)
    })
    .then( (res) => res.json() )
    .then((res)=>{
      dispatch(codeBase64(res))
    })
  }
}