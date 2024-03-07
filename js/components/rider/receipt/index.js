import moment from 'moment';
import { Button, Container, Content, Header, Icon, Text, Thumbnail, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import Communications from 'react-native-communications';
import { connect } from 'react-redux';

import config from '../../../../config.js';
import { updateFavoriteDriversList } from '../../../actions/rider/favorites';
import { changePageStatus } from '../../../actions/rider/home';
import { clearReducerState, setRating } from '../../../actions/rider/receipt';
import { etaTimerReset } from '../../../actions/rider/rideBooked';
import { popRoute } from '../../../actions/route';
import { RIDER_RECEIPT_FAVORITE, RIDER_RECEIPT_FEEDBACK, RIDER_RECEIPT_HELP, RIDER_RECEIPT_SUM, RIDER_RECEIPT_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from './styles';

const profileImage = require('../../../../images/Contacts/avatar-8.jpg');

function mapStateToProps(state) {
  return {
    jwtAccessToken: state.rider.appState.jwtAccessToken,
    user: state.rider.user,
    trip: state.rider.trip,
    tripRequest: state.rider.tripRequest,
    favDrivers: state.rider.favorites.driversList,
  };
}

class Receipt extends Component {
  static propTypes = {
    jwtAccessToken: PropTypes.string,
    user: PropTypes.object,
    trip: PropTypes.object,
    tripRequest: PropTypes.object,
    popRoute: PropTypes.func,
    clearReducerState: PropTypes.func,
    changePageStatus: PropTypes.func,
    setRating: PropTypes.func,
    favDrivers: PropTypes.array,
    updateFavoriteDriversList: PropTypes.func,
    etaTimerReset: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      stars: [{ active: false }, { active: false }, { active: false }, { active: false }, { active: false }],
    };
  }

  componentWillMount() {
    this.props.etaTimerReset();
  }

  popRoute() {
    this.props.popRoute();
  }

  computeRating() {
    let count = 0;
    this.state.stars.forEach((item) => {
      if (item.active) {
        count += 1;
      }
    });
    return count;
  }

  addToFavorites() {
    const driversList = [];

    for (let i = 0; i < this.props.favDrivers.length; i++) {
      driversList.push(this.props.favDrivers[i]._id);
    }

    driversList.push(this.props.trip.driverId);

    const user = {
      jwtAccessToken: this.props.jwtAccessToken,
      _id: this.props.user._id,
      list: driversList,
    };

    this.props.updateFavoriteDriversList(user);
  }

  goBack() {
    const rating = this.computeRating();
    this.props.setRating(rating);
    this.props.clearReducerState();
    this.props.changePageStatus('home');
  }

  formatDate(bookingTime) {
    // eslint-disable-line class-methods-use-this
    return moment(bookingTime).tz('America/Mexico_City').format('h:mm a');
  }

  rate(index) {
    const stateCopy = { ...this.state };
    for (let i = 0; i < 5; i += 1) {
      stateCopy.stars[i].active = false;
    }
    this.setState(stateCopy);
    for (let i = index; i >= 0; i -= 1) {
      stateCopy.stars[i].active = true;
    }
    this.setState(stateCopy);
  }

  helpButtonPress() {
    Communications.phonecall('81300600', true);
  }

  feedbackButtonPress() {
    const to = ['atencionalcliente@urgi.com.mx'];
    const subject = 'feedback';
    const body = `Numero de reserva: ${this.props.trip.folio}\n
                  Conductor: ${this.props.trip.driver.fname} ${this.props.trip.driver.lname}\n
                  Unidad: ${this.props.trip.unit}\n`;

    Communications.email(to, null, null, subject, body);
  }

  render() {
    if (!this.props.tripRequest.tripRequestStatus) {
      this.props.changePageStatus('home');
      return <View />;
    }
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.goBack()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title>{RIDER_RECEIPT_TITLE}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button transparent onPress={() => this.goBack()}>
                <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{RIDER_RECEIPT_TITLE}</Title>
            </Body>
            <Right />
          </Header>

        <Content style={{ padding: 20 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.dateContainer}>
              <View style={styles.sideLines} />
              <Text style={styles.summaryText}>{this.formatDate(this.props.trip.tripStartTime)}</Text>
              <View style={styles.sideLines} />
            </View>
            {this.props.trip.initPrice > 0 ? (
              <View>
                <Text style={styles.summaryText}>{`Precio inicial: $${this.props.trip.initPrice}`}</Text>
                <Text style={styles.summaryText}>{`Precio por kilometro: $${this.props.trip.pKm}`}</Text>
                <Text style={styles.summaryText}>{`Precio por minuto: $${this.props.trip.pMin}`}</Text>
              </View>
            ) : (
              <View></View>
            )}
            <Text style={styles.amount}>${this.props.trip.tripAmt}</Text>
            <View style={styles.dateContainer}>
              <View style={styles.sideLines} />
              <Text style={styles.summaryText}>{RIDER_RECEIPT_SUM}</Text>
              <View style={styles.sideLines} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Thumbnail
                square
                size={60}
                source={{ uri: `${config.serverSideUrl}:${config.port}/users/${this.props.tripRequest.driver._id}/foto-perfil.jpg` }}
                style={{ borderRadius: 30 }}
              />
              <Text style={{ alignSelf: 'center' }}>{this.props.trip.driver.fname}</Text>
              <View style={styles.taxiNoContainer}>
                <Text style={styles.taxiNo}>
                  {this.props.tripRequest.driver.carDetails.mark} / {this.props.tripRequest.driver.carDetails.registrationNo}
                </Text>
              </View>
              <View style={[styles.feedBackBtn, { padding: 20 }]}>
                <TouchableOpacity onPress={() => this.addToFavorites()} style={{ paddingRight: 10 }}>
                  <Icon
                    name={'ios-heart'}
                    style={{
                      letterSpacing: 20,
                      color: this.props.favDrivers.some((obj) => {
                        return obj._id === this.props.trip.driverId;
                      })
                        ? '#de1c24'
                        : '#797979',
                    }}
                  />
                </TouchableOpacity>
                <Text style={{ top: 5 }}>{RIDER_RECEIPT_FAVORITE}</Text>
              </View>
            </View>
            <View style={{ padding: 20 }}>
              <View style={styles.feedBackBtn}>
                <TouchableOpacity onPress={() => this.feedbackButtonPress()} style={{ padding: 20 }}>
                  <Text style={styles.btnText}>{RIDER_RECEIPT_FEEDBACK}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.helpButtonPress()} style={{ padding: 20 }}>
                  <Text style={styles.btnText}>{RIDER_RECEIPT_HELP}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.feedBackBtn}>
                {this.state.stars.map((item, index) => (
                  <Button transparent key={index} onPress={() => this.rate(index)}>
                    <Icon name='ios-star' style={{ letterSpacing: 20, color: item.active ? 'blue' : '#797979' }} />
                  </Button>
                ))}
              </View>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    clearReducerState: () => dispatch(clearReducerState()),
    changePageStatus: (newPage) => dispatch(changePageStatus(newPage)),
    setRating: (rating) => dispatch(setRating(rating)),
    updateFavoriteDriversList: (user) => dispatch(updateFavoriteDriversList(user)),
    etaTimerReset: () => dispatch(etaTimerReset()),
  };
}

export default connect(mapStateToProps, bindActions)(Receipt);
