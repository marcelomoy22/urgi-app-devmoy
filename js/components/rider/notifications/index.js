import { Button, Card, CardItem, Container, Content, Header, Icon, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Platform, View } from 'react-native';
import { connect } from 'react-redux';

import { popRoute } from '../../../actions/route';
import { RIDER_NOTIFICATIONS_CASE_YOU_DID_NOT_KNOW, RIDER_NOTIFICATIONS_SHARE_N_SAVE, RIDER_NOTIFICATIONS_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from './styles';

const taxi1 = require('../../../../images/taxi1.jpg');
const taxi2 = require('../../../../images/taxi2.jpg');

class Notifications extends Component {
  static propTypes = {
    popRoute: PropTypes.func,
  };
  popRoute() {
    this.props.popRoute();
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderText : styles.aHeaderText}>{RIDER_NOTIFICATIONS_TITLE}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button transparent onPress={() => this.popRoute()}>
                <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{RIDER_NOTIFICATIONS_TITLE}</Title>
            </Body>
            <Right />
          </Header>

        <Content style={styles.container}>
          <Text style={styles.contentHeading}>{RIDER_NOTIFICATIONS_CASE_YOU_DID_NOT_KNOW}</Text>
          <View style={{ padding: 20 }}>
            <Card>
              <View style={{ padding: 3 }}>
                <Image source={taxi1} style={styles.notCard} />
              </View>
            </Card>
          </View>
          <View style={{ padding: 20, paddingTop: 0 }}>
            <Card>
              <View style={{ padding: 3 }}>
                <Image source={taxi2} style={styles.notCard} />
              </View>
            </Card>
          </View>
          <View style={{ padding: 20, paddingTop: 0 }}>
            <Card>
              <View style={{ padding: 3 }}>
                <View style={{ backgroundColor: '#24BCD9' }}>
                  <Text style={styles.shareText}>{RIDER_NOTIFICATIONS_SHARE_N_SAVE}</Text>
                </View>
              </View>
            </Card>
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

export default connect(null, bindActions)(Notifications);
