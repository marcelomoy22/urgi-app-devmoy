import moment from 'moment-timezone';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Dimensions, Image, Platform, StatusBar, Text, TouchableHighlight, View } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import MapView, { AnimatedRegion, Circle } from 'react-native-maps';
import { connect } from 'react-redux';

import { clearAlertMsg } from '../../../actions/alerts';
import { openDrawer } from '../../../actions/drawer';
import { fetchUserCurrentLocationAsync, syncDataAsync } from '../../../actions/driver/home';
import { clearReducerState } from '../../../actions/driver/rateRider';
import { requestTripUpdated } from '../../../actions/driver/rideRequest';
import { popRoute, resetRoute } from '../../../actions/route';
import DropOff from '../dropOff';
import DriverHome from '../home';
import PickRider from '../pickRider';
import RateRider from '../rateRider';
import RideRequest from '../rideRequest';
import ScheduledTrips from '../scheduledTrips';
import StartRide from '../startRide';
import styles from './styles';

const { width, height } = Dimensions.get('window');
const aspectRatio = width / height;
const carImg1 = require('../../../../images/carIcon1.png');
const carImg2 = require('../../../../images/carIcon2.png');
const carColor1 = require('../../../../images/stripe1.png');
const carColor2 = require('../../../../images/stripe2.png');

function mapStateToProps(state) {
  return {
    tripRequest: state.driver.tripRequest,
    user: state.driver.user,
    pageStatus: state.driver.appState.pageStatus,
    futureTrips: state.driver.scheduledTrips.data,
    jwtAccessToken: state.driver.appState.jwtAccessToken,
    taxiType: state.driver.user.carDetails ? state.driver.user.carDetails.type : null,
    region: {
      latitude: state.driver.user.gpsLoc[0],
      longitude: state.driver.user.gpsLoc[1],
      latitudeDelta: state.driver.user.latitudeDelta,
      longitudeDelta: state.driver.user.longitudeDelta,
    },
    riderPickupLocLat: !state.driver.tripRequest.srcLoc[0] ? undefined : state.driver.tripRequest.srcLoc[0],
    riderPickupLocLong: !state.driver.tripRequest.srcLoc[1] ? undefined : state.driver.tripRequest.srcLoc[1],
    destLocation: state.driver.trip.destLoc,
    successMsg: state.alert.successMsg,
    errorMsg: state.alert.errorMsg,
    globalAlert: state.alert.global,
  };
}

class DriverRootView extends Component {
  static propTypes = {
    user: PropTypes.object,
    pageStatus: PropTypes.string,
    destLocation: PropTypes.array,
    jwtAccessToken: PropTypes.string,
    region: PropTypes.object,
    riderPickupLocLat: PropTypes.number,
    riderPickupLocLong: PropTypes.number,
    fetchUserCurrentLocationAsync: PropTypes.func,
    resetRoute: PropTypes.func,
    initialRegion: PropTypes.object,
    futureTrips: PropTypes.array,
    tripRequest: PropTypes.object,
    successMsg: PropTypes.string,
    errorMsg: PropTypes.string,
    clearAlertMsg: PropTypes.func,
    globalAlert: PropTypes.bool,
    taxiType: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      region: new AnimatedRegion({
        latitude: this.props.region.latitude,
        longitude: this.props.region.longitude,
        latitudeDelta: this.props.region.latitudeDelta,
        longitudeDelta: this.props.region.longitudeDelta * aspectRatio,
      }),
      scheduledTrip: undefined,
      ignoreLocation: false,
      carAngle: '0 deg',
    };

