import { Button, Card, Col, Grid, Input, InputGroup, Text, View } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { reduxForm } from 'redux-form';

import { addBill, cleanData, question, searchBilling, searchData, spinner, validationData, validationFolio } from '../../../actions/rider/billing';
import {
  RIDER_BILLING_AGREGAR,
  RIDER_BILLING_BILLING,
  RIDER_BILLING_CFDI,
  RIDER_BILLING_CITY,
  RIDER_BILLING_COLONY,
  RIDER_BILLING_CP,
  RIDER_BILLING_EMAIL,
  RIDER_BILLING_ENTER_RFC,
  RIDER_BILLING_EXTERIOR,
  RIDER_BILLING_FISCAL_DATA,
  RIDER_BILLING_FOLIO,
  RIDER_BILLING_INTERIOR,
  RIDER_BILLING_MONTO,
  RIDER_BILLING_RFC,
  RIDER_BILLING_SEARCH,
  RIDER_BILLING_SEARCH_RFC,
  RIDER_BILLING_SERVICIOS_A_FACTURAR,
  RIDER_BILLING_SOCIAL_BUSINESS,
  RIDER_BILLING_STATE,
  RIDER_BILLING_STREET,
} from '../../../textStrings';
import styles from './styles';

class BillingForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    searchData: PropTypes.func,
    addBilling: PropTypes.func,
    loading: PropTypes.object,
    RFC: PropTypes.object,
    searchBilling: PropTypes.func,
    addBill: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      sRFC: '',
      razonSocial: '',
      RFC: '',
      street: '',
      numberExt: '',
      numberInt: '',
      suburb: '',
      city: '',
      state: '',
      postalCode: '',
      email: '',
      CFDI: 'Gastos en general',
      loading: undefined,
    };
  }

  async componentWillMount() {
    this.folios = [];
    this.tex = [];
    this.num = [''];
    this.props.dispatch(searchBilling(undefined));
    this.props.dispatch(spinner(undefined));
    this.props.dispatch(cleanData(undefined));
    this.props.dispatch(validationData(undefined));
    this.toDo = undefined;
  }

  changesRFC(sRFC) {
    this.setState({ sRFC });
  }
  changeRazonSocial(razonSocial) {
    this.setState({ razonSocial });
  }
  changeRFC(RFC) {
    this.setState({ RFC });
  }
  changeStreet(street) {
    this.setState({ street });
  }
  changeNumberExt(numberExt) {
    this.setState({ numberExt });
  }
  changeNumberInt(numberInt) {
    this.setState({ numberInt });
  }
  changeSuburb(suburb) {
    this.setState({ suburb });
  }
  changeCity(city) {
    this.setState({ city });
  }
  changeState(state) {
    this.setState({ state });
  }
  changePostalCode(postalCode) {
    this.setState({ postalCode });
  }
  changeEmail(email) {
    this.setState({ email });
  }
  changeCFDI(CFDI) {
    this.setState({ CFDI });
  }
  changeFolio(folio) {
    this.setState({ folio });
  }
  changeMonto(monto) {
    this.setState({ monto });
  }

  rfcToSearch() {
    var data = { RFC: this.state.sRFC.trim().toUpperCase() };
    this.props.dispatch(searchData(data));
  }

  validationFolio() {
    this.setState({ loading: true });
    this.props.dispatch(spinner(true));
    this.props.dispatch(validationFolio(this.state));
  }

  aggregateBillings() {
    this.toDo = true;
    this.setState({ loading: true });
    this.props.dispatch(spinner(true));
    this.props.dispatch(question(this.folios));
  }

  async componentWillReceiveProps(props) {

    //-------- Cuando busco un RFC------------
    if (props.RFC) {
      this.state = {
        sRFC: '',
        razonSocial: props.RFC.razonSocial,
        RFC: props.RFC.RFC,
        street: props.RFC.address.street,
        numberExt: props.RFC.address.numberExt,
        numberInt: props.RFC.address.numberInt,
        suburb: props.RFC.address.suburb,
        city: props.RFC.address.city,
        state: props.RFC.address.state,
        postalCode: props.RFC.address.postalCode,
        email: this.state.email,
        CFDI: 'Gastos en general',
        folio: this.state.folio,
      };
    } else {
      if (this.state.sRFC) {
        var rfc = this.state.sRFC.toUpperCase().trim();
        this.state = this.state;
        this.state.RFC = rfc;
        this.state.sRFC = undefined;
      } else {
        this.state = this.state;
      }
    }

    //-- Para limpiar los datos(solo cuando factura lo ejecuta)
    if (props.cleanData == true) {
      this.state = {
        CFDI: 'Gastos en general',
      };
      this.folios = [];
      this.tex = [];
      this.num = [''];
      this.props.dispatch(searchBilling(undefined));
      this.props.dispatch(spinner(undefined));
      this.props.dispatch(cleanData(undefined));
      this.props.dispatch(validationData(undefined));
      this.toDo = undefined;
    }

    //---- aqui es para detener el spinner
    if (props.loading != true) {
      this.state.loading = undefined;
      this.setState.loading = undefined;
      this.setState({ loading: undefined });
    }

    //----- aqui los folios validados se ponen en un arreglo
    if (props.dataFolio && props.loading == true && props.cleanData != true && this.state.folio && this.toDo != true) {
      var igual = 0;
      var seconIgual = 0;
      var tomar = 0;
      var tomar2 = 0;

      this.num.forEach((data) => {
        if (data == this.state.folio) {
          igual = 1;
        } else {
          tomar = 1;
        }
      });

      if (igual != 1 && tomar == 1) {
        this.folios.forEach((arr) => {
          if (arr.cashBox.OptypePayment.value != props.dataFolio.cashBox.OptypePayment.value) {
            seconIgual = 1;
          } else {
            tomar2 = 1;
          }
        });

        if (seconIgual != 1 && this.state.folio == props.dataFolio.folio) {
          this.num.push(props.dataFolio.folio);
          this.folios.push(props.dataFolio);
          var te = (
            <View>
              <Text>
                {'Folio: ' +
                  props.dataFolio.folio +
                  ',  Monto: ' +
                  props.dataFolio.monto +
                  ',  Forma de Pago: ' +
                  props.dataFolio.cashBox.OptypePayment.description +
                  '\n'}
              </Text>
            </View>
          );
          this.tex.push(te);
        } else {
          alert('Ups, No coincide la forma de pago');
        }
      } else {
        alert('Ups, El folio se repite');
      }
    }
  }

  render() {
    return (
      <View>
        <Card>
          <View>
            <View>
              <Text style={styles.textFirst}> {RIDER_BILLING_FISCAL_DATA} </Text>

              <View>
                <Text style={{ paddingTop: 15 }}>{RIDER_BILLING_ENTER_RFC}</Text>
              </View>

              <Col style={{ paddingTop: 10 }}>
                <Text> {RIDER_BILLING_SEARCH_RFC} </Text>
              </Col>

              <Col>
                <View>
                  <InputGroup>
                    <Input
                      name='sRFC'
                      value={this.state.sRFC}
                      onChangeText={(sRFC) => this.changesRFC(sRFC)}
                      placeholder={RIDER_BILLING_RFC}
                      placeholderTextColor='#D5D4D4'
                      autoCapitalize='none'
                    />
                  </InputGroup>
                </View>
              </Col>

              <Col style={{ paddingTop: 20 }}>
                <View>
                  <Button onPress={this.props.handleSubmit(this.rfcToSearch.bind(this))} block style={{ backgroundColor: '#19192B' }}>
                    <Text style={{ color: '#fff', fontWeight: '600' }}> {RIDER_BILLING_SEARCH} </Text>
                  </Button>
                </View>
              </Col>
            </View>
          </View>
        </Card>

        <Card>
          <View>
            <View>
              <View style={{ paddingTop: 15 }}>
                <InputGroup>
                  <Input
                    name='razonSocial'
                    value={this.state.razonSocial}
                    onChangeText={(razonSocial) => this.changeRazonSocial(razonSocial)}
                    placeholder={RIDER_BILLING_SOCIAL_BUSINESS}
                    placeholderTextColor='#D5D4D4'
                    autoCapitalize='none'
                  />
                </InputGroup>
              </View>

              <View style={{ paddingTop: 10 }}>
                <InputGroup>
                  <Input
                    name='RFC'
                    value={this.state.RFC}
                    onChangeText={(RFC) => this.changeRFC(RFC)}
                    placeholder={RIDER_BILLING_RFC}
                    placeholderTextColor='#D5D4D4'
                    autoCapitalize='none'
                  />
                </InputGroup>
              </View>

              <View style={{ paddingTop: 10 }}>
                <InputGroup>
                  <Input
                    name='street'
                    value={this.state.street}
                    onChangeText={(street) => this.changeStreet(street)}
                    placeholder={RIDER_BILLING_STREET}
                    placeholderTextColor='#D5D4D4'
                    autoCapitalize='none'
                  />
                </InputGroup>
              </View>

              <Grid style={{ paddingTop: 10 }}>
                <Col style={styles.payCardInput1}>
                  <InputGroup>
                    <Input
                      name='numberExt'
                      value={this.state.numberExt}
                      onChangeText={(numberExt) => this.changeNumberExt(numberExt)}
                      placeholder={RIDER_BILLING_EXTERIOR}
                      placeholderTextColor='#D5D4D4'
                      autoCapitalize='none'
                    />
                  </InputGroup>
                </Col>

                <Col style={styles.payCardInput}>
                  <InputGroup>
                    <Input
                      name='numberInt'
                      value={this.state.numberInt}
                      onChangeText={(numberInt) => this.changeNumberInt(numberInt)}
                      placeholder={RIDER_BILLING_INTERIOR}
                      placeholderTextColor='#D5D4D4'
                      autoCapitalize='none'
                    />
                  </InputGroup>
                </Col>
              </Grid>

              <View style={{ paddingTop: 10 }}>
                <InputGroup>
                  <Input
                    name='suburb'
                    value={this.state.suburb}
                    onChangeText={(suburb) => this.changeSuburb(suburb)}
                    placeholder={RIDER_BILLING_COLONY}
                    placeholderTextColor='#D5D4D4'
                    autoCapitalize='none'
                  />
                </InputGroup>
              </View>

              <View style={{ paddingTop: 10 }}>
                <InputGroup>
                  <Input
                    name='city'
                    value={this.state.city}
                    onChangeText={(city) => this.changeCity(city)}
                    placeholder={RIDER_BILLING_CITY}
                    placeholderTextColor='#D5D4D4'
                    autoCapitalize='none'
                  />
                </InputGroup>
              </View>

              <View style={{ paddingTop: 10 }}>
                <InputGroup>
                  <Input
                    name='state'
                    value={this.state.state}
                    onChangeText={(state) => this.changeState(state)}
                    placeholder={RIDER_BILLING_STATE}
                    placeholderTextColor='#D5D4D4'
                    autoCapitalize='none'
                  />
                </InputGroup>
              </View>

              <View style={{ paddingTop: 10 }}>
                <InputGroup>
                  <Input
                    name='postalCode'
                    value={this.state.postalCode}
                    onChangeText={(postalCode) => this.changePostalCode(postalCode)}
                    placeholder={RIDER_BILLING_CP}
                    placeholderTextColor='#D5D4D4'
                    autoCapitalize='none'
                  />
                </InputGroup>
              </View>

              <View style={{ paddingTop: 10 }}>
                <InputGroup>
                  <Input
                    name='email'
                    value={this.state.email}
                    onChangeText={(email) => this.changeEmail(email)}
                    placeholder={RIDER_BILLING_EMAIL}
                    placeholderTextColor='#D5D4D4'
                    autoCapitalize='none'
                  />
                </InputGroup>
              </View>

              <View style={{ paddingTop: 10 }}>
                <InputGroup>
                  <Input name='CFDI' value={this.state.CFDI} placeholder={RIDER_BILLING_CFDI} placeholderTextColor='#D5D4D4' autoCapitalize='none' />
                </InputGroup>
              </View>
            </View>
          </View>
        </Card>

        <Card style={{ padding: 10 }}>
          <View>
            <View>
              <Text style={styles.textFirst}> {RIDER_BILLING_SERVICIOS_A_FACTURAR} </Text>

              <View style={{ paddingTop: 10 }}>
                <InputGroup>
                  <Input
                    name='folio'
                    value={this.state.folio}
                    onChangeText={(folio) => this.changeFolio(folio)}
                    placeholder={RIDER_BILLING_FOLIO}
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
                    placeholder={RIDER_BILLING_MONTO}
                    placeholderTextColor='#D5D4D4'
                    autoCapitalize='none'
                  />
                </InputGroup>
              </View>

              <Col style={{ paddingTop: 20 }}>
                <View>
                  {this.state.loading == true && this.props.loading == true ? (
                    <ActivityIndicator size='large' color='#000000' />
                  ) : (
                    <Button onPress={this.props.handleSubmit(this.validationFolio.bind(this))} block style={{ backgroundColor: '#19192B' }}>
                      <Text style={{ color: '#fff', fontWeight: '600' }}> {RIDER_BILLING_AGREGAR} </Text>
                    </Button>
                  )}
                </View>
              </Col>
            </View>
          </View>
        </Card>

        <Card>
          <View>
            <View style={{ paddingTop: 10 }}>
              {this.tex}

              {this.tex && this.tex.length > 0 ? (
                <Col style={{ paddingTop: 20 }}>
                  <View>
                    {this.state.loading == true && this.props.loading == true ? (
                      <ActivityIndicator size='large' color='#000000' />
                    ) : (
                      <Button onPress={this.props.handleSubmit(this.aggregateBillings.bind(this))} block style={{ backgroundColor: '#19192B' }}>
                        <Text style={{ color: '#fff', fontWeight: '600' }}> {RIDER_BILLING_BILLING} </Text>
                      </Button>
                    )}
                  </View>
                </Col>
              ) : (
                <View></View>
              )}
            </View>
          </View>
        </Card>
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    searchData: (RFC) => dispatch(searchData(RFC)),
    addBilling: (dataRFC) => dispatch(addBilling(dataRFC)),
    searchBilling: () => dispatch(searchBilling()),
    spinner: () => dispatch(spinner()),
    cleanData: () => dispatch(cleanData()),
    validationData: () => dispatch(validationData()),
    addBill: () => dispatch(addBill()),
  };
}

export default reduxForm({
  form: 'billing',
  bindActions,
})(BillingForm);
