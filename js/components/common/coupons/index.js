import moment from "moment-timezone";
import {
  Button,
  Card,
  CardItem,
  Col,
  Container,
  Content,
  Footer,
  Grid,
  Header,
  Icon,
  Row,
  Text,
  Title,
  Right,
  Left,
  Body,
} from "native-base";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Alert, Image, Modal, Platform, TextInput, View } from "react-native";
import { connect } from "react-redux";

import config from "../../../../config";
import {
  deleteCoupon,
  deselectCoupon,
  fetchCouponList,
  saveCoupon,
  selectCoupon,
  validateCoupon,
} from "../../../actions/common/coupons";
import { popRoute } from "../../../actions/route";
import {
  COMMON_COUPON_DELETE_MSG,
  COMMON_COUPON_DELETE_TITLE,
  COMMON_COUPON_EMPTY,
  COMMON_COUPON_FOOTER_BUTTON_SHARE,
  COMMON_COUPON_FOOTER_INPUT_PLACEHOLDER,
  COMMON_COUPON_FOOTER_TITLE,
  COMMON_COUPON_TITLE,
  COMMON_COUPON_VALID,
  COMMON_SETTINGS_SAVE_BTN,
  NO,
  OK,
  YES,
} from "../../../textStrings";
import theme from "../../../themes/base-theme";
import { isIphoneXorAbove } from "../../common/headerHelper";
import styles from "./styles";

function mapStateToProps(state) {
  return {
    jwtAccessToken:
      state.rider.appState.jwtAccessToken ||
      state.driver.appState.jwtAccessToken,
    user: state.rider.user._id ? state.rider.user : state.driver.user,
    usersCoupon: state.driver.user._id ? state.driver.user.coupon : undefined,
    userType: state.rider.user.userType || state.driver.user.userType,
    coupons: state.coupons.list,
    selectedCoupon: state.coupons.selected,
  };
}

class Coupons extends Component {
  static propTypes = {
    jwtAccessToken: PropTypes.string,
    user: PropTypes.string,
    coupons: PropTypes.array,
    usersCoupon: PropTypes.string,
    fetchCouponList: PropTypes.func,
    userType: PropTypes.string,
    popRoute: PropTypes.func,
    validateCoupon: PropTypes.func,
    selectCoupon: PropTypes.func,
    selectedCoupon: PropTypes.string,
    deleteCoupon: PropTypes.func,
    deselectCoupon: PropTypes.func,
    saveCoupon: PropTypes.func,
  };

  constructor() {
    super();

    this.state = {
      showModal: false,
      couponCode: "",
    };
  }

  async componentDidMount() {
    const couponIdList = [];

    for (let i = 0; i < this.props.coupons.length; i++) {
      couponIdList.push(this.props.coupons[i]._id);
    }

    const data = {
      app: true,
      jwtAccessToken: this.props.jwtAccessToken,
      userType: this.props.userType,
      userId: this.props.user._id,
    };

    await this.props.fetchCouponList(data);
  }

  popRoute() {
    this.props.popRoute();
  }

  formatDate(time) {
    // eslint-disable-line class-methods-use-this
    return moment(time).tz("America/Mexico_City").format(" D/M/YY");
  }

  insertCoupon(coupon) {
    const data = {
      jwtAccessToken: this.props.jwtAccessToken,
      userId: this.props.user._id,
      coupon,
    };
    this.setState({ showModal: false, couponCode: "" });
    this.props.validateCoupon(data);
  }

  saveCode(code) {
    const data = {
      code,
      jwtAccessToken: this.props.jwtAccessToken,
      user: this.props.user,
      app: true,
    };

    this.props.saveCoupon(data);
  }

  shareCode = () => {};

