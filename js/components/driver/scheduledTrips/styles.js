import { StyleSheet } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceWidth = Dimensions.get('window').width;
module.exports = StyleSheet.create({

  aSrcdes: {
    flex: 1,
    backgroundColor: '#fff',

  },
  iosSrcdes: {
    flex: 1,
    backgroundColor: '#fff',

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
    backgroundColor: '#eee',
    position: 'absolute',
    bottom: 0,
    width: deviceWidth,
  },
  tripBtn: {
    backgroundColor: 'green',
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
    color: '#000',
    textAlign: 'center',
  },
  aHeaderTitle: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    marginTop: -5,
    color: '#000',
    textAlign: 'center',
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
  riderName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  payedTag: {
    color: 'green',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 14,
  },
  notPayedTag: {
    color: '#C61100',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 14,
  },
});