    this.getMarkerDetails = this.getMarkerDetails.bind(this);
  }

  componentWillMount() {
    this.props.syncDataAsync(this.props.jwtAccessToken);
  }

  componentWillReceiveProps(props) {
    if (props.globalAlert === true) {
      if (props.successMsg) {
        Alert.alert('Exito!', props.successMsg, [{ text: 'OK', onPress: () => {} }]);
      } else if (props.errorMsg) {
        Alert.alert('Error!', props.errorMsg, [{ text: 'Cerrar', onPress: () => {} }]);
      }

      props.clearAlertMsg();
    }

    this.angleAnimation(props.region);
    this.movementAnimation();
  }

  scheduledTripsCallback = () => {
    this.setState({ scheduledTrip: undefined, ignoreLocation: false });
  };

  onMapPress = () => {
    this.setState({ scheduledTrip: undefined });
  };

  resetRoute(route) {
    this.props.resetRoute(route);
  }

  getMarkerDetails(info) {
    this.setState({
      scheduledTrip: info,
      ignoreLocation: true,
    });
  }

  _renderRiderMarker() {
    if ((this.props.riderPickupLocLat !== undefined && this.props.pageStatus === 'pickRider') || this.props.pageStatus === 'startRide') {
      return (
        <View>
          <MapView.Marker
            identifier='RiderMarker'
            coordinate={{
              latitude: this.props.riderPickupLocLat,
              longitude: this.props.riderPickupLocLong,
            }}
          >
            <View>
              <Icon name='ios-pin' style={{ color: '#222', fontSize: 24 }} />
            </View>
          </MapView.Marker>

          <Circle
            strokeWidth={0}
            fillColor={'rgba(0,0,0,0.2)'}
            radius={150}
            center={{
              latitude: this.props.riderPickupLocLat,
              longitude: this.props.riderPickupLocLong,
            }}
          />
        </View>
      );
    }
    return <View />;
  }

  _renderDriverMarker() {
    if (Platform.OS === 'ios') {
      return (
        <MapView.Marker.Animated identifier='DriverMarker' coordinate={this.state.region} flat>
          <View style={{ transform: [{ rotate: this.state.carAngle }] }}>
            <Image source={this.props && this.props.taxiType && this.props.taxiType.name === 'SUV' ? carImg2 : carImg1} style={styles.carIcon} />
            <Image
              source={this.props && this.props.taxiType && this.props.taxiType.name === 'SUV' ? carColor2 : carColor1}
              style={{
                tintColor: this.props.user.carDetails.group.color,
                alignSelf: 'center',
                flex: 1,
                width: 50,
                height: 50,
              }}
            />
          </View>
        </MapView.Marker.Animated>
      );
    } else {
      return (
        <MapView.Marker.Animated
          identifier='DriverMarker'
          coordinate={this.state.region}
          flat
          image={Platform.Version >= 26 ? (this.props && this.props.taxiType && this.props.taxiType.name === 'SUV' ? carImg2 : carImg1) : null}
          style={Platform.Version >= 26 ? { transform: [{ rotate: this.state.carAngle }] } : null}
        >
          {Platform.Version < 26 ? (
            <View style={{ transform: [{ rotate: this.state.carAngle }] }}>
              <Image source={this.props && this.props.taxiType && this.props.taxiType.name === 'SUV' ? carImg2 : carImg1} style={styles.carIcon} />
              <Image
                source={this.props && this.props.taxiType && this.props.taxiType.name === 'SUV' ? carColor2 : carColor1}
                style={{
                  tintColor: this.props.user.carDetails.group.color,
                  alignSelf: 'center',
                  flex: 1,
                  width: 50,
                  height: 50,
                }}
              />
            </View>
          ) : null}
        </MapView.Marker.Animated>
      );
    }
  }

  _renderScheduledTripsMarkers() {
    if (this.props.pageStatus === 'scheduledTrips') {
      if (this.props.futureTrips.length > 0) {
        return this.props.futureTrips.map((marker) =>
          marker.taxiType._id === this.props.user.carDetails.type._id ? (
            <MapView.Marker
              coordinate={{ latitude: marker.srcLoc[0], longitude: marker.srcLoc[1] }}
              // title={`$ ${marker.tripAmt}`}
              title={'$ XXX.XX'}
              description={moment(marker.requestTime).tz('America/Mexico_City').format('[pickup at] h:mm a')}
              onPress={() => this.getMarkerDetails(marker)}
            >
              <View>
                <Icon name='ios-pin' style={{ color: '#222', fontSize: 24 }} />
              </View>
            </MapView.Marker>
          ) : null
        );
      }
    }
    return <View />;
  }

  _renderDestinationZoneMarker() {
    if (this.props.pageStatus === 'dropOff') {
      return (
        <View>
          <MapView.Marker
            identifier='DestinationMarker'
            coordinate={{
              latitude: this.props.destLocation[0],
              longitude: this.props.destLocation[1],
            }}
          >
            <View>
              <Icon name='ios-pin' style={{ color: '#222', fontSize: 24 }} />
            </View>
          </MapView.Marker>

          <Circle
            strokeWidth={0}
            fillColor={'rgba(0,0,0,0.2)'}
            radius={150}
            center={{
              latitude: this.props.destLocation[0],
              longitude: this.props.destLocation[1],
            }}
          />
        </View>
      );
    }
    return <View />;
  }

  goToMyLoc() {
    //alert(`pageStatus: ${this.props.pageStatus} \nLatLong: ${this.props.user.gpsLoc[0]} , ${this.props.user.gpsLoc[1]}`);
    this.map.animateToCoordinate({ latitude: this.props.initialRegion.latitude, longitude: this.props.initialRegion.longitude }, 1);
  }

  render() {
    if (this.props.user.fname === undefined) {
      return <View />;
    }

    let component = null;
    switch (this.props.pageStatus) {
      case 'home':
        component = <DriverHome />;
        break;
      case 'rideRequest':
        component = <RideRequest />;
        break;
      case 'pickRider':
        component = <PickRider />;
        break;
      case 'startRide':
        component = <StartRide />;
        break;
      case 'dropOff':
        component = <DropOff />;
        break;
      case 'scheduledTrips':
        component = <ScheduledTrips tripRequest={this.state.scheduledTrip} callback={this.scheduledTripsCallback} />;
        break;
      case 'rateRider':
        if (this.props.tripRequest.rider && !this.props.tripRequest.rider.anonymous) {
          component = <RateRider />;
        } else {
          component = <DriverHome />;
        }
        break;
      default:
        component = <DriverHome />;
    }
    return (
      <View style={{ flex: 1 }}>
        {Platform.OS === 'android' ? <KeepAwake /> : null}
        <StatusBar barStyle='light-content' />
        <MapView
          ref={(ref) => {
            this.map = ref;
          }}
          style={styles.map}
          initialRegion={this.props.region}
          onPress={this.onMapPress}
        >
          {this._renderRiderMarker()}
          {this._renderDestinationZoneMarker()}
          {this._renderDriverMarker()}
          {this._renderScheduledTripsMarkers()}
        </MapView>
        {
          // <Button onPress={this.goToMyLoc.bind(this)} style={{}} title="GOTOLOC"/>
        }
        {component}
        <TouchableHighlight
          style={{ backgroundColor: 'white', width: 31, position: 'absolute', alignSelf: 'flex-end', paddingLeft: 2, zIndex: 0, top: 500 }}
          onPress={this.goToMyLoc.bind(this)}
        >
          <Text>
            <Icon name='ios-locate-outline' style={{ alignSelf: 'center', flex: 1, color: '#222' }} />
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  /* -----------------------------

  CAR MOVEMENT ANIMATION METHODS

  ----------------------------- */

  _toRad(deg) {
    return deg * (Math.PI / 180);
  }

  _toDeg(rad) {
    return rad * (180 / Math.PI);
  }

  angleAnimation(region) {
    const lng1 = this.props.region.longitude;
    const lng2 = region.longitude;
    const lat1 = this.props.region.latitude;
    const lat2 = region.latitude;
    const dLon = lng2 - lng1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const brng = this._toDeg(Math.atan2(y, x));
    const deg = 360 + ((brng + 360) % 360);

    if (lng1 !== lng2) {
      this.setState({ carAngle: `${deg}deg` });
    }
  }

  movementAnimation() {
    if (!this.state.ignoreLocation && this.props.pageStatus !== 'scheduledTrips') {
      setTimeout(() => {
        const { region } = this.state;

        region
          .timing({
            latitude: this.props.region.latitude,
            longitude: this.props.region.longitude,
            latitudeDelta: this.props.region.latitudeDelta,
            longitudeDelta: this.props.region.longitudeDelta,
          })
          .start(() => {
            if (this.map) {
              this.map.animateToCoordinate(this.props.region);
            }
          });
      }, 1000);
    }
  }
}

function bindActions(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: () => dispatch(popRoute()),
    clearReducerState: () => dispatch(clearReducerState()),
    requestTripUpdated: (status) => dispatch(requestTripUpdated(status)),
    resetRoute: (route) => dispatch(resetRoute(route)),
    fetchUserCurrentLocationAsync: () => dispatch(fetchUserCurrentLocationAsync()),
    syncDataAsync: (jwtAccessToken) => dispatch(syncDataAsync(jwtAccessToken)),
    clearAlertMsg: () => dispatch(clearAlertMsg()),
  };
}

export default connect(mapStateToProps, bindActions)(DriverRootView);
