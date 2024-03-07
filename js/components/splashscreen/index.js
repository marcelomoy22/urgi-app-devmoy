import PropTypes from "prop-types";
import React, { Component } from "react";
import { Image } from "react-native";

const splashImage = require("../../../images/splash.jpg");

export default class SplashPage extends Component {
  static propTypes = {
    navigator: PropTypes.object,
  };
  componentWillMount() {
    const navigator = this.props.navigator;
    setTimeout(() => {
      navigator.replace({
        id: "login",
      });
    }, 1500);
  }
  render() {
    // eslint-disable-line class-methods-use-this
    return (
      <Image
        source={splashImage}
        style={{ flex: 1, height: null, width: null }}
      />
    );
  }
}
