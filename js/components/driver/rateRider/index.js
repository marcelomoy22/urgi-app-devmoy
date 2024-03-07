import { Button, Card, Title, Header, Icon, Text, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Modal, Platform, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';

import { changePageStatus } from '../../../actions/driver/home';
import { clearReducerState, setRating } from '../../../actions/driver/rateRider';
import {
  DRIVER_RATE_RIDER_COMPLETE_RATING_BTN,
  DRIVER_RATE_RIDER_LAST_TRIP,
  DRIVER_RATE_RIDER_NEED_HELP_BTN,
  DRIVER_RATE_RIDER_RATE,
  DRIVER_RATE_RIDER_TRIP_COMPLETED_BTN,
} from '../../../textStrings';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from './styles';

function mapStateToProps(state) {
  return {
    trip: state.driver.trip,
    tripRequest: state.driver.tripRequest,
  };
}
class RateRider extends Component {
  static propTypes = {
    changePageStatus: PropTypes.func,
    clearReducerState: PropTypes.func,
    trip: PropTypes.object,
    tripRequest: PropTypes.object,
    setRating: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      stars: [{ active: false }, { active: false }, { active: false }, { active: false }, { active: false }],
    };
  }

  componentDidMount() {
    const that = this;
    setTimeout(() => {
      that.setState({
        visible: true,
      });
    }, 500);
    setTimeout(() => {
      that.setState({
        opacity: 0,
      });
    }, 900);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.tripRequest.tripRequestStatus) {
      this.props.changePageStatus('driverHome');
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  goBack() {
    this.props.clearReducerState();
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
  handleClick() {
    this.setModalVisible(false);
    const rating = this.computeRating();
    this.props.setRating(rating);
  }

  render() {
    if (this.props.tripRequest.tripRequestStatus === undefined) {
      return <View />;
    }
    return (
      <View pointerEvents='box-none' style={this.state.modalVisible === true ? { opacity: 0.5, flex: 1 } : { flex: 1 }}>
        <StatusBar barStyle='light-content' />
        <View style={styles.slideSelector}>
          <Card style={styles.footerCard}>
            <View>
              <Text style={styles.trip}>{DRIVER_RATE_RIDER_LAST_TRIP}</Text>
              <Text note style={styles.pay}>
                ${this.props.trip.tripAmtDriver}
              </Text>
            </View>
            <Button style={styles.helpBtn} bordered>
              <Text style={{ color: '#797979', fontSize: 14, lineHeight: 16 }}>{DRIVER_RATE_RIDER_NEED_HELP_BTN}</Text>
            </Button>
          </Card>
          <Card style={styles.footerCard}>
            <View>
              <Text>{this.props.trip.rider.fname}</Text>
              <Text note>{this.props.trip.driver.carDetails.mark}</Text>
            </View>
            <View style={{ justifyContent: 'center', position: 'absolute', right: 10, top: 0, bottom: 0 }}>
              <Text style={{ textAlign: 'right', color: '#797979' }}>
                {this.props.trip.riderRatingByDriver} <Icon name='ios-star' style={styles.starIcon} />
              </Text>
            </View>
          </Card>
        </View>

        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.goBack()}>
            <Icon name='md-arrow-back' style={{ color: '#fff', fontSize: 28 }} />
          </Button>
          <Text style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{DRIVER_RATE_RIDER_TRIP_COMPLETED_BTN}</Text>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button onPress={() => this.goBack()} transparent>
                <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{DRIVER_RATE_RIDER_TRIP_COMPLETED_BTN}</Title>
            </Body>
            <Right />
          </Header>

        <Modal
          animationType={'slide'}
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <View style={styles.modalView}>
            <View style={styles.rateCard}>
              <Icon name='ios-person' style={styles.profileIcon} />
              <Text style={{ color: '#31D0E2', fontSize: 13, fontWeight: '700', lineHeight: 14 }}>{DRIVER_RATE_RIDER_RATE}</Text>
              <Text note style={{ fontSize: 18, fontWeight: '500', color: '#333' }}>
                {this.props.trip.rider.fname}
              </Text>
            </View>
            <Card style={{ borderRadius: 0, borderColor: '#eee' }}>
              <View style={styles.ratings}>
                {this.state.stars.map((item, index) => (
                  <Button transparent key={index} onPress={() => this.rate(index)}>
                    <Icon name='ios-star' style={{ letterSpacing: 20, color: item.active ? 'blue' : '#797979' }} />
                  </Button>
                ))}
              </View>
              <View style={styles.btnContainer}>
                <Button
                  block
                  style={{ backgroundColor: '#31D0E2', height: 60 }}
                  onPress={() => {
                    this.handleClick();
                  }}
                >
                  <Text style={styles.btnText}>{DRIVER_RATE_RIDER_COMPLETE_RATING_BTN}</Text>
                </Button>
              </View>
            </Card>
          </View>
        </Modal>
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    clearReducerState: () => dispatch(clearReducerState()),
    changePageStatus: (newPage) => dispatch(changePageStatus(newPage)),
    setRating: (rating) => dispatch(setRating(rating)),
  };
}

export default connect(mapStateToProps, bindActions)(RateRider);
