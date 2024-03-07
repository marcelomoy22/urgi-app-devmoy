import { Button, Container, Content, Header, Icon, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Platform, StatusBar, View } from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';

import { socailSignupSuccess } from '../../../actions/common/entrypage';
import { cleanRegisterError, registerAsync, registerAsyncFb } from '../../../actions/common/register';
import { replaceRoute } from '../../../actions/route';
import { COMMON_REGISTER_OR, COMMON_REGISTER_SIGNUP_FACEBOOK, COMMON_REGISTER_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import RegisterForm from './form';
import RegisterFormFb from './formFb';
import styles from './styles';

function mapStateToProps(state) {
  const getErrormsg = () => {
    if (!state.rider.appState.errormsg && !state.driver.appState.errormsg) {
      return '';
    } else if (!state.rider.appState.errormsg && state.driver.appState.errormsg) {
      return state.driver.appState.errormsg;
    }
    return state.rider.appState.errormsg;
  };

  return {
    isLoggedIn: state.rider.appState.isLoggedIn || state.driver.appState.isLoggedIn,
    registerError: state.rider.appState.registerError || state.driver.appState.registerError,
    socialLogin: state.entrypage.socialLogin,
    errormsg: getErrormsg(),
  };
}

class Register extends Component {
  static propTypes = {
    errormsg: PropTypes.string,
    isFetching: PropTypes.bool,
    replaceRoute: PropTypes.func,
    cleanRegisterError: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      registerError: false,
      FirstNameChange: '',
      LastNameChange: '',
      EmailChange: '',
      MobileNumberChange: '',
      PasswordChange: '',
      socialLogin: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.registerError) {
      this.setState({ registerError: true });
    }
    if (nextProps.socialLogin.email !== null) {
      this.setState({ socialLogin: nextProps.socialLogin });
    }

    this.props.cleanRegisterError();
  }

  callGraphApi(data) {
    const infoRequestParams = {
      fields: {
        string: 'email, first_name, last_name',
      },
    };
    const infoRequestConfig = {
      httpMethod: 'GET',
      version: 'v2.8',
      parameters: infoRequestParams,
      accessToken: data.accessToken.toString(),
    };
    const infoRequest = new GraphRequest('/me', infoRequestConfig, this._responseInfoCallback.bind(this));
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  requestFbSignup() {
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then((result) => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          let permissionsFromFb = '';
          for (let i = 0; i < result.grantedPermissions.length; i++) {
            if (i === result.grantedPermissions.length - 1) {
              permissionsFromFb += result.grantedPermissions[i];
            } else {
              permissionsFromFb = `${permissionsFromFb + result.grantedPermissions[i]}, `;
            }
          }
          AccessToken.getCurrentAccessToken()
            .then((data) => {
              if (data.accessToken) {
                this.callGraphApi(data);
              } else {
                alert('access token is null');
                this.setState({ show: true, disableLoginButton: false });
              }
            })
            .catch((error) => {
              console.log(error, ' :error in Fetching response from Graph API');
              Alert.alert('error after');
              this.setState({ show: true, disableLoginButton: false });
            });
        }
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  }

  _responseInfoCallback(error, result) {
    if (error) {
      console.log('Error fetching data: ', error);
    } else {
      console.log('the results is', result);
      this.props.socailSignupSuccess(result);
    }
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        <StatusBar barStyle='default' />
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.props.replaceRoute('')}>
            <Icon name='md-arrow-back' style={{ fontSize: 28, marginLeft: 5 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{COMMON_REGISTER_TITLE}</Title>
        </Header> */}

        <Header style={{ backgroundColor: '#e80000' }}>
          <Left>
            <Button onPress={() => this.props.replaceRoute()} transparent>
              <Icon name="arrow-back" style={{ color: '#FFF' }} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: '#FFF' }}>{COMMON_REGISTER_TITLE}</Title>
          </Body>
          <Right />
        </Header>

        <Content style={{ padding: 10 }}>
          <KeyboardAwareScrollView>
            <View style={{ padding: 10 }}>
              {Platform.OS !== 'ios' ?
                <View>
                  <Grid>
                    <Col style={{ padding: 10 }}>
                      <Button onPress={() => this.requestFbSignup()} block style={{ borderRadius: 0, backgroundColor: '#3B579D' }}>
                        <Text style={{ color: '#fff' }}>{COMMON_REGISTER_SIGNUP_FACEBOOK}</Text>
                      </Button>
                    </Col>
                  </Grid>

                  <Text style={styles.orText}>{COMMON_REGISTER_OR}</Text>
                </View> : null}

              <RegisterForm navigator={this.props.navigator} isFetching={this.props.isFetching} />


              {this.state.registerError && <Text style={{ color: 'red' }}>{this.props.errormsg}</Text>}
            </View>
          </KeyboardAwareScrollView>
        </Content>
      </Container >
    );
  }
}

function bindActions(dispatch) {
  return {
    replaceRoute: () => dispatch(replaceRoute()),
    socailSignupSuccess: (route) => dispatch(socailSignupSuccess(route)),
    cleanRegisterError: () => dispatch(cleanRegisterError()),
    registerAsync: (userCredentials) => dispatch(registerAsync(userCredentials, route)),
    registerAsyncFb: (userObj) => dispatch(registerAsyncFb(userObj)),
  };
}

export default connect(mapStateToProps, bindActions)(Register);
