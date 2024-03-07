import moment from 'moment-timezone';
import { Button, Card, CardItem, Header, Icon, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Linking, Modal, Platform, StatusBar, TouchableOpacity, View } from 'react-native';
import Communications from 'react-native-communications';
import { Col, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';

import { logOutUserAsync } from '../../../actions/common/signin';
import { startRide } from '../../../actions/driver/startRide';
import { showOdometerInput } from '../../../actions/driver/unitOdometerInput';
import * as appStateSelector from '../../../reducers/driver/appState';
import {
  ALERT_LOGOUT_MSG,
  ALERT_LOGOUT_TITLE,
  AMOUNT,
  DRIVER_NAVIGATE_TAG,
  DRIVER_PICK_UP,
  DRIVER_START_RIDE_TITLE,
  FOLIO,
  HOUR,
  INFO_ALERT_MORE_TITLE,
  INTERNET_CONN_ERROR,
  NO,
  OK,
  PAYED,
  START_TRIP_BTN,
  YES,
} from '../../../textStrings';
import { isIphoneXorAbove } from '../../common/headerHelper';
import Spinner from '../../loaders/Spinner';
import OdometerInput from '../unitOdometerInput';
import styles from './styles';

function mapStateToProps(state) {
  return {
    jwtAccessToken: state.driver.appState.jwtAccessToken,
    tripRequest: state.driver.tripRequest,
    trip: state.driver.trip,
    isFetching: appStateSelector.isFetching(state),
    region: {
      latitude: state.driver.tripRequest.srcLoc[0],
      longitude: state.driver.tripRequest.srcLoc[1],
      latitudeDelta: state.driver.tripRequest.latitudeDelta,
      longitudeDelta: state.driver.tripRequest.longitudeDelta,
    },
    driverCurrentGpsLocLat: state.driver.user.gpsLoc[0],
    driverCurrentGpsLocLong: state.driver.user.gpsLoc[1],
    socketDisconnected: state.driver.appState.socketDisconnected,
  };
}
class StartRide extends Component {
  static propTypes = {
    region: PropTypes.object,
    tripRequest: PropTypes.object,
    showOdometerInput: PropTypes.func,
    socketDisconnected: PropTypes.bool,
    startRide: PropTypes.func,
    isFetching: PropTypes.bool,
    logOutUserAsync: PropTypes.func,
    jwtAccessToken: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      heading: DRIVER_START_RIDE_TITLE,
      showView: true,
      driver: {
        latitude: this.props.region.latitude,
        longitude: this.props.region.longitude,
      },
    };
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

  contactPress() {
    Communications.phonecall(this.props.tripRequest.rider.phoneNo, true);
  }

  showMoreInfo() {
    let info = `${FOLIO} ${this.props.tripRequest.folio}\n${HOUR} ${moment(this.props.tripRequest.requestTime)
      .tz('America/Mexico_City')
      .format('D/M/YYYY h:mm a')}\n${AMOUNT} ${this.props.tripRequest.tripAmt}\n`;
    if (this.props.tripRequest.cashBox || this.props.tripRequest.transactionId) {
      info += PAYED + ' Si'; // info += `pagado: ${this.props.tripRequest.cashBox}`
    } else info += PAYED + ' No';

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

  startRide() {
    this.props.startRide();
  }

  goToNav() {
    console.log(this.props.tripRequest);
    const url = '';
    const dest = this.props.tripRequest.pickUpAddress.replace('Mexico', '');
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

  render() {
    return (
      <View pointerEvents='box-none' style={{ flex: 1 }}>
        <StatusBar barStyle='light-content' />
        {this.state.showView ? (
          <View style={styles.slideSelector}>
            <View style={styles.pickCard}>
              <Icon name='ios-person' style={styles.profileIcon} />
              <Text style={{ color: 'green', fontSize: 13, fontWeight: '700', lineHeight: 14 }}>{DRIVER_PICK_UP}</Text>
              <Text note style={{ fontSize: 18, fontWeight: '500', color: '#333' }}>
                {this.props.tripRequest.rider.fname} {this.props.tripRequest.rider.lname}
              </Text>
              <Grid>
                <Col>
                  <Button bordered style={styles.cardCall} textStyle={styles.btnTextCall} onPress={() => this.contactPress()}>
                    <Icon name='ios-call-outline' style={{ fontSize: 15, paddingHorizontal: 5, color: '#797979' }} />
                    <Text>{this.props.tripRequest.rider.phoneNo}</Text>
                  </Button>
                </Col>
                <Col>
                  <Button bordered style={styles.cardCall} textStyle={styles.btnTextCall} onPress={() => this.showMoreInfo()}>
                    <Icon name={'ios-add'} style={{ fontSize: 15, paddingHorizontal: 5, color: '#797979' }} />
                    <Text>{INFO_ALERT_MORE_TITLE}</Text>
                  </Button>
                </Col>
              </Grid>
            </View>
            <View style={{ justifyContent: 'center', position: 'absolute', right: 10, top: 0, bottom: 100 }}>
              <Text style={{ textAlign: 'right', color: '#797979' }}>0 MIN</Text>
            </View>
            <Card>
              {/* <CardItem style={{ alignSelf: 'center', borderBottomWidth: 0 }}>
                <Icon name="md-alarm"style={{ color: '#797979' }} />
                <Text style={{ color: '#555', fontWeight: '700' }}>WAIT FOR RIDER</Text>
                <Text note>Rider has been notified</Text>
              </CardItem> */}
              <View style={{ borderTopWidth: 1 }}>
                <Button
                  onPress={() => {
                    this.startRide();
                  }}
                  block
                  disabled={this.props.isFetching}
                  style={styles.tripBtn}
                >
                  {this.props.isFetching ? <Spinner /> : <Text style={styles.btnText}>{START_TRIP_BTN}</Text>}
                </Button>
              </View>
            </Card>
          </View>
        ) : (
          <View />
        )}

        <View style={styles.headerContainer}>
          {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
            <Button transparent>
              <Icon name='md-arrow-back' style={{ fontSize: 28, color: '#fff' }} />
            </Button>
            <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{this.state.heading}</Title>
            <Button transparent>
              <Icon name='ios-power' style={styles.logoutLogo} onPress={() => this.handleLogOut(ALERT_LOGOUT_TITLE, ALERT_LOGOUT_MSG)} />
            </Button>
          </Header> */}

          <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button transparent>
                <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{this.state.heading}</Title>
            </Body>
            <Right>
            <Button transparent>
              <Icon color="#FFF" name='ios-power' style={styles.logoutLogo} onPress={() => this.handleLogOut(ALERT_LOGOUT_TITLE, ALERT_LOGOUT_MSG)} />
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
                {this.props.tripRequest.tripAmt ? `\nTarifa: ${this.props.tripRequest.tripAmt}\n` : ''}
                {this.props.tripRequest.pickUpAddress}
                {this.props.tripRequest.pickUpReferences ? ` \nEntre calles: ${this.props.tripRequest.pickUpReferences}\n` : ''}
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
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    startRide: () => dispatch(startRide()),
    logOutUserAsync: (jwtAccessToken) => dispatch(logOutUserAsync(jwtAccessToken)),
    showOdometerInput: (data) => dispatch(showOdometerInput(data)),
  };
}

export default connect(mapStateToProps, bindActions)(StartRide);
