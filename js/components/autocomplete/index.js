import ListView from 'deprecated-react-native-listview';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';

import { onDropdownSelect } from '../../actions/autoComplete';
import styles from './styles';

const TOUCHABLE_ELEMENTS = ['TouchableHighlight', 'TouchableOpacity', 'TouchableWithoutFeedback', 'TouchableNativeFeedback'];

function mapStateToProps(state) {
  return {
    showDropdown: state.autocomplete.show,
    options: state.autocomplete.resultLables,
  };
}

class AutoComplete extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    defaultIndex: PropTypes.number,
    defaultValue: PropTypes.string,
    options: PropTypes.array,
    accessible: PropTypes.bool,
    renderRow: PropTypes.func,
    onDropdownSelect: PropTypes.func,
    showDropdown: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    defaultIndex: -1,
    defaultValue: 'Please select...',
    options: null,
  };

  constructor(props) {
    super(props);

    this._nextValue = null;
    this._nextIndex = null;

    this.state = {
      disabled: props.disabled,
      accessible: !!props.accessible,
      loading: props.options === null || props.options === undefined,
      buttonText: props.defaultValue,
      selectedIndex: props.defaultIndex,
    };
  }

  componentWillReceiveProps(nextProps) {
    let buttonText = this._nextValue == null ? this.state.buttonText : this._nextValue.toString();
    let selectedIndex = this._nextIndex == null ? this.state.selectedIndex : this._nextIndex;
    if (selectedIndex < 0) {
      selectedIndex = nextProps.defaultIndex;
      if (selectedIndex < 0) {
        buttonText = nextProps.defaultValue;
      }
    }
    this._nextValue = null;
    this._nextIndex = null;

    this.setState({
      disabled: nextProps.disabled,
      loading: nextProps.options == null,
      buttonText,
      selectedIndex,
    });
  }
  renderIf(condition, render) {
    if (condition) {
      return render;
    }

    return null;
  }

  render() {
    return (
      <View {...this.props}>{this.renderIf(this.props.showDropdown, <ListView dataSource={this._dataSource} renderRow={this._renderRow.bind(this)} />)}</View>
    );
  }

  get _dataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    return ds.cloneWithRows(this.props.options);
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    const key = `row_${rowID}`;
    const highlighted = rowID === this.state.selectedIndex;
    const row = !this.props.renderRow ? (
      <Text style={[styles.rowText, styles.dropdownTextStyle, highlighted && styles.highlightedRowText]}>{rowData}</Text>
    ) : (
      this.props.renderRow(rowData, rowID, highlighted)
    );
    const preservedProps = {
      key,
      accessible: this.props.accessible,
      onPress: () => this._onRowPress(rowData, sectionID, rowID, highlightRow),
    };
    if (TOUCHABLE_ELEMENTS.find((name) => name === row.type.displayName)) {
      const props = { ...row.props };
      props.key = preservedProps.key;
      props.onPress = preservedProps.onPress;
      switch (row.type.displayName) {
        case 'TouchableHighlight':
          {
            return <TouchableHighlight {...props}>{row.props.children}</TouchableHighlight>;
          }
          break;
        case 'TouchableOpacity':
          {
            return <TouchableOpacity {...props}>{row.props.children}</TouchableOpacity>;
          }
          break;
        case 'TouchableWithoutFeedback':
          {
            return <TouchableWithoutFeedback {...props}>{row.props.children}</TouchableWithoutFeedback>;
          }
          break;
        case 'TouchableNativeFeedback':
          {
            return <TouchableNativeFeedback {...props}>{row.props.children}</TouchableNativeFeedback>;
          }
          break;
        default:
          break;
      }
    }
    return <TouchableHighlight {...preservedProps}>{row}</TouchableHighlight>;
  }

  _onRowPress(rowData, sectionID, rowID, highlightRow) {
    if (!this.props.onDropdownSelect || this.props.onDropdownSelect(rowID, rowData) !== false) {
      highlightRow(sectionID, rowID);
      this._nextValue = rowData;
      this._nextIndex = rowID;
      this.setState({
        buttonText: rowData.toString(),
        selectedIndex: rowID,
      });
    }
  }
}

function bindActions(dispatch) {
  return {
    onDropdownSelect: (index) => dispatch(onDropdownSelect(index)),
  };
}

export default connect(mapStateToProps, bindActions)(AutoComplete);
