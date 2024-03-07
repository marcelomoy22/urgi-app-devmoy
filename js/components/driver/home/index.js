import { Button, Header, Icon, Title, Left, Right, Body } from "native-base";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import BackgroundJob from "react-native-background-job";
import { connect } from "react-redux";
import Geolocation from "@react-native-community/geolocation";

import { clearAlertMsg } from "../../../actions/alerts";
import { clearMessages } from "../../../actions/common/chat";
import { logOutUserAsync } from "../../../actions/common/signin";
import { openDrawer } from "../../../actions/drawer.ts";
import {
  changePageStatus,
  fetchUserCurrentLocationAsync,
  setToBusyState,
  syncDataAsync,
  updateBackgroundLocation,
} from "../../../actions/driver/home";
import { tripStarted } from "../../../actions/driver/startRide";
import { showOdometerInput } from "../../../actions/driver/unitOdometerInput";
import { resetRoute } from "../../../actions/route";
import {
  ALERT_LOGOUT_MSG,
  ALERT_LOGOUT_TITLE,
  DRIVER_HOME_PAUSE_ALERT_MSG,
  DRIVER_HOME_PAUSE_ALERT_TITLE,
  DRIVER_HOME_PAUSE_TITLE,
  DRIVER_HOME_PLAY_ALERT_MSG,
  DRIVER_HOME_PLAY_ALERT_TITLE,
  DRIVER_HOME_TITLE,
  NO,
  YES,
} from "../../../textStrings";
import { isIphoneXorAbove } from "../../common/headerHelper";
import OdometerInput from "../unitOdometerInput";
import styles from "./styles";

const gpsBackgroundJob = {
  jobKey: "gpsBackgroundJob",
  job: () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const user = {
          userType: "driver",
          gpsLoc: [position.coords.latitude, position.coords.longitude],
          persist: true,
          overwrite: false,
          speed: position.coords.speed,
          heading: position.coords.heading,
        };
        updateBackgroundLocation(user);
      },
      (error) => console.log(new Date(), error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    );
  },
};
// register background job for gps location when app is killed
BackgroundJob.register(gpsBackgroundJob);

const { width, height } = Dimensions.get("window");
const SLIDE_CONFIG = width / 47; // slide adjusted to screen size
const SPRING_CONFIG = { tension: 2, friction: 3 }; // Soft spring

function mapStateToProps(state) {
  return {
    tripRequest: state.driver.tripRequest,
    fname: state.driver.user.fname,
    busy: state.driver.user.busy,
    jwtAccessToken: state.driver.appState.jwtAccessToken,
    ticket: state.driver.captureTicket.data,
    successMsg: state.alert.successMsg,
    errorMsg: state.alert.errorMsg,
  };
}

class DriverHome extends Component {
  static propTypes = {
    resetRoute: PropTypes.func,
    logOutUserAsync: PropTypes.func,
    jwtAccessToken: PropTypes.string,
    busy: PropTypes.bool,
    openDrawer: PropTypes.func,
    ticket: PropTypes.object,
    tripStarted: PropTypes.func,
    showOdometerInput: PropTypes.func,
    successMsg: PropTypes.string,
    errorMsg: PropTypes.string,
    clearAlertMsg: PropTypes.func,
    setToBusyState: PropTypes.func,
    clearMessages: PropTypes.func,
  };

  constructor() {
    super();

    // slide buttons on screen
    this.slideBtnsValue = new Animated.Value(0);
  }

  componentWillMount() {
    this.screenChangeAnimations(SLIDE_CONFIG);
    BackgroundJob.cancelAll();
    this.props.clearMessages();
  }

  componentDidMount() {
    try {
      // background gps configuration
      BackgroundJob.schedule({
        jobKey: "gpsBackgroundJob",
        period: 180000, // Change me!!!
        timeout: 180000, // if you don't want to waist all cellphone data
        exact: true,
        allowExecutionInForeground: true,
      });
    } catch (e) {
      console.log(e);
    }
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

  handlePause(title, msg, busy) {
    Alert.alert(
      title,
      msg,
      [
        {
          text: YES,
          onPress: () => {
            this.setState({ busy });
            this.props.setToBusyState(busy);
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

  render() {
    // slide animation
    const slideToRight = this.slideBtnsValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 40],
    });

    // render start trip if ticket exists
    if (this.props.ticket && this.props.ticket.destAddress)
      this.props.tripStarted(this.props.ticket);

    return (
      <View pointerEvents="box-none" style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />

        <Animated.View style={{ marginLeft: slideToRight }}>
          <View style={styles.quickOptionsRightContainer}>
            <View style={{ padding: 10 }}>
              <TouchableOpacity
                style={
                  this.props.busy
                    ? styles.quickOptionPlay
                    : styles.quickOptionStop
                }
                onPress={() => {
                  if (!this.props.busy)
                    this.handlePause(
                      DRIVER_HOME_PAUSE_ALERT_TITLE,
                      DRIVER_HOME_PAUSE_ALERT_MSG,
                      true
                    );
                  else
                    this.handlePause(
                      DRIVER_HOME_PLAY_ALERT_TITLE,
                      DRIVER_HOME_PLAY_ALERT_MSG,
                      false
                    );
                }}
              >
                {this.props.busy ? (
                  <Icon name={"ios-play"} style={styles.icons} />
                ) : (
                  <Icon name={"ios-pause"} style={styles.icons} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={this.props.openDrawer}>
            <Icon name='ios-menu' style={{ color: '#fff' }} />
          </Button>
          <Button transparent>
            <Icon name='ios-power' style={styles.logoutLogo} onPress={() => this.handleLogOut(ALERT_LOGOUT_TITLE, ALERT_LOGOUT_MSG)} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>
            {this.props.busy ? DRIVER_HOME_PAUSE_TITLE : DRIVER_HOME_TITLE}
          </Title>
        </Header> */}

        <Header>
          <Left>
            <Button onPress={this.props.openDrawer} transparent>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>
              {this.props.busy ? DRIVER_HOME_PAUSE_TITLE : DRIVER_HOME_TITLE}
            </Title>
          </Body>
          <Right>
            {/* <Button transparent>
              <Icon
                name="ios-power"
                style={styles.logoutLogo}
                onPress={() =>
                  this.handleLogOut(ALERT_LOGOUT_TITLE, ALERT_LOGOUT_MSG)
                }
              />
            </Button> */}
          </Right>
        </Header>

        <OdometerInput />
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    resetRoute: (route) => dispatch(resetRoute(route)),
    changePageStatus: (newPage) => dispatch(changePageStatus(newPage)),
    logOutUserAsync: (jwtAccessToken) =>
      dispatch(logOutUserAsync(jwtAccessToken)),
    fetchUserCurrentLocationAsync: () =>
      dispatch(fetchUserCurrentLocationAsync()),
    syncDataAsync: (jwtAccessToken) => dispatch(syncDataAsync(jwtAccessToken)),
    tripStarted: (data) => dispatch(tripStarted(data)),
    showOdometerInput: (data) => dispatch(showOdometerInput(data)),
    clearAlertMsg: () => dispatch(clearAlertMsg()),
    setToBusyState: (state) => dispatch(setToBusyState(state)),
    clearMessages: () => dispatch(clearMessages()),
  };
}

export default connect(mapStateToProps, bindActions)(DriverHome);
