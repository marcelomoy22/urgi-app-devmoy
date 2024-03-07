import { Content, Icon, List, ListItem, Text, View } from "native-base";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Alert, Platform } from "react-native";
import { connect } from "react-redux";

import { logOutUserAsync } from "../../../actions/common/signin";
import { closeDrawer } from "../../../actions/drawer";
import { changePageStatus } from "../../../actions/driver/home";
import { showOdometerInput } from "../../../actions/driver/unitOdometerInput";
import {
  pushNewRoute,
  replaceOrPushRoute,
  resetRoute,
} from "../../../actions/route";
import { sendSOS } from "../../../services/driversocket";
import {
  ALERT_LOGOUT_MSG,
  ALERT_LOGOUT_TITLE,
  COMMON_SIDEBAR_BILLING,
  COMMON_SIDEBAR_CAPTURETICKET,
  COMMON_SIDEBAR_COUPONS,
  COMMON_SIDEBAR_FAVORITES,
  COMMON_SIDEBAR_LAST_TRIP,
  COMMON_SIDEBAR_LOGOUT,
  COMMON_SIDEBAR_NEXT_TRIP,
  COMMON_SIDEBAR_PAYMENT,
  COMMON_SIDEBAR_SCHEDULEDTRIPS,
  COMMON_SIDEBAR_SETTINGS,
  COMMON_SIDEBAR_SOS,
  COMMON_SIDEBAR_VERSION,
  COMMON_SIDEBAR_MAKEPAYMENT,
  NO,
  YES,
} from "../../../textStrings";
import OdometerInput from "../../driver/unitOdometerInput";
import styles from "./styles";

function mapStateToProps(state) {
  return {
    jwtAccessToken:
      state.rider.appState.jwtAccessToken ||
      state.driver.appState.jwtAccessToken,
    fname: state.rider.user.fname || state.driver.user.fname,
    userType: state.rider.user.userType || state.driver.user.userType,
    user: state.rider.user || state.driver.user,
  };
}

