

import { StyleSheet, Platform } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;
const deviceWidth = Dimensions.get('window').width;
module.exports = StyleSheet.create({

  searchBar: {
    width: deviceWidth,
    flexDirection: 'row',
  },
  aSrcdes: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',

  },
  iosSrcdes: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',

  },
  modalHeader: {
    borderColor: '#aaa',
    elevation: 3,
  },
  close: {
    color: '#ccc',
    fontSize: 40,
    lineHeight: 45,
    marginTop: (Platform.OS === 'android') ? -7 : undefined,

  },
  iosTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ddd',
  },
  aTitle: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    marginTop: -5,
    color: '#ddd',
  },
  iosHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3EC1D9',
  },
  aHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 26,
    marginTop: -10,
    color: '#3EC1D9',
  },
  slideSelector: {
    backgroundColor: 'rgba(238,238,238,0.2)',
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

  modalScheduleContainer: {
    alignSelf: 'flex-end',
    width: deviceWidth / 1.2,
  },
  containHead: {
    color: '#fff',
    fontWeight: '600',
    paddingVertical: 10,
  },
  btnContain: {
    borderBottomWidth: 0,
    flexDirection: 'column',
    alignItems: 'center',
  },
  drop: {
    textAlign: 'right',
    fontSize: 12,
    color: '#EB6543',
    fontWeight: '600',
    lineHeight: 13,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    flex: 1,
    width: deviceWidth,
  },
  iosHeader: {
    backgroundColor: '#19192B',
  },
  aHeader: {
    backgroundColor: '#19192B',
    borderColor: '#aaa',
    elevation: 3,
  },
  iosHeaderTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  aHeaderTitle: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    marginTop: -5,
    color: '#fff',
    textAlign: 'center',
  },
  navigateBtn: {
    flexDirection: 'column',
    alignItems: 'center',
    width: deviceWidth / 4,
    padding: 10,
    borderRightWidth: 0.5,
    borderColor: '#aaa',
    paddingVertical: 20,
  },
  place: {
    alignItems: 'center',
    width: deviceWidth / 1.4,
    padding: 10,
    paddingVertical: 20,
  },
  placeText: {
    textAlign: 'center',
    marginTop: -3,
    fontSize: 14,
  },
  pickCard: {
    backgroundColor: 'rgba(238,238,238,0.2)',
  },
  profileIcon: {
    alignSelf: 'center',
    paddingRight: 10,
    color: '#797979',
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
  navigate: {
    color: '#3EC1D9',
    fontSize: (deviceWidth < 330) ? 12 : 13,
    fontWeight: '700',
    lineHeight: 14,
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
  cardCall: {
    alignItems: 'center',
    borderWidth: 1,
    flex: 2,
    borderColor: '#EEE',
  },
  btnTextCall: {
    fontSize: 13,
    lineHeight: 15,
    color: '#797979',
  },

});
