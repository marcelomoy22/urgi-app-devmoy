import { DELETE_CAM_DATA, SET_IMAGE_PATH, SET_BARCODE } from '../../actions/driver/camera';

const initialState = {
  path: undefined,
  code: undefined,
};

const getPhoto = (state = initialState, action) => {
  switch (action.type) {
      case SET_IMAGE_PATH:
      return { ...state, path: action.payload };

      case SET_BARCODE:
      return { ...state, code: action.payload };

      case DELETE_CAM_DATA:
      return {path: undefined, code: undefined};

    default:
      return state;
  }
};
export default getPhoto;
