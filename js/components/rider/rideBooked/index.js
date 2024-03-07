import moment from 'moment';
import { Button, Card, CardItem, Header, Icon, Text, Thumbnail, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Animated, Dimensions, Easing, Modal, Platform, TouchableOpacity, View } from 'react-native';
import Communications from 'react-native-communications';
import { Col, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';

import config from '../../../../config.js';
import { changePageStatus } from '../../../actions/rider/home';
import { cancelRide, etaTimerDigits, etaTimerFormat } from '../../../actions/rider/rideBooked';
import { pushNewRoute } from '../../../actions/route';
import * as tripViewSelector from '../../../reducers/rider/tripRequest';
import {
  CANCEL_ALERT_MSG_NO_CHARGE,
  CANCEL_ALERT_MSG_WITH_CHARGE,
  CANCEL_ALERT_TITLE,
  CANCEL_ERROR_MSG,
  INTERNET_CONN_ERROR,
  NO,
  OK,
} from '../../../textStrings';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from './styles';

const profileImage = require('../../../../images/Contacts/avatar-9.jpg');
const { width, height } = Dimensions.get('window');
const SLIDE_CONFIG = width / 47; // slide adjusted to screen size
const SPRING_CONFIG = { tension: 2, friction: 3 }; // Soft spring

let startDate = moment();

function mapStateToProps(state) {
  return {
    rider: state.rider.user,
    tripRequest: state.rider.tripRequest,
    estimateDetails: state.rider.tripRequest.estimateDetails,
    requestTripFrom: state.rider.tripRequest.requestTripFrom,
    tripStatus: state.rider.trip.tripStatus,
    socketDisconnected: state.rider.appState.socketDisconnected,
    tripViewSelector: tripViewSelector.tripView(state),
    getEta: state.rider.etaTimer,
    counter: state.chat.newMsgCounter,
  };
}

class RideBooked extends Component {
  static propTypes = {
    tripRequest: PropTypes.object,
    estimateDetails: PropTypes.array,
    requestTripFrom: PropTypes.string,
    rider: PropTypes.object,
    cancelRide: PropTypes.func,
    changePageStatus: PropTypes.func,
    socketDisconnected: PropTypes.bool,
    tripViewSelector: PropTypes.object,
    etaTimerDigits: PropTypes.func,
    etaTimerFormat: PropTypes.func,
    getEta: PropTypes.object,
    pushNewRoute: PropTypes.func,
    counter: PropTypes.number,
  };

  constructor() {
    super();

    // slide buttons on screen
    this.slideBtnsValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.setEta(this.props, 0);
    this.screenChangeAnimations(SLIDE_CONFIG);
  }

  componentWillReceiveProps(props) {
    const minutesPassed = moment().diff(startDate, 'minutes');

    if (minutesPassed > 0 || this.props.tripViewSelector.heading !== props.tripViewSelector.heading) {
      startDate = moment();
      this.setEta(props, 1);
    }
  }

  setEta(props, subtract) {
    if (props.tripViewSelector.heading === 'En Viaje') {
      if (this.props.getEta.timeDigits === 0) {
        this.props.etaTimerDigits(parseFloat(this.props.estimateDetails[0].duration) - subtract);
      } else {
        this.props.etaTimerDigits(this.props.getEta.timeDigits - subtract);
      }

      this.props.etaTimerFormat(this.props.estimateDetails[0].duration.substr(this.props.estimateDetails[0].duration.length - 4));
    } else if (props.tripViewSelector.heading === '¡El chofer ha llegado!') {
      this.props.etaTimerDigits(0);
      this.props.etaTimerFormat(this.props.estimateDetails[1].duration.substr(this.props.estimateDetails[1].duration.length - 4));
    } else {
      if (this.props.getEta.timeDigits === 0) {
        this.props.etaTimerDigits(parseFloat(this.props.estimateDetails[1].duration) - subtract);
      } else {
        this.props.etaTimerDigits(this.props.getEta.timeDigits - subtract);
      }

      this.props.etaTimerFormat(this.props.estimateDetails[1].duration.substr(this.props.estimateDetails[1].duration.length - 4));
    }
  }

  handleExit() {
    let msg = CANCEL_ALERT_MSG_WITH_CHARGE;

    if (this.props.requestTripFrom !== 'PrivautoApp' && this.props.tripRequest.cashBox) {
      alert(CANCEL_ERROR_MSG);
      return;
    }

    if (this.props.rider.anonymous || !this.props.tripRequest.transactionId) {
      msg = CANCEL_ALERT_MSG_NO_CHARGE;
    }

    Alert.alert(
      CANCEL_ALERT_TITLE,
      msg,
      [
        { text: OK, onPress: () => this.props.cancelRide() },
        {
          text: NO,
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  }

  screenChangeAnimations(slide) {
    // slide buttons
    Animated.spring(this.slideBtnsValue, {
      ...SPRING_CONFIG,
      toValue: slide,
      duration: 1000,
      easing: Easing.linear,
    }).start();
  }

  contactPress() {
    if (this.props.tripRequest.driver.phoneNo2 !== undefined) Communications.phonecall(this.props.tripRequest.driver.phoneNo2, true);
    else Communications.phonecall(this.props.tripRequest.driver.phoneNo, true);
  }

  navigateTo(component) {
    this.props.pushNewRoute(component);
  }

  goBack() {
    this.props.changePageStatus('home');
  }

  render() {
    // slide animation
    const slideToRight = this.slideBtnsValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 40],
    });

    const slideToLeft = this.slideBtnsValue.interpolate({
      inputRange: [0, 1],
      outputRange: [40, 0],
    });

    return (
      <View pointerEvents='box-none' style={{ flex: 1 }}>
        {this.props.tripViewSelector.showFooter ? (
          <View style={styles.slideSelector}>
            {!this.props.tripRequest.rider.anonymous ? (
              <View>
                <Grid style={{ flexDirection: 'row', borderWidth: 0 }}>
                  <Col style={styles.driverInfoContainer}>
                    <Thumbnail
                      square
                      size={60}
                      source={{ uri: `${config.serverSideUrl}:${config.port}/users/${this.props.tripRequest.driver._id}/foto-perfil.jpg` }}
                      style={{ borderRadius: 30 }}
                    />
                    <View style={styles.driverInfo}>
                      <Text style={{ fontSize: 12, lineHeight: 13, color: '#000' }}>{this.props.tripRequest.driver.userRating}</Text>
                      <Icon name='ios-star' style={{ fontSize: 12, marginTop: 0, color: '#000' }} />
                    </View>
                    <Text>{this.props.tripRequest.driver.fname}</Text>
                  </Col>
                  <Col style={styles.driverInfoContainer}>
                    <Icon name='ios-car' style={{ fontSize: 40, color: '#000' }} />
                    <View style={styles.carInfo}>
                      <Text style={{ fontSize: 12, lineHeight: 13, color: '#000' }}>{this.props.tripRequest.driver.carDetails.name}</Text>
                    </View>
                    <Text style={{ fontSize: 12, lineHeight: 15, color: '#000' }}>{this.props && this.props.tripRequest && this.props.tripRequest.driver && this.props.tripRequest.driver.carDetails ? this.props.tripRequest.driver.carDetails.model : null}</Text>
                    <Text style={{ fontSize: 12, lineHeight: 15, color: '#000' }}>{this.props.tripRequest.driver.carDetails.registrationNo}</Text>
                  </Col>
                </Grid>
              </View>
            ) : null}
          </View>
        ) : (
          <View />
        )}

        <View style={styles.headerContainer}>
          {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
            {this.props.tripViewSelector.backButton ? (
              <Button transparent onPress={() => this.goBack()}>
                <Icon name='md-arrow-back' style={{ fontSize: 28, color: '#000' }} />
              </Button>
            ) : (
              <View />
            )}
            <Title style={{ color: '#000' }}>{this.props.tripViewSelector.heading}</Title>
          </Header> */}

          <Header>
            <Left>
            {this.props.tripViewSelector.backButton ? (
              <Button transparent onPress={() => this.goBack()}>
                <Icon name='arrow-back' />
              </Button>
            ) : (
              null
            )}
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{this.props.tripViewSelector.heading}</Title>
            </Body>
            <Right />
          </Header>

          <View style={styles.srcdes}>
            <Card style={styles.searchBar}>
              <View style={{ borderWidth: 0, borderColor: 'transparent' }}>
                {this.props.tripViewSelector.subText == ''}
                <Text style={styles.confirmation}>{this.props.tripViewSelector.subText}</Text>
              </View>
            </Card>
            <Card style={styles.searchBar2}>
              <View style={{ borderWidth: 0, borderColor: 'transparent' }}>
                <Text>{`${this.props.getEta.timeDigits} ${this.props.getEta.timeFormat}`}</Text>
              </View>
            </Card>
          </View>
        </View>
        <Modal animationType={'none'} transparent visible={this.props.socketDisconnected}>
          <View style={styles.modalTopContainer}>
            <View style={styles.modalTextViewContainer}>
              <Text style={styles.modalText}>{INTERNET_CONN_ERROR}</Text>
            </View>
          </View>
        </Modal>

        {this.props.tripViewSelector.cancelButton ? (
          <Animated.View style={{ marginLeft: slideToRight }}>
            <View style={styles.quickOptionsLeftContainer}>
              <View style={{ padding: 10 }}>
                <TouchableOpacity transparent style={styles.quickOptionsBtns} onPress={() => this.navigateTo('chat')}>
                  <Icon name={'ios-chatbubbles'} style={styles.quickOptionsIcon} />
                </TouchableOpacity>
                {this.props.counter > 0 ? (
                  <View style={styles.notificationCounter}>
                    <Text style={{ color: '#fff' }}>{this.props.counter > 99 ? '+99' : this.props.counter}</Text>
                  </View>
                ) : null}
              </View>

              <View style={{ padding: 10 }}>
                <TouchableOpacity transparent style={styles.quickOptionsBtns} onPress={() => this.contactPress()}>
                  <Icon name={'ios-call'} style={styles.quickOptionsIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ) : null}

        {this.props.tripViewSelector.cancelButton ? (
          <Animated.View style={{ marginLeft: slideToLeft }}>
            <View style={styles.quickOptionsRightContainer}>
              <View style={{ padding: 10 }}>
                <TouchableOpacity transparent style={styles.quickOptionsBtns} onPress={() => this.handleExit()}>
                  <Icon name={'ios-close'} style={styles.cancelRideIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ) : null}
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    cancelRide: () => dispatch(cancelRide()),
    changePageStatus: (newPage) => dispatch(changePageStatus(newPage)),
    etaTimerDigits: (digit) => dispatch(etaTimerDigits(digit)),
    etaTimerFormat: (format) => dispatch(etaTimerFormat(format)),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
  };
}

export default connect(mapStateToProps, bindActions)(RideBooked);
