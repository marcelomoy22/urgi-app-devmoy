
import { StyleSheet } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

module.exports = StyleSheet.create({
  iosHeader: {
    backgroundColor: '#19192B',
    position: 'absolute',
    top: 0,
    width: deviceWidth - 30,
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
    borderBottomColor: '#797979',
    borderBottomWidth: 2,
    textAlign: 'center',
  },
  modalX: {
    fontSize: 28,
    color: '#fff',
    paddingLeft: 20,
    paddingBottom: 20,
  },
});
