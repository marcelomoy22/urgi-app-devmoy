import { Button, Icon, Input, InputGroup, Text } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';
import { Field, reduxForm } from 'redux-form';

import { createOpenpayToken } from '../../../actions/rider/payment';
import {
  CARD_HOLDER_PLACEHOLDER,
  CARD_HOLDER_REQUIRED,
  CARD_MONTH_INVALID,
  CARD_MONTH_PLACEHOLDER,
  CARD_MONTH_REQUIRED,
  CARD_NUM_INVALID,
  CARD_NUM_REQUIRED,
  CARD_NUMBER_PLACEHOLDER,
  CARD_PIN_INVALID_3,
  CARD_PIN_INVALID_4,
  CARD_PIN_PLACEHOLDER,
  CARD_PIN_REQUIRED,
  CARD_YEAR_INVALID,
  CARD_YEAR_PLACEHOLDER,
  CARD_YEAR_REQUIRED,
  RIDER_CREDIT_CARD_ADD_PAYMENT_BTN,
} from '../../../textStrings';
import Spinner from '../../loaders/Spinner';
import styles from './styles';

const imageLogo = require('../../../../images/paytm2.png');
const imageSecurity = require('../../../../images/security.png');
const cards = require('../../../../images/cards1.png');

const validate = (values) => {
  const errors = {};
  if (!values.cardHolder) {
    errors.cardHolder = CARD_HOLDER_REQUIRED;
  }

  if (!values.cardNumber) {
    errors.cardNumber = CARD_NUM_REQUIRED;
  } else if (values.cardNumber.length !== 15 && values.cardNumber.length !== 16) {
    errors.cardNumber = CARD_NUM_INVALID;
  }

  if (!values.month) {
    errors.month = CARD_MONTH_REQUIRED;
  } else if (values.month.length !== 2) {
    errors.month = CARD_MONTH_INVALID;
  }

  if (!values.year) {
    errors.year = CARD_YEAR_REQUIRED;
  } else if (values.year.length !== 2) {
    errors.year = CARD_YEAR_INVALID;
  }

  if (values.cardNumber) {
    if (!values.pin) {
      errors.pin = CARD_PIN_REQUIRED;
    } else if (values.cardNumber.length === 15) {
      if (values.pin.length !== 4) errors.pin = CARD_PIN_INVALID_4;
    } else if (values.cardNumber.length === 16) {
      if (values.pin.length !== 3) errors.pin = CARD_PIN_INVALID_3;
    }
  }
  return errors;
};

export const inputCardHolder = (props) => {
  const { meta, input } = props;
  return (
    <View>
      <InputGroup style={{ borderBottomColor: '#797979' }}>
        <Icon name='ios-person' style={{ color: '#797979' }} />
        <Input {...input} {...props} />
      </InputGroup>

      {meta.touched && meta.error && <Text style={{ color: 'red' }}>{meta.error}</Text>}
    </View>
  );
};

export const inputCardNumber = (props) => {
  const { meta, input } = props;
  return (
    <View>
      <InputGroup style={{ borderBottomColor: '#24BCD9' }}>
        <Icon name='ios-card' style={{ color: '#797979' }} />
        <Input {...input} {...props} />
      </InputGroup>

      {meta.touched && meta.error && <Text style={{ color: 'red' }}>{meta.error}</Text>}
    </View>
  );
};

export const inputGeneral = (props) => {
  const { meta, input } = props;
  return (
    <View>
      <InputGroup style={{ borderBottomColor: '#797979' }}>
        <Input {...input} {...props} />
      </InputGroup>

      {meta.touched && meta.error && <Text style={{ color: 'red' }}>{meta.error}</Text>}
    </View>
  );
};

class CreditCardForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    isFetching: PropTypes.bool,
  };

  registerCard(values) {
    const cardData = {
      card_number: values.cardNumber,
      holder_name: values.cardHolder,
      cvv2: values.pin,
      expiration_month: values.month,
      expiration_year: values.year,
    };

    this.props.dispatch(createOpenpayToken(cardData));
  }

  render() {
    return (
      <View>
        <View>
          <Field
            component={inputCardHolder}
            type='name'
            name='cardHolder'
            placeholder={CARD_HOLDER_PLACEHOLDER}
            placeholderTextColor='#797979'
            autoCapitalize='none'
          />
        </View>
        <View>
          <Field
            component={inputCardNumber}
            keyboardType='numeric'
            name='cardNumber'
            placeholder={CARD_NUMBER_PLACEHOLDER}
            placeholderTextColor='#797979'
            maxLength={16}
          />
        </View>
        <Grid style={{ paddingVertical: 10 }}>
          <Col style={styles.payCardInput}>
            <Field
              component={inputGeneral}
              keyboardType='numeric'
              name='month'
              placeholder={CARD_MONTH_PLACEHOLDER}
              placeholderTextColor='#797979'
              maxLength={2}
            />
          </Col>
          <Col style={styles.payCardInput}>
            <Field
              component={inputGeneral}
              keyboardType='numeric'
              name='year'
              placeholder={CARD_YEAR_PLACEHOLDER}
              placeholderTextColor='#797979'
              maxLength={2}
            />
          </Col>
          <Col style={{ flex: 4 }}>
            <Field component={inputGeneral} keyboardType='numeric' name='pin' placeholder={CARD_PIN_PLACEHOLDER} placeholderTextColor='#797979' maxLength={4} />
          </Col>
        </Grid>

        <Button block style={{ backgroundColor: '#19192B' }} disabled={this.props.isFetching} onPress={this.props.handleSubmit(this.registerCard.bind(this))}>
          {this.props.isFetching ? <Spinner /> : <Text style={{ color: '#fff', fontWeight: '600' }}>{RIDER_CREDIT_CARD_ADD_PAYMENT_BTN} </Text>}
        </Button>

        <View style={{ paddingTop: 20 }}>
          <Text>Tarjetas de crédito y debito:</Text>
          <Image source={cards} />

          <Text style={{ paddingTop: 20 }}> Transacciones realizadas vía:</Text>
          <Image source={imageLogo} />

          <Text style={{ paddingTop: 20 }}>Tus pagos se realizan de forma segura con encriptación de 256 bits:</Text>
          <Image source={imageSecurity} />
        </View>
      </View>
    );
  }
}

export default reduxForm({
  form: 'creditcard', // a unique name for this form
  validate,
})(CreditCardForm);
