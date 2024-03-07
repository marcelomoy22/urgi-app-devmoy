import { Button, Col, Grid, Input, InputGroup } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Field, reduxForm } from 'redux-form';

import { registerAsyncFb } from '../../../actions/common/register';
import { askLocationPermissions } from '../../../actions/permissions';
import { COMMON_LOCATION_DENIED_ALERT, COMMON_REGISTER_BTN, FORM_VALIDATION_PHONE, FORM_VALIDATION_PHONE_EMPTY } from '../../../textStrings';
import Spinner from '../../loaders/Spinner';
import styles from './styles';

const validate = (values) => {
  const errors = {};
  if (!values.phone) {
    errors.phone = FORM_VALIDATION_PHONE_EMPTY;
  } else if (!values.phone.match(/^\d{10}$/)) {
    errors.phone = FORM_VALIDATION_PHONE;
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

class RegisterFb extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    isFetching: PropTypes.bool,
    socialLogin: PropTypes.object,
  };

  async submit(values) {
    const permission = await askLocationPermissions();
    if (permission) {
      const userInfo = {
        fname: this.props.socialLogin.fname,
        lname: this.props.socialLogin.lname,
        email: this.props.socialLogin.email,
        phoneNo: values.phone,
      };
      this.props.dispatch(registerAsyncFb(userInfo, this.props.navigator));
    } else alert(COMMON_LOCATION_DENIED_ALERT);
  }

  componentWillMount() {
    const socialLogin = this.props.socialLogin;
    if (socialLogin !== null) {
      this.setState({
        fname: socialLogin.fname,
        lname: socialLogin.lname,
        email: socialLogin.email,
      });
    }
  }

  render() {
    return (
      <View>
        <Grid>
          <Col style={{ padding: 10 }}>
            <Text style={{ color: '#797979' }}>{this.state.fname}</Text>
          </Col>

          <Col style={{ padding: 10 }}>
            <Text>{this.state.lname}</Text>
          </Col>
        </Grid>

        <View style={{ padding: 10 }}>
          <Text>{this.state.email}</Text>
        </View>

        <View style={{ padding: 10 }}>
          <Field component={input} name='phone' placeholder='Mobile Number' placeholderTextColor='#797979' keyboardType='numeric' />
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
  form: 'register-fb', // a unique name for this form
  validate,
})(RegisterFb);
