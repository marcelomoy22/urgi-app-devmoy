import { Button, Container, Content, Header, Icon, Title, Left, Right, Body } from "native-base";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Image, Platform, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";

import config from "../../../../config.js";
import { updateUserProfileAsync } from "../../../actions/common/settings";
import { popRoute } from "../../../actions/route";
import * as appStateSelector from "../../../reducers/driver/appState";
import { storeObj } from "../../../setup";
import { COMMON_SIDEBAR_SETTINGS } from "../../../textStrings";
import theme from "../../../themes/base-theme";
import { isIphoneXorAbove } from "../../common/headerHelper";
import SettingsForm from "./form";
import styles from "./styles";

function mapStateToProps(state) {
  return {
    jwtAccessToken:
      state.rider.appState.jwtAccessToken ||
      state.driver.appState.jwtAccessToken,
    userType: state.rider.user.userType || state.driver.user.userType,
    isFetching: appStateSelector.isFetching(state),
  };
}

class Settings extends Component {
  static propTypes = {
    popRoute: PropTypes.func,
    userType: PropTypes.string,
    isFetching: PropTypes.bool,
  };

  goBack() {
    this.props.popRoute();
  }

  render() {
    const { dispatch, getState } = storeObj.store;
    return (
      <Container theme={theme} style={{ backgroundColor: "#fff" }}>
        {/* <Header
          style={
            Platform.OS === "ios"
              ? isIphoneXorAbove()
                ? styles.iosHeaderX
                : styles.iosHeader
              : styles.aHeader
          }
        >
          <Button transparent onPress={() => this.goBack()}>
            <Icon name="md-arrow-back" style={{ fontSize: 28 }} />
          </Button>
          <Title
            style={
              Platform.OS === "ios"
                ? styles.iosHeaderTitle
                : styles.aHeaderTitle
            }
          >
            {COMMON_SIDEBAR_SETTINGS}
          </Title>
          <Button transparent>
            <Icon name="md-more" />
          </Button>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
          <Left>
            <Button onPress={() => this.goBack()} transparent>
              <Icon name="arrow-back" style={{color: '#FFF'}} />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#FFF'}}>{COMMON_SIDEBAR_SETTINGS}</Title>
          </Body>
          <Right>
          </Right>
        </Header>

        <Content>
          <KeyboardAwareScrollView>
            <View style={{ backgroundColor: "#eee" }}>
              <Image
                style={styles.profileIcon}
                source={{
                  uri: `${config.serverSideUrl}:${config.port}/users/${
                    getState().driver.user._id
                  }/foto-perfil.jpg`,
                }}
              />
            </View>
            <SettingsForm
              userType={this.props.userType}
              isFetching={this.props.isFetching}
            />
          </KeyboardAwareScrollView>
        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    updateUserProfileAsync: (userDetails) =>
      dispatch(updateUserProfileAsync(userDetails)),
  };
}

export default connect(mapStateToProps, bindActions)(Settings);
