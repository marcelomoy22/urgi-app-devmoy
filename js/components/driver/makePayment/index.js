import { Button, Col, Container, Content, Grid, Header, Icon, Text, Title, View, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';

import { popRoute } from '../../../actions/route';
import { DRIVER_MAKEPAYMENT_PENDING_PAYMENTS } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import MyTicketProcess from './myTicketProcess';
import styles from './styles';



function mapStateToProps(state) {
  return {
    jwtAccessToken: state.driver.appState.jwtAccessToken,
    historyTicketProcess: state.driver.makePayment.historyTicketProcess
  };
}

class MakePayment extends Component {
  static propTypes = {
    popRoute: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      history: undefined,
    };
  }

  componentWillMount() {
    this.setState({ history: true });
  }

  componentDidMount() {
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
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{RIDER_BILLING_TITLE}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
          <Left>
            <Button transparent onPress={() => this.popRoute()}>
              <Icon name="arrow-back" style={{color: '#FFF'}} />
            </Button>
          </Left>
          <Body>
            <Title>{DRIVER_MAKEPAYMENT_PENDING_PAYMENTS}</Title>
          </Body>
          <Right />
        </Header>

<Content style={{ padding: 5 }}>
{this.state.history == true ? <MyTicketProcess historyTicketProcess={this.props.historyTicketProcess} /> : <View></View>}
</Content>

      </Container>


    )
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
  };
}

export default connect(mapStateToProps, bindActions)(MakePayment);
