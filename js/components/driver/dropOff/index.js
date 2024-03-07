import {
  Button,
  Card,
  CardItem,
  Header,
  Icon,
  Text,
  Title,
  Left,
  Right,
  Body,
} from "native-base";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import Communications from "react-native-communications";
import { connect } from "react-redux";

import { logOutUserAsync } from "../../../actions/common/signin";
import { endTicketTrip, endTrip } from "../../../actions/driver/dropOff";
import { showOdometerInput } from "../../../actions/driver/unitOdometerInput";
import { pushNewRoute } from "../../../actions/route";
import * as appStateSelector from "../../../reducers/driver/appState";
import {
  ALERT_LOGOUT_MSG,
  ALERT_LOGOUT_TITLE,
  DRIVER_DROPOFF_TAG,
  DRIVER_DROPOFF_TITLE,
  DRIVER_NAVIGATE_TAG,
  END_TRIP_BTN,
  INTERNET_CONN_ERROR,
  NO,
  YES,
} from "../../../textStrings";
import { isIphoneXorAbove } from "../../common/headerHelper";
import Spinner from "../../loaders/Spinner";
import OdometerInput from "../unitOdometerInput";
import styles from "./styles";

function mapStateToProps(state) {
  return {
    jwtAccessToken: state.driver.appState.jwtAccessToken,
    socketDisconnected: state.driver.appState.socketDisconnected,
    rider: state.driver.trip.rider,
    ticket: state.driver.captureTicket.data,
    trip: state.driver.trip,
    isFetching: appStateSelector.isFetching(state),
    region: {
      latitude: state.driver.user.gpsLoc[0],
      longitude: state.driver.user.gpsLoc[1],
      latitudeDelta: state.driver.tripRequest.latitudeDelta,
      longitudeDelta: state.driver.tripRequest.longitudeDelta,
    },
    // rider:state.driver.trip.rider
  };
}
class DropOff extends Component {
  static propTypes = {
    rider: PropTypes.object,
    ticket: PropTypes.object,
    trip: PropTypes.object,
    endTrip: PropTypes.func,
    endTicketTrip: PropTypes.func,
    pushNewRoute: PropTypes.func,
    isFetching: PropTypes.bool,
    logOutUserAsync: PropTypes.func,
    jwtAccessToken: PropTypes.string,
    socketDisconnected: PropTypes.bool,
    showOdometerInput: PropTypes.func,
  };
  constructor(props) {
    super(props);

    if (props.ticket === undefined) {
      this.state = {
        destAddress: props.trip.destAddress,
        destLoc: props.trip.destLoc,
        ticket: false,
      };
    } else {
      this.state = {
        destAddress: props.ticket.destAddress,
        destLoc: props.ticket.destLoc,
        ticket: true,
        button: true,
      };
    }

    this.getLocAddress(props.region.latitude, props.region.longitude);
  }

  contactPress() {
    Communications.phonecall(
      this.props.rider ? this.props.rider.phoneNo : 3318482390,
      true
    );
  }

  completeTrip() {
    if (this.state.ticket) {
      // check if it's a ticket trip
      // check if we have all necessary data to end trip
      if (
        (this.props.ticket.folio && this.props.ticket.urlTicket) ||
        (this.props.ticket.code &&
          this.props.ticket.securityCode &&
          this.props.ticket.urlTicket)
      ) {
        const driverEndTrip = {
          srcEndTrip: this.state.srcEndTrip,
          Address: this.state.address,
          datetime: this.state.datetime,
        };

        this.props.endTicketTrip(this.props.ticket, driverEndTrip);
      } else this.props.pushNewRoute("captureTicket"); // if ticket data is incomplete route to capture ticket form
    } else {
      this.props.endTrip();
    } // if not end trip with sockets
  }

  goToNav() {
    const dest = this.state.destAddress.replace("Mexico", "");
    const url = "";
    if (Platform.OS == "ios") {
      Linking.canOpenURL(`http://maps.apple.com/?daddr=${dest}`).then(
        (supported) => {
          if (supported) {
            Linking.openURL(`http://maps.apple.com/?daddr=${dest}`);
          } else {
            console.log(`Don't know how to open URI: ${url}`);
          }
        }
      );
    } else {
      Linking.canOpenURL(
        `https://www.google.com/maps/dir/?api=1&destination=${this.state.destLoc[0]},${this.state.destLoc[1]}`
      ).then((supported) => {
        if (supported) {
          Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${this.state.destLoc[0]},${this.state.destLoc[1]}`
          );
        } else {
          console.log(`Don't know how to open URI: ${url}`);
        }
      });
    }
  }

