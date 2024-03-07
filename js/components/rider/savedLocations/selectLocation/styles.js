

import { StyleSheet } from 'react-native';

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
  subtitleContainer: {
    margin: 20,
    padding: 10,
    marginTop: 0,
    paddingLeft: 0,
    borderBottomColor: '#24BCD9',
    borderBottomWidth: 1,
  },
  subtitleText: {
    color: '#24BCD9',
    fontSize: 14,
  },
  detailContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.3)',

  },
  detailName: {
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingTop: 5,

  },
  detailAddress: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    padding: 10,

  },
  selectIcon: {
    alignSelf: 'center',
    color: '#24BCD9',
    fontSize: 50,

  },
  locationIcon: {
    width: 40,
    height: 20,
    marginTop: 3,
    alignSelf: 'center',

  },
  trashBtnContainer: {
    alignSelf: 'center',
  },
  trashIcon: {
    alignSelf: 'center',
    color: '#000',

  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,

  },
  swipeOutButtonIcons: {
    color: '#fff',
    fontSize: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
