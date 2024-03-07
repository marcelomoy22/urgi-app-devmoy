import moment from 'moment-timezone';
import { Button, Header, Icon, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';

import { changePageStatus } from '../../../actions/driver/home';
import { responseByDriver } from '../../../actions/driver/rideRequest';
import { DRIVER_RIDE_REQUEST_ACCEPT_BTN, DRIVER_RIDE_REQUEST_DECLINE_BTN, DRIVER_RIDE_REQUEST_TITLE } from '../../../textStrings';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from './styles';

const Sound = require('react-native-sound');
const image = require('../../../../images/map-bg.png');
let eta = '';
let eta_done = false;
let whoosh;

function mapStateToProps(state) {
  return {
    tripRequest: state.driver.tripRequest,
    region: {
      latitude: state.driver.tripRequest.srcLoc[0],
      longitude: state.driver.tripRequest.srcLoc[1],
      latitudeDelta: state.driver.tripRequest.latitudeDelta,
      longitudeDelta: state.driver.tripRequest.longitudeDelta,
    },
  };
}
class RideRequest extends Component {
  static propTypes = {
    responseByDriver: PropTypes.func,
    tripRequest: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      eta: '',
    };
  }

  playSound() {
    whoosh = new Sound('newtripsound.wav', Sound.MAIN_BUNDLE, (error) => {
      whoosh.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          whoosh.reset();
        }
      });
    });
  }

  getETA() {
    // return 10;
    if (eta_done) {
      console.log('simon');
      return;
    }
    console.log('NEL');
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        console.log(this.props.tripRequest);
        fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${position.coords.latitude},${position.coords.longitude}&destination=${this.props.tripRequest.srcLoc[0]},${this.props.tripRequest.srcLoc[1]}&key=AIzaSyDii65UXo0SBSWHtQgAXO8vpOAm0vzA97w`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        ).then((res) => {
          console.log('EL RES', res);
          const body = JSON.parse(res._bodyText);
          console.log(body);
          eta = body.routes[0].legs[0].duration.text;
          eta_done = true;
          this.setState({ eta: body.routes[0].legs[0].duration.text });
        });
      },
      (error) => console.log(new Date(), error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    );
  }
  acceptRide() {
    whoosh.stop(() => {
      whoosh.release();
    });
    this.props.responseByDriver('accept');
  }
  rejectRide() {
    whoosh.stop(() => {
      whoosh.release();
    });
    this.props.responseByDriver('reject');
  }
  render() {
    return (
      <View style={{ flex: 1, zIndex: 10000 }} pointerEvents='box-none'>
        {this.playSound()}
        <StatusBar barStyle='light-content' />
        {/* <Image source={image} style={styles.mapBg} > */}
        <View style={styles.detailsContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.rating}>4.6</Text>
            <Icon name='ios-star' style={Platform.OS === 'ios' ? styles.iosRateStar : styles.aRateStar} />
          </View>
          <Text style={styles.time}>
            {this.getETA()}
            {this.state.eta}
          </Text>
          <Text style={styles.place}>
            {'Comentarios: \n'}
            {`${this.props.tripRequest.comments}\n`}
            {`${this.props.tripRequest.requestTripFrom}\n`}
            {this.props.tripRequest.tripAmt ? `\n Tarifa: ${this.props.tripRequest.tripAmt}\n` : ''}
          </Text>
          <Text style={styles.place}>
            {this.props.tripRequest.pickUpAddress}
            {this.props.tripRequest.pickUpReferences ? ` \n Entre calles: ${this.props.tripRequest.pickUpReferences}\n` : ''}
          </Text>
          <Text style={styles.place}>
            {`Hora de servicio: ${moment(this.props.tripRequest.requestTime).tz('America/Mexico_City').format(' D/M/YY [at] h:mm a')}`}
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button block style={{ backgroundColor: 'green', margin: 20, flex: 1 }} onPress={() => this.acceptRide()}>
              <Text>{DRIVER_RIDE_REQUEST_ACCEPT_BTN}</Text>
            </Button>
            <Button block style={{ backgroundColor: 'red', margin: 20, flex: 1 }} onPress={() => this.rejectRide()}>
              <Text>{DRIVER_RIDE_REQUEST_DECLINE_BTN}</Text>
            </Button>
          </View>
        </View>
        {/* </Image> */}

        <Header>
          <Left />
          <Body>
            <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{DRIVER_RIDE_REQUEST_TITLE}</Title>
          </Body>
          <Right />
        </Header>
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    responseByDriver: (response) => dispatch(responseByDriver(response)),
    changePageStatus: (newPage) => dispatch(changePageStatus(newPage)),
  };
}

export default connect(mapStateToProps, bindActions)(RideRequest);
