import { Button, Card, CardItem, Icon, Input } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { updateUserProfileAsync } from '../../../actions/common/settings';
import {
  COMMON_SETTINGS_BRAND,
  COMMON_SETTINGS_ECO_NUMBER,
  COMMON_SETTINGS_EMAIL,
  COMMON_SETTINGS_EMERGENCY,
  COMMON_SETTINGS_ENABLE_PROFILES,
  COMMON_SETTINGS_FNAME,
  COMMON_SETTINGS_HOME,
  COMMON_SETTINGS_JAYANAGAR,
  COMMON_SETTINGS_LNAME,
  COMMON_SETTINGS_MOBILE1,
  COMMON_SETTINGS_MOBILE2,
  COMMON_SETTINGS_MYSTORE,
  COMMON_SETTINGS_PEOPLE,
  COMMON_SETTINGS_PLACEHOLDER_OPTIONAL,
  COMMON_SETTINGS_PLACES,
  COMMON_SETTINGS_PROFILES,
  COMMON_SETTINGS_SAVE_BTN,
  COMMON_SETTINGS_SCORE,
  COMMON_SETTINGS_START_RIDING,
  COMMON_SETTINGS_SUGGESTED_INVITES,
  COMMON_SETTINGS_WORK,
  FORM_VALIDATION_EMAIL,
  FORM_VALIDATION_EMAIL_EMPTY,
  FORM_VALIDATION_PHONE,
  FORM_VALIDATION_PHONE_EMPTY,
} from '../../../textStrings';
import Spinner from '../../loaders/Spinner';
import styles from './styles';

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = FORM_VALIDATION_EMAIL_EMPTY;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = FORM_VALIDATION_EMAIL;
  } else if (!values.phoneNo) {
    errors.phoneNo = FORM_VALIDATION_PHONE_EMPTY;
  }
  if (!/^\d+$/.test(values.phoneNo2) && values.phoneNo2) {
    errors.phoneNo2 = FORM_VALIDATION_PHONE;
  }
  // else if (!values.phoneNo.match(/^(\+52[\-\s]?)?[0]?(91)?[789]\d{9}$/i)) {
  //   errors.phoneNo = FORM_VALIDATION_PHONE;
  // }
  return errors;
};

export const input = (props) => {
  const { meta, input } = props;
  return (
    <View>
      <Input {...input} {...props} />
      {meta.touched && meta.error && <Text style={{ color: 'red' }}>{meta.error}</Text>}
    </View>
  );
};
input.propTypes = {
  input: PropTypes.object,
};

class SettingsForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    userType: PropTypes.string,
    isFetching: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      rider: true,
      edit: false,
    };
  }

  componentDidMount() {
    if (this.props.userType === 'driver') this.setState({ rider: false });
  }

  submit(values) {
    this.props.dispatch(updateUserProfileAsync(values));
  }

  render() {
    return (
      <View>
        <Card>
          <View style={[{ flexDirection: 'row' }, styles.inputContainer]}>
            <View style={styles.input}>
              <Text style={{fontWeight: 'bold'}} note>{COMMON_SETTINGS_FNAME}</Text>
              <Field component={input} style={{ marginLeft: -5 }} name='fname' editable={this.state.edit} />
            </View>
            <View style={styles.input}>
              <Text style={{fontWeight: 'bold'}} note>{COMMON_SETTINGS_LNAME}</Text>
              <Field component={input} style={{ marginLeft: -5 }} name='lname' editable={this.state.edit} />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <Text style={{fontWeight: 'bold'}} note>{COMMON_SETTINGS_EMAIL}</Text>
              <Field component={input} style={{ marginLeft: -5 }} name='email' editable={this.state.edit} />
            </View>
            <View style={styles.input}>
              <Text style={{fontWeight: 'bold'}} note>{COMMON_SETTINGS_MOBILE1}</Text>
              <Field component={input} style={{ marginLeft: -5 }} keyboardType='numeric' name='phoneNo' editable={this.state.edit} />
            </View>
          </View>

          {this.props.userType == '*rider*' ? ( // change to this.state.rider when view is done!
            <View>
              <View style={styles.blueBorder}>
                <Text style={styles.blueHeader}>{COMMON_SETTINGS_PROFILES}</Text>
              </View>
              <TouchableOpacity>
                <View style={{ borderBottomWidth: 0, paddingBottom: 0 }}>
                  <Icon name='ios-add-circle-outline' style={{ fontSize: 25, color: '#444' }} />
                  <Text>{COMMON_SETTINGS_START_RIDING}</Text>
                </View>
              </TouchableOpacity>
              <View style={{ borderBottomWidth: 0 }}>
                <Text note>{COMMON_SETTINGS_ENABLE_PROFILES}</Text>
              </View>
              <View style={styles.blueBorder}>
                <Text style={styles.blueHeader}>{COMMON_SETTINGS_PLACES}</Text>
              </View>
              <TouchableOpacity>
                <View>
                  <Icon name='ios-home' style={{ fontSize: 20, color: '#aaa' }} />
                  <Text>{COMMON_SETTINGS_HOME}</Text>
                  <Text note>{COMMON_SETTINGS_MYSTORE}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ borderBottomWidth: 0 }}>
                <View>
                  <Icon name='ios-briefcase' style={{ fontSize: 20, color: '#aaa' }} />
                  <Text>{COMMON_SETTINGS_WORK}</Text>
                  <Text note>{COMMON_SETTINGS_JAYANAGAR}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.blueBorder}>
                <Text style={styles.blueHeader}>{COMMON_SETTINGS_PEOPLE}</Text>
              </View>
              <View>
                <TouchableOpacity>
                  <Text>{COMMON_SETTINGS_EMERGENCY}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ borderBottomWidth: 0 }}>
                <TouchableOpacity>
                  <Text>{COMMON_SETTINGS_SUGGESTED_INVITES}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View />
          )}

          {!this.state.rider ? (
            <View>
              <View style={styles.inputContainer}>
                <View style={styles.input}>
                  <Text style={{fontWeight: 'bold'}} note>{COMMON_SETTINGS_ECO_NUMBER}</Text>
                  <Field component={input} style={{ marginLeft: -5 }} keyboardType='numeric' name='unit.name' editable={this.state.edit} />
                </View>
                <View style={styles.input}>
                  <Text style={{fontWeight: 'bold'}} note>{COMMON_SETTINGS_BRAND}</Text>
                  <Field component={input} style={{ marginLeft: -5 }} name='unit.mark' editable={this.state.edit} />
                </View>
                <View style={styles.input}>
                  <Text style={{fontWeight: 'bold'}} note>{COMMON_SETTINGS_SCORE}</Text>
                  <Field component={input} style={{ marginLeft: -5 }} name='score' editable={this.state.edit} />
                </View>
                <View style={styles.input}>
                  <Text style={{fontWeight: 'bold'}} note>{COMMON_SETTINGS_MOBILE2}</Text>
                  <Field
                    component={input}
                    style={{ marginLeft: -5 }}
                    keyboardType='numeric'
                    placeholder={COMMON_SETTINGS_PLACEHOLDER_OPTIONAL}
                    name='phoneNo2'
                  />
                </View>
                <View style={{ padding: 10 }}>
                  <Button onPress={this.props.handleSubmit(this.submit.bind(this))} block disabled={this.props.isFetching} style={styles.saveBtn}>
                    {this.props.isFetching ? <Spinner /> : <Text style={styles.btnText}>{COMMON_SETTINGS_SAVE_BTN}</Text>}
                  </Button>
                </View>
              </View>
            </View>
          ) : (
            <View />
          )}
        </Card>
      </View>
    );
  }
}

SettingsForm = reduxForm({
  form: 'settings', // a unique name for this form
  validate,
})(SettingsForm);

SettingsForm = connect((state) => ({
  initialValues: {
    fname: state.rider.user.fname || state.driver.user.fname,
    lname: state.rider.user.lname || state.driver.user.lname,
    email: state.rider.user.email || state.driver.user.email,
    phoneNo: state.rider.user.phoneNo || state.driver.user.phoneNo,
    phoneNo2: state.driver.user.phoneNo2,
    unit: state.driver.user.carDetails || {},
    score: state.driver.user.userRaiting || '5.0',
  },
}))(SettingsForm);

export default SettingsForm;
