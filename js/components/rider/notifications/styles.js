

import { StyleSheet, Platform } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;
module.exports = StyleSheet.create({

  notCard: {
    height: deviceHeight / 4,
    width: null,
  },
  iosHeader: {
    backgroundColor: '#fff',
  },
  iosHeaderX: {
    backgroundColor: 'rgba(0,0,0,0)',
    top : 10,
  },  
  aHeader: {
    backgroundColor: '#fff',
    borderColor: '#aaa',
    elevation: 3,
  },
  iosHeaderText: {
    fontSize: 18,
    fontWeight: '500',
  },
  aHeaderText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    marginTop: -5,
  },
  container: {
    backgroundColor: '#19192B',
    padding: 20,
    marginBottom: (Platform.OS === 'ios') ? -50 : -10,
  },
  contentHeading: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  shareText: {
    textAlign: 'center',
    margin: 40,
    color: '#fff',
    fontWeight: '600',
  },


});
