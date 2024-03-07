

import { StyleSheet } from 'react-native';

const React = require('react-native');
const { Dimensions } = React;
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  map: {
    position: 'absolute',
    width: deviceWidth,
    height: deviceHeight,
    backgroundColor: '#fff',
  },
  stripe: {
    tintColor: 'rgba(255,0,0,.6)',
    alignSelf: 'center',
    flex: 1,
    width: 50,
    height: 50,
  },
  carIcon: {
    position: 'absolute',
    alignSelf: 'center',
    flex: 1,
    width: 50,
    height: 50,
  },
  feedBackBtn: {
    top: 400,
    flexDirection: 'row',
    alignSelf: 'center',
  },

});
