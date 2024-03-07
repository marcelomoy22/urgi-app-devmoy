import { Button, Input, InputGroup } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CheckBox from 'react-native-check-box';
import { Field, reduxForm } from 'redux-form';

import { registerAnonAsync } from '../../../actions/common/register';
import { signinAsync } from '../../../actions/common/signin';
import { askLocationPermissions } from '../../../actions/permissions';
import {
  CHECK_BOX_TEXT,
  COMMON_LOCATION_DENIED_ALERT,
  COMMON_SIGNIN_ANON_BTN,
  COMMON_SIGNIN_BTN,
  COMMON_SIGNIN_FORGOT_PASSWORD_LABEL,
  FORM_VALIDATION_ACCOUNT_EMPTY,
  FORM_VALIDATION_EMAIL,
  FORM_VALIDATION_PASSWORD_EMPTY,
  FORM_VALIDATION_PHONE,
  FORM_VALIDATION_UNIT_NUMBER,
} from '../../../textStrings';
import Spinner from '../../loaders/Spinner';
import styles from './styles';

const validate = (values) => {
  const errors = {};
  const regex = /[A-Za-z]/g;

  if (!values.account) {
    errors.account = FORM_VALIDATION_ACCOUNT_EMPTY;
  } else if (!values.account.match(regex) && values.account.length !== 10) {
    errors.account = FORM_VALIDATION_PHONE;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.account) && values.account.length !== 10) {
    errors.account = FORM_VALIDATION_EMAIL;
  }

  if (!values.password) {
    errors.password = FORM_VALIDATION_PASSWORD_EMPTY;
  }
  if (values.checkbox && !values.unit) {
    errors.unit = FORM_VALIDATION_UNIT_NUMBER;
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
input.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
};

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    pushNewRoute: PropTypes.func,
    isFetching: PropTypes.bool,
    navigator: PropTypes.object
  };

  async submit(values) {
    const permission = await askLocationPermissions();
    if (permission) {
      this.props.dispatch(signinAsync(values, this.props.navigator));
    } else alert(COMMON_LOCATION_DENIED_ALERT);
  }

  async submitAnon(values) {
    const permission = await askLocationPermissions();
    if (permission) {
      this.props.dispatch(registerAnonAsync(this.props.navigator));
    } else alert(COMMON_LOCATION_DENIED_ALERT);
  }

  renderUnit(condition, render) {
    // render unit field if checkbox is checked
    if (condition) {
      return render;
    }
    return null;
  }

  renderCheckbox = (props) => {
    const { input } = props;
    return (
      <CheckBox
        {...input}
        {...props}
        checkBoxColor='#d0d0d0'
        rightText={CHECK_BOX_TEXT}
        onClick={() => {
          this.setState({ checked: !this.state.checked });
          input.onChange(!input.value);
        }}
        isChecked={this.state.checked}
        rightTextStyle={{ color: '#d0d0d0' }}
        style={{ marginTop: 5, marginBottom: 15 }}
      />
    );
  };

  render() {
    return (
      <View>
        <View style={{ padding: 10 }}>
          <Field
            component={input}
            type='email'
            name='account'
            placeholder='Correo ó Teléfono'
            placeholderTextColor='#797979'
            keyboardType='email-address'
            autoCapitalize='none'
          />
        </View>
        <View style={{ padding: 10 }}>
          <Field component={input} placeholder='Password' secureTextEntry placeholderTextColor='#797979' name='password' autoCapitalize='none' />
        </View>
        <TouchableOpacity onPress={() => this.props.pushNewRoute('passwordRecovery')}>
          <Text style={styles.passwordResetText}>{COMMON_SIGNIN_FORGOT_PASSWORD_LABEL}</Text>
        </TouchableOpacity>
        <View style={{ padding: 10 }}>
          <Field component={this.renderCheckbox} name='checkbox' />
        </View>
        <View style={{ padding: 10 }}>
          {this.renderUnit(
            this.state.checked,
            <Field
              component={input}
              name='unit'
              type='number'
              placeholder='Unidad'
              placeholderTextColor='#797979'
              keyboardType='numeric'
              autoCapitalize='none'
            />
          )}
        </View>

        <View style={styles.regBtnContain}>
          <Button onPress={this.props.handleSubmit(this.submit.bind(this))} block style={styles.regBtn}>
            {this.props.isFetching ? <Spinner /> : <Text style={{ color: '#fff', fontWeight: '600' }}>{COMMON_SIGNIN_BTN}</Text>}
          </Button>
        </View>
        {/* <View style={styles.regBtnContain}>
          <Button onPress={this.submitAnon.bind(this)} block style={styles.regBtn}>
            {this.props.isFetching ? <Spinner /> : <Text style={{ color: '#fff', fontWeight: '600' }}>{COMMON_SIGNIN_ANON_BTN}</Text>}
          </Button>
        </View> */}
      </View>
    );
  }
}
export default reduxForm({
  form: 'login', // a unique name for this form
  validate,
})(LoginForm);
