import { Button, Container, Header, Icon, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { popRoute, pushNewRoute } from '../../../actions/route';
import { RIDER_CARDPAYMENT_CARD, RIDER_CARDPAYMENT_PAY_METHOD, RIDER_CARDPAYMENT_PAYTM, RIDER_CARDPAYMENT_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from './styles';

const image = require('../../../../images/paytm2.png');

class cardPayment extends Component {
  static propTypes = {
    pushNewRoute: PropTypes.func,
    popRoute: PropTypes.func,
  };
  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }

  popRoute() {
    this.props.popRoute();
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{RIDER_CARDPAYMENT_TITLE}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button transparent onPress={() => this.popRoute()}>
                <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{RIDER_CARDPAYMENT_TITLE}</Title>
            </Body>
            <Right />
          </Header>

        <View>
          <View style={styles.cardSelect}>
            <Text style={{ fontSize: 14, fontWeight: '600' }}>{RIDER_CARDPAYMENT_PAY_METHOD}</Text>
          </View>
          <TouchableOpacity style={styles.payCard} onPress={() => this.pushNewRoute('creditCard')}>
            <Icon name='ios-card' style={{ fontSize: 40, color: '#24BCD9' }} />
            <Text style={{ marginLeft: 20, marginTop: 8 }}>{RIDER_CARDPAYMENT_CARD}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.payCard, { marginTop: 15, paddingBottom: 10 }]}>
            <View style={{ borderWidth: 1, borderColor: '#aaa' }}>
              <Image source={image} style={styles.paytmIcon} />
            </View>
            <Text style={{ marginLeft: 20 }}>{RIDER_CARDPAYMENT_PAYTM}</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    popRoute: () => dispatch(popRoute()),
  };
}

export default connect(null, bindActions)(cardPayment);
