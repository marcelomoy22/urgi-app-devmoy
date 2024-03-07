import { Button, Col, Grid, Input, InputGroup } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Field, reduxForm } from 'redux-form';

import { registerAsync } from '../../../actions/common/register';
import { askLocationPermissions } from '../../../actions/permissions';
import {
  COMMON_LOCATION_DENIED_ALERT,
  COMMON_REGISTER_BTN,
  FORM_VALIDATION_FNAME,
  FORM_VALIDATION_FNAME_EMPTY,
  FORM_VALIDATION_LNAME,
  FORM_VALIDATION_LNAME_EMPTY,
  FORM_VALIDATION_PASSWORD_EMPTY,
  FORM_VALIDATION_PASSWORDS_MATCH,
  FORM_VALIDATION_PHONE,
  FORM_VALIDATION_PHONE_EMPTY,
} from '../../../textStrings';
import Spinner from '../../loaders/Spinner';
import styles from './styles';

const validate = (values) => {
  const errors = {};
  if (!values.fname) {
    errors.fname = FORM_VALIDATION_FNAME_EMPTY;
  } else if (!/^[a-zA-Z]*$/.test(values.fname)) {
    errors.fname = FORM_VALIDATION_FNAME;
  }

  if (!values.lname) {
    errors.lname = FORM_VALIDATION_LNAME_EMPTY;
  } else if (!/^[a-zA-Z]*$/.test(values.lname)) {
    errors.lname = FORM_VALIDATION_LNAME;
  }

  // if (!values.email) {
  //   errors.email = FORM_VALIDATION_EMAIL_EMPTY;
  // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
  //   errors.email = FORM_VALIDATION_EMAIL;
  // }

  if (!values.phoneNo) {
    errors.phoneNo = FORM_VALIDATION_PHONE_EMPTY;
  } else if (!values.phoneNo.match(/^\d{10}$/)) {
    errors.phoneNo = FORM_VALIDATION_PHONE;
  }

  if (!values.password) {
    errors.password = FORM_VALIDATION_PASSWORD_EMPTY;
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = FORM_VALIDATION_PASSWORDS_MATCH;
  }
  return errors;
};

export const input = (props) => {
  const { meta, input } = props;
  return (
    <View>
      <InputGroup>
        <Input {...input} {...props} />
      </InputGroup>

      {meta.touched && meta.error && <Text style={{ color: 'red' }}>{meta.error}</Text>}
    </View>
  );
};

class RegisterForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    isFetching: PropTypes.bool,
  };

  async submit(values) {
    const permission = await askLocationPermissions();
    if (permission) {
      this.props.dispatch(registerAsync(values, this.props.navigator));
    } else alert(COMMON_LOCATION_DENIED_ALERT);
  }

  render() {
    return (
      <View>
        <Grid>
          <Col style={{ padding: 10 }}>
            <Field component={input} name='fname' placeholder='First Name' placeholderTextColor='#797979' />
          </Col>

          <Col style={{ padding: 10 }}>
            <Field component={input} name='lname' placeholder='Last Name' placeholderTextColor='#797979' />
          </Col>
        </Grid>

        <View style={{ padding: 10 }}>
          <Field
            component={input}
            type='email'
            name='email'
            placeholder='Email'
            placeholderTextColor='#797979'
            keyboardType='email-address'
            autoCapitalize='none'
          />
        </View>

        <View style={{ padding: 10 }}>
          <Field component={input} name='phoneNo' placeholder='Mobile Number' placeholderTextColor='#797979' keyboardType='numeric' />
        </View>

        <View style={{ padding: 10 }}>
          <Field component={input} name='password' placeholder='Password' secureTextEntry placeholderTextColor='#797979' autoCapitalize='none' />
        </View>

        <View style={{ padding: 10 }}>
          <Field component={input} name='confirmPassword' placeholder='Confirm password' secureTextEntry placeholderTextColor='#797979' autoCapitalize='none' />
        </View>

        {this.props.error && <Text style={{ color: 'red' }}>{this.props.error}</Text>}
        <View style={styles.regBtnContain}>
          <Button onPress={this.props.handleSubmit(this.submit.bind(this))} block style={styles.regBtn}>
            {this.props.isFetching ? <Spinner /> : <Text style={{ color: '#fff', fontWeight: '600' }}>{COMMON_REGISTER_BTN}</Text>}
          </Button>
        </View>
      </View>
    );
  }
}
export default reduxForm({
  form: 'register', // a unique name for this form
  validate,
})(RegisterForm);
