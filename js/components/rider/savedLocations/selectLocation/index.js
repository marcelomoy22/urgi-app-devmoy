import { Button, Col, Container, Content, Grid, Header, Icon, Row, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Platform, TouchableOpacity, View } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';

import { fetchLocationList, gotoLocation, updateLocationList } from '../../../../actions/rider/savedLocations';
import { popRoute, pushNewRoute } from '../../../../actions/route';
import {
  NO,
  RIDER_SELECT_LOCATION_DELETE_MSG,
  RIDER_SELECT_LOCATION_DELETE_TITLE,
  RIDER_SELECT_LOCATION_EMPTY,
  RIDER_SELECT_LOCATION_SUBTITLE,
  RIDER_SELECT_LOCATION_TITLE,
  YES,
} from '../../../../textStrings';
import theme from '../../../../themes/base-theme';
import { isIphoneXorAbove } from '../../../common/headerHelper';
import styles from './styles';

function mapStateToProps(state) {
  return {
    jwtAccessToken: state.rider.appState.jwtAccessToken,
    user: state.rider.user,
    locationList: state.rider.savedLocations.list,
    selectedLocation: state.rider.savedLocations.selected,
    pageStatus: state.rider.appState.pageStatus,
  };
}

class SelectLocation extends Component {
  static propTypes = {
    jwtAccessToken: PropTypes.string,
    user: PropTypes.object,
    selectedLocation: PropTypes.object,
    locationList: PropTypes.array,
    popRoute: PropTypes.func,
    pushNewRoute: PropTypes.func,
    fetchLocationList: PropTypes.func,
    gotoLocation: PropTypes.func,
    pageStatus: PropTypes.object,
    updateLocationList: PropTypes.func,
  };

  async componentWillMount() {
    const user = {
      jwtAccessToken: this.props.jwtAccessToken,
      _id: this.props.user._id,
    };

    await this.props.fetchLocationList(user);
  }

  popRoute() {
    this.props.popRoute();
  }

  pushRoute(route) {
    this.props.pushNewRoute(route);
  }

  buttonIcon = (iconName) => (
    <View>
      <Icon name={iconName} style={styles.swipeOutButtonIcons} />
    </View>
  );

  swipeButtons(location) {
    return [
      {
        text: this.buttonIcon('ios-trash'),
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => {
          this.handleDelete(location);
        },
      },
    ];
  }

  handleDelete(location) {
    Alert.alert(
      RIDER_SELECT_LOCATION_DELETE_TITLE,
      RIDER_SELECT_LOCATION_DELETE_MSG,
      [
        {
          text: YES,
          onPress: () => {
            // add delete flag
            location.delete = true;

            this.props.updateLocationList(location);
          },
        },
        {
          text: NO,
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  }

  handelSelect(location) {
    this.props.gotoLocation(location);
    this.popRoute();
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{RIDER_SELECT_LOCATION_TITLE}</Title>
          <Button transparent onPress={() => this.pushRoute('addLocation')}>
            <Icon name='ios-add-circle-outline' style={{ color: '#797979' }} />
          </Button>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button transparent onPress={() => this.popRoute()}>
                <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{RIDER_SELECT_LOCATION_TITLE}</Title>
            </Body>
            <Right>
            <Button transparent onPress={() => this.pushRoute('addLocation')}>
            <Icon name='ios-add-circle-outline' style={{ color: '#FFF' }} />
          </Button>
              </Right>
          </Header>

        <Content>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>{RIDER_SELECT_LOCATION_SUBTITLE}</Text>
          </View>

          {this.props.locationList.length > 0 ? (
            this.props.locationList.map((location) => (
              <Swipeout right={this.swipeButtons(location)} backgroundColor={'#fff'}>
                <TouchableOpacity onPress={() => this.handelSelect(location)}>
                  <View style={{ padding: 10 }}>
                    <View style={styles.detailContainer}>
                      <Grid>
                        <Row>
                          <Col>
                            <Text style={styles.detailName}>{location.name}</Text>
                          </Col>
                        </Row>

                        <Row>
                          <Col style={{ width: 60 }}>
                            <Icon name={'ios-arrow-forward'} style={styles.selectIcon} />
                          </Col>

                          <Col style={styles.detailAddress}>
                            <Text note>{location.address}</Text>
                          </Col>
                        </Row>
                      </Grid>
                    </View>
                  </View>
                </TouchableOpacity>
              </Swipeout>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{RIDER_SELECT_LOCATION_EMPTY}</Text>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    fetchLocationList: (data) => dispatch(fetchLocationList(data)),
    gotoLocation: (location) => dispatch(gotoLocation(location)),
    updateLocationList: (data) => dispatch(updateLocationList(data)),
  };
}

export default connect(mapStateToProps, bindAction)(SelectLocation);
