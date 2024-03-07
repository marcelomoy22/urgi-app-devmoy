import { Button, Card, CardItem, Col, Container, Content, Grid, Header, Icon, Input, InputGroup, Text, Title } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { connect } from 'react-redux';

import { popRoute } from '../../../actions/route';
import { COMMON_HISTORY_FOLIOS_EMPTY, COMMON_HISTORY_FOLIOS_SEARCH_PLACEHOLDER, COMMON_HISTORY_FOLIOS_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from './styles';

function mapStateToProps(state) {
  return {
    paysheets: state.driver.paysheets.data,
  };
}

class Folios extends Component {
  static propTypes = {
    paysheets: PropTypes.object,
    popRoute: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      folios: undefined,
    };
  }

  componentDidMount() {
    setTimeout(() => this.setFolios(''), 1000);
  }

  popRoute() {
    this.props.popRoute();
  }

  setFolios(string) {
    const dataArray = [];

    for (let i = 0; i < this.props.paysheets.folios.length; i++) {
      if (string !== '') {
        if (this.props.paysheets.folios[i].includes(string)) {
          dataArray.push({ title: i + 1, data: this.props.paysheets.folios[i] });
        }
      } else {
        dataArray.push({ title: i + 1, data: this.props.paysheets.folios[i] });
      }
    }

    this.setState({
      folios: dataArray.map((row) => (
        <View>
          <Grid>
            <Col>
              <Text>{row.title}</Text>
            </Col>
            <Col>
              <Text style={styles.paysheetData}>{row.data}</Text>
            </Col>
          </Grid>
        </View>
      )),
    });
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{COMMON_HISTORY_FOLIOS_TITLE}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
          <Left>
            <Button onPress={() => this.popRoute()} transparent>
              <Icon name="arrow-back" style={{color: '#FFF'}} />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#FFF'}}>{COMMON_HISTORY_FOLIOS_TITLE}</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <View style={{ padding: 10 }}>
            <View style={styles.searchBarContainer}>
              <InputGroup borderType='regular' style={styles.searchBar}>
                <Icon name='ios-search' style={styles.searchIcon} />
                <Input
                  placeholder={COMMON_HISTORY_FOLIOS_SEARCH_PLACEHOLDER}
                  placeholderTextColor='#797979'
                  style={{ textAlign: 'center' }}
                  onChangeText={(searchInputText) => {
                    this.setFolios(searchInputText);
                  }}
                />
              </InputGroup>
            </View>
            {this.state.folios ? <Card>{this.state.folios}</Card> : <Text style={styles.emptyText}>{COMMON_HISTORY_FOLIOS_EMPTY}</Text>}
          </View>
        </Content>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
  };
}

export default connect(mapStateToProps, bindActions)(Folios);
