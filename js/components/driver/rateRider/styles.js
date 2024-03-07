

import { StyleSheet } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceWidth = Dimensions.get('window').width;
module.exports = StyleSheet.create({

  slideSelector: {
    padding: 10,
    backgroundColor: '#eee',
    position: 'absolute',
    bottom: 0,
    width: deviceWidth,
  },
  iosHeader: {
    position: 'absolute',
    top: 0,
    width: deviceWidth,
    backgroundColor: '#19192B',
  },
  aHeader: {
    position: 'absolute',
    top: 0,
    width: deviceWidth,
    backgroundColor: '#19192B',
    borderColor: '#19192B',
    elevation: 3,
  },
  iosHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  aHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    marginTop: -5,
    color: '#fff',
    textAlign: 'center',
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
  pay: {
    fontSize: 18,
    fontWeight: '500',
    color: 'green',
  },
  trip: {
    color: '#797979',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 14,
  },
  helpBtn: {
    position: 'absolute',
    right: 10,
    top: 12,
    bottom: 12,
    borderColor: '#797979',
  },

  starIcon: {
    color: '#797979',
    fontSize: 18,
    lineHeight: 20,
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    width: deviceWidth,
  },
  rateCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 0,
    borderColor: '#fff',
  },
  profileIcon: {
    alignSelf: 'center',
    paddingRight: 10,
    color: '#797979',
  },
  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  btnContainer: {
    borderBottomColor: '#eee',
    flexDirection: 'column',
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 25,
  },

});
