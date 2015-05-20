/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var AnimationExperimental = require('AnimationExperimental');

var {
  StyleSheet,
  Text,
  View,
} = React;

var SingleMessageView = React.createClass({
  componentDidMount: function() {
    AnimationExperimental.startAnimation({
      node: this.refs.singleMessageView,
      duration: 350,
      easing: 'easeInQuad',
      property: 'opacity',
      toValue: 1,
    });
  },
  render: function() {
    console.log(this.props)
    return(
      <View ref="singleMessageView" style={styles.messageViewContainer}>
        <Text>{this.props.message.messageString}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  messageViewContainer: {
    backgroundColor: 'pink',
    height: 50
  }
});

module.exports = SingleMessageView;
