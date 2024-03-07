import { Button, Content, Text } from 'native-base';
import React, { Component } from 'react';
import { Image, Platform, StatusBar, View } from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';

import { COMMON_LOGIN_MAIN_TITTLE, COMMON_LOGIN_REGISTER_BTN, COMMON_LOGIN_SIGNIN_BTN } from '../../../textStrings';
import styles from './styles';

const logoImg = require('../../../../images/privauto-logo.png');

class Login extends Component {

  gotoLogin() {
    const navigator = this.props.navigator;
    navigator.replace({ id: 'signIn' });
  }

  gotoRegister() {
    const navigator = this.props.navigator;
    navigator.replace({ id: 'register' });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle='light-content' backgroundColor='#000' />
        <Content style={{ backgroundColor: '#000' }}>
          <View style={Platform.OS === 'ios' ? styles.iosLogoContainer : styles.aLogoContainer}>
            <Image source={logoImg} style={styles.logoImage} />
            <Text style={styles.logoText}>{COMMON_LOGIN_MAIN_TITTLE}</Text>
            <Grid>
              <Col style={{ padding: 10 }}>
                <Button onPress={() => this.gotoLogin()} block style={styles.registerBtn}>
                  <Text style={{ fontWeight: '600', color: '#fff' }}>{COMMON_LOGIN_SIGNIN_BTN}</Text>
                </Button>
              </Col>
              <Col style={{ padding: 10 }}>
                <Button onPress={() => this.gotoRegister()} block style={styles.registerBtn}>
                  <Text style={{ fontWeight: '600', color: '#fff' }}>{COMMON_LOGIN_REGISTER_BTN}</Text>
                </Button>
              </Col>
            </Grid>
          </View>
        </Content>
      </View>
    );
  }
}

function mapStateToProps() {
  return {};
}

function bindActions() {
  return {};
}

export default connect(mapStateToProps, bindActions)(Login);
