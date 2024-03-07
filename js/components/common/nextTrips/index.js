import moment from 'moment-timezone';
import { Button, Card, CardItem, Container, Content, Header, Icon, Text, Thumbnail, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Image, Platform, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { fetchNextTripsAsync, fetchSendTripNow } from '../../../actions/rider/history';
import { popRoute } from '../../../actions/route';
import {
  COMMON_NEXTTRIPS_ALERT_MSG,
  COMMON_NEXTTRIPS_ASK_START_RIDE,
  COMMON_NEXTTRIPS_EMPTY,
  COMMON_NEXTTRIPS_START_RIDE,
  COMMON_NEXTTRIPS_TITLE,
  NO,
  YES,
} from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from './styles';

const mapImage = require('../../../../images/dummyMap.png');
const profileImage = require('../../../../images/Contacts/avatar-1.jpg');

function mapStateToProps(state) {
  return {
    jwtAccessToken: state.rider.appState.jwtAccessToken || state.driver.appState.jwtAccessToken,
    trips: (state.rider.history ? state.rider.history.trips : []) || (state.rider.history ? state.rider.history.trips : []),
    userType: state.rider.user.userType || state.driver.user.userType,
    loadSpinner: false,
  };
}

class History extends Component {
  static propTypes = {
    jwtAccessToken: PropTypes.string,
    trips: PropTypes.array,
    userType: PropTypes.string,
    fetchNextTripsAsync: PropTypes.func,
    fetchSendTripNow: PropTypes.func,
    popRoute: PropTypes.func,
    loadSpinner: PropTypes.bool,
  };

  async componentDidMount() {
    const jwtAccessToken = this.props.jwtAccessToken;
    await this.props.fetchNextTripsAsync(jwtAccessToken);
  }

  send(trip) {
    Alert.alert(
      COMMON_NEXTTRIPS_START_RIDE,
      COMMON_NEXTTRIPS_ASK_START_RIDE,
      [
        {
          text: YES,
          onPress: () => {
            if (trip === this.props.trips[0]) {
              this.props.fetchSendTripNow(this.props.jwtAccessToken, trip);
              this.props.popRoute();
            } else {
              alert(COMMON_NEXTTRIPS_ALERT_MSG);
            }
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

  popRoute() {
    this.props.popRoute();
  }
  formatDate(bookingTime) {
    // eslint-disable-line class-methods-use-this
    return moment(bookingTime).tz('America/Mexico_City').format(' D/M/YY [at] h:mm a');
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{COMMON_NEXTTRIPS_TITLE}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
          <Left>
            <Button onPress={() => this.popRoute()} transparent>
              <Icon name="arrow-back" style={{color: '#FFF'}} />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#FFF'}}>{COMMON_NEXTTRIPS_TITLE}</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          {!this.props.trips || this.props.trips.length === 0 ? (
            <Text>{COMMON_NEXTTRIPS_EMPTY}</Text>
          ) : (
            this.props.trips.map((trip, index) => (
              <TouchableOpacity key={index} disabled={this.props.userType === 'driver' ? false : true} onPress={() => this.send(trip)}>
                <View style={{ paddingBottom: 10 }}>
                  <Card style={{ position: 'relative' }}>
                    <View style={styles.mapContainer}>
                      <Image source={mapImage} style={{ width: '110%', marginLeft: -20}} />
                    </View>
                    <View style={styles.detailContainer}>
                      <Thumbnail square source={profileImage} size={40} style={styles.driverImage} />
                      <Text>
                        {this.formatDate(trip.requestTime)}{' '}
                        {!trip.cashBox ? (
                          <Text style={styles.cashText}>
                            <Text style={{ color: 'green' }}>${this.props.userType === 'driver' ? trip.tripAmtDriver : trip.tripAmt}</Text>
                          </Text>
                        ) : (
                          <Text style={styles.cashText}>
                            <Text style={{ color: 'green' }}>${this.props.userType === 'driver' ? trip.tripAmtDriver : trip.tripAmt}</Text>
                          </Text>
                        )}
                      </Text>
                      <Text note>
                        {trip.unit ? trip.unit.name : trip.unitName} - {trip.folio} {'\n'}
                        {trip.pickUpAddress}
                      </Text>
                    </View>
                    <View style={styles.dummyView} />
                  </Card>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    fetchNextTripsAsync: (jwtAccessToken) => dispatch(fetchNextTripsAsync(jwtAccessToken)),
    fetchSendTripNow: (jwtAccessToken, tripObject) => dispatch(fetchSendTripNow(jwtAccessToken, tripObject)),
  };
}

export default connect(mapStateToProps, bindActions)(History);
