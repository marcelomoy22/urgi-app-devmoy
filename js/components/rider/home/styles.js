

import { StyleSheet } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
module.exports = StyleSheet.create({
  iosSearchBar: {
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.6)',
    width: deviceWidth - 20,
    alignSelf: 'center',
    marginTop: 10,
    flex: 1,
    height: 50,
    margin: 10,

  },
  aSearchBar: {
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.6)',
    width: deviceWidth - 20,
    alignSelf: 'center',
    flex: 1,
    height: 50,
    margin: 10,

  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  slideSelector: {
    backgroundColor: 'rgba(255,255,255,0.6)',
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
    backgroundColor: '#fff',
  },
  carIcon: {
    color: '#222',
    fontSize: 24,
  },
  pinContainer: {
    bottom: deviceHeight / 2.1,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  pinButton: {
    backgroundColor: '#19192B',
    alignSelf: 'center',
  },
  pin: {
    width: 2,
    height: 15,
    backgroundColor: '#19192B',
    position: 'relative',
    alignSelf: 'center',
  },
  shareContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  shareOptions: {
    paddingLeft: 20,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
  },
  shareType: {
    fontSize: 12,
    color: '#23C2E1',
  },
  share: {
    paddingRight: 10,
    padding: 10,
    alignItems: 'flex-end',
  },
  taxiTypeContainer: {
    padding: 15,
    alignItems: 'center',
  },
  taxiType: {
    opacity: 0.5,
    alignItems: 'center',
  },
  taxi: {
    borderRadius: 18,
    borderWidth: 2,
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taxiIcon: {
    fontSize: 15,
    color: '#aaa',
    padding: 5,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  SearchPickText: {
    fontSize: 10,
    color: 'green',
    textAlign: 'center',
    marginBottom: -2,
  },
  selectedTaxi: {
    fontSize: 25,
    backgroundColor: 'transparent',
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
    width: deviceWidth - 30,
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
  modalValidationHeader: {
    backgroundColor: '#19192B',
    borderColor: '#aaa',
    elevation: 3,
    paddingTop: 20,
    position: 'absolute',
    top: 0,
    width: deviceWidth,
  },
  quickOptionsRightContainer: {
    position: 'absolute',
    left: -deviceWidth / 1.2,
    marginTop: deviceHeight / 5.5,
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

});
