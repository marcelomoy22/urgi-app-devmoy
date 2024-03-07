import { Button, Col, Container, Content, Grid, Header, Icon, Input, InputGroup, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';

import { passwordRecovery } from '../../../actions/common/entrypage';
import { popRoute } from '../../../actions/route';
import { COMMON_SIGNIN_PASSWORD_RECOVERY_TITLE, COMMON_SIGNIN_RECOVER_LABEL } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from './styles';

function mapStateToProps(state) {
  return {
    pageStatus: state.rider.appState.pageStatus,
  };
}

class PasswordRecovery extends Component {
  static propTypes = {
    popRoute: PropTypes.func,
    passwordRecovery: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      email: '',
    };
  }

  passwordRecover(email) {
    if (email.length > 0) {
      this.props.passwordRecovery({ email });
      setTimeout(() => this.props.popRoute(), 500);
    } else alert('favor de agregar algún correo');
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        <StatusBar barStyle='default' />
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.props.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28, marginLeft: 5 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{COMMON_SIGNIN_PASSWORD_RECOVERY_TITLE}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
          <Left>
            <Button onPress={() => this.props.popRoute()} transparent>
              <Icon name="arrow-back" style={{color: '#FFF'}} />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#FFF'}}>{COMMON_SIGNIN_PASSWORD_RECOVERY_TITLE}</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <KeyboardAwareScrollView>
            <View style={styles.passwordResetFormContainer}>
              <InputGroup>
                <Input type='email' autoCapitalize='none' placeholder='Email' onChangeText={(value) => this.setState({ email: value })} />
              </InputGroup>
              <Grid>
                <Col style={{ padding: 10 }}>
                  <Button onPress={() => this.passwordRecover(this.state.email)} block style={{ borderRadius: 0, backgroundColor: '#19192B' }}>
                    <Text style={{ color: '#fff' }}>{COMMON_SIGNIN_RECOVER_LABEL}</Text>
                  </Button>
                </Col>
              </Grid>
            </View>
          </KeyboardAwareScrollView>
        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    passwordRecovery: (email) => dispatch(passwordRecovery(email)),
  };
}

export default connect(mapStateToProps, bindActions)(PasswordRecovery);
