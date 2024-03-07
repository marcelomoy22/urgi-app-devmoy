import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Dimensions, Image, Platform, TouchableHighlight, View } from 'react-native';
import MapView, { AnimatedRegion } from 'react-native-maps';
import { connect } from 'react-redux';

import { clearAlertMsg } from '../../../actions/alerts';
import { openDrawer } from '../../../actions/drawer';
import { changePageStatus, changeRegion, clearTripAndTripRequest, fetchUserCurrentLocationAsync, syncDataAsync } from '../../../actions/rider/home';
import { clearReducerState } from '../../../actions/rider/receipt';
import * as appStateSelector from '../../../reducers/rider/appState';
import { updatePickupRegion } from '../../../services/ridersocket';
import ConfirmRide from '../confirmRide';
import Home from '../home';
import Receipt from '../receipt';
import RideBooked from '../rideBooked';
import styles from './styles';

const { width, height } = Dimensions.get('window');
const aspectRatio = width / height;
const carImg1 = require('../../../../images/carIcon1.png');
const carImg2 = require('../../../../images/carIcon2.png');
const carColor1 = require('../../../../images/stripe1.png');
const carColor2 = require('../../../../images/stripe2.png');

function mapStateToProps(state) {
  return {
    region: {
      latitude: state.rider.tripRequest.srcLoc[0],
      longitude: state.rider.tripRequest.srcLoc[1],
      latitudeDelta: state.rider.tripRequest.latitudeDelta,
      longitudeDelta: state.rider.tripRequest.longitudeDelta * aspectRatio,
    },
    pickupLatitude: state.rider.tripRequest.srcLoc[0],
    pickupLongitude: state.rider.tripRequest.srcLoc[1],
    carColor: state.rider.tripRequest.driver ? state.rider.tripRequest.driver.carDetails.color : null,
    pageStatus: state.rider.appState.pageStatus,
    jwtAccessToken: state.rider.appState.jwtAccessToken,
    tripRequestStatus: state.rider.tripRequest.tripRequestStatus,
    tripStatus: state.rider.trip.tripStatus,
    user: state.rider.user,
    taxiType: state.rider.taxi.selected || 'Sedan',
    markers: appStateSelector.getMarkers(state),
    // driversList: userSelector.getNearbyDriversLocation(state),
    driversList: state.rider.user.driversList,
    driverCurrentGpsLocLat: state.rider.tripRequest.driver ? state.rider.tripRequest.driver.gpsLoc[1] : undefined,
    driverCurrentGpsLocLong: state.rider.tripRequest.driver ? state.rider.tripRequest.driver.gpsLoc[0] : undefined,
    successMsg: state.alert.successMsg,
    errorMsg: state.alert.errorMsg,
    globalAlert: state.alert.global,
  };
}

