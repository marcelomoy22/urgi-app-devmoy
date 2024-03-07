

import { StyleSheet, Platform } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

module.exports = StyleSheet.create({
  searchBarContainer: {
    width: deviceWidth - 20,
    alignSelf: 'center',
  },
  searchBar: {
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  aSrcdes: {
    margin: 10,
    flex: 1,
  },
  iosSrcdes: {
    margin: 10,
    flex: 1,
  },
  DropdownSelect: {
    alignSelf: 'center',
    height: 0,
  },
  DropdownSelectText: {
    flex: 1,
    alignItems: 'flex-start',
    borderWidth: 0,
    left: 10,
    width: deviceWidth - 24,
  },
  slideSelector: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    position: 'absolute',
    bottom: 0,
    width: deviceWidth,
    zIndex: 1,
  },

  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iosPaytmIcon: {
    width: 35,
    height: 13,
    marginTop: (Platform.OS === 'android') ? 2 : -3,
    padding: 8,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  aPaytmIcon: {
    width: 100,
    height: 13,
    marginTop: -3,
    padding: 8,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  carIcon: {
    color: '#222',
    fontSize: 24,
  },
  quickOptionsLeftContainer: {
    width: deviceWidth * 3.2,
    marginTop: deviceHeight / 2.5,
  },
  quickOptionsBtns: {
    borderRadius: 30,
    backgroundColor: '#19192B',
    height: 55,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  icons: {
    fontSize: 22,
    color: '#fff',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 15,
    marginBottom: -7,
    color: '#797979',
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
  searchIcon: {
    fontSize: 20,
    color: '#797979',
    backgroundColor: 'transparent',
    marginTop: 3,
    position: 'absolute',
    left: 10,
    top: 7,
  },
  modalTopContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
  modalScheduleContainer: {
    alignItems: 'center',
    height: deviceWidth - 500,
    width: deviceWidth - 30,
    backgroundColor: '#fff',
  },
  modalScheduleButton: {
    padding: 20,
  },
  modalScheduleInfo: {
    padding: 20,
  },
  scheduleBtn: {
    backgroundColor: 'green',
    borderRadius: 60,
  },
  confirmBtn: {
    backgroundColor: '#19192B',
    borderRadius: 60,
  },
  vipBtn: {
    backgroundColor: '#A05757',
    borderRadius: 60,
  },
  modalllll: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  putModalInPlace: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalValidationContainer: {
    alignItems: 'center',
    height: deviceWidth - 500,
    width: deviceWidth - 30,
    backgroundColor: '#fff',
  },
  modalX: {
    fontSize: 28,
    color: '#000',
    paddingLeft: 20,
    paddingBottom: 20,
  },
  modalValidationTitle: {
    paddingBottom: 20,
    color: '#000',
  },
  cancelBtn: {
    backgroundColor: '#f00',
    borderRadius: 60,
  },
});
