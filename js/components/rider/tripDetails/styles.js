
import { StyleSheet } from 'react-native';

const React = require('react-native');

const { Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;

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
  mapContainer: {
    borderWidth: 0,
    padding: 0,
    height: deviceHeight / 5,
    overflow: 'hidden',
  },
  highLightText: {
    color: '#000',
    fontWeight: 'bold',
    padding: 10,
  },
  selectedTab: {
    color: 'gray',
    fontSize: 16,
  },
  detailText: {
    color: 'gray',
    fontSize: 16,
    padding: 10,
  },
  tabBarContainer: {
    backgroundColor: '#f7f7f7',
    padding: 30,
  },
  driverImage: {
    alignSelf: 'center',
    borderRadius: 60,
    marginTop: 3,
  },
  detailContainer: {
    borderWidth: 0,
    padding: 10,
  },
  detailsField: {
    color: '#868688',
    alignSelf: 'center',
  },
  greenLabel: {
    color: 'green',
    alignSelf: 'center',
  },
  yellowLabel: {
    color: 'yellow',
    alignSelf: 'center',
  },
  redLabel: {
    color: 'red',
    alignSelf: 'center',
  },

});