class RootView extends Component {
  static propTypes = {
    pickupLatitude: PropTypes.number,
    pickupLongitude: PropTypes.number,
    driverCurrentGpsLocLat: PropTypes.number,
    driverCurrentGpsLocLong: PropTypes.number,
    jwtAccessToken: PropTypes.string,
    syncDataAsync: PropTypes.func,
    pageStatus: PropTypes.string,
    changeRegion: PropTypes.func,
    changePageStatus: PropTypes.func,
    tripRequestStatus: PropTypes.string,
    tripStatus: PropTypes.string,
    user: PropTypes.object,
    taxiType: PropTypes.object,
    driversList: PropTypes.array,
    initialRegion: PropTypes.object,
    region: PropTypes.object,
    successMsg: PropTypes.string,
    errorMsg: PropTypes.string,
    clearAlertMsg: PropTypes.func,
    globalAlert: PropTypes.bool,
    carColor: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      driverRegion: new AnimatedRegion({
        latitude: this.props.driverCurrentGpsLocLat ? this.props.driverCurrentGpsLocLat : 0,
        longitude: this.props.driverCurrentGpsLocLong ? this.props.driverCurrentGpsLocLong : 0,
        latitudeDelta: this.props.region.latitudeDelta ? this.props.region.latitudeDelta : 0,
        longitudeDelta: this.props.region.longitudeDelta ? this.props.region.longitudeDelta : 0,
      }),
      carAngle: '0 deg',
    };
  }

  componentWillMount() {
    console.log('Root', this.props);
    if (this.props.tripRequestStatus === 'request') {
      this.props.changePageStatus('confirmRide');
    } else {
      this.props.syncDataAsync(this.props.jwtAccessToken);
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.pageStatus === 'confirmRide') {
      this.gotoCurrentLocation(this.props.region);
    }

    if (props.globalAlert === true) {
      if (props.successMsg) {
        Alert.alert('Exito!', props.successMsg, [{ text: 'OK', onPress: () => {} }]);
      } else if (props.errorMsg) {
        Alert.alert('Error!', props.errorMsg, [{ text: 'Cerrar', onPress: () => {} }]);
      }

      props.clearAlertMsg();
    }

    // nearByCarAnimation
    // if (this.props.pageStatus === 'home' || this.props.pageStatus === 'confirmRide') { this.setNearByCarAngle(props); }

    // car animation on ride
    if (
      this.props.pageStatus !== 'home' &&
      this.props.pageStatus !== 'confirmRide' &&
      this.props.driverCurrentGpsLocLat !== undefined &&
      this.props.driverCurrentGpsLocLong !== undefined
    ) {
      const regionStart = {
        latitude: this.props.driverCurrentGpsLocLat,
        longitude: this.props.driverCurrentGpsLocLong,
        latitudeDelta: props.region.latitudeDelta,
        longitudeDelta: props.region.longitudeDelta,
      };

      const regionEnd = {
        latitude: props.driverCurrentGpsLocLat,
        longitude: props.driverCurrentGpsLocLong,
        latitudeDelta: props.region.latitudeDelta,
        longitudeDelta: props.region.longitudeDelta,
      };

      if (regionEnd.latitude) {
        this.angleAnimation(regionStart, regionEnd);
        this.movementAnimation(regionEnd);
      }
    }
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  gotoCurrentLocation(region) {
    this.map.animateToRegion(region);
  }

  // setNearByCarAngle(props) {
  //
  //   if (this.props.driversList && props.driversList)
  //     for (let i = 0; i < this.props.driversList.length; i++)
  //       this.angleAnimation(this.props.driversList[i].coordinate, props.driversList[i].coordinate);
  //
  // }

  _renderNearByDrivers(driversList) {
    if ((this.props.pageStatus === 'home' || this.props.pageStatus === 'confirmRide') && driversList) {
      if (Platform.OS === 'ios') {
        return driversList.map((data, index) => (
          <MapView.Marker key={index} coordinate={{ latitude: data.gpsLoc[1], longitude: data.gpsLoc[0] }} flat>
            <View style={{ transform: [{ rotate: `${Math.floor(Math.random() * 360 + 1)} deg` }] }}>
              <Image source={this.props && this.props.taxiType && this.props.taxiType.name === 'SUV' ? carImg2 : carImg1} style={styles.carIcon} />
              <Image source={this.props && this.props.taxiType && this.props.taxiType.name === 'SUV' ? carColor2 : carColor1} style={[styles.stripe, { tintColor: data.groups_docs.color }]} />
            </View>
          </MapView.Marker>
        ));
      } else {
        return driversList.map((data, index) => (
          <MapView.Marker
            key={index}
            coordinate={{ latitude: data.gpsLoc[1], longitude: data.gpsLoc[0] }}
            flat
            image={Platform.Version >= 26 ? (this.props && this.props.taxiType && this.props.taxiType.name === 'SUV' ? carImg2 : carImg1) : null}
            style={Platform.Version >= 26 ? { transform: [{ rotate: `${Math.floor(Math.random() * 360 + 1)} deg` }] } : null}
          >
            {Platform.Version < 26 ? (
              <View style={{ transform: [{ rotate: `${Math.floor(Math.random() * 360 + 1)} deg` }] }}>
                <Image source={this.props && this.props.taxiType && this.props.taxiType.name === 'SUV' ? carImg2 : carImg1} style={styles.carIcon} />
                <Image source={this.props && this.props.taxiType && this.props.taxiType.name === 'SUV' ? carColor2 : carColor1} style={[styles.stripe, { tintColor: data.groups_docs.color }]} />
              </View>
            ) : null}
          </MapView.Marker>
        ));
      }
    }
    return <View />;
  }
  _renderRiderMarker() {
    if (this.props.tripStatus !== 'onTrip' && this.props.tripStatus !== 'endTrip' && this.props.pickupLatitude !== undefined) {
      return (
        <MapView.Marker
          identifier='RiderMarker'
          coordinate={{
            latitude: this.props.pickupLatitude,
            longitude: this.props.pickupLongitude,
            // latitudeDelta: this.props.region.latitudeDelta,
            // longitudeDelta: this.props.region.longitudeDelta,
          }}
        >
          <View>
            <Icon name='ios-pin' style={styles.pinIcon} />
          </View>
        </MapView.Marker>
      );
    }
    return <View />;
  }

  // TODO: test with multiple cars
  _renderDriverMarker() {
    if (
      this.props.pageStatus !== 'home' &&
      this.props.pageStatus !== 'confirmRide' &&
      this.props.driverCurrentGpsLocLat !== undefined &&
      this.props.driverCurrentGpsLocLong !== undefined
    ) {
      if (Platform.OS === 'ios') {
        return (
          <MapView.Marker.Animated identifier='DriverMarker' coordinate={this.state.driverRegion} flat>
            <View style={{ transform: [{ rotate: this.state.carAngle }] }}>
              <Image source={this.props && this.props.taxiType && this.props.taxiType.name === 'SUV' ? carImg2 : carImg1} style={styles.carIcon} />
              <Image
                source={this.props && this.props.taxiType && this.props.taxiType.name === 'SUV' ? carColor2 : carColor1}
                style={{
                  tintColor: this.props.carColor,
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
            coordinate={this.state.driverRegion}
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
                    tintColor: this.props.carColor,
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
    return <View />;
  }

  goToMyLoc() {
    this.map.animateToCoordinate({ latitude: this.props.initialRegion.latitude, longitude: this.props.initialRegion.longitude }, 1);
  }

  render() {
    let component = null;
    console.log(this.props.pageStatus);
    switch (this.props.pageStatus) {
      case 'home':
        component = <Home />;
        break;
      case 'confirmRide':
        component = <ConfirmRide />;
        break;
      case 'rideBooked':
        component = <RideBooked />;
        break;
      case 'receipt':
        if (this.props.user.anonymous) {
          component = <Home />;
        } else {
          component = <Receipt />;
        }
        break;
      default:
        component = <Home />;
    }
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => {
            this.map = ref;
          }}
          style={styles.map}
          initialRegion={this.props.initialRegion}
          loadingEnabled
          onRegionChangeComplete={(region) => {
            if (this.props.pageStatus === 'home' && this.props.taxiType /* || this.props.pageStatus === 'confirmRide'*/) {
              updatePickupRegion(this.props.taxiType._id, this.props.user, region); // socket call

              this.props.changeRegion(region);
            }
          }}
        >
          {this._renderDriverMarker()}
          {this._renderRiderMarker()}
          {this._renderNearByDrivers(this.props.driversList)}
        </MapView>
        {component}
        {this.props.pageStatus === 'home' ? (
          <TouchableHighlight
            style={{ backgroundColor: 'white', width: 31, position: 'absolute', alignSelf: 'flex-end', paddingLeft: 2, zIndex: 0, top: 500 }}
            onPress={this.goToMyLoc.bind(this)}
          >
            <View>
              <Icon name='navigate' style={{ alignSelf: 'center', flex: 1, color: '#222' }} />
            </View>
          </TouchableHighlight>
        ) : null}
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

  angleAnimation(regionStart, regionEnd) {
    if (regionStart && regionEnd) {
      const lng1 = regionStart.longitude;
      const lng2 = regionEnd.longitude;
      const lat1 = regionStart.latitude;
      const lat2 = regionEnd.latitude;
      const dLon = lng2 - lng1;
      const y = Math.sin(dLon) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
      const brng = this._toDeg(Math.atan2(y, x));
      const deg = 360 + ((brng + 360) % 360);

      if (lng1 !== lng2) {
        this.setState({ carAngle: `${deg}deg` });
      }
    }
  }

  movementAnimation(region) {
    setTimeout(() => {
      const { driverRegion } = this.state;

      driverRegion
        .timing({
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: this.props.region.latitudeDelta,
          longitudeDelta: this.props.region.longitudeDelta,
        })
        .start(() => {
          if (this.map) {
            this.map.animateToCoordinate(region);
          }
        });
    }, 1000);
  }
}

function bindActions(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    fetchUserCurrentLocationAsync: () => dispatch(fetchUserCurrentLocationAsync()),
    changeRegion: (region) => dispatch(changeRegion(region)),
    clearTripAndTripRequest: () => dispatch(clearTripAndTripRequest()),
    changePageStatus: (newPage) => dispatch(changePageStatus(newPage)),
    syncDataAsync: (jwtAccessToken) => dispatch(syncDataAsync(jwtAccessToken)),
    clearReducerState: () => dispatch(clearReducerState()),
    clearAlertMsg: () => dispatch(clearAlertMsg()),
  };
}

export default connect(mapStateToProps, bindActions)(RootView);
