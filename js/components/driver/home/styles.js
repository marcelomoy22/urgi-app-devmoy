
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
    padding: 30,
    paddingTop: 40,
    alignItems: 'center',
    position: 'absolute',
    top: deviceHeight / 2,
    right: 0,
    left: 0,
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
    marginTop: 5,
    fontSize: 16,
    color: '#ccc',
    alignSelf: 'center',
  },
  aRateStar: {
    marginTop: -23,
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
    paddingTop: 20,
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
    marginTop: -10,
    textAlign: 'center',
    color: '#ddd',
  },
  logoutLogo: {
    padding: 5,
    bottom: 5,
    color: '#FFF'
  },
  putModalInPlace: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalBackground: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalValidationContainer: {
    alignItems: 'center',
    height: deviceWidth - 500,
    width: deviceWidth - 30,
    backgroundColor: '#fff',
  },
  modalValidationTitle: {
    paddingBottom: 20,
    color: '#fff',
  },
  modalValidationButton: {
    padding: 20,
  },
  modalValidationInput: {
    padding: 10,
    borderColor: '#797979',
    borderWidth: 1,
    textAlign: 'center',
    height: deviceHeight / 15,
  },
  modalConfirmationInput: {
    padding: 10,
    borderColor: '#797979',
    borderWidth: 1,
    textAlign: 'center',
    height: deviceHeight / 15,
    width: deviceWidth / 1.5,
  },
  modalX: {
    fontSize: 28,
    color: '#fff',
    paddingLeft: 20,
    paddingBottom: 20,
  },
  quickOptionsRightContainer: {
    position: 'absolute',
    left: -deviceWidth / 1.2,
    marginTop: deviceHeight / 5.5,
  },
  quickOptionPlay: {
    borderRadius: 30,
    backgroundColor: 'red',
    height: 55,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  quickOptionStop: {
    borderRadius: 30,
    backgroundColor: 'green',
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
});