class SideBar extends Component {
  static propTypes = {
    fname: PropTypes.string,
    userType: PropTypes.string,
    user: PropTypes.string,
    closeDrawer: PropTypes.func,
    pushNewRoute: PropTypes.func,
    resetRoute: PropTypes.func,
    logOutUserAsync: PropTypes.func,
    jwtAccessToken: PropTypes.string,
    sendSOS: PropTypes.func,
    changePageStatus: PropTypes.func,
    showOdometerInput: PropTypes.func,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.fname === undefined) {
      this.resetRoute("login");
    }
  }

  navigateTo(route) {
    this.props.closeDrawer();
    this.props.pushNewRoute(route);
  }

  resetRoute(route) {
    this.props.closeDrawer();
    this.props.resetRoute(route);
  }

  onRiderLogout() {
    this.props.closeDrawer();
    this.props.logOutUserAsync(this.props.jwtAccessToken, "rider");
  }

  onDriverLogout() {
    this.props.closeDrawer();
    this.props.showOdometerInput(true);
  }

  handleLogOut(title, msg) {
    Alert.alert(
      title,
      msg,
      [
        {
          text: YES,
          onPress: () => {
            if (this.props.userType === "rider") this.onRiderLogout();
            else this.onDriverLogout();
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

  handleSendSOS() {
    this.props.user.sos = {
      status: true,
      date: new Date(),
      coordinates: this.props.user.gpsLoc,
    };

    alert("Sending SOS");
    sendSOS(this.props.user);
  }

  handleScheduledTrips(route) {
    this.props.closeDrawer();
    this.props.changePageStatus(route);
  }

  // <ListItem button onPress={() => this.navigateTo('notifications')} iconLeft style={Platform.OS === 'android' ? styles.alinks : styles.links} >
  //   <Icon name="ios-notifications" style={Platform.OS === 'ios' ? styles.iosSidebarIcons : styles.aSidebarIcons} />
  //   <Text style={styles.linkText}>Notifications</Text>
  // </ListItem>

  // <ListItem button onPress={() => this.navigateTo('history')} iconLeft style={Platform.OS === 'android' ? styles.alinks : styles.links} >
  //   <Icon name="ios-keypad-outline" style={Platform.OS === 'ios' ? styles.iosSidebarIcons : styles.aSidebarIcons} />
  //   <Text style={styles.linkText}>History</Text>
  // </ListItem>

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#19192B" }}>
        {this.props.user.carDetails ? <OdometerInput /> : null}
        <Content
          style={
            Platform.OS === "android"
              ? styles.adrawerContent
              : styles.drawerContent
          }
        >
          <List foregroundColor={"white"} style={styles.profile}>
            <ListItem
              button
              iconLeft
              style={Platform.OS === "android" ? styles.alinks : styles.links}
            >
              <Icon
                name="ios-person"
                style={
                  Platform.OS === "ios"
                    ? styles.iosSidebarIcons
                    : styles.aSidebarIcons
                }
              />
              <Text style={styles.linkText}>{this.props.fname}</Text>
            </ListItem>
          </List>

          <List foregroundColor={"white"} style={styles.Bg}>
            {this.props.userType === "rider" && !this.props.user.anonymous ? (
              <ListItem
                button
                onPress={() => this.navigateTo("billing")}
                iconLeft
                style={Platform.OS === "android" ? styles.alinks : styles.links}
              >
                <Icon
                  name="ios-folder"
                  style={
                    Platform.OS === "ios"
                      ? styles.iosSidebarIcons
                      : styles.aSidebarIcons
                  }
                />
                <Text style={styles.linkText}>{COMMON_SIDEBAR_BILLING}</Text>
              </ListItem>
            ) : (
              <View />
            )}

            {this.props.userType === "rider" && !this.props.user.anonymous ? (
              <ListItem
                button
                onPress={() => this.navigateTo("payment")}
                iconLeft
                style={Platform.OS === "android" ? styles.alinks : styles.links}
              >
                <Icon
                  name="ios-card"
                  style={
                    Platform.OS === "ios"
                      ? styles.iosSidebarIcons
                      : styles.aSidebarIcons
                  }
                />
                <Text style={styles.linkText}>{COMMON_SIDEBAR_PAYMENT}</Text>
              </ListItem>
            ) : (
              <View />
            )}

            <ListItem
              button
              onPress={() => this.navigateTo("history")}
              iconLeft
              style={Platform.OS === "android" ? styles.alinks : styles.links}
            >
              <Icon
                name="ios-list"
                style={
                  Platform.OS === "ios"
                    ? styles.iosSidebarIcons
                    : styles.aSidebarIcons
                }
              />
              <Text style={styles.linkText}>{COMMON_SIDEBAR_LAST_TRIP}</Text>
            </ListItem>

            <ListItem
              button
              onPress={() => this.navigateTo("nextTrips")}
              iconLeft
              style={Platform.OS === "android" ? styles.alinks : styles.links}
            >
              <Icon
                name="ios-list"
                style={
                  Platform.OS === "ios"
                    ? styles.iosSidebarIcons
                    : styles.aSidebarIcons
                }
              />
              <Text style={styles.linkText}>{COMMON_SIDEBAR_NEXT_TRIP}</Text>
            </ListItem>

            {this.props.userType === "driver" ? (
              <ListItem
                button
                onPress={() => this.navigateTo("makePayment")}
                iconLeft
                style={Platform.OS === "android" ? styles.alinks : styles.links}
              >
                <Icon
                  name="ios-cash"
                  style={
                    Platform.OS === "ios"
                      ? styles.iosSidebarIcons
                      : styles.aSidebarIcons
                  }
                />
                <Text style={styles.linkText}>
                  {COMMON_SIDEBAR_MAKEPAYMENT}
                </Text>
              </ListItem>
            ) : (
              <View />
            )}

            {!this.props.user.anonymous ? (
              <ListItem
                button
                onPress={() => this.navigateTo("settings")}
                iconLeft
                style={Platform.OS === "android" ? styles.alinks : styles.links}
              >
                <Icon
                  name="ios-settings"
                  style={
                    Platform.OS === "ios"
                      ? styles.iosSidebarIcons
                      : styles.aSidebarIcons
                  }
                />
                <Text style={styles.linkText}>{COMMON_SIDEBAR_SETTINGS}</Text>
              </ListItem>
            ) : (
              <View />
            )}

            {this.props.userType === "rider" && !this.props.user.anonymous ? (
              <ListItem
                button
                onPress={() => this.navigateTo("favorites")}
                iconLeft
                style={Platform.OS === "android" ? styles.alinks : styles.links}
              >
                <Icon
                  name="ios-heart"
                  style={
                    Platform.OS === "ios"
                      ? styles.iosSidebarIcons
                      : styles.aSidebarIcons
                  }
                />
                <Text style={styles.linkText}>{COMMON_SIDEBAR_FAVORITES}</Text>
              </ListItem>
            ) : (
              <View />
            )}

            {this.props.userType === "driver" ? (
              <ListItem
                button
                onPress={() => this.navigateTo("captureTicket")}
                iconLeft
                style={Platform.OS === "android" ? styles.alinks : styles.links}
              >
                <Icon
                  name="ios-pricetag"
                  style={
                    Platform.OS === "ios"
                      ? styles.iosSidebarIcons
                      : styles.aSidebarIcons
                  }
                />
                <Text style={styles.linkText}>
                  {COMMON_SIDEBAR_CAPTURETICKET}
                </Text>
              </ListItem>
            ) : (
              <View />
            )}

            {this.props.userType === "driver" ? (
              <ListItem
                button
                onPress={() => this.handleScheduledTrips("scheduledTrips")}
                iconLeft
                style={Platform.OS === "android" ? styles.alinks : styles.links}
              >
                <Icon
                  name="ios-car"
                  style={
                    Platform.OS === "ios"
                      ? styles.iosSidebarIcons
                      : styles.aSidebarIcons
                  }
                />
                <Text style={styles.linkText}>
                  {COMMON_SIDEBAR_SCHEDULEDTRIPS}
                </Text>
              </ListItem>
            ) : (
              <View />
            )}

            {!this.props.user.anonymous ? (
              <ListItem
                button
                onPress={() => this.navigateTo("coupons")}
                iconLeft
                style={Platform.OS === "android" ? styles.alinks : styles.links}
              >
                <Icon
                  name="ios-cut"
                  style={
                    Platform.OS === "ios"
                      ? styles.iosSidebarIcons
                      : styles.aSidebarIcons
                  }
                />
                <Text style={styles.linkText}>{COMMON_SIDEBAR_COUPONS}</Text>
              </ListItem>
            ) : (
              <View />
            )}

            <ListItem
              button
              onPress={() =>
                this.handleLogOut(ALERT_LOGOUT_TITLE, ALERT_LOGOUT_MSG)
              }
              iconLeft
              style={Platform.OS === "android" ? styles.alinks : styles.links}
            >
              <Icon
                name="ios-power"
                style={
                  Platform.OS === "ios"
                    ? styles.iosSidebarIcons
                    : styles.aSidebarIcons
                }
              />
              <Text style={styles.linkText}>{COMMON_SIDEBAR_LOGOUT}</Text>
            </ListItem>

            {this.props.userType === "driver" ? (
              <ListItem
                button
                onPress={() => this.handleSendSOS()}
                iconLeft
                style={Platform.OS === "android" ? styles.alinks : styles.links}
              >
                <Icon
                  name="ios-warning"
                  style={
                    Platform.OS === "ios"
                      ? styles.iosSidebarIcons
                      : styles.aSidebarIcons
                  }
                />
                <Text style={styles.linkText}>{COMMON_SIDEBAR_SOS}</Text>
              </ListItem>
            ) : (
              <View />
            )}

            <ListItem
              button
              iconLeft
              style={Platform.OS === "android" ? styles.alinks : styles.links}
            >
              <Icon
                name="ios-information"
                style={
                  Platform.OS === "ios"
                    ? styles.iosSidebarIcons
                    : styles.aSidebarIcons
                }
              />
              <Text style={styles.linkText}>{COMMON_SIDEBAR_VERSION}</Text>
            </ListItem>
          </List>
        </Content>
      </View>
    );
  }
}

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    replaceOrPushRoute: (route) => dispatch(replaceOrPushRoute(route)),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    resetRoute: (route) => dispatch(resetRoute(route)),
    logOutUserAsync: (id, userType) => dispatch(logOutUserAsync(id, userType)),
    sendSOS: (userDatails) => dispatch(sendSOS(userDatails)),
    changePageStatus: (route) => dispatch(changePageStatus(route)),
    showOdometerInput: (data) => dispatch(showOdometerInput(data)),
  };
}

export default connect(mapStateToProps, bindAction)(SideBar);
