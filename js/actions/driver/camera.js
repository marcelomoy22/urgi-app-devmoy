export const SET_IMAGE_PATH = 'SET_IMAGE_PATH';
export const SET_BARCODE = 'SET_BARCODE';
export const DELETE_CAM_DATA = 'DELETE_CAM_DATA';

export function setImagePath(pic) {
  return {
    type: SET_IMAGE_PATH,
    payload: pic,
  };
}

export function setBarcode(code) {
  return {
    type: SET_BARCODE,
    payload: code,
  };
}

export function deleteCamData() {
  return { type: DELETE_CAM_DATA };
}
