
import { StyleSheet } from 'react-native';

const React = require('react-native');

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  capture: {
    flex: 0,
    backgroundColor: '#19192B',
    borderRadius: 5,
    color: '#fff',
    padding: 10,
    margin: 40,
    height: 40,
    width: 300,
    justifyContent: 'center'
  },
  flash: {
    color: '#fff',
    backgroundColor: 'transparent',
    margin: 40,
    height: 40,
    width: 100,
  },
  exit: {
    color: '#fff',
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    margin: 40,
    height: 40,
    width: 100,
  },
});
