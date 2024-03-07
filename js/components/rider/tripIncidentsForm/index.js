import { Button, Container, Content, Header, Icon, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';

import { popRoute } from '../../../actions/route';
import { COMMON_TRIP_DETAILS_FORM_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import IncidentForm from './form';
import styles from './styles';

function mapStateToProps(state) {
  return {
    isFetching: state.rider.appState.loadSpinner,
  };
}

class Settings extends Component {
  static propTypes = {
    popRoute: PropTypes.func,
    isFetching: PropTypes.bool,
  };

  goBack() {
    this.props.popRoute();
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.goBack()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{COMMON_TRIP_DETAILS_FORM_TITLE}</Title>
        </Header> */}

          <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button transparent onPress={() => this.goBack()}>
                  <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{COMMON_TRIP_DETAILS_FORM_TITLE}</Title>
            </Body>
            <Right />
          </Header>

        <Content>
          <KeyboardAwareScrollView>
            <IncidentForm isFetching={this.props.isFetching} />
          </KeyboardAwareScrollView>
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

export default connect(mapStateToProps, bindActions)(Settings);
