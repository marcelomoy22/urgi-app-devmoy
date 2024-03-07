
import { StyleSheet, Platform } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
  searchBar: {
    width: deviceWidth,
    flexDirection: 'row',
  },
  aSrcdes: {
    flex: 1,
    backgroundColor: '#fff',

  },
  iosSrcdes: {
    flex: 1,
    backgroundColor: '#fff',

  },

  slideSelector: {
    padding: 10,
    backgroundColor: '#eee',
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
  footerCard: {
    flexDirection: 'row',
    backgroundColor: '#eee',
  },
  profileIcon: {
    alignSelf: 'center',
    paddingRight: 10,
    color: '#797979',
  },
  pick: {
    color: 'green',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 14,
  },
  rider: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  time: {
    textAlign: 'right',
    color: '#797979',
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
  modalScheduleContainer: {
    alignSelf: 'flex-end',
    width: deviceWidth / 1.2,
  },
  containHead: {
    color: '#fff',
    fontWeight: '600',
    paddingVertical: 10,
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
  quickOptionsLeftContainer: {
    position: 'absolute',
    left: -deviceWidth / 1.2,
    marginTop: deviceHeight / 3.5,
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
  moreInfoIcon: {
    fontSize: 40,
    color: 'green',
  },

});
