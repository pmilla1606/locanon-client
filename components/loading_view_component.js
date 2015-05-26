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
  ActivityIndicatorIOS,

} = React;

var LoadingView = React.createClass({
  componentDidMount: function() {
    AnimationExperimental.startAnimation({
      node: this.refs.loadingView,
      duration: 350,
      easing: 'easeInQuad',
      property: 'opacity',
      toValue: 1,
    });
  },
  render: function() {
    return(
      <View ref="loadingView" style={styles.loadingViewContainer}>
        <Text>Loading Loading Loading</Text>
        <ActivityIndicatorIOS
            animating={this.props.isLoading}
            style={[styles.centering, styles.gray, {height: 40}]}
            color="white"
            />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  loadingViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignSelf: 'stretch',
    opacity: 0,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)'
  }
});

module.exports = LoadingView;
