import { Button, Container, Header, Icon, Text, Title, Left, Right, Body } from "native-base";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Keyboard, Platform, View } from "react-native";
import { Bubble, Composer, GiftedChat, Send } from "react-native-gifted-chat";
import { connect } from "react-redux";

import {
  clearMsgCounter,
  fetchMessages,
  sendMessage,
} from "../../../actions/common/chat";
import { popRoute } from "../../../actions/route";
import { driverIsTyping } from "../../../services/driversocket";
import { riderIsTyping } from "../../../services/ridersocket";
import {
  COMMON_CHAT_IS_TYPING,
  COMMON_CHAT_NEW_MESSAGE,
  COMMON_CHAT_TITLE,
  COMMON_TRIP_DETAILS_FORM_PLACEHOLDER,
} from "../../../textStrings";
import theme from "../../../themes/base-theme";
import { isIphoneXorAbove } from "../../common/headerHelper";
import Spinner from "../../loaders/Spinner";
import styles from "./styles";

function mapStateToProps(state) {
  return {
    riderTripRequest: state.rider.tripRequest,
    driverTripRequest: state.driver.tripRequest,
    userType: state.rider.user.userType || state.driver.user.userType,
    userId: state.rider.user._id || state.driver.user._id,
    isFetching:
      state.rider.appState.loadSpinner || state.driver.appState.loadSpinner,
    isTyping: state.chat.isTyping,
    conversation: state.chat.messages,
    counter: state.chat.newMsgCounter,
  };
}

class Chat extends Component {
  static propTypes = {
    riderTripRequest: PropTypes.object,
    driverTripRequest: PropTypes.object,
    userId: PropTypes.string,
    userType: PropTypes.string,
    popRoute: PropTypes.func,
    sendMessage: PropTypes.func,
    conversation: PropTypes.array,
    isFetching: PropTypes.bool,
    counter: PropTypes.number,
    isTyping: PropTypes.bool,
    fetchMessages: PropTypes.func,
    clearMsgCounter: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.counter = 0;

    if (props.userType === "rider") {
      this.tripRequest = props.riderTripRequest;
      this.toUser = this.tripRequest.driver;
    } else {
      this.tripRequest = props.driverTripRequest;
      this.toUser = this.tripRequest.rider;
    }

    this.state = {
      messages: [],
    };

    this.onSend = this.onSend.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }

  async componentWillMount() {
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);

    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );

    await this.props.fetchMessages(this.tripRequest.conversation);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();

    this._keyboardDidHide();
  }

  componentWillReceiveProps(nextProps) {
    nextProps.conversation.forEach((element) => {
      if (element.user !== nextProps.userId) {
        element.user = { _id: 2 };
      } // position on left in chat
    });

    this.props.clearMsgCounter();

    this.setState({
      messages: nextProps.conversation,
    });
  }

  _keyboardDidShow() {
    // show is typing message
    if (this.props.userType === "rider") {
      riderIsTyping(true, this.toUser._id);
    } else {
      driverIsTyping(true, this.toUser._id);
    }
  }

  _keyboardDidHide() {
    // stop showing is typing message
    if (this.props.userType === "rider") {
      riderIsTyping(false, this.toUser._id);
    } else {
      driverIsTyping(false, this.toUser._id);
    }
  }

  popRoute() {
    this.props.popRoute();
  }

  onSend(messages = []) {
    this.props.sendMessage(
      messages[0],
      this.tripRequest.conversation,
      this.toUser._id
    );
  }

  headerText(isTyping) {
    if (isTyping) return `${this.toUser.fname} ${COMMON_CHAT_IS_TYPING}`;

    return COMMON_CHAT_TITLE;
  }

  renderBubble(props) {
    this.counter++;

    if (this.props.counter === this.counter) {
      // clear counter
      this.props.clearMsgCounter();

      return (
        <View>
          <Text style={styles.detailsField}>{COMMON_CHAT_NEW_MESSAGE}</Text>
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: "green",
              },
            }}
          />
        </View>
      );
    }

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "green",
          },
        }}
      />
    );
  }

  renderFooter() {
    return (
      <View style={styles.footerContainer}>
        <Spinner />
      </View>
    );
  }

  placeHolderMsg(props) {
    return (
      <Composer
        {...props}
        placeholder={COMMON_TRIP_DETAILS_FORM_PLACEHOLDER}
        composerHeight={55}
      />
    );
  }

  sendButton(props) {
    return <Send {...props} label={"enviar"} textStyle={styles.sendText} />;
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: "#fff" }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{this.headerText(this.props.isTyping)}</Title>
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
          <Left>
            <Button onPress={() => this.popRoute()} transparent>
              <Icon name="arrow-back" style={{color: '#FFF'}} />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#FFF'}}>{this.headerText(this.props.isTyping)}</Title>
          </Body>
          <Right />
        </Header>

        <View style={{ flex: 1 }}>
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            user={this.props.userId}
            renderBubble={this.renderBubble}
            renderAvatar={null}
            renderComposer={this.placeHolderMsg}
            renderSend={this.sendButton}
            minInputToolbarHeight={55}
            renderFooter={this.props.isFetching ? this.renderFooter : null}
            maxInputLength={140}
          />
        </View>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    sendMessage: (msg, conversationId, toUser) =>
      dispatch(sendMessage(msg, conversationId, toUser)),
    fetchMessages: (id) => dispatch(fetchMessages(id)),
    clearMsgCounter: () => dispatch(clearMsgCounter()),
  };
}

export default connect(mapStateToProps, bindActions)(Chat);
