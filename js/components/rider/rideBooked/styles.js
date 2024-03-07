

import { StyleSheet } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
  searchBar: {
    width: deviceWidth,
    alignSelf: 'center',
    height: 50,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar2: {
    marginVertical: -5,
    width: deviceWidth,
    alignSelf: 'center',
    height: 60,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  srcdes: {
    flex: 1,
  },
  slideSelector: {
    paddingBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    position: 'absolute',
    bottom: 0,
    width: deviceWidth,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  driverInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInfo: {
    flexDirection: 'row',
    alignSelf: 'center',
    borderWidth: 1,
    padding: 3,
    backgroundColor: '#eee',
    marginTop: -10,
  },
  carInfo: {
    borderWidth: 1,
    padding: 3,
    backgroundColor: '#eee',
    marginTop: -10,
  },
  card: {
    alignItems: 'center',
    borderWidth: 1,
    flex: 2,
    borderColor: '#EEE',
  },
  btnText: {
    fontSize: 13,
    lineHeight: 15,
    color: '#797979',
  },
  waitTime: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 15,
    color: '#797979',
    marginTop: 10,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: deviceWidth,
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
  confirmation: {
    textAlign: 'center',
    marginTop: -10,
    fontSize: 14,
  },

  modalTopContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalTextViewContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  modalText: {
    alignSelf: 'center',
  },
  quickOptionsLeftContainer: {
    position: 'absolute',
    left: -deviceWidth / 1.2,
    marginTop: deviceHeight / 2,
  },
  quickOptionsRightContainer: {
    position: 'absolute',
    left: deviceWidth / 0.66,
    marginTop: deviceHeight / 1.61,
  },
  quickOptionsBtns: {
    borderRadius: 60,
    backgroundColor: '#19192B',
    height: 55,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  quickOptionsIcon: {
    color: '#fff',
    fontSize: 26,
  },
  notificationCounter: {
    position: 'absolute',
    left: deviceWidth / 8,
    borderRadius: 60,
    backgroundColor: '#19192B',
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',

  },
  cancelRideIcon: {
    fontSize: 40,
    color: 'red',
  },

});
