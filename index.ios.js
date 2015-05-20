/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ActivityIndicatorIOS
} = React;

var locanon = React.createClass({
  getInitialState: function(){
    return {
      currentMessageInput: '',
      currentLocation: 'unknown',
      messagesAtThisLocation: null,
      loadingLocation: true,
    }
  },

  componentWillMount: function() {

  },

  componentDidMount: function() {
    navigator.geolocation.getCurrentPosition(
      (currentLocation) => {
        this.setState({currentLocation, loadingLocation: false})
      },
      (error) => console.error(error),
      {enableHighAccuracy: true, timeout: 25000, maximumAge: 1000}
    );
  },

  getMessagesForThisLocation: function() {
    var currentLocation;

    if (this.state.currentLocation !== 'unknown') {
      currentLocation = `${this.state.currentLocation.coords.latitude}--${this.state.currentLocation.coords.longitude}`
    } else {
      return false
    }

    var queryUrl = 'http://localhost:1337/app/'+currentLocation;
    
    fetch(queryUrl, {method: 'get'}).then(function(response) {
      return response.json().then(function(json) {
        console.log(json)
      });
    });
  },

  saveNewMessageForThisLocation: function() {
    
    var dummy = {
      a: 1,
      b: 2
    };
    
    fetch('http://localhost:1337/app', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'x-www-form-urlencoded'
        },
        data: 'json='+JSON.stringify(dummy)
      }).then(function(response) {
      return response.json().then(function(json){
        console.log(json)
      });
    });
  },

  render: function() {
    console.log(this.state)
    var loadingView = this.state.loadingLocation ? 
      <View style={styles.loadingViewContainer}>
        <ActivityIndicatorIOS
            animating={this.state.loadingLocation}
            style={[styles.centering, styles.gray, {height: 40}]}
            color="white"
            />
      </View> : null;

    return ( 
    
      <View style={styles.container}>
        {loadingView}
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({currentMessageInput: text})}
        />
        <TouchableHighlight onPress={this.getMessagesForThisLocation}>
          <Text>Get Locations</Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.saveNewMessageForThisLocation}>
          <Text>Post Locations</Text>
        </TouchableHighlight>



      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  loadingViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: 300,
    backgroundColor: 'rgba(0,0,0,0.8'
  }
});

AppRegistry.registerComponent('locanon', () => locanon);
