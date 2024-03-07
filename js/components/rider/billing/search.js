import { Button, Card, Col, Grid, Input, InputGroup, Text, View } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { reduxForm } from 'redux-form';

import { codeBase64, dataSearch, downloadBilling, filterBilling, sendBilling, spinner } from '../../../actions/rider/billing';
import styles from './styles';

class SearchForm extends Component {
  static propTypes = {
    loading: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      folio: '',
      RFC: '',
      monto: '',
      email: '',
      view: undefined,
      loading: undefined,
    };
  }

  async componentWillMount() {
    this.tex = undefined;
    this.setState({ view: undefined });
    this.props.dispatch(dataSearch(undefined));
    this.props.dispatch(codeBase64(undefined));
    this.props.dispatch(spinner(undefined));
  }

  changeFolio(folio) {
    this.setState({ folio });
  }

  changeRFC(RFC) {
    this.setState({ RFC });
  }

  changeMonto(monto) {
    this.setState({ monto });
  }

  changeEmail(email) {
    this.setState({ email });
  }

  button() {
    this.props.dispatch(filterBilling(this.state));
  }

  async componentWillReceiveProps(props) {
    if (props.dataSearch) {
      this.setState({ view: true });

      var te = (
        <View style={{ paddingTop: 20 }}>
          {props.dataSearch[0].folio ? (
            <Text>
              {'Folio: ' +
                props.dataSearch[0].folio +
                ' ,  Monto: ' +
                props.dataSearch[0].tripAmt +
                ' ,  RFC: ' +
                props.dataSearch[0].billing.RFC +
                ' ,  Día pagado: ' +
                props.dataSearch[1]}
            </Text>
          ) : (
            <Text>
              {'Folio: ' +
                props.dataSearch[0].code +
                ' ,  Monto: ' +
                props.dataSearch[0].price +
                ' ,  RFC: ' +
                props.dataSearch[0].billing.RFC +
                ' ,  Día pagado: ' +
                props.dataSearch[1]}
            </Text>
          )}
          <Grid style={{ paddingBottom: 20 }}>
            <Col style={{ paddingTop: 20, paddingRight: 10 }}>
              <View>
                {this.state.loading == true && this.props.loading != true ? (
                  <ActivityIndicator size='large' color='#000000' />
                ) : (
                  <Button onPress={this.sendBilling.bind(this)} block style={{ backgroundColor: '#696969' }}>
                    <Text style={{ color: '#fff', fontWeight: '600' }}> Enviar PDF y XML </Text>
                  </Button>
                )}
              </View>
            </Col>

            <Col style={{ paddingTop: 20, paddingLeft: 10 }}>
              <View>
                <Button onPress={this.downloadBilling.bind(this)} block style={{ backgroundColor: '#696969' }}>
                  <Text style={{ color: '#fff', fontWeight: '600' }}> Descargar PDF </Text>
                </Button>
              </View>
            </Col>
          </Grid>
        </View>
      );
      this.tex = te;
    }

    if (props.codeBase64) {
    }

    if (props.loading != true) {
      this.state.loading = undefined;
      this.setState.loading = undefined;
      this.setState({ loading: undefined });
    }
  }

  sendBilling() {
    this.state.loading = true;
    this.props.dispatch(spinner(true));
    this.props.dispatch(sendBilling(this.state.email, this.props.dataSearch[0].billing.idCFDI));
  }

  downloadBilling() {
    this.props.dispatch(downloadBilling(this.props.dataSearch[0].billing.idCFDI));
  }

  render() {
    return (
      <View>
        <Card style={{ paddingTop: 5 }}>
          <View>
            <View>
              <Text style={styles.textSecond}> Ingresa los datos y despues en Buscar </Text>
            </View>

            <View style={{ paddingTop: 20 }}>
              <InputGroup>
                <Input
                  name='RFC'
                  value={this.state.RFC}
                  onChangeText={(RFC) => this.changeRFC(RFC)}
                  placeholder='RFC'
                  placeholderTextColor='#D5D4D4'
                  autoCapitalize='none'
                />
              </InputGroup>
            </View>

            <View style={{ paddingTop: 10 }}>
              <InputGroup>
                <Input
                  name='folio'
                  value={this.state.folio}
                  onChangeText={(folio) => this.changeFolio(folio)}
                  placeholder='Folio'
                  placeholderTextColor='#D5D4D4'
                  autoCapitalize='none'
                />
              </InputGroup>
            </View>

            <View style={{ paddingTop: 10 }}>
              <InputGroup>
                <Input
                  name='monto'
                  value={this.state.monto}
                  onChangeText={(monto) => this.changeMonto(monto)}
                  placeholder='monto'
                  placeholderTextColor='#D5D4D4'
                  autoCapitalize='none'
                />
              </InputGroup>
            </View>

            <Col style={{ paddingTop: 20 }}>
              <View>
                <Button onPress={this.button.bind(this)} block style={{ backgroundColor: '#19192B' }}>
                  <Text style={{ color: '#fff', fontWeight: '600' }}> Buscar </Text>
                </Button>
              </View>
            </Col>
          </View>
        </Card>

        {this.state.view == true ? (
          <Card style={{ paddingTop: 5 }}>
            <View>
              <View style={{ paddingBottom: 15 }}>
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
              {this.tex}
            </View>
          </Card>
        ) : (
          <View></View>
        )}
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    dataSearch: () => dispatch(dataSearch()),
    codeBase64: () => dispatch(codeBase64()),
    spinner: () => dispatch(spinner()),
  };
}

export default reduxForm({
  form: 'search',
  bindActions,
})(SearchForm);
