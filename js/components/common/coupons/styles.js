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
  card: {
    backgroundColor: '#fff',
    position: 'relative',
  },
  cardSelected: {
    backgroundColor: '#aaa',
    position: 'relative',
  },
  couponContainer: {
    borderWidth: 0,
    padding: 0,
    height: deviceHeight / 5,
    overflow: 'hidden',
  },
  detailContainer: {
    borderWidth: 0,
    padding: 10,
  },
  dummyView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  iosModalHeader: {
    backgroundColor: '#19192B',
    position: 'absolute',
    top: 0,
    width: deviceWidth - 30,
  },
  aModalHeader: {
    backgroundColor: '#19192B',
    borderColor: '#aaa',
    elevation: 3,
    paddingTop: 20,
    position: 'absolute',
    top: 0,
    width: deviceWidth,
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
  modalValidationTitle: {
    paddingBottom: 20,
    color: '#000',
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
    width: deviceWidth/2
  },
  modalX: {
    fontSize: 28,
    color: '#000',
    paddingLeft: 20,
    paddingBottom: 20,
  },
  checkMark: {
    color: 'green',
    fontSize: 40,
    alignSelf: 'center',
  },
  selectOutLine: {
    color: 'green',
    fontSize: 30,
    alignSelf: 'center',
  },
  trash: {
    color: 'red',
    fontSize: 30,
  },
  deleteBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  selectBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  couponTitle: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  couponText: {
    textAlign: 'center',
    marginTop: 30
  },
  modalBackground: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  iosFooter: {
    backgroundColor: '#fff',
    marginBottom: 100
  },
  aFooter: {
    backgroundColor: '#fff',
    borderColor: '#aaa',
    elevation: 3,
    height: deviceHeight / 4,
    marginBottom: 100
  },
  buttonStyle: {
    width: deviceWidth / 1.4,
    height: 55,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#19192B',
    borderRadius: 0,

  },
  buttonText: {
    color: '#fff',
  },
  footerTitleText: {
    color: 'gray',
  },
});
