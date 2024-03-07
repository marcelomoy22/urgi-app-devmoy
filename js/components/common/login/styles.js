
import { StyleSheet } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;

module.exports = StyleSheet.create({
  iosLogoContainer: {
    top: deviceHeight / 2.6,
    alignItems: 'center',
  },
  aLogoContainer: {
    top: deviceHeight / 3,
    alignItems: 'center',
    height: deviceHeight / 1.5,
  },
  logoIcon: {
    color: '#eee',
    fontSize: 100,
  },
  logoText: {
    color: '#eee',
    fontWeight: '700',
    fontSize: 25,
    lineHeight: 30,    
  },
  logoImage: { 
    width: 90, 
    height: 90,
    tintColor: '#FFF',    
  },
  loginBtn: {
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#19192B',
  },
  registerBtn: {
    borderRadius: 0,
    backgroundColor: '#19192B',
  },
});
