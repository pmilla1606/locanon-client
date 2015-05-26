/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var AnimationExperimental = require('AnimationExperimental');

var Icon = require('Entypo');

var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;

var SingleMessageView = React.createClass({
  componentDidMount: function() {
    AnimationExperimental.startAnimation({
      node: this.refs.singleMessageView,
      duration: 500,
      easing: 'easeInQuad',
      property: 'opacity',
      toValue: 1,
    });
  },
  render: function() {
    return(
      <View ref="singleMessageView" style={styles.messageViewContainer}>
        <Text style={styles.messageText}>{this.props.message.messageString}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  messageViewContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop:5,
    marginBottom: 5
  },
  messageText: {
    flex: 1,
    fontSize: 40,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '100',
    fontFamily: 'Helvetica'
  }
});

module.exports = SingleMessageView;
