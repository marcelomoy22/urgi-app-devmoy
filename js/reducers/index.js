
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import alert from './alerts';
import drawer from './drawer';
import route from './route';
import driver from './driver';
import rider from './rider';
import entrypage from './entrypage';
import autocomplete from './autoComplete';
import coupons from './coupons';
import chat from './chat';

export default combineReducers({
  alert,
  drawer,
  route,
  entrypage,
  autocomplete,
  coupons,
  chat,
  form,
  driver,
  rider,
});
