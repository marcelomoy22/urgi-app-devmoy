import { Button, Card, CardItem, Header, Icon, Row, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import Communications from 'react-native-communications';
import { connect } from 'react-redux';

import config from '../../../../config';
import { changePageStatus } from '../../../actions/driver/home';
import { asignTripAsync, cleanScheduledTrips, getScheduledTrips } from '../../../actions/driver/scheduledTrips';
import {
  DRIVER_SCHEDULE_BTN,
  DRIVER_SCHEDULED_TRIPS_DESTINY_TAG,
  DRIVER_SCHEDULED_TRIPS_DISABLE_TEXT,
  DRIVER_SCHEDULED_TRIPS_NOT_PAYED,
  DRIVER_SCHEDULED_TRIPS_PAYED,
  DRIVER_SCHEDULED_TRIPS_TITLE,
} from '../../../textStrings';
import { isIphoneXorAbove } from '../../common/headerHelper';
import Spinner from '../../loaders/Spinner';
import styles from './styles';

function mapStateToProps(state) {
  return {
    jwtAccessToken: state.driver.appState.jwtAccessToken,
    driver: state.driver.user,
  };
}

class ScheduledTrips extends Component {
  static propTypes = {
    changePageStatus: PropTypes.func,
    jwtAccessToken: PropTypes.string,
    getScheduledTrips: PropTypes.func,
    cleanScheduledTrips: PropTypes.func,
    tripRequest: PropTypes.object,
    isFetching: PropTypes.bool,
    asignTripAsync: PropTypes.func,
    driver: PropTypes.object,
    callback: PropTypes.func,
  };

  componentDidMount() {
    this.props.getScheduledTrips(this.props.jwtAccessToken);
  }

  submit() {
    // assign driver to trip request
    this.props.tripRequest.driverId = this.props.driver._id;
    this.props.tripRequest.unit = this.props.driver.carDetails._id;
    if (config.disableScheduledTrips) {
      alert(DRIVER_SCHEDULED_TRIPS_DISABLE_TEXT);
    } else {
      // send data
      this.props.asignTripAsync(this.props.jwtAccessToken, this.props.tripRequest._id, this.props.tripRequest);
      this.goBack();
    }
  }

  goBack() {
    // reset rootView scheduledTrip state
    this.props.callback();

    // reset scheduledTrips reducer
    this.props.cleanScheduledTrips();

    // go to driver home window
    this.props.changePageStatus('home');
  }

  contactPress() {
    Communications.phonecall(this.props.tripRequest.riderId.phoneNo, true);
  }

  renderStarts(rating) {
    switch (rating) {
      case 1:
        return <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />;
      case 2:
        return (
          <Row>
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
          </Row>
        );
      case 3:
        return (
          <Row>
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
          </Row>
        );
      case 4:
        return (
          <Row>
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
          </Row>
        );
      case 5:
        return (
          <Row>
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
            <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />
          </Row>
        );
      default:
        return <Icon name={'ios-star'} style={{ color: '#31D0E2' }} />;
    }
  }

  render() {
    return (
      <View pointerEvents='box-none' style={{ flex: 1 }}>
        <StatusBar barStyle='light-content' />
        <View style={styles.slideSelector}>
          {this.props.tripRequest ? (
            <View style={{ flexDirection: 'row', backgroundColor: '#eee' }}>
              <Icon name='ios-person' style={{ alignSelf: 'center', paddingRight: 10, color: '#797979' }} />
              <Text note style={styles.riderName}>
                {this.props.tripRequest.riderId.fname} {this.props.tripRequest.riderId.lname}
              </Text>
              <Button bordered style={styles.cardCall} textStyle={styles.btnTextCall} onPress={() => this.contactPress()}>
                <Icon name='ios-call-outline' style={{ fontSize: 15, paddingHorizontal: 5, color: '#797979' }} />
                <Text>{this.props.tripRequest.riderId.phoneNo}</Text>
              </Button>
              <Text style={styles.placeText}>
                {DRIVER_SCHEDULED_TRIPS_DESTINY_TAG}
                {this.props.tripRequest.destAddress}
              </Text>
            </View>
          ) : null}

          {this.props.tripRequest ? (
            <View style={{ borderTopWidth: 1 }}>
              <Icon name={'ios-cash'} style={{ color: '#797979' }} />
              {this.props.tripRequest.cashBox ? (
                <Text style={styles.payedTag}>{DRIVER_SCHEDULED_TRIPS_PAYED}</Text>
              ) : (
                <Text style={styles.notPayedTag}>{DRIVER_SCHEDULED_TRIPS_NOT_PAYED}</Text>
              )}
              {this.renderStarts(this.props.tripRequest.riderId.userRating)}
            </View>
          ) : null}

          {this.props.tripRequest ? (
            <Card>
              <View style={{ borderTopWidth: 1 }}>
                <Button disabled={this.props.isFetching} block style={styles.tripBtn} onPress={() => this.submit()}>
                  {this.props.isFetching ? <Spinner /> : <Text style={styles.btnText}>{DRIVER_SCHEDULE_BTN}</Text>}
                </Button>
              </View>
            </Card>
          ) : null}
        </View>
        <View style={styles.headerContainer}>
          {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
            <Button transparent onPress={() => this.goBack()}>
              <Icon name='ios-home' style={{ fontSize: 28, color: '#000' }} />
            </Button>
            <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{DRIVER_SCHEDULED_TRIPS_TITLE}</Title>
          </Header> */}

          <Header>
            <Left>
              <Button onPress={() => this.goBack()} transparent>
                <Icon name="ios-home" />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{DRIVER_SCHEDULED_TRIPS_TITLE}</Title>
            </Body>
            <Right />
          </Header>
        </View>
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    changePageStatus: (route) => dispatch(changePageStatus(route)),
    getScheduledTrips: (token) => dispatch(getScheduledTrips(token)),
    asignTripAsync: (auth, id, data) => dispatch(asignTripAsync(auth, id, data)),
    cleanScheduledTrips: () => dispatch(cleanScheduledTrips()),
  };
}

export default connect(mapStateToProps, bindActions)(ScheduledTrips);
