import { Button, Col, Grid, Header, Icon, Input, InputGroup, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Animated, Dimensions, Easing, Modal, Platform, TouchableOpacity, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';

import { clearAlertMsg } from '../../../actions/alerts';
import { setDestValidator, setSrcValidator, startSearch } from '../../../actions/autoComplete';
import { openDrawer } from '../../../actions/drawer';
import {
  addVipData,
  fetchAddressFromCoordinatesAsync,
  fetchCurrentZone,
  isInsideZone,
  originDestZone,
  startEstimate,
  zoneStart,
} from '../../../actions/rider/confirmRide';
import { changePageStatus, setTripRequestReceivedFalse } from '../../../actions/rider/home';
import { cancelRide } from '../../../actions/rider/rideBooked';
import { popRoute, pushNewRoute } from '../../../actions/route';
import * as appStateSelector from '../../../reducers/driver/appState';
import * as tripViewSelector from '../../../reducers/rider/tripRequest';
import { riderCancelledTripRequest } from '../../../services/ridersocket';
import {
  CANCEL_BTN,
  INTERNET_CONN_ERROR,
  RIDER_CONFIRM_RIDE_DEST_ERROR,
  RIDER_CONFIRM_RIDE_PLACEHOLDER_DEST,
  RIDER_CONFIRM_RIDE_PLACEHOLDER_SOURCE,
  RIDER_CONFIRM_RIDE_PLEASE_WAIT,
  RIDER_CONFIRM_RIDE_REQUEST_TAXI_BTN,
  RIDER_CONFIRM_RIDE_SCHEDULE_MODAL_TITLE,
  RIDER_CONFIRM_RIDE_SCHEDULE_TRIP_BTN,
  RIDER_CONFIRM_RIDE_TITLE,
} from '../../../textStrings';
import AutoComplete from '../../autocomplete';
import { isIphoneXorAbove } from '../../common/headerHelper';
import Spinner from '../../loaders/Spinner';
import styles from './styles';

const { width } = Dimensions.get('window');
const SLIDE_CONFIG = width / 47; // slide adjusted to screen size
const SPRING_CONFIG = { tension: 2, friction: 3 }; // Soft spring

function mapStateToProps(state) {
  return {
    region: {
      latitude: state.rider.tripRequest.srcLoc[0],
      longitude: state.rider.tripRequest.srcLoc[1],
    },
    tripRequest: state.rider.tripRequest,
    zonaName: state.rider.tripRequest.zonaName,
    vipData: state.rider.tripRequest.vipData,
    pickUpAddress: state.rider.tripRequest.pickUpAddress,
    destAddress: state.autocomplete.address,
    destLoc: state.autocomplete.destLoc,
    selectedCard: state.rider.payment.selectedCard,
    rider: state.rider.user,
    tripRequestStatus: state.rider.tripRequest.tripRequestStatus,
    tripViewSelector: tripViewSelector.tripView(state),
    taxiType: state.rider.taxi.selected,
    isFetching: appStateSelector.isFetching(state),
    fieldOptions: state.rider.fieldOptions,
    stackNavigation: state.route.routes,
    socketDisconnected: state.rider.appState.socketDisconnected,
    successMsg: state.alert.successMsg,
    errorMsg: state.alert.errorMsg,
    globalAlert: state.alert.global,
    selectedCoupon: state.coupons.selected,
    srcValidator: state.autocomplete.srcValidator,
    destValidator: state.autocomplete.destValidator,
  };
}

class ConfirmRide extends Component {
  static propTypes = {
    successMsg: PropTypes.string,
    errorMsg: PropTypes.string,
    globalAlert: PropTypes.bool,
    clearAlertMsg: PropTypes.func,
    region: PropTypes.object,
    tripRequest: PropTypes.object,
    pickUpAddress: PropTypes.string,
    rider: PropTypes.object,
    changePageStatus: PropTypes.func,
    pushNewRoute: PropTypes.func,
    popRoute: PropTypes.func,
    fetchAddressFromCoordinatesAsync: PropTypes.func,
    tripViewSelector: PropTypes.object,
    taxiType: PropTypes.object,
    startSearch: PropTypes.func,
    destAddress: PropTypes.string,
    destLoc: PropTypes.object,
    clearGooglePlacesBar: PropTypes.func,
    isInsideZone: PropTypes.func,
    originDestZone: PropTypes.func,
    isFetching: PropTypes.bool,
    fetchCurrentZone: PropTypes.func,
    cancelRide: PropTypes.func,
    riderCancelledTripRequest: PropTypes.func,
    stackNavigation: PropTypes.array,
    setSrcValidator: PropTypes.func,
    setDestValidator: PropTypes.func,
    setTripRequestReceivedFalse: PropTypes.func,
    socketDisconnected: PropTypes.bool,
    srcValidator: PropTypes.bool,
    destValidator: PropTypes.bool,
    startEstimate: PropTypes.func,
    selectedCoupon: PropTypes.string,
    addVipData: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      region: `${props.region.latitude}` + ',' + `${props.region.longitude}`,
      isDateTimePickerVisible: false,
      dateTime: null,
      processing: false,
      pickUpAddress: props.pickUpAddress,
      destAddress: props.destAddress,
      buttonVip: undefined,
      vipBtn: undefined,
      modalVIP: undefined,
    };
    if (props.taxiType) {
      props.tripRequest.taxiType = props.taxiType._id;
    }
    // slide buttons on screenN
    this.slideBtnsValue = new Animated.Value(0);
  }

  async componentDidMount() {
    this.props.addVipData(undefined);
    this.state.buttonVip = undefined;
    this.setState({ buttonVip: undefined });
    this.props.zoneStart();
    await this.props.fetchAddressFromCoordinatesAsync(this.props.region.latitude, this.props.region.longitude);
    if (this.props.vipData) {
      this.state.vipBtn = true;
    } else {
      this.state.vipBtn = undefined;
    }

    this.props.setSrcValidator(true);

    this.screenChangeAnimations(SLIDE_CONFIG);
  }

  screenChangeAnimations(slide) {
    // slide buttons
    Animated.spring(this.slideBtnsValue, {
      ...SPRING_CONFIG,
      toValue: slide,
      duration: 1000,
      easing: Easing.linear,
    }).start(() => {});
  }

  estimate(dateTime) {
    // show calculating .........
    this.props.startEstimate();

    const data = {
      userId: this.props.rider._id,
      couponId: this.props.selectedCoupon,
      origin: [this.props.region.latitude, this.props.region.longitude],
      dest: [this.props.destLoc.lat, this.props.destLoc.lng],
      coordinates: null,
      taxiType: this.props.taxiType._id,
      km: null,
      toZone: null,
      tripRequest: undefined,
      dateTime,
      vip: this.state.vipBtn,
    };

    this.props.isInsideZone(data);
  }

  // calendar and Time picker functions
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (dateTime) => {
    if (!this.state.processing) {
      this.scheduleTrip(dateTime);
    }
  };

  scheduleTrip(dateTime) {
    this.setState({ processing: true, isDateTimePickerVisible: false });
    this.props.tripRequest.tripRequestStatus = 'scheduling';
    this.props.tripRequest.requestTime = dateTime;

    this.estimate(dateTime);
  }

  handlePress() {
    this.setState({ processing: true });
    // set to false received
    this.props.setTripRequestReceivedFalse();
    // initialize trip request
    this.props.tripRequest.destLoc = [this.props.destLoc.lat, this.props.destLoc.lng];
    this.props.tripRequest.destAddress = this.props.destAddress;
    this.props.tripRequest.requestTripFrom = 'PrivautoApp';
    this.props.tripRequest.coupon = this.props.selectedCoupon;
    delete this.props.tripRequest.driver;
    delete this.props.tripRequest.driverId;
    delete this.props.tripRequest.unit;
    delete this.props.tripRequest.unitName;

    // prepare data
    const data = {
      origin: [this.props.region.latitude, this.props.region.longitude],
      dest: [this.props.destLoc.lat, this.props.destLoc.lng],
      coordinates: null,
      taxiType: this.props.taxiType._id,
      tripRequest: this.props.tripRequest,
      rider: this.props.rider,
    };

    if (this.props.vipData) {
      data.tripRequest.vip = {
        terminal: this.props.vipData.terminal,
        aerolinea: this.props.vipData.aerolinea,
        nVuelo: this.props.vipData.nVuelo,
        cliente: this.props.vipData.cliente,
      };
    }
    // send data to action
    this.props.isInsideZone(data);
  }

  vipService() {
    const data = {
      origin: [this.props.region.latitude, this.props.region.longitude],
      dest: [this.props.destLoc.lat, this.props.destLoc.lng],
    };
    this.props.originDestZone(data);
  }

  async handleCancel() {
    await this.props.cancelRide();
    this.props.riderCancelledTripRequest(this.props.tripRequest);
  }

  goBack() {
    this.props.changePageStatus('home');
  }

  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }

  popRoute() {
    this.props.popRoute();
  }

  vipBtn() {
    this.pushNewRoute('vipData');
  }

  vipBtnPick() {
    this.pushNewRoute('vipData');
  }

  componentWillReceiveProps(props) {
    if (props.zonaName == 'zona99') {
      this.state.buttonVip = true;
      this.setState({ buttonVip: true });
    } else {
      // this.setState({buttonVip: undefined})
      this.setState({ buttonVip: undefined }); //cambiar aqui por undefinde
      this.setState({ vipBtn: undefined });
    }

    if (props.vipData) {
      this.state.vipBtn = true;
      this.setState({ vipBtn: true });
    } else {
      this.state.vipBtn = undefined;
    }

    if (this.props.pickUpAddress != props.pickUpAddress) {
      this.vipService();
    }

    if (this.props.pickUpAddress != props.pickUpAddress) {
      this.setState({ pickUpAddress: props.pickUpAddress });
    }

    if (this.props.destAddress != props.destAddress) {
      this.setState({ destAddress: props.destAddress });
    }

    setTimeout(() => {
      if (props.globalAlert === false) {
        Alert.alert(RIDER_CONFIRM_RIDE_SCHEDULE_MODAL_TITLE, props.successMsg, [
          {
            text: 'Cancel',
            onPress: () => {
              this.setState({ processing: false });
            },
            style: 'cancel',
          },
          { text: 'OK', onPress: () => this.handlePress() },
        ]);

        props.clearAlertMsg();
      } else {
        this.setState({ processing: false });
      }
    }, 500);
  }

  render() {
    const today = new Date();

    // slide animation
    const slideToLeft = this.slideBtnsValue.interpolate({
      inputRange: [0, 1],
      outputRange: [40, 0],
    });

    return (
      <View pointerEvents='box-none' style={{ flex: 1, zIndex: 1 }}>
        <View style={{ position: 'absolute', top: 0, zIndex: 1, width: width }}>
          {/* <Header
            style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader ? styles.iosHeader : styles.aHeader}
          >
            {!this.props.tripViewSelector.loadSpinner ? (
              <Button transparent onPress={() => this.goBack()}>
                <Icon name='md-arrow-back' style={{ fontSize: 28, color: '#000' }} />
              </Button>
            ) : (
              <View />
            )}
            <Title style={{ color: '#000' }}>{RIDER_CONFIRM_RIDE_TITLE}</Title>
          </Header> */}

          <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button onPress={() => this.goBack()} transparent>
                <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{RIDER_CONFIRM_RIDE_TITLE}</Title>
            </Body>
            <Right />
          </Header>

          <View style={Platform.OS === 'ios' ? styles.iosSrcdes : styles.aSrcdes}>
            <View style={styles.searchBarContainer}>
              <View style={styles.searchBarIn}>
                <InputGroup borderType='regular' style={styles.searchBar}>
                  <Icon name='ios-search' style={styles.searchIcon} />
                  <Input
                    placeholder={RIDER_CONFIRM_RIDE_PLACEHOLDER_SOURCE}
                    placeholderTextColor='#797979'
                    defaultValue={this.props.pickUpAddress}
                    value={this.state.pickUpAddress}
                    style={{ textAlign: 'center', color: this.props.srcValidator ? 'green' : 'red', marginLeft: 15 }}
                    onChangeText={(searchInputText) => {
                      this.setState({ pickUpAddress: searchInputText });
                      this.props.startSearch(this.state.region, searchInputText, true);
                      this.props.setSrcValidator(false);
                    }}
                    onSubmitEditing={(event) => this.props.startSearch(this.state.region, this.state.pickUpAddress, true)}
                  />
                </InputGroup>
              </View>
            </View>
            <View style={styles.searchBarContainer}>
              <View>
                <InputGroup borderType='regular' style={styles.searchBar}>
                  <Icon name='ios-search' style={styles.searchIcon} />
                  <Input
                    autoCorrect={false}
                    placeholder={RIDER_CONFIRM_RIDE_PLACEHOLDER_DEST}
                    placeholderTextColor='#797979'
                    defaultValue={this.props.destAddress}
                    value={this.state.destAddress}
                    style={{ textAlign: 'center', color: 'green', marginLeft: 15 }}
                    onChangeText={(searchInputText) => {
                      this.setState({ destAddress: searchInputText });
                      this.props.startSearch(this.state.region, searchInputText);
                      this.props.setDestValidator(false);
                    }}
                    onSubmitEditing={(event) => this.props.startSearch(this.state.region, this.state.searchInputText)}
                  />
                </InputGroup>
                <AutoComplete />
              </View>
            </View>
          </View>
        </View>

        {!this.props.rider.anonymous ? (
          <Animated.View style={{ marginLeft: slideToLeft }}>
            <View style={styles.quickOptionsLeftContainer}>
              <View style={{ padding: 10 }}>
                <TouchableOpacity
                  style={styles.quickOptionsBtns}
                  onPress={() => {
                    this.pushNewRoute('selectLocation');
                  }}
                >
                  <Icon name={'ios-pin'} style={styles.icons} />
                </TouchableOpacity>
              </View>

              <View style={{ padding: 10 }}>
                <TouchableOpacity
                  style={styles.quickOptionsBtns}
                  onPress={() => {
                    this.pushNewRoute('coupons');
                  }}
                >
                  <Icon name={'ios-cut'} style={styles.icons} />
                </TouchableOpacity>
              </View>

              <View style={{ padding: 10 }}>
                <TouchableOpacity
                  style={styles.quickOptionsBtns}
                  onPress={() => {
                    if (this.props.srcValidator && this.props.destValidator) {
                      this.estimate(undefined);
                    } else {
                      alert(RIDER_CONFIRM_RIDE_DEST_ERROR);
                    }
                  }}
                >
                  <Icon name={'ios-calculator'} style={styles.icons} />
                </TouchableOpacity>
              </View>

              <View style={{ padding: 10 }}>
                <TouchableOpacity
                  style={[styles.quickOptionsBtns, { flexDirection: 'row' }]}
                  onPress={() => {
                    this.pushNewRoute('payment');
                  }}
                >
                  <Icon name={'ios-card'} style={styles.icons} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ) : null}

        <View style={styles.slideSelector}>
          <Grid>
            <Col>
              {this.state.buttonVip == true ? (
                <View>
                  {this.state.vipBtn == true ? (
                    <Button
                      block
                      style={styles.vipBtn}
                      disabled={this.props.tripViewSelector.loadSpinner || this.state.processing}
                      onPress={() => {
                        this.vipBtnPick();
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: '700' }}>Viaje VIP</Text>
                    </Button>
                  ) : (
                    <Button
                      block
                      style={styles.confirmBtn}
                      disabled={this.props.tripViewSelector.loadSpinner || this.state.processing}
                      onPress={() => {
                        this.vipBtn();
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: '700' }}>Hacer VIP</Text>
                    </Button>
                  )}
                </View>
              ) : (
                <View>
                  {/* <Button
                    block
                    style={styles.confirmBtn}
                    disabled={this.props.tripViewSelector.loadSpinner || this.state.processing}
                    onPress={() => {
                      if (this.props.srcValidator && this.props.destValidator) {
                        this.handlePress();
                      } else {
                        alert(RIDER_CONFIRM_RIDE_DEST_ERROR);
                      }
                    }}
                  >
                    {this.state.processing ? <Spinner /> : <Text style={{ color: '#fff', fontWeight: '700' }}>{RIDER_CONFIRM_RIDE_REQUEST_TAXI_BTN}</Text>}
                  </Button> */}
                </View>
              )}
            </Col>

            {!this.props.rider.anonymous ? (
              <Col>
                {this.props.tripViewSelector.loadSpinner ? (
                  <View style={{ marginLeft: 2 }}>
                    <Button
                      disabled={!this.props.tripRequest.received}
                      block
                      style={styles.cancelBtn}
                      onPress={() => {
                        this.handleCancel();
                      }}
                    >
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                        }}
                      >
                        {!this.props.tripRequest.received ? RIDER_CONFIRM_RIDE_PLEASE_WAIT : CANCEL_BTN}
                      </Text>
                    </Button>
                  </View>
                ) : (
                  <View style={{ marginLeft: 2 }}>
                    <Button
                      disabled={this.state.processing}
                      block
                      style={styles.scheduleBtn}
                      onPress={() => {
                        if (this.props.srcValidator && this.props.destValidator) {
                          if (this.state.vipBtn == true) {
                            if (this.props.selectedCard.type) {
                              this._showDateTimePicker();
                            } else {
                              alert('El servicio VIP tiene que ser prepagado, Favor de cambiar el tipo de pago a tarjeta');
                            }
                          } else {
                            this._showDateTimePicker();
                          }
                        } else {
                          alert(RIDER_CONFIRM_RIDE_DEST_ERROR);
                        }
                      }}
                    >
                      {this.state.processing ? <Spinner /> : <Text style={{ color: '#fff', fontWeight: '700' }}>{RIDER_CONFIRM_RIDE_SCHEDULE_TRIP_BTN}</Text>}
                    </Button>
                  </View>
                )}
              </Col>
            ) : (
              <View>
                {this.props.tripViewSelector.loadSpinner ? (
                  <View style={{ marginLeft: 2 }}>
                    <Button
                      disabled={!this.props.tripRequest.received}
                      block
                      style={styles.cancelBtn}
                      onPress={() => {
                        this.handleCancel();
                      }}
                    >
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                        }}
                      >
                        {!this.props.tripRequest.received ? RIDER_CONFIRM_RIDE_PLEASE_WAIT : CANCEL_BTN}
                      </Text>
                    </Button>
                  </View>
                ) : null}
              </View>
            )}
          </Grid>

          {/* <Text style={styles.footerText}>PICKUP TIME IS APPROXIMATELY 2 MINUTES</Text>*/}
        </View>

        <View style={{ flex: 1, zIndex: 0 }}>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            mode={'datetime'}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            minimumDate={today}
            minuteInterval={15}
          />
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
    openDrawer: () => dispatch(openDrawer()),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    popRoute: () => dispatch(popRoute()),
    fetchAddressFromCoordinatesAsync: (latitude, longitude) => dispatch(fetchAddressFromCoordinatesAsync(latitude, longitude)),
    // noNearByDriver: () => submit(noNearByDriver()),
    changePageStatus: (newPage) => dispatch(changePageStatus(newPage)),
    startSearch: (region, input, edit) => dispatch(startSearch(region, input, edit)),
    isInsideZone: (data) => dispatch(isInsideZone(data)),
    originDestZone: (data) => dispatch(originDestZone(data)),
    zoneStart: () => dispatch(zoneStart()),
    startEstimate: () => dispatch(startEstimate()),
    fetchCurrentZone: (data) => dispatch(fetchCurrentZone(data)),
    cancelRide: () => dispatch(cancelRide()),
    riderCancelledTripRequest: (data) => dispatch(riderCancelledTripRequest(data)),
    setTripRequestReceivedFalse: () => dispatch(setTripRequestReceivedFalse()),
    clearAlertMsg: () => dispatch(clearAlertMsg()),
    setSrcValidator: (bool) => dispatch(setSrcValidator(bool)),
    setDestValidator: (bool) => dispatch(setDestValidator(bool)),
    addVipData: (data) => dispatch(addVipData(data)),
  };
}

export default connect(mapStateToProps, bindActions)(ConfirmRide);
