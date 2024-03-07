import moment from 'moment-timezone';
import { Button, Card, Col, Container, Content, Grid, Header, Icon, Text, Thumbnail, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { getDriverPaysheet, setLastUpdatedTime } from '../../../actions/driver/paysheets';
import { clearTrips, fetchTripHistoryAsync, setSelectedTrip } from '../../../actions/rider/history';
import { popRoute, pushNewRoute } from '../../../actions/route';
import {
  COMMON_HISTORY_BONUS,
  COMMON_HISTORY_BOX,
  COMMON_HISTORY_COMMISSION_AMOUNT,
  COMMON_HISTORY_COMMISSION_PERCENTAGE,
  COMMON_HISTORY_CON,
  COMMON_HISTORY_DEPARTMENT,
  COMMON_HISTORY_DUPLICATES,
  COMMON_HISTORY_EMPTY,
  COMMON_HISTORY_FOLIO,
  COMMON_HISTORY_INCIDENTS_NEG,
  COMMON_HISTORY_INCIDENTS_POS,
  COMMON_HISTORY_PAY_OFF,
  COMMON_HISTORY_PAYSHEET_TYPE,
  COMMON_HISTORY_PAYSHEETS_EMPTY,
  COMMON_HISTORY_PAYSHEETS_UPDATE_ERR,
  COMMON_HISTORY_SALARY,
  COMMON_HISTORY_TITLE,
  COMMON_HISTORY_TOTAL,
  COMMON_HISTORY_TOTAL_AMOUNT,
  COMMON_HISTORY_TOTAL_RIDES,
  COMMON_HISTORY_UPDATE_LABEL,
} from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import Spinner from '../../loaders/Spinner';
import styles from './styles';

const mapImage = require('../../../../images/dummyMap.png');
const profileImage = require('../../../../images/Contacts/avatar-1.jpg');

function mapStateToProps(state) {
  return {
    jwtAccessToken: state.rider.appState.jwtAccessToken || state.driver.appState.jwtAccessToken,
    driverId: state.driver.user._id,
    paysheets: state.driver.paysheets.data,
    lastUpdatedTime: state.driver.paysheets.updateTime,
    trips: (state.rider.history ? state.rider.history.trips : []) || (state.rider.history ? state.rider.history.trips : []),
    isFetching: state.rider.appState.loadSpinner,
  };
}

class History extends Component {
  static propTypes = {
    jwtAccessToken: PropTypes.string,
    driverId: PropTypes.string,
    paysheets: PropTypes.object,
    trips: PropTypes.array,
    fetchTripHistoryAsync: PropTypes.func,
    popRoute: PropTypes.func,
    isFetching: PropTypes.bool,
    getDriverPaysheet: PropTypes.func,
    pushNewRoute: PropTypes.func,
    setLastUpdatedTime: PropTypes.func,
    lastUpdatedTime: PropTypes.string,
    clearTrips: PropTypes.func,
    setSelectedTrip: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.jwtAccessToken = props.jwtAccessToken;
    this.limit = 5;

    this.state = {
      paysheetTable: undefined,
      tripDetails: undefined,
    };
  }

  async componentWillMount() {
    // get trip history
    const data = {
      jwtAccessToken: this.jwtAccessToken,
      limit: this.limit,
    };

    await this.props.fetchTripHistoryAsync(data);
    if (!this.props.driverId) {
      await this.setPaySheets(this.props.paysheets);
    }
  }

  componentDidUnMount() {
    this.props.clearTrips();
  }

  navigateTo(route) {
    this.props.pushNewRoute(route);
  }

  setTripData(trip) {
    this.props.setSelectedTrip(trip);
    this.navigateTo('tripDetails');
  }

  details(trip) {
    this.setState({ trip });
  }

  componentWillReceiveProps(props) {
    this.setPaySheets(props.paysheets);
  }

  updateInfoButton() {
    const blockTime = moment(this.props.lastUpdatedTime).add(10, 'minutes');
    // alert(moment().format("hh:mm") +" > "+ blockTime.format("hh:mm"))
    if (moment().isAfter(blockTime) || !this.props.lastUpdatedTime) {
      this.props.setLastUpdatedTime(moment());
      this.props.getDriverPaysheet(this.jwtAccessToken, this.props.driverId);
    } else alert(COMMON_HISTORY_PAYSHEETS_UPDATE_ERR);

    // if (this.props.lastUpdatedTime > halfAnHourAgo || !this.props.lastUpdatedTime) {
    //   this.props.setLastUpdatedTime(moment().format('h:mm:ss a'));
    //   this.props.getDriverPaysheet(this.jwtAccessToken, this.props.driverId);
    // } else alert(COMMON_HISTORY_PAYSHEETS_UPDATE_ERR);
  }

  popRoute() {
    this.props.popRoute();
  }

  formatDate(bookingTime) {
    // eslint-disable-line class-methods-use-this
    return moment(bookingTime).tz('America/Mexico_City').format(' D/M/YY [at] h:mm a');
  }

  setPaySheets(paysheets) {
    this.dataArray = [
      { title: COMMON_HISTORY_DEPARTMENT, data: paysheets.Department },
      { title: COMMON_HISTORY_PAYSHEET_TYPE, data: paysheets.TypePaysheets },
      { title: COMMON_HISTORY_TOTAL_RIDES, data: paysheets.NumberOfTrips },
      { title: COMMON_HISTORY_TOTAL_AMOUNT, data: `$${paysheets.AmoutOfTrips}` },
      { title: COMMON_HISTORY_BOX, data: `$${paysheets.revenuemin} a $${paysheets.revenuemax}` },
      { title: COMMON_HISTORY_COMMISSION_AMOUNT, data: `$${paysheets.amount}` },
      { title: COMMON_HISTORY_COMMISSION_PERCENTAGE, data: `%${paysheets.commission}` },
      { title: COMMON_HISTORY_BONUS, data: `$${paysheets.bonuses}` },
      { title: `(${paysheets.incidenciasIdsPos}) ${COMMON_HISTORY_INCIDENTS_POS}`, data: `+$${paysheets.incidenciasAmountPos}` },
      { title: `(${paysheets.incidenciasIdsNeg}) ${COMMON_HISTORY_INCIDENTS_NEG}`, data: `-$${paysheets.incidenciasAmountNeg}` },
      { title: `(${paysheets.conveniosIds ? paysheets.conveniosIds.length : 0}) ${COMMON_HISTORY_CON}`, data: `-$${paysheets.conveniosAmount}` },
      { title: COMMON_HISTORY_DUPLICATES, data: paysheets.tripsDuplicated },
      { title: COMMON_HISTORY_PAY_OFF, data: `$${paysheets.sueldoVariable}` },
      { title: COMMON_HISTORY_SALARY, data: `$${paysheets.salary}` },
      { title: COMMON_HISTORY_TOTAL, data: `$${paysheets.Total}` },
      { button: true, title: `${COMMON_HISTORY_FOLIO}`, data: <Icon style={styles.arrowIcon} name={'ios-arrow-forward'} /> },
    ];

    this.setState({
      paysheetTable: this.dataArray.map((row) => (
        <View>
          {row.button ? (
            <Button transparent onPress={() => this.navigateTo('folios')}>
              <Grid>
                <Col>
                  <Text>{row.title}</Text>
                </Col>
                <Col>
                  <Text style={styles.paysheetData}>{row.data}</Text>
                </Col>
              </Grid>
            </Button>
          ) : (
            <Grid>
              <Col>
                <Text>{row.title}</Text>
              </Col>
              <Col>
                <Text style={styles.paysheetData}>{row.data}</Text>
              </Col>
            </Grid>
          )}
        </View>
      )),
    });
  }

  // detect when scroll is at the bottom
  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => layoutMeasurement.height + contentOffset.y >= contentSize.height;

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{COMMON_HISTORY_TITLE}</Title>
          {this.props.driverId ? (
            <Button style={styles.updateBtn} onPress={() => this.updateInfoButton()}>
              <Text style={styles.updateText}>{COMMON_HISTORY_UPDATE_LABEL}</Text>
            </Button>
          ) : null}
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
          <Left>
            <Button onPress={() => this.popRoute()} transparent>
              <Icon name="arrow-back" style={{color: '#FFF'}} />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#FFF'}}>{COMMON_HISTORY_TITLE}</Title>
          </Body>
          <Right>
          {this.props.driverId ? (
            <Button style={styles.updateBtn} onPress={() => this.updateInfoButton()}>
              <Text style={styles.updateText}>{COMMON_HISTORY_UPDATE_LABEL}</Text>
            </Button>
          ) : null}
          </Right>
        </Header>

        <Content
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent)) {
              const data = {
                jwtAccessToken: this.jwtAccessToken,
                limit: (this.limit += 5),
              };
              this.props.fetchTripHistoryAsync(data);
            }
          }}
        >
          {this.props.driverId ? (
            <View>
              {this.props.lastUpdatedTime ? (
                <Text style={styles.emptyText}>{`Proxima actualización disponible a las ${moment(this.props.lastUpdatedTime)
                  .add(10, 'minutes')
                  .format('hh:mm')}`}</Text>
              ) : null}
              {this.props.paysheets.Department ? (
                <Card>{this.state.paysheetTable}</Card>
              ) : (
                <Text style={styles.emptyText}>{COMMON_HISTORY_PAYSHEETS_EMPTY}</Text>
              )}
            </View>
          ) : null}

          {!this.props.driverId ? (
            !this.props.trips || this.props.trips.length === 0 ? (
              <Text style={styles.emptyText}>{COMMON_HISTORY_EMPTY}</Text>
            ) : (
              this.props.trips.map((trip, index) => (
                <View key={index} style={{ paddingBottom: 10 }}>
                  <TouchableOpacity onPress={() => this.setTripData(trip)}>
                    <Card style={{ position: 'relative' }}>
                      <View style={styles.mapContainer}>
                        <Image source={mapImage} style={{ width: '110%', marginLeft: -20}} />
                      </View>
                      <View style={styles.detailContainer}>
                        <Thumbnail square source={profileImage} size={40} style={styles.driverImage} />
                        <Text>
                          {this.formatDate(trip.tripStartTime || trip.bookingTime)}{' '}
                          {!trip.cashBox ? (
                            <Text style={styles.cashText}>
                              <Text style={{ color: 'green' }}>${trip.tripAmt}</Text>
                            </Text>
                          ) : (
                            <Text style={styles.cashText}>
                              <Text style={{ color: 'green' }}>${trip.tripAmt}</Text>
                            </Text>
                          )}
                        </Text>
                        <Text note>
                          {trip.unit ? trip.unit.name : '0000'} - {trip.folio} {'\n'}
                          {trip.pickUpAddress}
                        </Text>
                      </View>
                      <View style={styles.dummyView} />
                    </Card>
                  </TouchableOpacity>
                </View>
              ))
            )
          ) : null}

          {this.props.isFetching ? <Spinner /> : null}
        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    fetchTripHistoryAsync: (jwtAccessToken) => dispatch(fetchTripHistoryAsync(jwtAccessToken)),
    getDriverPaysheet: (jwtAccessToken, driverId) => dispatch(getDriverPaysheet(jwtAccessToken, driverId)),
    setLastUpdatedTime: (time) => dispatch(setLastUpdatedTime(time)),
    setSelectedTrip: (trip) => dispatch(setSelectedTrip(trip)),
    clearTrips: () => dispatch(clearTrips()),
  };
}

export default connect(mapStateToProps, bindActions)(History);
