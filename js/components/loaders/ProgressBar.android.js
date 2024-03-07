import { ProgressBar } from '@react-native-community/progress-bar-android';
import { getTheme, Spinner } from 'native-base';
import computeProps from 'native-base/dist/src/utils/computeProps';
import React from 'react';

export default class SpinnerNB extends Spinner {
  prepareRootProps() {
    const type = {
      height: 40,
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
        return getTheme().variables.inverseProgressColor;
      }

      return getTheme().variables.defaultProgressColor;
    };

    return (
      <ProgressBar
        {...this.prepareRootProps()}
        styleAttr='Horizontal'
        indeterminate={false}
        progress={this.props.progress ? this.props.progress / 100 : 0.5}
        color={getColor()}
      />
    );
  }
}
