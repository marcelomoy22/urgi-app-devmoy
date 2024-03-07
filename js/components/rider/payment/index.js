import { Button, Container, Header, Icon, Text, Title, Left, Right, Body } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { connect } from 'react-redux';

import { deleteOpenPayCard, getCardList, setSelectCash, setSelectedCard } from '../../../actions/rider/payment';
import { popRoute, pushNewRoute } from '../../../actions/route';
import { RIDER_PAYMENT_ADD_CARD_ALERT, RIDER_PAYMENT_CASH, RIDER_PAYMENT_METHOD, RIDER_PAYMENT_TITLE } from '../../../textStrings';
import theme from '../../../themes/base-theme';
import { isIphoneXorAbove } from '../../common/headerHelper';
import styles from './styles';

const amercanexpress = require('../../../../images/amercan_express.jpg');
const visa = require('../../../../images/visa.png');
const mastercard = require('../../../../images/mastercard.jpeg');

function mapStateToProps(state) {
  return {
    cards: state.rider.payment.cards,
    selectedCard: state.rider.payment.selectedCard,
  };
}

class Payment extends Component {
  static propTypes = {
    popRoute: PropTypes.func,
    pushNewRoute: PropTypes.func,
    cards: PropTypes.array,
    selectedCard: PropTypes.object,
    deleteOpenPayCard: PropTypes.func,
    getCardList: PropTypes.func,
    setSelectCash: PropTypes.func,
    setSelectedCard: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      cardList: [],
      cash: null,
      disableAddCard: false,
    };
  }

  // print card list when component will open
  componentWillMount() {
    this.updateCardList(this.props.cards);

    // set reducer to cash if undefined
    if (this.props.selectedCard === undefined) this.props.setSelectCash();
  }

  // update card list after inserting new card
  componentDidUpdate(prevProps) {
    if (this.props.cards.length !== prevProps.cards.length) {
      this.props.getCardList();
      this.updateCardList(this.props.cards);
    }
  }

  popRoute() {
    this.props.popRoute();
  }

  pushNewRoute(route) {
    if (this.state.disableAddCard) {
      alert(RIDER_PAYMENT_ADD_CARD_ALERT);
    } else {
      this.props.pushNewRoute(route);
    }
  }

  buttonIcon = (iconName) => (
    <View>
      <Icon name={iconName} style={styles.swipeOutButtonIcons} />
    </View>
  );

  swipeButtons(card) {
    return [
      {
        text: this.buttonIcon('ios-trash'),
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => {
          this.deleteCard(card);
          this.setState({ disableAddCard: false });
        },
      },
    ];
  }

  updateCardList(cards) {
    const options = [];

    let brand,
      select,
      cashIcon = 'ios-checkmark-circle-outline';

    if (cards) {
      for (let i = 0; i < cards.length; i++) {
        if (i > 3) this.setState({ disableAddCard: true });

        if (cards[i].brand === 'visa') {
          brand = visa;
        } else if (cards[i].brand === 'mastercard') {
          brand = mastercard;
        } else if (cards[i].brand === 'american_express') {
          brand = amercanexpress;
        } else brand = null;

        if (cards[i].id === this.props.selectedCard.id) {
          select = 'ios-checkmark-circle-outline';
          cashIcon = 'ios-radio-button-off';
        } else {
          select = 'ios-radio-button-off';
        }

        options.push({ pos: i, brand, number: cards[i].card_number, id: cards[i].id, select, cardData: cards[i] });
      }
    }

    this.setState({
      cardList: options.map((card) => (
        <Swipeout right={this.swipeButtons(card)} backgroundColor={'#fff'}>
          <TouchableOpacity style={styles.payMethod1} onPress={() => this.payWithCard(card.pos)}>
            <Icon name={card.select} style={{ fontSize: 40, color: 'green' }} />
            <View style={{ marginLeft: 20, borderWidth: 1, borderColor: '#fff', marginTop: 8 }}>
              <Image source={card.brand} style={styles.paytmIcon} />
            </View>
            <Text style={{ marginLeft: 20, marginTop: 8 }}>{card.number}</Text>
          </TouchableOpacity>
        </Swipeout>
      )),

      cash: (
        <TouchableOpacity style={styles.payMethod2} onPress={() => this.payWithCash()}>
          <Icon name={cashIcon} style={{ fontSize: 40, color: 'green' }} />
          <Icon name='ios-cash' style={{ marginLeft: 20, fontSize: 40, color: 'green' }} />
          <Text style={{ marginLeft: 20, marginTop: 8 }}>{RIDER_PAYMENT_CASH}</Text>
        </TouchableOpacity>
      ),
    });
  }

  async payWithCard(pos) {
    // set reducer to card
    await this.props.setSelectedCard(this.props.cards[pos]);

    // call card list update
    this.updateCardList(this.props.cards);
  }

  async payWithCash() {
    // reset reducer to cash
    await this.props.setSelectCash();

    // call card list update
    this.updateCardList(this.props.cards);
  }

  deleteCard(card) {
    // delete card from openpay
    this.props.deleteOpenPayCard(card.cardData);

    // update
    this.updateCardList(this.props.cards);
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: '#fff' }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{RIDER_PAYMENT_TITLE}</Title>
          <Button transparent onPress={() => this.pushNewRoute('creditCard')}>
            <Icon name='ios-card' style={{ color: '#797979' }} />
          </Button>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
            <Left>
              <Button transparent onPress={() => this.popRoute()}>
                <Icon name="arrow-back" style={{color: '#FFF'}} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{RIDER_PAYMENT_TITLE}</Title>
            </Body>
            <Right>
            <Button transparent onPress={() => this.pushNewRoute('creditCard')}>
            <Icon name='ios-card' style={{ color: '#FFF' }} />
          </Button>
              </Right>
          </Header>

        <View>
          <View style={styles.payModeType}>
            <Text style={styles.payModeText}>{RIDER_PAYMENT_METHOD}</Text>
          </View>

          {this.state.cardList}
          {this.state.cash}
        </View>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    deleteOpenPayCard: (pos) => dispatch(deleteOpenPayCard(pos)),
    getCardList: () => dispatch(getCardList()),
    setSelectCash: () => dispatch(setSelectCash()),
    setSelectedCard: (card) => dispatch(setSelectedCard(card)),
  };
}

export default connect(mapStateToProps, bindActions)(Payment);
