

import { StyleSheet } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

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
  iosSubHeader: {
    backgroundColor: '#19192B',
  },
  aHeader: {
    backgroundColor: '#fff',
    borderColor: '#aaa',
    elevation: 3,
  },
  aSubHeader: {
    backgroundColor: '#19192B',
    borderColor: '#aaa',
    elevation: 3,
  },
  iosHeaderTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  iosSubHeaderTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  aHeaderTitle: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    marginTop: -5,
  },
  aSubHeaderTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    marginTop: -5,
    color: '#fff',
  },
  mapContainer: {
    borderWidth: 0,
    padding: 0,
    height: deviceHeight / 5,
    overflow: 'hidden',
    width: '100%'
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
  paysheetData: {
    color: '#868688',
    alignSelf: 'center',
  },
  updateBtn: {
    width: deviceWidth / 4,
    backgroundColor: '#aaa',

  },
  updateText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  emptyText: {
    alignSelf: 'center',
    fontSize: 16,
  },
  searchIcon: {
    fontSize: 20,
    color: '#797979',
    backgroundColor: 'transparent',
    marginTop: 3,
    position: 'absolute',
    left: 10,
    top: 7,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#797979',
    backgroundColor: 'transparent',
    marginTop: 3,
    position: 'absolute',
    left: 10,
    top: 7,
  },
  searchBarContainer: {
    width: deviceWidth - 20,
    alignSelf: 'center',
  },
  searchBar: {
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

});
