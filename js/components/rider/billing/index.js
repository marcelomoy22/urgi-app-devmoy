import { Button, Col, Container, Content, Grid, Header, Icon, Text, Title, View, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';

import { popRoute } from '../../../actions/route';
import { RIDER_BILLING_BILLING, RIDER_BILLING_SEARCH_BILLING, RIDER_BILLING_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import BillingForm from './form';
import MyBillingForm from './myBilling';
import SearchForm from './search';
import styles from './styles';

function mapStateToProps(state) {
  return {
    jwtAccessToken: state.rider.appState.jwtAccessToken,
    RFC: state.rider.billing.RFC,
    loading: state.rider.billing.loading,
    dataFolio: state.rider.billing.dataFolio,
    cleanData: state.rider.billing.cleanData,
    historyBilling: state.rider.billing.historyBilling,
    dataSearch: state.rider.billing.dataSearch,
    codeBase64: state.rider.billing.codeBase64,
  };
}

class Billing extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    popRoute: PropTypes.func,
    FRC: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      adddBillingButton: undefined,
      history: undefined,
      buttons: undefined,
      searchButton: undefined,
    };
  }

  async componentWillMount() {
    this.setState({ history: true });
    this.setState({ buttons: true });
    this.setState({ adddBillingButton: undefined });
    this.setState({ searchButton: undefined });
  }

  popRoute() {
    this.props.popRoute();
  }

  billing() {
    this.setState({ history: undefined });
    this.setState({ buttons: undefined });
    this.setState({ searchButton: undefined });
    this.setState({ adddBillingButton: true });
  }

  search() {
    this.setState({ history: undefined });
    this.setState({ buttons: undefined });
    this.setState({ adddBillingButton: undefined });
    this.setState({ searchButton: true });
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
              <Title style={{color: '#FFF'}}>{RIDER_BILLING_TITLE}</Title>
            </Body>
            <Right />
          </Header>

        <Content style={{ padding: 5 }}>
          {this.state.buttons == true ? (
            <Grid style={{ paddingBottom: 20 }}>
              <Col style={{ paddingTop: 20, paddingRight: 10 }}>
                <View>
                  <Button onPress={this.search.bind(this)} block style={{ backgroundColor: '#19192B' }}>
                    <Text style={{ color: '#fff', fontWeight: '600' }}> {RIDER_BILLING_SEARCH_BILLING} </Text>
                  </Button>
                </View>
              </Col>

              <Col style={{ paddingTop: 20, paddingLeft: 10 }}>
                <View>
                  <Button onPress={this.billing.bind(this)} block style={{ backgroundColor: '#19192B' }}>
                    <Text style={{ color: '#fff', fontWeight: '600' }}> {RIDER_BILLING_BILLING} </Text>
                  </Button>
                </View>
              </Col>
            </Grid>
          ) : (
            <View></View>
          )}

          {this.state.history == true ? <MyBillingForm historyBilling={this.props.historyBilling} codeBase64={this.props.codeBase64} /> : <View></View>}

          {this.state.adddBillingButton == true ? (
            <BillingForm RFC={this.props.RFC} loading={this.props.loading} dataFolio={this.props.dataFolio} cleanData={this.props.cleanData} />
          ) : (
            <View></View>
          )}

          {this.state.searchButton == true ? (
            <SearchForm dataSearch={this.props.dataSearch} loading={this.props.loading} codeBase64={this.props.codeBase64} />
          ) : (
            <View></View>
          )}
        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
  };
}

export default connect(mapStateToProps, bindActions)(Billing);
