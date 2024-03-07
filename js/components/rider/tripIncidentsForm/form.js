import { Button, Card, Textarea } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Field, reduxForm } from 'redux-form';

import { reportIncident } from '../../../actions/rider/incidents';
import { COMMON_TRIP_DETAILS_FORM_PLACEHOLDER, COMMON_TRIP_DETAILS_FORM_VALIDATION, RIDER_HOME_VALIDATION_MODAL_SEND_BTN } from '../../../textStrings';
import Spinner from '../../loaders/Spinner';
import styles from './styles';

const validate = (values) => {
  const errors = {};
  if (!values.comment) {
    errors.comment = COMMON_TRIP_DETAILS_FORM_VALIDATION;
  }

  return errors;
};

class IncidentForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    isFetching: PropTypes.bool,
  };

  submit(values) {
    this.props.dispatch(reportIncident(values));
  }

  inputComment = (props) => {
    const { input, meta } = props;

    return (
      <View style={{ padding: 10 }}>
        <Card style={styles.inputContainer}>
          <Textarea multiline numberOfLines={5} style={{ textAlign: 'center' }} {...input} {...props} />
        </Card>
        {meta.touched && meta.error && <Text style={{ color: 'red' }}>{meta.error}</Text>}
      </View>
    );
  };

  render() {
    return (
      <View>
        <Field
          style={{ height: 200 }}
          component={this.inputComment}
          type='text'
          name='comment'
          placeholder={COMMON_TRIP_DETAILS_FORM_PLACEHOLDER}
          maxLength={200}
          placeholderTextColor='#797979'
        />

        <View style={{ padding: 10 }}>
          <Button onPress={this.props.handleSubmit(this.submit.bind(this))} block disabled={this.props.isFetching} style={styles.saveBtn}>
            {this.props.isFetching ? <Spinner /> : <Text style={styles.btnText}>{RIDER_HOME_VALIDATION_MODAL_SEND_BTN}</Text>}
          </Button>
        </View>
      </View>
    );
  }
}

export default reduxForm({
  form: 'incidentForm', // a unique name for this form
  validate,
})(IncidentForm);
