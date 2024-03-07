import { StyleSheet } from 'react-native';

const React = require('react-native');
const { Dimensions } = React;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

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
  detailContainer: {
    borderWidth: 0,
    padding: 10,
  },
  driverImage: {
    borderRadius: 100,
    marginTop: 3,
  },
  dummyView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
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
  searchBarContainer: {
    width: deviceWidth - 20,
    alignSelf: 'center',
  },
  searchBar: {
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});
