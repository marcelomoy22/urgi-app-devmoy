import { Button, Container, Content, Header, Icon, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';

import { clearGooglePlacesBar, startSearch } from '../../../../actions/autoComplete';
import { changePageStatus } from '../../../../actions/rider/home';
import { popRoute } from '../../../../actions/route';
import * as appStateSelector from '../../../../reducers/driver/appState';
import { RIDER_ADD_LOCATION_TITLE } from '../../../../textStrings';
import theme from '../../../../themes/base-theme';
import { isIphoneXorAbove } from '../../../common/headerHelper';
import AddLocationForm from './form';
import styles from './styles';

function mapStateToProps(state) {
  return {
    region: `${state.driver.user.gpsLoc[0]}` + ',' + `${state.driver.user.gpsLoc[1]}`,
    jwtAccessToken: state.driver.appState.jwtAccessToken,
    tripStarted: state.driver.appState.tripStarted,
    isFetching: appStateSelector.isFetching(state),
    address: state.autocomplete.address,
    location: state.autocomplete.destLoc,
    pageStatus: state.rider.appState.pageStatus,
  };
}

class AddLocation extends Component {
  static propTypes = {
    popRoute: PropTypes.func,
    tripStarted: PropTypes.func,
    isFetching: PropTypes.bool,
    address: PropTypes.string,
    clearGooglePlacesBar: PropTypes.func,
    location: PropTypes.object,
    region: PropTypes.string,
    pageStatus: PropTypes.string,
    changePageStatus: PropTypes.func,
  };

  componentDidMount() {
    if (this.props.pageStatus === 'home') this.props.changePageStatus('addLocH');
    // check if coming from home
    else this.props.changePageStatus('addLocC');
  }

  componentWillUnmount() {
    if (this.props.pageStatus === 'addLocH') this.props.changePageStatus('home');
    // return pageStatus to home if it came from home
    else this.props.changePageStatus('confirmRide'); // return pageStatus to confirmRide if it came from comfirmRide
  }

  goBack() {
    this.props.popRoute();
    this.props.clearGooglePlacesBar();
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header
          style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader ? styles.iosHeader : styles.aHeader}
        >
          <Button transparent onPress={() => this.goBack()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{RIDER_ADD_LOCATION_TITLE}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
          <Left>
            <Button onPress={() => this.goBack()} transparent>
              <Icon name="arrow-back" style={{color: '#FFF'}} />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#FFF'}}>{RIDER_ADD_LOCATION_TITLE}</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <KeyboardAwareScrollView>
            <AddLocationForm
              region={this.props.region}
              isFetching={this.props.isFetching}
              address={this.props.address}
              location={this.props.location}
              goBack={() => this.goBack()}
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
    startSearch: (region, input) => dispatch(startSearch(region, input)),
    clearGooglePlacesBar: () => dispatch(clearGooglePlacesBar()),
    changePageStatus: (status) => dispatch(changePageStatus(status)),
  };
}

export default connect(mapStateToProps, bindActions)(AddLocation);
