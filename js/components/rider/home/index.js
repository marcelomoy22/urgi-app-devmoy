import { Button, Card, Header, Icon, Input, InputGroup, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Animated, Dimensions, Easing, Modal, Platform, TextInput, TouchableOpacity, View } from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';

import { clearGooglePlacesBar, startSearch } from '../../../actions/autoComplete';
import { clearMessages } from '../../../actions/common/chat';
import { phoneValidation, resendValidationCode } from '../../../actions/common/phoneValidation';
import { logOutUserAsync } from '../../../actions/common/signin';
import { openDrawer } from '../../../actions/drawer';
import { fetchUserCurrentLocationAsync, selectTaxiType, zoneIsCovered } from '../../../actions/rider/home';
import { pushNewRoute } from '../../../actions/route';
import { fetchNextTripsAsync } from '../../../actions/rider/history';

import {
  ALERT_LOGOUT_MSG,
  ALERT_LOGOUT_TITLE,
  NO,
  RIDER_HOME_PICKUP_BTN,
  RIDER_HOME_PLACEHOLDER_SEARCHBAR,
  RIDER_HOME_TITLE,
  RIDER_HOME_VALIDATION_MODAL_RESEND_BTN,
  RIDER_HOME_VALIDATION_MODAL_SEND_BTN,
  RIDER_HOME_VALIDATION_MODAL_SEND_PLACEHOLDER,
  RIDER_HOME_VALIDATION_MODAL_TITLE,
  RIDER_HOME_VALIDATION_MODAL_VALIDATE_BTN,
  RIDER_HOME_VALIDATION_MODAL_VALIDATE_PLACEHOLDER,
  YES,
} from '../../../textStrings';
import AutoComplete from '../../autocomplete';
import { isIphoneXorAbove } from '../../common/headerHelper';
import Spinner from '../../loaders/Spinner';
import styles from './styles';

const { width, height } = Dimensions.get('window');
const SLIDE_CONFIG = width / 47; // slide adjusted to screen size
const SPRING_CONFIG = { tension: 2, friction: 3 }; // Soft spring
const aspectRatio = width / height;

function mapStateToProps(state) {
  return {
    tripNumers: state.rider.history.trips,
    fetchNextTripsAsync: PropTypes.func,
    jwtAccessToken: state.rider.appState.jwtAccessToken,
    rider: state.rider.user,
    pickupLocation: {
      latitude: state.rider.tripRequest.srcLoc[0],
      longitude: state.rider.tripRequest.srcLoc[1],
    },
    region: {
      latitude: state.rider.user.gpsLoc[0],
      longitude: state.rider.user.gpsLoc[1],
      latitudeDelta: state.rider.user.latitudeDelta,
      longitudeDelta: state.rider.user.latitudeDelta * aspectRatio,
    },
    taxiTypes: state.rider.taxi.type ? state.rider.taxi.type : [],
    selectedTaxi: state.rider.taxi.selected,
    processing: state.rider.appState.loadSpinner,
  };
}

class Home extends Component {
  static propTypes = {
    tripNumers: PropTypes.array,
    openDrawer: PropTypes.func,
    rider: PropTypes.object,
    taxiTypes: PropTypes.array,
    selectedTaxi: PropTypes.object,
    region: PropTypes.object,
    selectTaxiType: PropTypes.func,
    jwtAccessToken: PropTypes.string,
    startSearch: PropTypes.func,
    clearGooglePlacesBar: PropTypes.func,
    zoneIsCovered: PropTypes.func,
    pickupLocation: PropTypes.object,
    phoneValidation: PropTypes.func,
    resendValidationCode: PropTypes.func,
    processing: PropTypes.bool,
    logOutUserAsync: PropTypes.func,
    pushNewRoute: PropTypes.func,
    clearMessages: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalCase: 1,
      searchInputText: '',
      phoneValidationInputText: '',
      phoneConfirmationInputText: '',
      region: `${props.region.latitude}` + ',' + `${props.region.longitude}`,
    };

    // clear search bar
    this.props.clearGooglePlacesBar();

    // slide buttons on screen
    this.slideBtnsValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.screenChangeAnimations(SLIDE_CONFIG);

    this.props.clearMessages();

