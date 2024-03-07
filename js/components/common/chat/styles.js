
import { StyleSheet } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').weight;

module.exports = StyleSheet.create({

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
  iosHeaderTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  aHeaderTitle: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    marginTop: -5,
  },
  detailsField: {
    color: '#868688',
    alignSelf: 'center',
    padding: 20,
  },
  footerContainer: {
    alignSelf: 'flex-end',
    marginBottom: 15,
    width: 55,
    height: 55,
  },
  inputBar: {
    height: deviceHeight / 2,
    backgroundColor: '#efefef',
  },
  sendText: {
    color: 'green',
  },

});
