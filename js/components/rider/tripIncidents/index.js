import moment from 'moment-timezone';
import { Button, CardItem, Col, Container, Content, Grid, Header, Icon, Row, Text, Title, View, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';

import { sendMessage } from '../../../actions/common/chat';
import { popRoute } from '../../../actions/route';
import {
  COMMON_TRIP_DETAILS_INCIDENCE_ACCIDENT,
  COMMON_TRIP_DETAILS_INCIDENCE_DATE,
  COMMON_TRIP_DETAILS_INCIDENCE_DRIVERCOMMENT,
  COMMON_TRIP_DETAILS_INCIDENCE_GENERAL,
  COMMON_TRIP_DETAILS_INCIDENCE_ISSUE,
  COMMON_TRIP_DETAILS_INCIDENCE_LOSTNFOUND,
  COMMON_TRIP_DETAILS_INCIDENCE_STATUS,
  COMMON_TRIP_DETAILS_INCIDENCE_TICKET,
  COMMON_TRIP_DETAILS_INCIDENCE_TITLE,
  COMMON_TRIP_DETAILS_INCIDENCE_TYPE,
  COMMON_TRIP_DETAILS_INCIDENCE_VEHICLECOMMENT,
} from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from './styles';

const Native = require('react-native');
const { Dimensions } = Native;
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

function mapStateToProps(state) {
  return {
    incidence: state.rider.incidents.selected,
    userId: state.rider.user._id,
    isFetching: state.rider.appState.loadSpinner,
  };
}

class TripIncidents extends Component {
  static propTypes = {
    incidence: PropTypes.object,
    userId: PropTypes.string,
    popRoute: PropTypes.func,
    sendMessage: PropTypes.func,
    isFetching: PropTypes.bool,
  };

  constructor() {
    super();

    this.state = {
      inputText: '',
    };
  }

  popRoute() {
    this.props.popRoute();
  }

  formatDate(bookingTime) {
    // eslint-disable-line class-methods-use-this
    return moment(bookingTime).tz('America/Mexico_City').format(' D/M/YY [-] h:mm a');
  }

  getLabelColor(status) {
    if (status === 'nuevo') return styles.greenLabel;
    else if (status === 'procesando') return styles.yellowLabel;
    else if (status === 'finalizado') return styles.redLabel;
  }

  getTypeName(type) {
    if (type === 'Accident') return COMMON_TRIP_DETAILS_INCIDENCE_ACCIDENT;
    else if (type === 'Lost&Found') return COMMON_TRIP_DETAILS_INCIDENCE_LOSTNFOUND;
    else if (type === 'DriverComment') return COMMON_TRIP_DETAILS_INCIDENCE_DRIVERCOMMENT;
    else if (type === 'VehicleComment') return COMMON_TRIP_DETAILS_INCIDENCE_VEHICLECOMMENT;

    return COMMON_TRIP_DETAILS_INCIDENCE_GENERAL;
  }

  sendMsg(msg) {
    if (msg !== '') {
      this.props.sendMessage(msg, this.props.incidence.conversation);
      this.setState({ inputText: '' });
    }
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{COMMON_TRIP_DETAILS_INCIDENCE_TITLE}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button transparent onPress={() => this.popRoute()}>
                <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{COMMON_TRIP_DETAILS_INCIDENCE_TITLE}</Title>
            </Body>
            <Right />
          </Header>

        <Content>
          <View>
            <Grid>
              <Col>
                <Text>{COMMON_TRIP_DETAILS_INCIDENCE_TICKET}</Text>
              </Col>

              <Col>
                <Text style={styles.detailsField}>{this.props.incidence.ticket}</Text>
              </Col>
            </Grid>
          </View>

          <View>
            <Grid>
              <Col>
                <Text>{COMMON_TRIP_DETAILS_INCIDENCE_TYPE}</Text>
              </Col>

              <Col>
                <Text style={styles.detailsField}>{this.getTypeName(this.props.incidence.OpTypeIncidence.value)}</Text>
              </Col>
            </Grid>
          </View>

          <View>
            <Grid>
              <Col>
                <Text>{COMMON_TRIP_DETAILS_INCIDENCE_STATUS}</Text>
              </Col>

              <Col>
                <Text style={this.getLabelColor(this.props.incidence.status)}>{this.props.incidence.status}</Text>
              </Col>
            </Grid>
          </View>

          <View>
            <Grid>
              <Col>
                <Text>{COMMON_TRIP_DETAILS_INCIDENCE_DATE}</Text>
              </Col>

              <Col>
                <Text style={styles.detailsField}>{this.formatDate(this.props.incidence.date)}</Text>
              </Col>
            </Grid>
          </View>

          <View style={{ padding: 15 }}>
            <Grid>
              <Row>
                <Col>
                  <Text>{COMMON_TRIP_DETAILS_INCIDENCE_ISSUE}</Text>
                </Col>
              </Row>

              <Row>
                <Text style={styles.detailsField}>{this.props.incidence.issue}</Text>
              </Row>

              <Row>{/* TODO: new chat goes here!! */}</Row>
            </Grid>
          </View>
        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    sendMessage: (msg, conversationId) => dispatch(sendMessage(msg, conversationId)),
  };
}

export default connect(mapStateToProps, bindActions)(TripIncidents);
