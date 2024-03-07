import moment from 'moment-timezone';
import { Button, Header, Icon, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Animated, Dimensions, Easing, Linking, Modal, Platform, StatusBar, TouchableOpacity, View } from 'react-native';
import Communications from 'react-native-communications';
import { connect } from 'react-redux';

import { logOutUserAsync } from '../../../actions/common/signin';
import { cancelledRideByDriver } from '../../../actions/driver/pickRider';
import { showOdometerInput } from '../../../actions/driver/unitOdometerInput';
import { pushNewRoute } from '../../../actions/route';
import * as tripViewSelector from '../../../reducers/driver/tripRequest';
import {
  ALERT_LOGOUT_MSG,
  ALERT_LOGOUT_TITLE,
  AMOUNT,
  DRIVER_NAVIGATE_TAG,
  FOLIO,
  HOUR,
  INFO_ALERT_MORE_TITLE,
  INTERNET_CONN_ERROR,
  NO,
  OK,
  PAYED,
  YES,
} from '../../../textStrings';
import { isIphoneXorAbove } from '../../common/headerHelper';
import OdometerInput from '../unitOdometerInput';
import styles from './styles';

const { width, height } = Dimensions.get('window');
const SLIDE_CONFIG = width / 47; // slide adjusted to screen size
const SPRING_CONFIG = { tension: 2, friction: 3 }; // Soft spring

function mapStateToProps(state) {
  return {
    jwtAccessToken: state.driver.appState.jwtAccessToken,
    tripRequest: state.driver.tripRequest,
    region: {
      latitude: state.driver.tripRequest.srcLoc[0],
      longitude: state.driver.tripRequest.srcLoc[1],
      latitudeDelta: state.driver.tripRequest.latitudeDelta,
      longitudeDelta: state.driver.tripRequest.longitudeDelta,
    },
    driverCurrentGpsLocLat: state.driver.user.gpsLoc[0],
    driverCurrentGpsLocLong: state.driver.user.gpsLoc[1],
    riderPickupLocLat: !state.driver.tripRequest.rider ? undefined : state.driver.tripRequest.srcLoc[0],
    riderPickupLocLong: !state.driver.tripRequest.rider ? undefined : state.driver.tripRequest.srcLoc[0],
    distance: state.driver.appState.distance,
    socketDisconnected: state.driver.appState.socketDisconnected,
    tripViewSelector: tripViewSelector.tripView(state),
    counter: state.chat.newMsgCounter,
  };
}

class PickRider extends Component {
  static propTypes = {
    cancelledRideByDriver: PropTypes.func,
    tripRequest: PropTypes.object,
    socketDisconnected: PropTypes.bool,
    tripViewSelector: PropTypes.object,
    logOutUserAsync: PropTypes.func,
    jwtAccessToken: PropTypes.string,
    showOdometerInput: PropTypes.func,
    pushNewRoute: PropTypes.func,
    counter: PropTypes.number,
  };

  constructor() {
    super();

    // slide buttons on screen
    this.slideBtnsValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.screenChangeAnimations(SLIDE_CONFIG);
  }

  goToNav() {
    console.log(this.props.tripRequest);
    const dest = this.props.tripRequest.pickUpAddress.replace('Mexico', '');
    const url = '';
    if (Platform.OS == 'ios') {
      Linking.canOpenURL(`http://maps.apple.com/?daddr=${dest}`).then((supported) => {
        if (supported) {
          Linking.openURL(`http://maps.apple.com/?daddr=${dest}`);
        } else {
          console.log(`Don't know how to open URI: ${url}`);
        }
      });
    } else {
      Linking.canOpenURL(`https://www.google.com/maps/dir/?api=1&destination=${this.props.tripRequest.srcLoc[0]},${this.props.tripRequest.srcLoc[1]}`).then(
        (supported) => {
          if (supported) {
            Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${this.props.tripRequest.srcLoc[0]},${this.props.tripRequest.srcLoc[1]}`);
          } else {
            console.log(`Don't know how to open URI: ${url}`);
          }
        }
      );
    }
  }

