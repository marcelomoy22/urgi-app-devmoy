import { Spinner, getTheme } from 'native-base';
import computeProps from 'native-base/dist/src/utils/computeProps';
import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';

export default class SpinnerNB extends Spinner {
  prepareRootProps() {
    const type = {
      height: 80,
    };

    const defaultProps = {
      style: type,
    };

    return computeProps(this.props, defaultProps);
  }

  render() {
    const getColor = () => {
      if (this.props.color) {
        return this.props.color;
      } else if (this.props.inverse) {
        return getTheme().variables.inverseSpinnerColor;
      }

      return getTheme().variables.defaultSpinnerColor;
    };

    return <ActivityIndicator {...this.prepareRootProps()} color={getColor()} size={this.props.size ? this.props.size : 'large'} />;
  }
}
