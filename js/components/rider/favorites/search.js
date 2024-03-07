import { Button, Card, CardItem, Col, Container, Content, Grid, Header, Icon, Input, InputGroup, Text, Thumbnail, Title, View, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { clearFavoriteSearchResults, searchFavorite, updateFavoriteDriversList } from '../../../actions/rider/favorites';
import { popRoute } from '../../../actions/route';
import { RIDER_SEARCH_FAVORITES_EMPTY_SEARCH, RIDER_SEARCH_FAVORITES_PLACEHOLDER, RIDER_SEARCH_FAVORITES_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from '../../common/history/styles';

const profileImage = require('../../../../images/Contacts/avatar-1.jpg');

function mapStateToProps(state) {
  return {
    jwtAccessToken: state.rider.appState.jwtAccessToken,
    user: state.rider.user,
    searchResults: state.rider.favorites.searchResults,
    favDrivers: state.rider.favorites.driversList,
  };
}

class Favorites extends Component {
  static propTypes = {
    jwtAccessToken: PropTypes.string,
    user: PropTypes.object,
    popRoute: PropTypes.func,
    searchFavorite: PropTypes.func,
    updateFavoriteDriversList: PropTypes.func,
    clearFavoriteSearchResults: PropTypes.func,
    searchResults: PropTypes.array,
    favDrivers: PropTypes.array,
  };

  constructor() {
    super();

    this.state = {
      searchInputText: '',
    };
  }

  componentWillMount() {
    this.props.clearFavoriteSearchResults();
  }

  popRoute() {
    this.props.popRoute();
  }

  search(searchInputText) {
    if (searchInputText === '') {
      this.props.clearFavoriteSearchResults();
    } else {
      const data = {
        jwtAccessToken: this.props.jwtAccessToken,
        search: searchInputText,
      };
      this.props.searchFavorite(data);
    }
  }

  addToFavorites(driverId) {
    const driversList = [];

    for (let i = 0; i < this.props.favDrivers.length; i++) {
      driversList.push(this.props.favDrivers[i]._id);
    }

    driversList.push(driverId);

    const user = {
      jwtAccessToken: this.props.jwtAccessToken,
      _id: this.props.user._id,
      list: driversList,
    };

    this.props.updateFavoriteDriversList(user);
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{RIDER_SEARCH_FAVORITES_TITLE}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button transparent onPress={() => this.popRoute()}>
                <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{RIDER_SEARCH_FAVORITES_TITLE}</Title>
            </Body>
            <Right />
          </Header>

        <Content>
          <View style={{ padding: 10 }}>
            <View style={styles.searchBarContainer}>
              <InputGroup borderType='regular' style={styles.searchBar}>
                <Icon name='ios-search' style={styles.searchIcon} />
                <Input
                  placeholder={RIDER_SEARCH_FAVORITES_PLACEHOLDER}
                  placeholderTextColor='#797979'
                  style={{ textAlign: 'center' }}
                  onChangeText={(searchInputText) => this.search(searchInputText)}
                />
              </InputGroup>
            </View>
            {this.props.searchResults.length > 0 ? (
              this.props.searchResults.map((driver) => (
                <TouchableOpacity transparent onPress={() => this.addToFavorites(driver._id)}>
                  <Card style={{ position: 'relative' }}>
                    <View style={styles.detailContainer}>
                      <Thumbnail square source={profileImage} size={70} style={styles.driverImage} />
                      <Grid>
                        <Col>
                          <Text note>{`${driver.fname} ${driver.lname}`}</Text>
                          <Text>{driver.phoneNo}</Text>
                        </Col>
                        <Col>
                          <Icon
                            name={'ios-heart'}
                            style={{
                              color: this.props.favDrivers.some((obj) => obj._id === driver._id) ? '#de1c24' : '#797979',
                            }}
                          />
                        </Col>
                      </Grid>
                    </View>
                    <View style={styles.dummyView} />
                  </Card>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>{RIDER_SEARCH_FAVORITES_EMPTY_SEARCH}</Text>
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    searchFavorite: (data) => dispatch(searchFavorite(data)),
    clearFavoriteSearchResults: () => dispatch(clearFavoriteSearchResults()),
    updateFavoriteDriversList: (data) => dispatch(updateFavoriteDriversList(data)),
  };
}

export default connect(mapStateToProps, bindAction)(Favorites);