  handleLogOut(title, msg) {
    Alert.alert(
      title,
      msg,
      [
        {
          text: YES,
          onPress: () => {
            this.props.showOdometerInput({ show: true });
          },
        },
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
    Communications.phonecall(this.props.tripRequest.rider.phoneNo, true);
  }

  navigateTo(component) {
    this.props.pushNewRoute(component);
  }

  showMoreInfo() {
    let info = `${FOLIO} ${this.props.tripRequest.folio}\n${HOUR} ${moment(this.props.tripRequest.requestTime)
      .tz('America/Mexico_City')
      .format('D/M/YYYY h:mm a')}\n${AMOUNT} ${this.props.tripRequest.tripAmt}\n`;
    if (this.props.tripRequest.cashBox || this.props.tripRequest.transactionId) {
      info += `${PAYED} Si`; // info += `pagado: ${this.props.tripRequest.cashBox}`
    } else info += `${PAYED} No`;

    Alert.alert(
      INFO_ALERT_MORE_TITLE,
      info,
      [
        {
          text: OK,
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  }

  render() {
    // slide animation
    const slideToRight = this.slideBtnsValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 40],
    });

    return (
      <View pointerEvents='box-none' style={{ flex: 1 }}>
        <StatusBar barStyle='light-content' />
        {
          // <View style={styles.slideSelector}>
          //   <Card style={styles.footerCard}>
          //     <CardItem>
          //       <Icon name="ios-person" style={styles.profileIcon} />
          //       <Text style={styles.pick}>PICK UP</Text>
          //       <Text note style={styles.rider}>{this.props.tripRequest.rider.fname}</Text>
          //     </CardItem>
          //     <CardItem style={{ justifyContent: 'center', position: 'absolute', right: 10, top: 0, bottom: 0 }}>
          //       <Text style={styles.time}>2 MIN</Text>
          //     </CardItem>
          //   </Card>
          // </View>
        }

        <View style={styles.headerContainer}>
          {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
            {this.props.tripViewSelector.backButton ? (
              <View />
            ) : (
              <Button
                transparent
                onPress={() => {
                  alert(';)');
                }}
              >
                <Icon name='md-arrow-back' style={{ fontSize: 28, color: '#fff' }} />
              </Button>
            )}
            <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{this.props.tripViewSelector.heading}</Title>
            <Button transparent>
              <Icon name='ios-power' style={styles.logoutLogo} onPress={() => this.handleLogOut(ALERT_LOGOUT_TITLE, ALERT_LOGOUT_MSG)} />
            </Button>
          </Header> */}

          <Header>
            <Left>
            {this.props.tripViewSelector.backButton ? (
              null
            ) : (
              <Button
                transparent
                onPress={() => {
                  alert(';)');
                }}
              >
                <Icon name='arrow-back' />
              </Button>
            )}
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{this.props.tripViewSelector.heading}</Title>
            </Body>
            <Right>
            <Button transparent>
              <Icon name='ios-power' style={styles.logoutLogo} onPress={() => this.handleLogOut(ALERT_LOGOUT_TITLE, ALERT_LOGOUT_MSG)} />
            </Button>
              </Right>
          </Header>

          <View style={Platform.OS === 'ios' ? styles.iosSrcdes : styles.aSrcdes}>
            <View style={styles.searchBar}>
              <TouchableOpacity style={styles.navigateBtn} onPress={this.goToNav.bind(this)}>
                <Icon name='md-navigate' style={{ fontSize: 24, color: '#3EC1D9' }} />
                <Text style={{ color: '#3EC1D9', fontSize: 12, fontWeight: '700', lineHeight: 14 }}>{DRIVER_NAVIGATE_TAG}</Text>
              </TouchableOpacity>
              <Text style={styles.place}>
                {'Comentarios: \n'}
                {this.props.tripRequest.comments}
                {this.props.tripRequest.tripAmt ? `\n Tarifa: ${this.props.tripRequest.tripAmt}\n` : ''}
                {this.props.tripRequest.pickUpAddress}
                {this.props.tripRequest.pickUpReferences ? ` \n Entre calles: ${this.props.tripRequest.pickUpReferences}\n` : ''}
              </Text>
            </View>
          </View>
          <OdometerInput />
        </View>
        <Modal animationType={'none'} transparent visible={this.props.socketDisconnected}>
          <View style={styles.modalTopContainer}>
            <View style={styles.modalTextViewContainer}>
              <Text style={styles.modalText}>{INTERNET_CONN_ERROR}</Text>
            </View>
          </View>
        </Modal>

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

            <View style={{ padding: 10 }}>
              <TouchableOpacity transparent style={styles.quickOptionsBtns} onPress={() => this.showMoreInfo()}>
                <Icon name={'ios-information'} style={styles.moreInfoIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    cancelledRideByDriver: () => dispatch(cancelledRideByDriver()),
    logOutUserAsync: (jwtAccessToken) => dispatch(logOutUserAsync(jwtAccessToken)),
    showOdometerInput: (data) => dispatch(showOdometerInput(data)),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
  };
}

export default connect(mapStateToProps, bindActions)(PickRider);
