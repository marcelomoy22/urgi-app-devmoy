import { CardItem, Text } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';

import { selectIncidence } from '../../../actions/rider/incidents';
import { pushNewRoute } from '../../../actions/route';
import styles from './styles';

function mapStateToProps(state) {
  return {
    incidents: state.rider.incidents.list,
  };
}

class Help extends Component {
  static propTypes = {
    pushNewRoute: PropTypes.object,
    incidents: PropTypes.array,
    selectIncidence: PropTypes.func,
  };

  navigate = (incidence) => {
    this.props.selectIncidence(incidence);
    this.props.pushNewRoute('tripIncidents');
  };

  getLabelColor(status) {
    if (status === 'nuevo') return styles.greenLabel;
    else if (status === 'procesando') return styles.yellowLabel;
    else if (status === 'finalizado') return styles.redLabel;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.incidents.length > 0
          ? this.props.incidents.map((incidence) => (
              <View>
                <TouchableOpacity onPress={() => this.navigate(incidence)}>
                  <Grid>
                    <Col>
                      <Text>{incidence.ticket}</Text>
                    </Col>
                    <Col>
                      <Text style={this.getLabelColor(incidence.status)}>{incidence.status}</Text>
                    </Col>
                  </Grid>
                </TouchableOpacity>
              </View>
            ))
          : null}
      </View>
    );
  }
}

function bindActions(dispatch) {
  return {
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    selectIncidence: (incidence) => dispatch(selectIncidence(incidence)),
  };
}

export default connect(mapStateToProps, bindActions)(Help);
