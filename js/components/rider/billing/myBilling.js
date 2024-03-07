import { Button, Card, Col, Grid, Input, InputGroup, Text, View } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

import { codeBase64, downloadBilling, historyBilling, searchHistory, sendBilling } from '../../../actions/rider/billing';
import styles from './styles';

class MyBillingForm extends Component {
  static propTypes = {
    loading: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      factura: '',
    };
  }

  async componentWillMount() {
    this.tex = [];
    this.props.dispatch(searchHistory());
    this.props.dispatch(historyBilling(undefined));
    this.props.dispatch(codeBase64(undefined));
  }

  changeEmail(email) {
    this.setState({ email });
  }

  sendBilling(element) {
    this.props.dispatch(sendBilling(this.state.email, element[1].idCFDI));
  }

  downloadBilling(element) {
    this.props.dispatch(downloadBilling(element[1].idCFDI));
  }

  async componentWillReceiveProps(props) {
    if (props.historyBilling) {
      this.tex = [];
      var te = undefined;

      props.historyBilling.forEach((element) => {
        if (element[0].folio) {
          for (var i = 0; i < element.length - 1; i++) {
            te = (
              <View style={{ paddingTop: 25 }}>
                <Text>
                  {'Folio: ' +
                    element[i].folio +
                    ' ,  Monto: ' +
                    element[i].tripAmt +
                    ' ,  Tipo de Pago: ' +
                    element[i].cashBox.OptypePayment.description +
                    ' ,  RFC: ' +
                    element[element.length - 1].RFC}
                </Text>

                <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ paddingTop: 20, paddingRight: 10 }}>
                    <Button onPress={this.sendBilling.bind(this, element)} block style={{ backgroundColor: '#696969' }}>
                      <Text style={{ color: '#fff', fontWeight: '600' }}> Enviar PDF y XML </Text>
                    </Button>
                  </Col>
                  <Col style={{ paddingTop: 20, paddingRight: 10 }}>
                    <Button onPress={this.downloadBilling.bind(this, element)} block style={{ backgroundColor: '#696969' }}>
                      <Text style={{ color: '#fff', fontWeight: '600' }}> Descargar PDF, XML </Text>
                    </Button>
                  </Col>
                </Grid>
              </View>
            );
            this.tex.push(te);
          }
        } else {
          for (var i = 0; i < element.length - 1; i++) {
            te = (
              <View style={{ paddingTop: 25 }}>
                <Text>
                  {'Folio: ' +
                    element[i].code +
                    ' ,  Monto: ' +
                    element[i].price +
                    ' ,  Tipo de Pago: ' +
                    element[i].cashBoxBilling.OptypePayment.description +
                    ' ,  RFC: ' +
                    element[element.length - 1].RFC}
                </Text>

                <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ paddingTop: 20, paddingRight: 10 }}>
                    <Button onPress={this.sendBilling.bind(this, element)} block style={{ backgroundColor: '#696969' }}>
                      <Text style={{ color: '#fff', fontWeight: '600' }}> Enviar PDF y XML </Text>
                    </Button>
                  </Col>
                  <Col style={{ paddingTop: 20, paddingRight: 10 }}>
                    <Button onPress={this.downloadBilling.bind(this, element)} block style={{ backgroundColor: '#696969' }}>
                      <Text style={{ color: '#fff', fontWeight: '600' }}> Descargar PDF, XML </Text>
                    </Button>
                  </Col>
                </Grid>
              </View>
            );
            this.tex.push(te);
          }
        }
      });
    }

    if (props.codeBase64) {
      this.setState({ factura: props.codeBase64 });
      console.log(props.codeBase64.Content);
    }
  }

  render() {
    return (
      <View>
        <Card>
          <View>
            <View>
              <View>
                <InputGroup>
                  <Input
                    name='email'
                    value={this.state.email}
                    onChangeText={(email) => this.changeEmail(email)}
                    placeholder='Enviar a email:'
                    placeholderTextColor='#D5D4D4'
                    autoCapitalize='none'
                  />
                </InputGroup>
              </View>
              <View style={{ paddingTop: 20 }}>
                <Text style={styles.textFirst}> Mis Facturas </Text>
              </View>
              {this.tex}
            </View>
          </View>
        </Card>
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    historyBilling: () => dispatch(historyBilling()),
    codeBase64: () => dispatch(codeBase64()),
  };
}

export default reduxForm({
  form: 'myBilling',
  bindActions,
})(MyBillingForm);
