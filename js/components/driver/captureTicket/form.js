import { Button, CardItem, Input, InputGroup } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { change, Field, reduxForm } from 'redux-form';

import { startSearch } from '../../../actions/autoComplete';
import { ticketAsync } from '../../../actions/driver/captureTicket';
import {
  CAPTURE_TICKET_BTN,
  DRIVER_CAPTURETICKET_PLACEHOLDER_DEST,
  DRIVER_CAPTURETICKET_PLACEHOLDER_TICKET_CODE,
  DRIVER_CAPTURETICKET_PLACEHOLDER_TICKET_NUM,
  FORM_VALIDATION_DESTINY,
  FORM_VALIDATION_DESTINY_EMPTY,
  FORM_VALIDATION_PIC_EMPTY,
  FORM_VALIDATION_TICKET_NUMBER,
  FORM_VALIDATION_TICKET_NUMBER_EMPTY,
  FORM_VALIDATION_TICKET_NUMBER_LENGTH,
  FORM_VALIDATION_TICKET_SECURITY_CODE,
  FORM_VALIDATION_TICKET_SECURITY_CODE_EMPTY,
  START_TRIP_BTN,
} from '../../../textStrings';
import AutoComplete from '../../autocomplete';
import Spinner from '../../loaders/Spinner';
import styles from './styles';

let askForSecurity;

const validate = (values) => {
  const errors = {};

  if(values && values.ticketNumber){
    if(values.ticketNumber.length >28){
      var newTicket=[]
      for (var i = 0; i < values.ticketNumber.length; i++) {
        if(values.ticketNumber[i]!==','){
          newTicket.push(values.ticketNumber[i])
        }else{
          break;
        }
      }
      values.ticketNumber = newTicket.join('')
    }
  }

  if (values.ticketNumber || values.securityCode || values.camera) {
    if (!values.ticketNumber) {
      errors.ticketNumber = FORM_VALIDATION_TICKET_NUMBER_EMPTY;
    } else if (!/^\d+$/.test(values.ticketNumber)) {
      errors.ticketNumber = FORM_VALIDATION_TICKET_NUMBER;
    } else if (
      values.ticketNumber.length !== 2 &&
      values.ticketNumber.length !== 21 &&
      values.ticketNumber.length !== 12 &&
      values.ticketNumber.length !== 14 &&
      values.ticketNumber.length !== 0
    ) {
      errors.ticketNumber = FORM_VALIDATION_TICKET_NUMBER_LENGTH;
    } else {
      askForSecurity = false;
    }

    if (!values.securityCode) {
      errors.securityCode = FORM_VALIDATION_TICKET_SECURITY_CODE_EMPTY;
    } else if (values.securityCode.length !== 5) {
      errors.securityCode = FORM_VALIDATION_TICKET_SECURITY_CODE;
    }

    if (!values.camera) {
      errors.camera = FORM_VALIDATION_PIC_EMPTY;
    }
  }

  if (!values.destAddress) {
    errors.destAddress = FORM_VALIDATION_DESTINY_EMPTY;
  } else if (values.destAddress === 'error') {
    errors.destAddress = FORM_VALIDATION_DESTINY;
  }

  return errors;
};

class CTForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    isFetching: PropTypes.bool,
    location: PropTypes.object,
    image: PropTypes.string,
    code: PropTypes.string,
    destAddress: PropTypes.string,
    destLoc: PropTypes.object,
    pendingTicket: PropTypes.object,
    goBack: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      pickUpAddress: '',
      searchInputText: '',
      region: `${props.location.latitude}` + ',' + `${props.location.longitude}`,
    };

    this.getLocAddress(props.location.latitude, props.location.longitude);
  }

  submit(values) {
    const locations = {
      srcLoc: [this.props.location.latitude, this.props.location.longitude],
      destLoc: [this.props.destLoc.lat, this.props.destLoc.lng],
      pickUpAddress: this.state.pickUpAddress,
      destAddress: this.props.destAddress,
    };

    if (!this.props.pendingTicket) values.new = true;
    else values.new = false;

    this.props.dispatch(ticketAsync(values, locations));

    this.props.goBack();
  }

  // **************************************
  //  AUTO COMPLETE FUNCTIONS STARTS HERE *
  // **************************************
  getLocAddress(lat, long) {
    const param = {
      latlng: `${lat}` + ',' + `${long}`,
      key: 'AIzaSyDii65UXo0SBSWHtQgAXO8vpOAm0vzA97w',
    };
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?';
    url += Object.keys(param)
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(param[k])}`)
      .join('&');

    console.log(url);
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ pickUpAddress: responseJson.results[1].formatted_address });
      });
  }

  destiny = (props) => {
    const { meta, input } = props;
    if (this.props.pendingTicket) {
      this.props.dispatch(change('captureTicket', 'destAddress', this.props.pendingTicket.destAddress));
    }

    return (
      <View>
        <InputGroup disabled={!!this.props.pendingTicket}>
          <Input
            {...input}
            {...props}
            placeholder={DRIVER_CAPTURETICKET_PLACEHOLDER_DEST}
            placeholderTextColor='#797979'
            value={this.props.pendingTicket ? this.props.pendingTicket.destAddress : this.props.destAddress}
            style={{ color: 'green' }}
            onChangeText={(searchInputText) => {
              this.setState({ searchInputText });
              this.props.dispatch(startSearch(this.state.region, searchInputText));
            }}
            onSubmitEditing={() => this.props.dispatch(startSearch(this.state.region, this.state.searchInputText))}
          />
        </InputGroup>
        {meta.touched && meta.error && <Text style={{ color: 'red' }}>{meta.error}</Text>}
      </View>
    );
  };

  // **************************************
  //  AUTO COMPLETE FUNCTIONS ENDS HERE   *
  // **************************************

  cam = (props) => {
    const { meta } = props;

    if (!this.props.image) {
      return <View>{meta.touched && meta.error && <Text style={{ color: 'red' }}>{meta.error}</Text>}</View>;
    }

    this.props.dispatch(change('captureTicket', 'camera', this.props.image));

    return (
      <View>
        <Text style={{ color: '#797979' }}>{this.props.image}</Text>
      </View>
    );
  };

  input = (props) => {
    const { meta, input } = props;

    if (this.props.code === undefined) {
      return (
        <View>
          <InputGroup>
            <Input {...input} {...props} />
          </InputGroup>

          {meta.touched && meta.error && <Text style={{ color: 'red' }}>{meta.error}</Text>}
        </View>
      );
    }

    this.props.dispatch(change('captureTicket', 'ticketNumber', this.props.code));

    return (
      <View>
        <InputGroup disabled>
          <Input value={this.props.code} />
        </InputGroup>

        {meta.touched && meta.error && <Text style={{ color: 'red' }}>{meta.error}</Text>}
      </View>
    );
  };

  render() {
    return (
      <View>
        <View style={{ padding: 10 }}>
          <Field component={this.cam} name='camera' value={this.props.image} />
        </View>

        <View style={{ padding: 10 }}>
          <Field
            component={this.input}
            name='ticketNumber'
            placeholder={DRIVER_CAPTURETICKET_PLACEHOLDER_TICKET_NUM}
            placeholderTextColor='#797979'
            keyboardType='numeric'
            value={this.props.code}
          />
        </View>

        {this.props.code === undefined ? (
          <View style={{ padding: 10 }}>
            <Field component={this.input} name='securityCode' placeholder={DRIVER_CAPTURETICKET_PLACEHOLDER_TICKET_CODE} placeholderTextColor='#797979' />
          </View>
        ) : null}

        <View style={{ padding: 10 }}>
          <Field component={this.destiny} name='destAddress' placeholderTextColor='#797979' value={this.props.destAddress} />
        </View>

        {this.state.searchInputText !== '' && this.state.searchInputText.length > 1 && <AutoComplete />}

        <View style={{ padding: 10 }}>
          <View>
            <Button onPress={this.props.handleSubmit(this.submit.bind(this))} block disabled={this.props.isFetching} style={styles.tripBtn}>
              {this.props.isFetching ? <Spinner /> : <Text style={styles.btnText}>{!this.props.pendingTicket ? START_TRIP_BTN : CAPTURE_TICKET_BTN}</Text>}
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

CTForm = reduxForm({
  form: 'captureTicket', // a unique name for this form
  validate,
})(CTForm);

export default CTForm;
