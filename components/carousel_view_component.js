/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var AnimationExperimental = require('AnimationExperimental');
var Carousel = require('react-native-carousel');

var {
  StyleSheet,
  Text,
  View,
  ActivityIndicatorIOS
} = React;

var LoadingView = React.createClass({
  componentDidMount: function() {
    AnimationExperimental.startAnimation({
      node: this.refs.onboardingCarousel,
      duration: 350,
      easing: 'easeInQuad',
      property: 'opacity',
      toValue: 1,
    });
  },
  render: function() {
    return(
      <Carousel width={styles.wrapper} ref="onboardingCarousel">
        <View style={styles.container}>
          <Text>Page 1</Text>
        </View>
        <View style={styles.container}>
          <Text>Page 2</Text>
        </View>
        <View style={styles.container}>
          <Text>Page 3</Text>
        </View>
      </Carousel>
    );
  }
});

var styles = StyleSheet.create({
  wrapper: {
    width: 375,
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 375,
    borderWidth: 1,
    borderColor: 'green',
    height: 600,
    flex: 1,
    backgroundColor: 'pink',
  }
});

module.exports = LoadingView;
