
import { StyleSheet } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceWidth = Dimensions.get('window').width;
module.exports = StyleSheet.create({

  aSrcdes: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',

  },
  iosSrcdes: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',

  },
  searchBar: {
    width: deviceWidth,
    flexDirection: 'row',
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
  tripBtn: {
    backgroundColor: '#C61100',
    height: 60,
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 25,
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
});
