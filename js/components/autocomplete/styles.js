import {StyleSheet} from "react-native";

const React = require('react-native');

const { Dimensions } = React;

const deviceWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
    rowText: {
        paddingHorizontal: 6,
        paddingVertical: 10,
        fontSize: 11,
        color: 'gray',
        backgroundColor: 'white',
        textAlignVertical: 'center',
    },
    highlightedRowText: {
        color: 'black',
    },
    dropdownTextStyle: {
        flex: 1,
        alignItems: 'flex-start',
        borderWidth: 0,
        left: 10,
        width:deviceWidth - 24
    },
});
