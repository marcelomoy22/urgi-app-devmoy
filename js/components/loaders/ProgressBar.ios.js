import { ProgressView } from '@react-native-community/progress-view';
import { getTheme, Spinner } from 'native-base';
import React from 'react';

export default class ProgressBarNB extends Spinner {
  render() {
    const getColor = () => {
      if (this.props.color) {
        return this.props.color;
      } else if (this.props.inverse) {
        return getTheme().variables.inverseProgressColor;
      }

      return getTheme().variables.defaultProgressColor;
    };

    return <ProgressView progress={this.props.progress ? this.props.progress / 100 : 0.5} progressTintColor={getColor()} />;
  }
}
