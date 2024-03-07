import {
  Button,
  Col,
  Container,
  Content,
  Grid,
  Header,
  Left,
  Text,
  Title,
  Body,
  Right,
  Subtitle,
  Icon,
} from "native-base";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, StatusBar } from "react-native";
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from "react-native-fbsdk";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { connect } from "react-redux";

import {
  clearEntryPage,
  socailLoginSuccessAndRoutetoRegister,
} from "../../../actions/common/entrypage";
import { registerAnonAsync } from "../../../actions/common/register";
import { signinAsync } from "../../../actions/common/signin";
import { askLocationPermissions } from "../../../actions/permissions";
import { changePageStatus } from "../../../actions/rider/home";
import { pushNewRoute, replaceRoute } from "../../../actions/route";
import * as appStateSelector from "../../../reducers/rider/appState";
import * as userSelector from "../../../reducers/rider/user";
import {
  COMMON_LOCATION_DENIED_ALERT,
  COMMON_SIGNIN_TITLE,
} from "../../../textStrings";
import theme from "../../../themes/base-theme";
import LoginForm from "./form";

function mapStateToProps(state) {
  return {
    isLoggedIn:
      state.rider.appState.isLoggedIn || state.driver.appState.isLoggedIn,
    loginError:
      state.rider.appState.loginError || state.driver.appState.loginError,
    userType: userSelector.getUserType(state),
    errormsg: appStateSelector.getErrormsg(state),
    isFetching: appStateSelector.isFetching(state),
    pageStatus: state.rider.appState.pageStatus,
  };
}
class SignIn extends Component {
  static propTypes = {
    replaceRoute: PropTypes.func,
    pushNewRoute: PropTypes.func,
    loginError: PropTypes.bool,
    errormsg: PropTypes.string,
    isFetching: PropTypes.bool,
  };
  state = {
    showError: false,
  };

  replaceRoute(route) {
    this.props.replaceRoute(route);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loginError) {
      this.setState({
        showError: true,
      });
    }
  }

  callGraphApi(data) {
    const infoRequestParams = {
      fields: {
        string: "email, first_name, last_name",
      },
    };
    const infoRequestConfig = {
      httpMethod: "GET",
      version: "v2.8",
      parameters: infoRequestParams,
      accessToken: data.accessToken.toString(),
    };
    const infoRequest = new GraphRequest(
      "/me",
      infoRequestConfig,
      this._responseInfoCallback.bind(this)
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  async requestFbLogin() {
    /*const permission = await askLocationPermissions();
    if (permission) {*/
    LoginManager.logInWithPermissions(["public_profile", "email"])
      .then((result) => {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          let permissionsFromFb = "";
          for (let i = 0; i < result.grantedPermissions.length; i++) {
            if (i === result.grantedPermissions.length - 1) {
              permissionsFromFb += result.grantedPermissions[i];
            } else {
              permissionsFromFb = `${permissionsFromFb + result.grantedPermissions[i]
                }, `;
            }
          }
          AccessToken.getCurrentAccessToken()
            .then((data) => {
              if (data.accessToken) {
                this.callGraphApi(data);
              } else {
                alert("access token is null");
                this.setState({ show: true, disableLoginButton: false });
              }
            })
            .catch((error) => {
              alert("error try again later");
              this.setState({ show: true, disableLoginButton: false });
            });
        }
      })
      .catch((error) => {
        console.log("error: ", error);
      });
    // } else alert(COMMON_LOCATION_DENIED_ALERT);
  }

  _responseInfoCallback(error, result) {
    if (error) {
      console.log("Error fetching data: ", error);
    } else {
      console.log(result, "the token is");
      const credentials = {
        account: result.email,
        password: result.id,
      };
      this.props.signinAsync(credentials, this.props.navigator);
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container theme={theme} style={{ backgroundColor: "#fff" }}>
          <StatusBar barStyle="default" />
          <Header style={{ backgroundColor: '#e80000' }}>
            <Left>
              <Button onPress={() => this.replaceRoute()} transparent>
                <Icon name="arrow-back" style={{ color: '#FFF' }} />
              </Button>
            </Left>
            <Body>
              <Title style={{ color: '#FFF' }}>{COMMON_SIGNIN_TITLE}</Title>
            </Body>
            <Right />
          </Header>
          <Content style={{ padding: 10 }}>
            <KeyboardAwareScrollView>
              <LoginForm
                navigator={this.props.navigator}
                isFetching={this.props.isFetching}
                pushNewRoute={this.props.pushNewRoute}
              />
              <Grid>
                {Platform.OS !== 'ios' ? <Col style={{ padding: 10 }}>
                  <Button
                    onPress={() => this.requestFbLogin()}
                    block
                    style={{ borderRadius: 0, backgroundColor: "#3B579D" }}
                  >
                    <Text style={{ color: "#fff" }}>Log in with facebook</Text>
                  </Button>
                </Col> : null}
              </Grid>
              {this.state.showError && (
                <Text style={{ color: "red" }}>{this.props.errormsg}</Text>
              )}
            </KeyboardAwareScrollView>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }
}

function bindActions(dispatch) {
  return {
    replaceRoute: (route) => dispatch(replaceRoute(route)),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    clearEntryPage: () => dispatch(clearEntryPage()),
    socailLoginSuccessAndRoutetoRegister: (data) =>
      dispatch(socailLoginSuccessAndRoutetoRegister(data)),
    signinAsync: (userCredentials, router) =>
      dispatch(signinAsync(userCredentials, router)),
    changePageStatus: (pageStatus) => dispatch(changePageStatus(pageStatus)),
    registerAnonAsync: (data) => dispatch(registerAnonAsync(data)),
  };
}

export default connect(mapStateToProps, bindActions)(SignIn);