  getLocAddress(lat, long) {
    const param = {
      latlng: `${lat}` + "," + `${long}`,
      key: "AIzaSyDii65UXo0SBSWHtQgAXO8vpOAm0vzA97w",
    };
    let url = "https://maps.googleapis.com/maps/api/geocode/json?";
    url += Object.keys(param)
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(param[k])}`)
      .join("&");

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          srcEndTrip: [lat, long],
          address: responseJson.results[1].formatted_address,
          time: "test",
        });
      });
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
    return (
      <View pointerEvents="box-none" style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <View style={styles.slideSelector}>
          {!this.state.ticket ? (
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "rgba(238,238,238,0.2)",
              }}
            >
              <Icon
                name="ios-person"
                style={{
                  alignSelf: "center",
                  paddingRight: 10,
                  color: "#797979",
                }}
              />
              <Text
                style={{
                  color: "#C61100",
                  fontSize: 13,
                  fontWeight: "700",
                  lineHeight: 14,
                }}
              >
                {DRIVER_DROPOFF_TAG}
              </Text>
              <Text
                note
                style={{ fontSize: 18, fontWeight: "500", color: "#333" }}
              >
                {this.props.rider ? this.props.rider.fname : "error"}{" "}
                {this.props.rider ? this.props.rider.lname : "error"}
              </Text>
              <Button
                bordered
                style={styles.cardCall}
                textStyle={styles.btnTextCall}
                onPress={() => this.contactPress()}
              >
                <Icon
                  name="ios-call-outline"
                  style={{
                    fontSize: 15,
                    paddingHorizontal: 5,
                    color: "#797979",
                  }}
                />
                <Text>
                  {this.props.rider ? this.props.rider.phoneNo : 3318482390}
                </Text>
              </Button>
            </View>
          ) : null}
          {/*! this.state.ticket ? <View style={{ justifyContent: 'center', position: 'absolute', right: 10, top: 0, bottom: 0 }}>
            <Text style={{ textAlign: 'right', color: '#797979' }}>{this.props.trip.travelTime}</Text>
          </View> : null*/}
          <Card>
            <View style={{ borderTopWidth: 1 }}>
              <Button
                disabled={this.props.isFetching}
                block
                style={styles.tripBtn}
                onPress={() => {
                  this.completeTrip();
                }}
              >
                {this.props.isFetching ? (
                  <Spinner />
                ) : (
                  <Text style={styles.btnText}>{END_TRIP_BTN}</Text>
                )}
              </Button>
            </View>
          </Card>
        </View>
        <View style={styles.headerContainer}>
          {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
            <Button transparent>
              <Icon name='md-arrow-back' style={{ fontSize: 28, color: '#fff' }} />
            </Button>
            <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{DRIVER_DROPOFF_TITLE}</Title>
            <Button transparent>
              <Icon name='ios-power' style={styles.logoutLogo} onPress={() => this.handleLogOut(ALERT_LOGOUT_TITLE, ALERT_LOGOUT_MSG)} />
            </Button>
          </Header> */}

          <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button onPress={() => this.goToNav()} transparent>
                <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{DRIVER_DROPOFF_TITLE}</Title>
            </Body>
            <Right>
              <Button transparent>
                <Icon
                  name="ios-power"
                  style={styles.logoutLogo}
                  onPress={() =>
                    this.handleLogOut(ALERT_LOGOUT_TITLE, ALERT_LOGOUT_MSG)
                  }
                />
              </Button>
            </Right>
          </Header>

          <View
            style={Platform.OS === "ios" ? styles.iosSrcdes : styles.aSrcdes}
          >
            <View style={styles.searchBar}>
              <TouchableOpacity
                style={styles.navigateBtn}
                onPress={this.goToNav.bind(this)}
              >
                <Icon
                  name="md-navigate"
                  style={{ fontSize: 24, color: "#3EC1D9" }}
                />
                <Text
                  style={{
                    color: "#3EC1D9",
                    fontSize: 12,
                    fontWeight: "700",
                    lineHeight: 14,
                  }}
                >
                  {DRIVER_NAVIGATE_TAG}
                </Text>
              </TouchableOpacity>
              <View style={styles.place}>
                <Text style={styles.placeText}>
                  {this.props.trip ? this.props.trip.destAddress : "lol"}
                </Text>
              </View>
            </View>
          </View>
          <OdometerInput />
        </View>
        <Modal
          animationType={"none"}
          transparent
          visible={this.props.socketDisconnected}
        >
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
    endTrip: () => dispatch(endTrip()),
    endTicketTrip: (data, obj) => dispatch(endTicketTrip(data, obj)),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    logOutUserAsync: (jwtAccessToken) =>
      dispatch(logOutUserAsync(jwtAccessToken)),
    showOdometerInput: (data) => dispatch(showOdometerInput(data)),
  };
}

export default connect(mapStateToProps, bindActions)(DropOff);
