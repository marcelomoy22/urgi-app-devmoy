import { Button, Card, CardItem, Container, Content, Header, Icon, Text, Thumbnail, Title, View, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';

import { fetchFavoriteDriversList, updateFavoriteDriversList } from '../../../actions/rider/favorites';
import { popRoute, pushNewRoute } from '../../../actions/route';
import { RIDER_FAVORITES_EMPTY, RIDER_FAVORITES_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from '../../common/history/styles';

const profileImage = require('../../../../images/Contacts/avatar-1.jpg');

function mapStateToProps(state) {
  return {
    jwtAccessToken: state.rider.appState.jwtAccessToken,
    user: state.rider.user,
    favDrivers: state.rider.favorites.driversList,
  };
}

class Favorites extends Component {
  static propTypes = {
    jwtAccessToken: PropTypes.string,
    user: PropTypes.object,
    popRoute: PropTypes.func,
    pushNewRoute: PropTypes.func,
    favDrivers: PropTypes.array,
    fetchFavoriteDriversList: PropTypes.func,
    updateFavoriteDriversList: PropTypes.func,
  };

  async componentWillMount() {
    const user = {
      jwtAccessToken: this.props.jwtAccessToken,
      _id: this.props.user._id,
    };

    await this.props.fetchFavoriteDriversList(user);
  }

  popRoute() {
    this.props.popRoute();
  }

  navigateTo(route) {
    this.props.pushNewRoute(route);
  }

  removeDriverFromList(driver) {
    const driversList = [];

    for (let i = 0; i < this.props.favDrivers.length; i++) {
      driversList.push(this.props.favDrivers[i]._id);
    }

    driversList.push(driver._id);

    const user = {
      jwtAccessToken: this.props.jwtAccessToken,
      _id: this.props.user._id,
      list: driversList,
    };

    this.props.updateFavoriteDriversList(user);
  }

  swipeButtons(driver) {
    return [
      {
        text: 'Delete',
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => this.removeDriverFromList(driver),
      },
    ];
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{RIDER_FAVORITES_TITLE}</Title>
          <Button transparent onPress={() => this.navigateTo('searchDriver')}>
            <Icon name='ios-add-circle-outline' style={{ fontSize: 28 }} />
          </Button>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button transparent onPress={() => this.popRoute()}>
                <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{RIDER_FAVORITES_TITLE}</Title>
            </Body>
            <Right />
          </Header>

        <Content>
          {this.props.favDrivers.length > 0 ? (
            this.props.favDrivers.map((driver) => (
              <View style={{ paddingBottom: 10 }}>
                <Card style={{ position: 'relative' }}>
                  <Swipeout right={this.swipeButtons(driver)} backgroundColor={'#fff'}>
                    <View style={styles.detailContainer}>
                      <Thumbnail square source={profileImage} size={70} style={styles.driverImage} />
                      <Text note>{`${driver.fname} ${driver.lname}`}</Text>
                      <Text>{driver.phoneNo}</Text>
                    </View>
                    <View style={styles.dummyView} />
                  </Swipeout>
                </Card>
              </View>
            ))
          ) : (
            <View>
              <Text>{RIDER_FAVORITES_EMPTY}</Text>
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
    fetchFavoriteDriversList: (user) => dispatch(fetchFavoriteDriversList(user)),
    updateFavoriteDriversList: (user) => dispatch(updateFavoriteDriversList(user)),
  };
}

export default connect(mapStateToProps, bindAction)(Favorites);
