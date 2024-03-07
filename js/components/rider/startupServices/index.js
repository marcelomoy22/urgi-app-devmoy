/* eslint-disable react/prop-types,no-shadow */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import OneSignal from 'react-native-onesignal';
import { connect } from 'react-redux';

import { fetchTaxiType, fetchUserCurrentLocationAsync, mapDeviceIdToUser } from '../../../actions/rider/home';
import { createOpenPayCustomer, getCardList, setCustomerId, updateCardList } from '../../../actions/rider/payment';
import { pushNewRoute } from '../../../actions/route';
import * as appStateSelector from '../../../reducers/rider/appState';
import { socketRiderInit, updateLocation } from '../../../services/ridersocket';
import Spinner from '../../loaders/Spinner';
import RootView from '../rootView';

const { width, height } = Dimensions.get('window');
const aspectRatio = width / height;
let deviceId;
let pushToken;

function mapStateToProps(state) {
  return {
    customerIdDb: state.rider.user.customerId, // saved on database
    customerIdRe: state.rider.payment.customerId, // saved on reducers
    cardList: state.rider.payment.cards, // saved on reducers
    region: {
      latitude: state.rider.user.gpsLoc[0],
      longitude: state.rider.user.gpsLoc[1],
      latitudeDelta: state.rider.user.latitudeDelta,
      longitudeDelta: state.rider.user.latitudeDelta * aspectRatio,
    },
    user: state.rider.user,
    isInitialLocationFetched: appStateSelector.isInitialLocationFetched(state),
    jwtAccessToken: state.rider.appState.jwtAccessToken,
  };
}

class RiderStartupServices extends Component {
  static propTypes = {
    fetchUserCurrentLocationAsync: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    isInitialLocationFetched: PropTypes.bool,
    region: PropTypes.object,
    customerIdDb: PropTypes.string,
    customerIdRe: PropTypes.string,
    cardList: PropTypes.array,
    createOpenPayCustomer: PropTypes.func,
    setCustomerId: PropTypes.func,
    updateCardList: PropTypes.func,
    getCardList: PropTypes.func,
    fetchTaxiType: PropTypes.func,
    pushNewRoute: PropTypes.func,
  };

  componentWillMount() {
    const { mapDeviceIdToUser, jwtAccessToken } = this.props;

    OneSignal.init("60e5c348-0cdb-4444-bf43-b6f60beb6fa9");

    OneSignal.addEventListener('ids', (device) => {
      deviceId = device.userId;
      pushToken = device.pushToken;
      mapDeviceIdToUser(jwtAccessToken, deviceId, pushToken);
    });
  }

  componentDidMount() {

    OneSignal.addEventListener('opened', (data) => {
      if (data.notification.payload.title === 'Tienes un nuevo mensaje!') {
        this.props.pushNewRoute('chat');
      }
    });

    OneSignal.inFocusDisplaying(0);
    OneSignal.configure(); // add this to trigger `ids` event

    // sockets
    socketRiderInit();

    // load taxi types
    this.props.fetchTaxiType(this.props.jwtAccessToken);

    // current location
    this.props.fetchUserCurrentLocationAsync();

    // update location
    updateLocation(this.props.user);

    // get openpay info
    setTimeout(() => {
      this.startupOpenpay();
    }, 1000);
  }

  startupOpenpay() {
    // check if user is not anonymouse
    if (!this.props.user.anonymous) {
      // check if account has openpay
      if (!this.props.customerIdDb && !this.props.customerIdRe) {
        this.props.createOpenPayCustomer(this.props.user);
      } else {
        // set customer id from database if loaded
        if (this.props.customerIdDb) this.props.setCustomerId(this.props.customerIdDb);

        // set card list from reducers
        if (this.props.cardList && this.props.cardList.length !== 0) {
          this.props.updateCardList(this.props.cardList);

          // set card list from database if loaded
        } else {
          this.props.getCardList();
        }
      }
    }
  }

  render() {
    // eslint-disable-line class-methods-use-this
    if (this.props.isInitialLocationFetched) {
      return <RootView initialRegion={this.props.region} />;
    }
    return <Spinner />;
  }
}

function bindActions(dispatch) {
  return {
    fetchUserCurrentLocationAsync: () => dispatch(fetchUserCurrentLocationAsync()),
    fetchTaxiType: (jwtAccessToken) => dispatch(fetchTaxiType(jwtAccessToken)),
    mapDeviceIdToUser: (jwtAccessToken, deviceId, pushToken) => dispatch(mapDeviceIdToUser(jwtAccessToken, deviceId, pushToken)),
    createOpenPayCustomer: (data) => dispatch(createOpenPayCustomer(data)),
    setCustomerId: (id) => dispatch(setCustomerId(id)),
    updateCardList: (list) => dispatch(updateCardList(list)),
    getCardList: () => dispatch(getCardList()),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
  };
}
export default connect(mapStateToProps, bindActions)(RiderStartupServices);
