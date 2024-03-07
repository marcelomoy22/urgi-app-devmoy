

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
  cardSelect: {
    margin: 20,
    marginLeft: 20,
    padding: 10,
    marginTop: 0,
    paddingLeft: 0,
  },
  payCard: {
    flexDirection: 'row',
    paddingLeft: 20,
    marginTop: -10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  paytmIcon: {
    width: 35,
    height: 13,
    padding: 5,
    paddingTop: 15,
  },
});
