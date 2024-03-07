import { Button, Card, Col, Grid, Input, InputGroup, Text, View } from 'native-base';
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import DropdownMenu from 'react-native-dropdown-menu';

import { historyTicketProcess, searchHistory, sendInfo } from '../../../actions/driver/makePayment';
import styles from './styles';

class MyTicketProcess extends Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      form: undefined,
      typePay:undefined,
      codeAuth: undefined,
      tarjet: false,
      efect: false,
      terminal: 'Visa',
    };
  }

  async componentWillMount() {
    this.tex = []; 
    this.setState({ tarjet: false });
    this.setState({ efect: false });
    this.props.dispatch(searchHistory());
    this.props.dispatch(historyTicketProcess(undefined));
  }

  changeCodeAuth(codeAuth) {
    this.setState({ codeAuth });
  }
  changeTipeCard(tipeCard){
    this.setState({ tipeCard });
  }

  efectivo(efect){
    this.setState({ typePay: 'efectivo' });
    this.setState({ efect:true });
    this.setState({ tarjet:false });
    this.setState({ codeAuth:undefined });

  }
  tarjeta(tarjet){
    this.setState({ typePay: 'tarjeta' });
    this.setState({ tarjet: true });
    this.setState({ efect: false });
  }

  sendInfoPay(form) {
    if(!this.state.typePay){
      alert('Ups, Ingrese el método de pago');
    }else{
      if(this.state.typePay == 'tarjeta' && !this.state.codeAuth){
        alert('Ups, Ingrese el código de autorización');
      }else if(this.state.typePay == 'efectivo'){
        form.typePay=this.state.typePay
        this.setState({ form });
        this.props.dispatch(sendInfo(form));
      } else{
        form.codeAuth=this.state.codeAuth
        form.terminal=this.state.terminal
        form.typePay=this.state.typePay
        this.setState({ form });
        this.props.dispatch(sendInfo(form));
      }
    }
  }
  
  async componentWillReceiveProps(props) {
    if (props.historyTicketProcess){
      this.tex = [];
      var te = undefined;
      this.setState({ form: undefined });
      this.setState({ typePay: undefined });
      this.setState({ codeAuth: undefined });
      this.setState({ tarjet: false });
      this.setState({ efect: false });
      this.setState({ terminal: 'Visa' });
      var redondo =""
      props.historyTicketProcess.forEach((element) => {
        if(element.options && element.options.indexOf('redondo') > -1){
          redondo = " ,  -REDONDO"
        }else{
          redondo = ""
        }
            te = (
              <View style={{ paddingTop: 35 }}>
                <Text style={{ paddingLeft: 10 }}>
                  {'Folio: ' +
                    element.folio +
                    ' ,  Monto: ' +
                    element.processMonto + 
                    redondo +
                    ' ,  Día de Ticket: ' +
                    moment(element.requestTime).tz('America/Mexico_City').format('DD-MM-YYYY / HH:mm a')
                    }
                </Text>
                <Grid style={{ paddingBottom: 20 }}>
                  { !element.processTypePay && element.processMonto != 0 ?
                    <Col style={{ paddingTop: 5, paddingRight: 10, paddingLeft:10 }}>
                      <Button onPress={this.sendInfoPay.bind(this, element)} block style={{ backgroundColor: '#696969' }}>
                        <Text style={{ color: '#fff', fontWeight: '600' }}> Efectuar El Cobro </Text>
                      </Button>
                    </Col>
                  : <View>
                      <Text style={{paddingTop: 5, paddingLeft:10}}> Cobrado </Text>
                    </View> }
                </Grid>
              </View>
            );
            this.tex.push(te);
        })
    }
  }

  render() {
    var data = [['Visa', 'Master Card', 'American Express']];
    var efect = false
    var tarjet = false
    return (
      <View>
        <Card>
            <View>
              <View style={{ paddingTop: 25 }}>
                <Text style={styles.textFirst}> Mis Pagos Pendientes </Text>
              </View>
              {this.tex}
              {this.tex != undefined ?
              <Col>
                <Grid>
                  <Col style={{ paddingTop: 40, paddingRight: 20, paddingLeft:40 }}>
                    <Button onPress={this.efectivo.bind(this,efect=true)} block style={{ backgroundColor: '#696969' }}>
                      <Text style={{ color: '#fff', fontWeight: '600' }}> Efectivo </Text>
                    </Button>
                  </Col>
                  <Col style={{ paddingTop: 40, paddingRight: 40 }}>
                    <Button onPress={this.tarjeta.bind(this,tarjet=true)} block style={{ backgroundColor: '#696969' }}>
                      <Text style={{ color: '#fff', fontWeight: '600' }}> Tarjeta </Text>
                    </Button>
                  </Col>
                </Grid>

                <Col>
                  {this.state.efect == true ?
                    <Col style={{ paddingLeft: 10, paddingBottom: 20 }}>
                      <View>
                        <Text style={{paddingTop: 20}}> Efectivo </Text>
                      </View>
                    </Col>
                  : <View></View> }

                  {this.state.tarjet == true ?
                    <Col style={{ paddingLeft: 10 }}>
                      <Text style={{paddingTop: 20}}> Tarjeta </Text>

                      <View style={{ paddingTop: 5 }}>
                        <InputGroup>
                          <Input
                            name='codeAuth'
                            value={this.state.codeAuth}
                            onChangeText={(codeAuth) => this.changeCodeAuth(codeAuth)}
                            placeholder='Código de autorización'
                            placeholderTextColor='#D5D4D4'
                            autoCapitalize='none'
                          />
                        </InputGroup>
                      </View>
                      <View style={{ flex: 1, paddingBottom: 130 }}>
                      <DropdownMenu
                            bgColor={'white'}
                            activityTintColor={'green'}
                            optionTextStyle={{ color: '#333333' }}
                            handler={(selection, row) => this.setState({ terminal: data[selection][row] })}
                            data={data}
                          />
                      </View>
                    </Col>
                  : <View></View> }
                </Col>

                
              </Col>
              : <View></View>}
            </View>
        </Card>
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    historyTicketProcess: () => dispatch(historyTicketProcess()),
  };
}

export default reduxForm({
  form: 'myTicketProcess',
  bindActions,
})(MyTicketProcess);
