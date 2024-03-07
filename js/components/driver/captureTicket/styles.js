
import { StyleSheet } from 'react-native';

const React = require('react-native');

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
  btnCam: {
    backgroundColor: 'green',
    height: 40,
    width: 60,
    margin: 10,
  },
  tripBtn: {
    backgroundColor: 'green',
    height: 60,
  },
  btnText: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 25,
  },
  image: {
    alignSelf: 'center',
  },
});
