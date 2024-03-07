

import { StyleSheet } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;

module.exports = StyleSheet.create({

  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  mapContainer: {
    borderWidth: 0,
    padding: 0,
    height: deviceHeight / 5,
    overflow: 'hidden',
  },
  detailContainer: {
    borderWidth: 0,
    padding: 10,
    flexDirection: 'column'
  },
  driverImage: {
    borderRadius: 20,
    marginTop: 3,
  },
  cashText: {
    alignSelf: 'flex-end',
    marginTop: -40,
  },
  dummyView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },

});
