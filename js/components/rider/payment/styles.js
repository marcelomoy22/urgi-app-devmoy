

import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({

  paytmIcon: {
    width: 35,
    height: 13,
    padding: 5,
    paddingTop: 15,
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
  },
  aHeaderTitle: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    marginTop: -5,
  },
  payModeType: {
    margin: 20,
    padding: 10,
    marginTop: 0,
    paddingLeft: 0,
    borderBottomColor: '#24BCD9',
    borderBottomWidth: 1,
  },
  payModeText: {
    color: '#24BCD9',
    fontSize: 14,
  },
  payMethod1: {
    flexDirection: 'row',
    margin: 20,
    marginTop: 0,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: '#ccc',
  },
  payMethod2: {
    flexDirection: 'row',
    margin: 20,
    marginTop: -10,
  },
  swipeOutButtonIcons: {
    color: '#fff',
    fontSize: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
