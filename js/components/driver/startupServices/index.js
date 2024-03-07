import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DeviceEventEmitter, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';
import { connect } from 'react-redux';

import { logOutUserAsync } from '../../../actions/common/signin';
import { fetchUserCurrentLocationAsync, mapDeviceIdToUser } from '../../../actions/driver/home';
import { pushNewRoute } from '../../../actions/route';
import * as appStateSelector from '../../../reducers/driver/appState';
import { socketDriverInit, updateLocation } from '../../../services/driversocket';
import Spinner from '../../loaders/Spinner';
import DriverRootView from '../rootView';

const { width, height } = Dimensions.get('window');
const aspectRatio = width / height;

function mapStateToProps(state) {
  return {
    region: {
      latitude: state.driver.user.gpsLoc[0],
      longitude: state.driver.user.gpsLoc[1],
      latitudeDelta: state.driver.user.latitudeDelta,
      longitudeDelta: state.driver.user.latitudeDelta * aspectRatio,
    },
    user: state.driver.user,
    isInitialLocationFetched: appStateSelector.isInitialLocationFetched(state),
    jwtAccessToken: state.driver.appState.jwtAccessToken,
    carDetails: state.driver.user.carDetails,
  };
}

class DriverStartupServices extends Component {
  static propTypes = {
    fetchUserCurrentLocationAsync: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    isInitialLocationFetched: PropTypes.bool,
    region: PropTypes.object,
    logOutUserAsync: PropTypes.func,
    carDetails: PropTypes.object,
    pushNewRoute: PropTypes.func,
  };

  componentWillMount() {
    DeviceEventEmitter.addListener('appInvoked', (data) => {
      this.props.pushNewRoute(data);
    });
  }

  componentDidMount() {
    const { mapDeviceIdToUser, jwtAccessToken } = this.props;

    // setup user id and accesstoken for background use
    AsyncStorage.setItem('id', this.props.user._id);
    AsyncStorage.setItem('car', JSON.stringify(this.props.carDetails));
    AsyncStorage.setItem('token', jwtAccessToken);

    // setup push notifications
    OneSignal.addEventListener('ids', (device) => {
      const deviceId = device.userId;
      const pushToken = device.pushToken;
      mapDeviceIdToUser(jwtAccessToken, deviceId, pushToken);
    });

    OneSignal.addEventListener('received', (data) => {
      if (data.notification && data.notification.payload && data.payload.title === 'Logout') {
        this.props.logOutUserAsync(jwtAccessToken);
      }
    });

    OneSignal.addEventListener('opened', (data) => {
      if (data.notification && data.notification.payload && data.notification.payload.title === 'Tienes un nuevo mensaje!') {
        this.props.pushNewRoute('chat');
      }
    });

    OneSignal.inFocusDisplaying(0);

    OneSignal.configure(); // add this to trigger `ids` event

    // setup driver socket
    socketDriverInit();

    // get current location
    this.props.fetchUserCurrentLocationAsync();

    // update first location to server
    updateLocation(this.props.user);
  }
  render() {
    // eslint-disable-line class-methods-use-this
    if (this.props.isInitialLocationFetched) {
      return <DriverRootView initialRegion={this.props.region} />;
    }
    return <Spinner />;
  }
}

function bindActions(dispatch) {
  return {
    fetchUserCurrentLocationAsync: () => dispatch(fetchUserCurrentLocationAsync()),
    mapDeviceIdToUser: (jwtAccessToken, deviceId, pushToken) => dispatch(mapDeviceIdToUser(jwtAccessToken, deviceId, pushToken)),
    logOutUserAsync: (jwtAccessToken) => dispatch(logOutUserAsync(jwtAccessToken)),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
  };
}
export default connect(mapStateToProps, bindActions)(DriverStartupServices);
