import { Button, Card, CardItem, Col, Container, Content, Grid, Header, Icon, Input, InputGroup, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import DropdownMenu from 'react-native-dropdown-menu';
import { connect } from 'react-redux';

import { addVipData } from '../../../actions/rider/confirmRide';
import { popRoute } from '../../../actions/route';
import { COMMON_VIP_DATA_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from './styles';

function mapStateToProps(state) {
  return {
    vipData: state.rider.tripRequest.vipData,
  };
}

class VipData extends Component {
  static propTypes = {
    addVipData: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      terminal: undefined,
      aerolinea: undefined,
      nVuelo: undefined,
      cliente: undefined,
    };
  }

  popRoute() {
    this.props.popRoute();
  }

  componentDidMount() {
    if (this.props.vipData) {
      this.setState({
        terminal: this.props.vipData.terminal,
        aerolinea: this.props.vipData.aerolinea,
        nVuelo: this.props.vipData.nVuelo,
        cliente: this.props.vipData.cliente,
      });
    }
  }

  async componentWillReceiveProps(props) {}

  changeTerminal(terminal) {
    this.setState({ terminal });
  }
  changeAerolinea(aerolinea) {
    this.setState({ aerolinea });
  }
  changeNVuelo(nVuelo) {
    this.setState({ nVuelo });
  }
  changeCliente(cliente) {
    this.setState({ cliente });
  }

  dataVip() {
    if (!this.state.terminal || !this.state.aerolinea || !this.state.nVuelo || !this.state.cliente) {
      alert('Ups, Completa la informacion');
    } else {
      var data = this.state;
      this.props.addVipData(data);
      this.popRoute();
    }
  }

  render() {
    var data = [['Teminal A', 'Teminal B', 'Teminal C']];
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => (this.props.addVipData(undefined), this.popRoute())}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{COMMON_VIP_DATA_TITLE}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
          <Left>
            <Button onPress={() => (this.props.addVipData(undefined), this.popRoute())} transparent>
              <Icon name="arrow-back" style={{color: '#FFF'}} />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#FFF'}}>{COMMON_VIP_DATA_TITLE}</Title>
          </Body>
          <Right />
        </Header>

        <Content style={{ padding: 5 }}>
          <View>
            <Card>
              <View>
                <View>
                  <Text> Ingrese los datos para su viaje VIP</Text>

                  <Col style={{ paddingTop: 15 }}>
                    <View>
                      <InputGroup>
                        <Input
                          name='aerolinea'
                          value={this.state.aerolinea}
                          onChangeText={(aerolinea) => this.changeAerolinea(aerolinea)}
                          placeholder='Aerolínea(Interjet, Volaris, Aeroméxico, etc)'
                          placeholderTextColor='#D5D4D4'
                          autoCapitalize='none'
                        />
                      </InputGroup>
                    </View>
                  </Col>

                  <Col style={{ paddingTop: 20 }}>
                    <View>
                      <InputGroup>
                        <Input
                          name='nVuelo'
                          value={this.state.nVuelo}
                          onChangeText={(nVuelo) => this.changeNVuelo(nVuelo)}
                          placeholder='Vuelo(Ejemplo: Y4-677)'
                          placeholderTextColor='#D5D4D4'
                          autoCapitalize='none'
                        />
                      </InputGroup>
                    </View>
                  </Col>

                  <Col style={{ paddingTop: 20 }}>
                    <View>
                      <InputGroup>
                        <Input
                          name='cliente'
                          value={this.state.cliente}
                          onChangeText={(cliente) => this.changeCliente(cliente)}
                          placeholder='Se recogera a la persona:'
                          placeholderTextColor='#D5D4D4'
                          autoCapitalize='none'
                        />
                      </InputGroup>
                    </View>
                  </Col>

                  <View style={{ flex: 1, paddingBottom: 130 }}>
                    <View style={{ height: 15 }} />
                    <DropdownMenu
                      bgColor={'white'}
                      tintColor={'# 666666'}
                      activityTintColor={'green'}
                      optionTextStyle={{ color: '#333333' }}
                      handler={(selection, row) => this.setState({ terminal: data[selection][row] })}
                      data={data}
                    />
                  </View>

                  <Grid>
                    <Col style={{ paddingRight: 30 }}>
                      <Button onPress={() => (this.props.addVipData(undefined), this.popRoute())} block style={{ backgroundColor: '#19192B' }}>
                        <Text style={{ color: '#fff', fontWeight: '600' }}> Cancelar </Text>
                      </Button>
                    </Col>

                    <Col>
                      <Button onPress={this.dataVip.bind(this)} block style={{ backgroundColor: '#19192B' }}>
                        <Text style={{ color: '#fff', fontWeight: '600' }}> Hacer VIP </Text>
                      </Button>
                    </Col>
                  </Grid>
                </View>
              </View>
            </Card>
          </View>
        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    popRoute: () => dispatch(popRoute()),
    addVipData: (data) => dispatch(addVipData(data)),
  };
}

export default connect(mapStateToProps, bindActions)(VipData);