    if (this.props.selectedTaxi && this.props.selectedTaxi._id === null) {
      // select first option if selected is undefined
      this.selectTaxi(this.props.taxiTypes[0]);
    }
    const jwtAccessToken = this.props.jwtAccessToken;
    this.props.fetchNextTripsAsync(jwtAccessToken);
  }

  componentWillReceiveProps(props){
    if(props.tripNumers && props.tripNumers.length > 0){
      this.tex = props.tripNumers.length+" "
    }else if(props.tripNumers.length <= 0){
      this.tex = undefined
    }
  }
   
  returnToHistory(route){
    this.props.pushNewRoute(route);
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

  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }

  setLocationClicked() {
    const data = {
      coordinates: [this.props.pickupLocation.latitude, this.props.pickupLocation.longitude],
    };
    this.props.zoneIsCovered(data);
  }

  selectTaxi(taxi) {
    this.props.selectTaxiType(taxi);
  }

  modalSelect(op) {
    switch (op) {
      case 1:
        return (
          <View style={{ paddingTop: 100 }}>
            <TextInput
              style={styles.modalValidationInput}
              name={'phoneValidation'}
              value={this.state.phoneValidationInputText}
              placeholder={RIDER_HOME_VALIDATION_MODAL_VALIDATE_PLACEHOLDER}
              keyboardType='numeric'
              onChangeText={(text) => {
                this.setState({ phoneValidationInputText: text });
              }}
            />
            <View style={styles.modalValidationButton}>
              <Button
                block
                style={{ backgroundColor: '#19192B' }}
                disabled={this.props.processing}
                onPress={() => {
                  this.props.phoneValidation(this.state.phoneValidationInputText);
                }}
              >
                {this.props.processing ? <Spinner /> : <Text style={{ color: '#fff', fontWeight: '700' }}>{RIDER_HOME_VALIDATION_MODAL_VALIDATE_BTN}</Text>}
              </Button>
            </View>
            <View>
              <Button
                transparent
                disabled={this.props.processing}
                onPress={() => {
                  this.setState({ modalCase: 2, phoneValidationInputText: '' });
                }}
              >
                <Text>{RIDER_HOME_VALIDATION_MODAL_RESEND_BTN}</Text>
              </Button>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={{ paddingTop: 100 }}>
            <TextInput
              style={styles.modalConfirmationInput}
              name={'phoneConfirmation'}
              value={this.state.phoneConfirmationInputText}
              placeholder={RIDER_HOME_VALIDATION_MODAL_SEND_PLACEHOLDER}
              keyboardType='numeric'
              onChangeText={(text) => {
                this.setState({ phoneConfirmationInputText: text });
              }}
            />

            <View style={styles.modalValidationButton}>
              <Button
                block
                style={{ backgroundColor: '#19192B' }}
                disabled={this.state.phoneConfirmationInputText.length < 10}
                onPress={() => {
                  this.props.resendValidationCode(this.state.phoneConfirmationInputText);
                  this.setState({ modalCase: 1, phoneConfirmationInputText: '' });
                }}
              >
                {this.props.processing ? <Spinner /> : <Text style={{ color: '#fff', fontWeight: '700' }}>{RIDER_HOME_VALIDATION_MODAL_SEND_BTN}</Text>}
              </Button>
            </View>
          </View>
        );
    }
    return null;
  }

  focusSearch = () => {
    this.refs.searchInput._root.focus();
  };

  handleLogOut(title, msg) {
    Alert.alert(
      title,
      msg,
      [
        {
          text: YES,
          onPress: () => {
            this.props.logOutUserAsync(this.props.jwtAccessToken, 'rider');
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

    return (
      <View pointerEvents='box-none' style={{ flex: 1 }}>
        {!this.props.rider.anonymous ? (
          <Animated.View style={{ marginLeft: slideToRight }}>
            <View style={styles.quickOptionsRightContainer}>
              <View style={{ padding: 10 }}>
                <TouchableOpacity
                  style={styles.quickOptionsBtns}
                  onPress={() => {
                    this.pushNewRoute('selectLocation');
                  }}
                >
                  <Icon name={'ios-pin'} style={styles.icons} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ) : null}

        <View style={styles.slideSelector}>
          <Grid>
            {this.props.taxiTypes.length > 0
              ? this.props.taxiTypes.map((taxi) => (
                  <TouchableOpacity style={[styles.taxiTypeContainer, { flex: 1 }]} onPress={() => this.selectTaxi(taxi)}>
                    <Row>
                      <Text style={{ color: '#555' }}>{taxi.name}</Text>
                    </Row>
                    <Row style={this.props.selectedTaxi && this.props.selectedTaxi._id === taxi._id ? styles.taxiType : null}>
                      <View style={this.props.selectedTaxi && this.props.selectedTaxi._id === taxi._id ? styles.taxi : null}>
                        <Icon
                          name={this.props.selectedTaxi && this.props.selectedTaxi._id === taxi._id ? taxi.icon : 'ios-radio-button-off'}
                          style={this.props.selectedTaxi && this.props.selectedTaxi._id === taxi._id ? styles.selectedTaxi : styles.taxiIcon}
                        />
                      </View>
                    </Row>
                  </TouchableOpacity>
                ))
              : null}
          </Grid>
        </View>

        <View style={styles.headerContainer} pointerEvents='box-none'>
          {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
            <Button transparent onPress={this.props.openDrawer}>
              <Icon name='ios-menu' style={{ color: '#000' }} />
            </Button>
            <Title style={{ color: '#000' }}>{RIDER_HOME_TITLE}</Title>
          </Header> */}

          <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button transparent onPress={this.props.openDrawer}>
                <Icon name="menu" style={{color: '#FFF'}}/>
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{RIDER_HOME_TITLE}</Title>
            </Body>
            <Right />
            { this.tex
              ? 
                <Button transparent onPress={this.returnToHistory.bind(this,'nextTrips')}>
                  <Text style={{ color: '#2C2C2C' }}>{this.tex}
                    <Icon name={'ios-alarm'} style={{fontSize: 20}}/>
                  </Text>
                </Button>
              : <Col></Col>
              }
          </Header>

          <Card style={Platform.OS === 'ios' ? styles.iosSearchBar : styles.aSearchBar}>
            <Grid>
              {/* <Col style={{ padding: 15, width: width / 3 }}>
                <TouchableOpacity onPress={()=>this.focusSearch()}>
                  <Icon name="ios-search" style={{ fontSize: 20, color: '#797979' }} />
                </TouchableOpacity>
              </Col>*/}
              <Col style={{ alignItems: 'center' }}>
                <Row style={Platform.OS === 'ios' ? { padding: 5 } : { padding: 3 }}>{/* <Text style={styles.SearchPickText}>PICKUP LOCATION</Text>*/}</Row>
                <Row style={Platform.OS === 'ios' ? { top: -15 } : { top: -15, alignItems: 'center', alignSelf: 'center' }}>
                  <InputGroup borderType='regular' style={[Platform.OS === 'android' ? { height: 30 } : {}, { flex: 1, alignItems: 'center', borderWidth: 0 }]}>
                    <Input
                      placeholder={RIDER_HOME_PLACEHOLDER_SEARCHBAR}
                      placeholderTextColor='#797979'
                      style={{ textAlign: 'center' }}
                      value={this.state.searchInputText}
                      onChangeText={(searchInputText) => {
                        this.setState({ searchInputText });
                        this.props.startSearch(this.state.region, searchInputText);
                      }}
                      onSubmitEditing={(event) => this.props.startSearch(this.state.region, this.state.searchInputText)}
                    />
                  </InputGroup>
                </Row>
              </Col>
            </Grid>
          </Card>
          <AutoComplete />
        </View>
        <View style={styles.pinContainer}>
          <Button rounded onPress={() => this.setLocationClicked()} iconRight style={styles.pinButton}>
            <Text>{RIDER_HOME_PICKUP_BTN}</Text>
            <Icon name='ios-arrow-forward' style={{ fontSize: 28 }} />
          </Button>
          <View style={styles.pin} />
        </View>
        {!this.props.rider.anonymous ? (
          <Modal animationType={'slide'} transparent visible={this.props.rider.verified === 0}>
            <View style={styles.modalBackground}>
              <View style={styles.putModalInPlace}>
                <View style={styles.modalValidationContainer}>
                  <Header style={styles.modalValidationHeader}>
                    <Button transparent onPress={() => this.handleLogOut(ALERT_LOGOUT_TITLE, ALERT_LOGOUT_MSG)}>
                      <Icon name='ios-close' style={styles.modalX} />
                    </Button>
                    <Title style={styles.modalValidationTitle}>{RIDER_HOME_VALIDATION_MODAL_TITLE}</Title>
                  </Header>
                  {this.modalSelect(this.state.modalCase)}
                </View>
              </View>
            </View>
          </Modal>
        ) : null}
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    fetchUserCurrentLocationAsync: () => dispatch(fetchUserCurrentLocationAsync()),
    selectTaxiType: (type) => dispatch(selectTaxiType(type)),
    startSearch: (region, input) => dispatch(startSearch(region, input)),
    clearGooglePlacesBar: () => dispatch(clearGooglePlacesBar()),
    zoneIsCovered: (data) => dispatch(zoneIsCovered(data)),
    phoneValidation: (code) => dispatch(phoneValidation(code)),
    resendValidationCode: (phoneNo) => dispatch(resendValidationCode(phoneNo)),
    logOutUserAsync: (jwtAccessToken, userType) => dispatch(logOutUserAsync(jwtAccessToken, userType)),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    clearMessages: () => dispatch(clearMessages()),
    fetchNextTripsAsync: jwtAccessToken => dispatch(fetchNextTripsAsync(jwtAccessToken)),
  };
}

export default connect(mapStateToProps, bindActions)(Home);
