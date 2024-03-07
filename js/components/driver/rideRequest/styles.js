
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
    width: deviceWidth,
    height: deviceWidth,
    flex: 999999,
  },
  mapBg: {
    height: null,
    width: null,
    top: 0,
    flex: 999,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  pageTouch: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: deviceHeight,
    width: deviceWidth,
    flex: 999999,
  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#19192B',
  },
  detailsContainer: {
    backgroundColor: '#19192b',
    // padding: 30,
    // paddingTop: 40,
    alignItems: 'center',
    //position: 'absolute',
    top: 50,
    right: 0,
    left: 0,
    height: deviceHeight
  },
  time: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
  },
  place: {
    color: '#bbb',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  rating: {
    color: '#ccc',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 10,
  },
  iosRateStar: {
    fontSize: 16,
    color: '#ccc',
    alignSelf: 'center',
  },
  aRateStar: {
    marginTop: 4,
    fontSize: 16,
    color: '#ccc',
    alignSelf: 'center',
  },
  iosHeader: {
    backgroundColor: '#19192B',
    position: 'absolute',
    top: 0,
    width: deviceWidth,
  },
  aHeader: {
    backgroundColor: '#19192B',
    borderColor: '#aaa',
    elevation: 3,
    position: 'absolute',
    top: 0,
    width: deviceWidth,
  },
  iosHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ddd',
    textAlign: 'center',
  },
  aHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
    marginTop: -5,
    textAlign: 'center',
    color: '#ddd',
  },
});
