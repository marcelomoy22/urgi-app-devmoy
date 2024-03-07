import { Button, Container, Content, Header, Icon, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';

import { createOpenpayToken } from '../../../actions/rider/payment';
import { popRoute } from '../../../actions/route';
import * as appStateSelector from '../../../reducers/driver/appState';
import { RIDER_CREDIT_CARD_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import CreditCardForm from './form';
import styles from './styles';

function mapStateToProps(state) {
  return {
    isFetching: appStateSelector.isFetching(state),
  };
}

class CreditCard extends Component {
  static propTypes = {
    popRoute: PropTypes.func,
    createOpenpayToken: PropTypes.func,
    isFetching: PropTypes.bool,
  };

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
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{RIDER_CREDIT_CARD_TITLE}</Title>
        </Header> */}

          <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button transparent onPress={() => this.popRoute()}>
                  <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{RIDER_CREDIT_CARD_TITLE}</Title>
            </Body>
            <Right />
          </Header>

        <Content style={{ padding: 20 }}>
          <CreditCardForm isFetching={this.props.isFetching} />
        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    createOpenpayToken: (cardData) => dispatch(createOpenpayToken(cardData)),
  };
}

export default connect(mapStateToProps, bindActions)(CreditCard);
