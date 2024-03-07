import { CardItem, Icon, Text } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';

import { changePageStatus } from '../../../actions/rider/home';
import { pushNewRoute } from '../../../actions/route';
import {
  COMMON_TRIP_DETAILS_HELP_ACCIDENT,
  COMMON_TRIP_DETAILS_HELP_DRIVER_COMMENT,
  COMMON_TRIP_DETAILS_HELP_LOST_ITEM,
  COMMON_TRIP_DETAILS_HELP_PROBLEM,
  COMMON_TRIP_DETAILS_HELP_UNIT_COMMENT,
} from '../../../textStrings';
import styles from './styles';

function mapStateToProps() {
  return {};
}

class Help extends Component {
  static propTypes = {
    pushNewRoute: PropTypes.object,
    changePageStatus: PropTypes.func,
  };

  navigate = (status) => {
    this.props.changePageStatus(status);
    this.props.pushNewRoute('tripIncidentsForm');
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View>
          <TouchableOpacity onPress={() => this.navigate('Accident')}>
            <Grid>
              <Col>
                <Text>{COMMON_TRIP_DETAILS_HELP_ACCIDENT}</Text>
              </Col>
              <Col>
                <Icon style={styles.detailsField} name={'ios-arrow-forward'} />
              </Col>
            </Grid>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => this.navigate('Lost&Found')}>
            <Grid>
              <Col>
                <Text>{COMMON_TRIP_DETAILS_HELP_LOST_ITEM}</Text>
              </Col>
              <Col>
                <Icon style={styles.detailsField} name={'ios-arrow-forward'} />
              </Col>
            </Grid>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => this.navigate('DriverComment')}>
            <Grid>
              <Col>
                <Text>{COMMON_TRIP_DETAILS_HELP_DRIVER_COMMENT}</Text>
              </Col>
              <Col>
                <Icon style={styles.detailsField} name={'ios-arrow-forward'} />
              </Col>
            </Grid>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => this.navigate('VehicleComment')}>
            <Grid>
              <Col>
                <Text>{COMMON_TRIP_DETAILS_HELP_UNIT_COMMENT}</Text>
              </Col>
              <Col>
                <Icon style={styles.detailsField} name={'ios-arrow-forward'} />
              </Col>
            </Grid>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => this.navigate('General')}>
            <Grid>
              <Col>
                <Text>{COMMON_TRIP_DETAILS_HELP_PROBLEM}</Text>
              </Col>
              <Col>
                <Icon style={styles.detailsField} name={'ios-arrow-forward'} />
              </Col>
            </Grid>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 30 }} />
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    changePageStatus: (status) => dispatch(changePageStatus(status)),
  };
}

export default connect(mapStateToProps, bindActions)(Help);
