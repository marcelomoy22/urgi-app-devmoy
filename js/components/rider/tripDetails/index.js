import moment from 'moment-timezone';
import { Button, CardItem, Col, Container, Content, Grid, Header, Icon, Row, Text, Thumbnail, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { fetchTripIncidents } from '../../../actions/rider/incidents';
import { popRoute } from '../../../actions/route';
import { COMMON_TRIP_DETAILS_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import Help from './help';
import Incidents from './incidents';
import Receipt from './receipt';
import styles from './styles';

const mapImage = require('../../../../images/dummyMap.png');
const profileImage = require('../../../../images/Contacts/avatar-1.jpg');

function mapStateToProps(state) {
  return {
    trip: state.rider.history.selected,
  };
}

class TripDetails extends Component {
  static propTypes = {
    trip: PropTypes.object,
    popRoute: PropTypes.func,
    fetchTripIncidents: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      screen: 'Receipt',
    };
  }

  async componentWillMount() {
    await this.props.fetchTripIncidents(this.props.trip._id);
  }

  popRoute() {
    this.props.popRoute();
  }

  formatDate(bookingTime) {
    // eslint-disable-line class-methods-use-this
    return moment(bookingTime).tz('America/Mexico_City').format(' D/M/YY [at] h:mm a');
  }

  getScreen(screen) {
    if (screen === 'Receipt') {
      return <Receipt trip={this.props.trip} />;
    } else if (screen === 'Help') {
      return <Help trip={this.props.trip} />;
    } else if (screen === 'Incidents') {
      return <Incidents />;
    }
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{COMMON_TRIP_DETAILS_TITLE}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button transparent onPress={() => this.popRoute()}>
                <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{COMMON_TRIP_DETAILS_TITLE}</Title>
            </Body>
            <Right />
          </Header>

        <Content>
          <Grid>
            <Row>
              <Col>
                <View style={styles.mapContainer}>
                  <Image source={mapImage} style={{ width: '110%', marginLeft: -20}} />
                </View>
              </Col>
            </Row>

            <Row>
              <Col>
                <Text style={styles.highLightText}>{this.formatDate(this.props.trip.tripStartTime)}</Text>
                <Text style={styles.detailText}>{`${this.props && this.props.trip && this.props.trip.unit ? this.props.trip.unit.model : null} color ${this.props && this.props.trip && this.props.trip.unit && this.props.trip.unit.color ? this.props.trip.unit.color.text : 'No definido'}`}</Text>
              </Col>
              <Col>
                <Text style={styles.highLightText}>{`$${this.props.trip.tripAmt}`}</Text>
              </Col>
            </Row>

            <Row>
              <Col>
                <Text style={styles.detailText}>{`Origen - ${this.props.trip.pickUpAddress}`}</Text>
                <Text style={styles.detailText}>{`Destino - ${this.props.trip.destAddress}`}</Text>
              </Col>
            </Row>

            <Row>
              <Col>
                <Thumbnail square source={profileImage} size={50} style={styles.driverImage} />
              </Col>
              <Col>
                <Text
                  style={styles.detailText}
                >{`${this.props && this.props.trip && this.props.trip.driverId && this.props.trip.driverId.fname ? this.props.trip.driverId.fname: null} ${this.props && this.props.trip && this.props.trip.driverId && this.props.trip.driverId.lname ? this.props.trip.driverId.lname : null} \n${this.props && this.props.trip && this.props.trip.driverId && this.props.trip.driverId.department ? this.props.trip.driverId.driver.department: null}`}</Text>
              </Col>
              <Col />
            </Row>

            <Row style={styles.tabBarContainer}>
              <Col>
                <TouchableOpacity onPress={() => this.setState({ screen: 'Receipt' })}>
                  <Text style={this.state.screen !== 'Receipt' ? styles.selectedTab : null}>Recibo</Text>
                </TouchableOpacity>
              </Col>
              <Col>
                <TouchableOpacity onPress={() => this.setState({ screen: 'Help' })}>
                  <Text style={this.state.screen !== 'Help' ? styles.selectedTab : null}>Ayuda</Text>
                </TouchableOpacity>
              </Col>
              <Col>
                <TouchableOpacity onPress={() => this.setState({ screen: 'Incidents' })}>
                  <Text style={this.state.screen !== 'Incidents' ? styles.selectedTab : null}>Incidencias</Text>
                </TouchableOpacity>
              </Col>
            </Row>
          </Grid>
          {this.getScreen(this.state.screen)}
        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    fetchTripIncidents: (tripId) => dispatch(fetchTripIncidents(tripId)),
  };
}

export default connect(mapStateToProps, bindActions)(TripDetails);
