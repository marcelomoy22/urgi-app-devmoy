import { Button, Header, Icon, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Modal, Platform, TextInput, View } from 'react-native';
import { connect } from 'react-redux';

import { logOutUserAsync } from '../../../actions/common/signin';
import { showOdometerInput, updateUnitOdometer } from '../../../actions/driver/unitOdometerInput';
import { ALERT_LOGOUT_MSG, ALERT_LOGOUT_TITLE, DRIVER_HOME_ODOMETER_PLACEHOLDER, DRIVER_HOME_ODOMETER_TITLE, NO, OK, YES } from '../../../textStrings';
import { isIphoneXorAbove } from '../../common/headerHelper';
import Spinner from '../../loaders/Spinner';
import styles from './style';

function mapStateToProps(state) {
  return {
    carDetails: state.driver.user.carDetails ? state.driver.user.carDetails : null,
    jwtAccessToken: state.driver.appState.jwtAccessToken,
    processing: state.driver.appState.loadSpinner,
    showModal: state.driver.unitOdometerInput.show,
    init: state.driver.unitOdometerInput.init,
  };
}

class unitOdometerInput extends Component {
  static propTypes = {
    logOutUserAsync: PropTypes.func,
    jwtAccessToken: PropTypes.string,
    processing: PropTypes.bool,
    updateUnitOdometer: PropTypes.func,
    carDetails: PropTypes.string,
    init: PropTypes.bool,
    showModal: PropTypes.bool,
    showOdometerInput: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      odometerInput: '',
    };
  }

  odometerInput() {
    const data = {
      jwtAccessToken: this.props.jwtAccessToken,
      odometerInput: this.state.odometerInput,
      unitId: this.props.carDetails._id,
      init: this.props.init,
    };

    this.props.updateUnitOdometer(data);
  }

  handleLogOut(title, msg) {
    if (this.props.init) {
      Alert.alert(
        title,
        msg,
        [
          {
            text: YES,
            onPress: () => {
              this.props.logOutUserAsync(this.props.jwtAccessToken, 'driver');
            },
          },
          {
            text: NO,
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
    } else {
      this.props.showOdometerInput(false);
    }
  }

  render() {
    return (
      <Modal animationType={'none'} transparent visible={this.props.showModal}>
        <View style={styles.modalBackground}>
          <View style={styles.putModalInPlace}>
            <View style={styles.modalValidationContainer}>
              {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
                <Button transparent onPress={() => this.handleLogOut(ALERT_LOGOUT_TITLE, ALERT_LOGOUT_MSG)}>
                  <Icon name='ios-close' style={styles.modalX} />
                </Button>
                <Title style={styles.modalValidationTitle}>{DRIVER_HOME_ODOMETER_TITLE}</Title>
              </Header> */}

              <Header style={{width: 340}}>
                <Left>
                  <Button transparent onPress={() => this.handleLogOut(ALERT_LOGOUT_TITLE, ALERT_LOGOUT_MSG)}>
                    <Icon name="ios-close" />
                  </Button>
                </Left>
                <Body>
                  <Title>{DRIVER_HOME_ODOMETER_TITLE}</Title>
                </Body>
                <Right />
              </Header>

              <View style={{ paddingTop: 100 }}>
                <TextInput
                  style={styles.modalValidationInput}
                  name={'phoneValidation'}
                  value={this.state.odometerInput}
                  placeholder={DRIVER_HOME_ODOMETER_PLACEHOLDER}
                  keyboardType='numeric'
                  onChangeText={(text) => {
                    this.setState({ odometerInput: text });
                  }}
                />

                <View style={styles.modalValidationButton}>
                  <Button block style={{ backgroundColor: '#19192B' }} disabled={this.props.processing} onPress={() => this.odometerInput()}>
                    {this.props.processing ? <Spinner /> : <Text style={{ color: '#fff', fontWeight: '700', marginHorizontal: 30 }}>{OK}</Text>}
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

function bindActions(dispatch) {
  return {
    logOutUserAsync: (jwtAccessToken, userType) => dispatch(logOutUserAsync(jwtAccessToken, userType)),
    updateUnitOdometer: (data) => dispatch(updateUnitOdometer(data)),
    showOdometerInput: (data) => dispatch(showOdometerInput(data)),
  };
}

export default connect(mapStateToProps, bindActions)(unitOdometerInput);
