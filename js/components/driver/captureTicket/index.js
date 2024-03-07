import { Button, Container, Content, Header, Icon, Title, Left, Body, Right } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Platform, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';

import { clearGooglePlacesBar, startSearch } from '../../../actions/autoComplete';
import {deleteCamData, setImagePath} from '../../../actions/driver/camera';
import { completeTicketData, ticketAsync } from '../../../actions/driver/captureTicket';
import { tripStarted } from '../../../actions/driver/startRide';
import { askCameraPermissions } from '../../../actions/permissions';
import { popRoute, pushNewRoute } from '../../../actions/route';
import * as appStateSelector from '../../../reducers/driver/appState';
import { DRIVER_CAPTURETICKET_PERMISSION_DENIED_ALERT, COMMON_VIP_DATA_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import CTForm from './form';
import styles from './styles';

const Native = require('react-native');
const { Dimensions } = Native;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const location = {};

function mapStateToProps(state) {
  location.latitude = state.driver.user.gpsLoc[0];
  location.longitude = state.driver.user.gpsLoc[1];

  return {
    jwtAccessToken: state.driver.appState.jwtAccessToken,
    tripStarted: state.driver.appState.tripStarted,
    image: state.driver.camera.path,
    code: state.driver.camera.code,
    ticket: state.driver.captureTicket.data,
    isFetching: appStateSelector.isFetching(state),
    destAddress: state.autocomplete.address,
    destLoc: state.autocomplete.destLoc,
  };
}

class CaptureTicket extends Component {
  static propTypes = {
    popRoute: PropTypes.func,
    pushNewRoute: PropTypes.func,
    image: PropTypes.string,
    code: PropTypes.string,
    deleteCamData: PropTypes.func,
    ticket: PropTypes.object,
    tripStarted: PropTypes.func,
    isFetching: PropTypes.bool,
    destAddress: PropTypes.string,
    clearGooglePlacesBar: PropTypes.func,
    destLoc: PropTypes.object,
    setImagePath: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      location,
    };
  }

  goBack() {
    this.props.deleteCamData();
    this.props.popRoute();
    this.props.clearGooglePlacesBar();
  }

  navigateTo(value) {
    this.props.pushNewRoute(value);
  }

  async camBtn() {
    /*const permission = await askCameraPermissions();

    if (permission) {*/
      this.navigateTo('camera');
    /*} else {
      alert(DRIVER_CAPTURETICKET_PERMISSION_DENIED_ALERT);
    }*/
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.goBack()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{DRIVER_CAPTURETICKET_TITLE}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
          <Left>
            <Button onPress={() => this.goBack()} transparent>
              <Icon name="arrow-back" style={{color: '#FFF'}} />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#FFF'}}>{COMMON_VIP_DATA_TITLE}</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <KeyboardAwareScrollView>
            <Button style={styles.btnCam} onPress={() => this.camBtn()}>
              <Icon name='ios-camera' />
            </Button>
            <CTForm
              location={this.state.location}
              image={this.props.image}
              code={this.props.code}
              isFetching={this.props.isFetching}
              destAddress={this.props.destAddress}
              destLoc={this.props.destLoc}
              pendingTicket={this.props.ticket ? this.props.ticket : undefined}
              goBack={() => this.goBack()}
            />
            <View style={styles.image}>
              <Image style={{ width: deviceWidth - 80, height: deviceHeight - 400 }} source={{ uri: this.props.image }} />
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
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    ticketAsync: (ticketDetails) => dispatch(ticketAsync(ticketDetails)),
    deleteCamData: () => dispatch(deleteCamData()),
    tripStarted: (data) => dispatch(tripStarted(data)),
    startSearch: (region, input) => dispatch(startSearch(region, input)),
    clearGooglePlacesBar: () => dispatch(clearGooglePlacesBar()),
    completeTicketData: (ticketDetails) => dispatch(completeTicketData(ticketDetails))
  };
}

export default connect(mapStateToProps, bindActions)(CaptureTicket);
