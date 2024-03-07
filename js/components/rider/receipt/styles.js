

import { StyleSheet, Platform } from 'react-native';

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
    paddingTop: 25,
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
  dateContainer: {
    paddingVertical: (Platform.OS === 'android') ? 5 : 20,
    flexDirection: 'row',
  },
  sideLines: {
    borderBottomWidth: 1,
    width: 50,
    alignSelf: 'center',
    borderBottomColor: '#797979',
  },
  summaryText: {
    textAlign: 'center',
    padding: 5,
    paddingTop: 0,
    color: '#797979',
  },
  amount: {
    fontSize: 80,
    lineHeight: 80,
    padding: 20,
    paddingVertical: 30,
  },
  taxiNoContainer: {
    borderWidth: 1,
    backgroundColor: '#19192B',
  },
  taxiNo: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 13,
    color: '#fff',
    padding: 5,
    fontWeight: '700',
  },
  feedBackBtn: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  btnText: {
    color: '#797979',
    fontSize: 14,
  },
});
