import { CardItem, Text } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';

import {
  COMMON_TRIP_DETAILS_RECEIPT_BASE_PRICE,
  COMMON_TRIP_DETAILS_RECEIPT_DISTANCE_PRICE,
  COMMON_TRIP_DETAILS_RECEIPT_TIME_PRICE,
  COMMON_TRIP_DETAILS_RECEIPT_TOTAL,
} from '../../../textStrings';
import styles from './styles';

function mapStateToProps() {
  return {};
}

class Receipt extends Component {
  static propTypes = {
    trip: PropTypes.object,
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View>
          <Grid>
            <Col>
              <Text>{COMMON_TRIP_DETAILS_RECEIPT_BASE_PRICE}</Text>
            </Col>
            <Col>
              <Text style={styles.detailsField}>{`$${this.props.trip.initPrice}`}</Text>
            </Col>
          </Grid>
        </View>
        <View>
          <Grid>
            <Col>
              <Text>{COMMON_TRIP_DETAILS_RECEIPT_DISTANCE_PRICE}</Text>
            </Col>
            <Col>
              <Text style={styles.detailsField}>{`$${this.props.trip.pKm}`}</Text>
            </Col>
          </Grid>
        </View>
        <View>
          <Grid>
            <Col>
              <Text>{COMMON_TRIP_DETAILS_RECEIPT_TIME_PRICE}</Text>
            </Col>
            <Col>
              <Text style={styles.detailsField}>{`$${this.props.trip.pMin}`}</Text>
            </Col>
          </Grid>
        </View>
        <View>
          <Grid>
            <Col>
              <Text>{COMMON_TRIP_DETAILS_RECEIPT_TOTAL}</Text>
            </Col>
            <Col>
              <Text style={styles.detailsField}>{`$${this.props.trip.tripAmt}`}</Text>
            </Col>
          </Grid>
        </View>
        <View style={{ padding: 30 }} />
      </View>
    );
  }
}

function bindActions() {
  return {};
}

export default connect(mapStateToProps, bindActions)(Receipt);