  handleDelete(id) {
    Alert.alert(
      COMMON_COUPON_DELETE_TITLE,
      COMMON_COUPON_DELETE_MSG,
      [
        {
          text: YES,
          onPress: () => {
            this.props.deleteCoupon(id);
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

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: "#fff" }}>
        {/* <Header style={Platform.OS === 'ios' ? (isIphoneXorAbove() ? styles.iosHeaderX : styles.iosHeader) : styles.aHeader}>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name='md-arrow-back' style={{ fontSize: 28 }} />
          </Button>
          <Title style={Platform.OS === 'ios' ? styles.iosHeaderTitle : styles.aHeaderTitle}>{COMMON_COUPON_TITLE}</Title>
          {this.props.userType === 'rider' ? (
            <Button transparent onPress={() => this.setState({ showModal: true })}>
              <Icon name='ios-add-circle-outline' style={{ fontSize: 28 }} />
            </Button>
          ) : null}
        </Header> */}

        <Header style={{backgroundColor: '#e80000'}}>
          <Left>
            <Button onPress={() => this.popRoute()} transparent>
              <Icon name="arrow-back" style={{color: '#FFF'}} />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#FFF'}}>{COMMON_COUPON_TITLE}</Title>
          </Body>
          <Right>
            {this.props.userType === "rider" ? (
              <Button
                transparent
                onPress={() => this.setState({ showModal: true })}
              >
                <Icon name="ios-add-circle-outline" style={{ fontSize: 28, color: '#FFF' }} />
              </Button>
            ) : null}
          </Right>
        </Header>

        <Content>
          {!this.props.coupons || this.props.coupons.length === 0 ? (
            <Text>{COMMON_COUPON_EMPTY}</Text>
          ) : (
            this.props.coupons.map((coupon, index) => (
              <View style={{ paddingBottom: 10 }}>
                <Card style={styles.card}>
                  <View>
                    <Text style={styles.couponTitle} note>
                      {coupon.name}
                    </Text>
                  </View>
                  <View style={styles.couponContainer}>
                    <Image
                      source={{
                        uri: `${config.awsImage.coupons + coupon._id}.jpeg`,
                      }}
                      style={{ resizeMode: "cover" }}
                    />
                  </View>

                  <View style={styles.dummyView} />
                </Card>
                <View>
                  <Grid>
                    <Row style={{alignItems: 'center', display: 'flex', justifyContent: 'space-between'}}>
                      <Button
                        transparent
                        style={styles.selectBtn}
                        key={index}
                        onPress={() => {
                          if (coupon._id === this.props.selectedCoupon) {
                            this.props.deselectCoupon(coupon._id);
                          } else {
                            this.props.selectCoupon(coupon._id);
                          }
                        }}
                      >
                        <Icon
                          name={
                            this.props.selectedCoupon === coupon._id
                              ? "ios-checkmark-circle-outline"
                              : "ios-radio-button-off"
                          }
                          style={styles.selectOutLine}
                        />
                      </Button>

                      <Text
                        style={{ fontWeight: "bold", color: "red" }}
                      >{`${COMMON_COUPON_VALID} ${this.formatDate(
                        coupon.validity
                      )}`}</Text>

                      <Button
                        transparent
                        style={styles.deleteBtn}
                        onPress={() => this.handleDelete(coupon._id)}
                      >
                        <Icon name={"ios-trash"} style={styles.trash} />
                      </Button>
                    </Row>
                    <Row>
                      <Text style={styles.couponText}>{coupon.description}</Text>
                    </Row>
                  </Grid>
                </View>
              </View>
            ))
          )}

          <Modal
            animationType={"none"}
            transparent
            visible={this.state.showModal}
          >
            <View style={styles.putModalInPlace}>
              <View style={styles.modalValidationContainer}>
                {/* <Header
                  style={
                    Platform.OS === 'ios'
                      ? isIphoneXorAbove()
                        ? styles.iosHeaderX
                        : styles.iosHeader
                      : styles.aHeader
                      ? styles.iosModalHeader
                      : styles.aModalHeader
                  }
                >
                  <Button transparent onPress={() => this.setState({ showModal: false })}>
                    <Icon name='ios-close' style={styles.modalX} />
                  </Button>
                  <Title style={styles.modalValidationTitle}>Ingresa tu cupón</Title>
                </Header> */}

                <View style={{height: 100}}>
                  <View style={{flexDirection: 'row-reverse', width: 350}}>
                    <Button
                      transparent
                      onPress={() => this.setState({ showModal: false })}
                    >
                      <Icon name="ios-close" style={styles.modalX} />
                    </Button>
                  </View>
                  <View>
                    <Title style={{color: '#000'}}>Ingresa tu cupón</Title>
                  </View>
                  <Right />
                </View>

                <View style={{ paddingTop: 10 }}>
                  <TextInput
                    style={styles.modalValidationInput}
                    name={"phoneValidation"}
                    value={this.state.couponCode}
                    placeholder={"Cupón"}
                    onChangeText={(text) => {
                      this.setState({ couponCode: text });
                    }}
                  />

                  <View style={styles.modalValidationButton}>
                    <Button
                      block
                      style={{ backgroundColor: "#19192B" }}
                      disabled={false}
                      onPress={() => this.insertCoupon(this.state.couponCode)}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "700",
                          marginHorizontal: 30,
                        }}
                      >
                        {OK}
                      </Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </Content>

        {this.props.userType === "driver" ? (
          <Footer
            style={Platform.OS === "ios" ? styles.iosFooter : styles.aFooter}
          >
            <Grid>
              <Row style={{ height: 20 }}>
                <Text style={styles.footerTitleText}>
                  {COMMON_COUPON_FOOTER_TITLE}
                </Text>
              </Row>
              <View>
                <View>
                  <TextInput
                    style={{fontSize: 30, marginLeft: 20, marginBottom: 20}}
                    editable={this.props.usersCoupon ? false : true}
                    placeholder={COMMON_COUPON_FOOTER_INPUT_PLACEHOLDER}
                    maxLength={20}
                    onChangeText={(textInput) =>
                      this.setState({ couponCode: textInput })
                    }
                    value={
                      this.props.usersCoupon
                        ? this.props.usersCoupon.code
                        : null
                    }
                  />
                </View>
              </View>
              <View>
                {this.props.usersCoupon ? (
                  <Button
                    style={styles.buttonStyle}
                    onPress={() => this.shareCode}
                  >
                    <Text style={styles.buttonText}>
                      {COMMON_COUPON_FOOTER_BUTTON_SHARE}
                    </Text>
                  </Button>
                ) : (
                  <Button
                    style={styles.buttonStyle}
                    onPress={() => this.saveCode(this.state.couponCode)}
                  >
                    <Text style={styles.buttonText}>
                      {COMMON_SETTINGS_SAVE_BTN}
                    </Text>
                  </Button>
                )}
              </View>
              <Row style={{ height: 20 }} />
            </Grid>
          </Footer>
        ) : null}
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    popRoute: () => dispatch(popRoute()),
    fetchCouponList: (data) => dispatch(fetchCouponList(data)),
    validateCoupon: (coupon) => dispatch(validateCoupon(coupon)),
    selectCoupon: (couponId) => dispatch(selectCoupon(couponId)),
    deselectCoupon: (couponId) => dispatch(deselectCoupon(couponId)),
    deleteCoupon: (couponId) => dispatch(deleteCoupon(couponId)),
    saveCoupon: (data) => dispatch(saveCoupon(data)),
  };
}

export default connect(mapStateToProps, bindActions)(Coupons);
