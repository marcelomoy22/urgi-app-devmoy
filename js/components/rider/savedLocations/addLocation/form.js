import { Button, CardItem, Input, InputGroup } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Field, reduxForm } from 'redux-form';

import { startSearch } from '../../../../actions/autoComplete';
import { updateLocationList } from '../../../../actions/rider/savedLocations';
import {
  FORM_VALIDATION_DESTINY,
  FORM_VALIDATION_DESTINY_EMPTY,
  RIDER_ADD_LOCATION_NAME_EMPTY,
  RIDER_ADD_LOCATION_NAME_PLACEHOLDER,
  RIDER_ADD_LOCATION_PLACEHOLDER,
  RIDER_ADD_LOCATION_SUBMIT,
} from '../../../../textStrings';
import AutoComplete from '../../../autocomplete';
import Spinner from '../../../loaders/Spinner';
import styles from './styles';

const validate = (values) => {
  const errors = {};

  if (!values.configName) {
    errors.configName = RIDER_ADD_LOCATION_NAME_EMPTY;
  }

  if (!values.address) {
    errors.address = FORM_VALIDATION_DESTINY_EMPTY;
  } else if (values.address === 'error') {
    errors.address = FORM_VALIDATION_DESTINY;
  }

  return errors;
};

class AddLocationForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    isFetching: PropTypes.bool,
    location: PropTypes.object,
    region: PropTypes.string,
    address: PropTypes.string,
    goBack: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      configName: '',
      searchInputText: '',
    };
  }

  submit(values) {
    const data = {
      location: [this.props.location.lat, this.props.location.lng],
      address: values.address,
      name: values.configName,
    };

    this.props.dispatch(updateLocationList(data));

    this.props.goBack();
  }

  destiny = (props) => {
    const { meta, input } = props;

    return (
      <View>
        <InputGroup>
          <Input
            {...input}
            {...props}
            placeholderTextColor='#797979'
            value={this.props.address}
            style={{ color: 'green' }}
            onChangeText={(searchInputText) => {
              this.setState({ searchInputText });
              this.props.dispatch(startSearch(this.props.region, searchInputText));
            }}
            onSubmitEditing={() => this.props.dispatch(startSearch(this.props.region, this.state.searchInputText))}
          />
        </InputGroup>
        {meta.touched && meta.error && <Text style={{ color: 'red' }}>{meta.error}</Text>}
      </View>
    );
  };

  input = (props) => {
    const { meta, input } = props;

    return (
      <View>
        <InputGroup>
          <Input
            {...input}
            {...props}
            value={this.state.configName}
            onChangeText={(inputText) => {
              this.setState({ configName: inputText });
            }}
          />
        </InputGroup>

        {meta.touched && meta.error && <Text style={{ color: 'red' }}>{meta.error}</Text>}
      </View>
    );
  };

  render() {
    return (
      <View>
        <View style={{ padding: 10 }}>
          <Field component={this.input} name='configName' placeholder={RIDER_ADD_LOCATION_NAME_PLACEHOLDER} placeholderTextColor='#797979' />
        </View>

        <View style={{ padding: 10 }}>
          <Field
            component={this.destiny}
            name='address'
            placeholder={RIDER_ADD_LOCATION_PLACEHOLDER}
            placeholderTextColor='#797979'
            value={this.props.address}
          />
        </View>
        {this.state.searchInputText !== '' && this.state.searchInputText.length > 1 && <AutoComplete />}
        <View style={{ padding: 10 }}>
          <View>
            <Button onPress={this.props.handleSubmit(this.submit.bind(this))} block disabled={this.props.isFetching} style={styles.tripBtn}>
              {this.props.isFetching ? <Spinner /> : <Text style={styles.btnText}>{RIDER_ADD_LOCATION_SUBMIT}</Text>}
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

AddLocationForm = reduxForm({
  form: 'saveLocation', // a unique name for this form
  validate,
})(AddLocationForm);

export default AddLocationForm;
