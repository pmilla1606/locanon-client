/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var stround = require('stround');
var round = stround.round;
var RefreshableListView = require('react-native-refreshable-listview')
// Components
var LoadingView = require('./components/loading_view_component');
var SingleMessageView = require('./components/message_view_component');

var ROUNDING_PRECISION = 3;
var BASE_QUERY_URL = 'http://45.55.242.156:1337/app' //prod
//var BASE_QUERY_URL = 'http://localhost:1337/app/' //dev

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ActivityIndicatorIOS,
  ListView,
  MapView
} = React;

var locanon = React.createClass({
  getInitialState: function(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      currentMessageInput: '',
      currentLong: 0,
      currentLat: 0,
      messagesAtThisLocation: null,
      loadingLocation: true,
      dataSource: ds.cloneWithRows(['row1', 'row2']),
    }
  },

  componentWillMount: function() {
  },

  componentDidMount: function() {
    this.geoInit();
  },

  geoInit: function() {
    navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError, {enableHighAccuracy: true, timeout: 25000, maximumAge: 300000});
  },

  geoSuccess: function(position) {
    this.setState({
      currentLong: round(position.coords.longitude, ROUNDING_PRECISION),
      currentLat: round(position.coords.latitude, ROUNDING_PRECISION),
      loadingLocation: false
    });

    this.getMessagesForThisLocation();
  },

  geoError: function(error) {
    console.log('Geo Error -- Trying Again');
    this.geoInit();
  },

  getMessagesForThisLocation: function() {
    console.log('fetching ow');
    var that = this;
    var currentLocation;

    this.setState({
      loadingLocation: true
    });


    if (this.state.currentLocation !== 'unknown') {
      currentLocation = `${this.state.currentLong}--${this.state.currentLat}`
    } else {
      return false
    }

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    
    fetch(BASE_QUERY_URL+currentLocation, {
      method: 'get'
    })
    .then(that.status)
    .then(that.json)
    .then(function(json){
      console.log('Get success! ', json)
      that.setState({
        dataSource: ds.cloneWithRows(json),
        loadingLocation: false
      });
    })
    .catch(function(error){
      console.log('ERROR', error)
    });
  },

  saveNewMessageForThisLocation: function() {
    var data;
    var that = this;

    if (this.state.currentMessageInput === '') {

      return false

    } else {

      that.setState({
        loadingLocation: true
      });

      data = {
        lng: that.state.currentLong,
        lat: that.state.currentLat,
        message: that.state.currentMessageInput
      };

      fetch(BASE_QUERY_URL, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(that.status)
      .then(that.json)
      .then(function(json){
        console.log('Put success! ', json)
        that.setState({
          loadingLocation: false
        }, function() {
          that.getMessagesForThisLocation();
        });
      })
      .catch(function(error){
        console.log('ERROR', error)
      });

    }
  },
  
  // fetch helpers
  status: function (response) {
    console.log('status', response)
    if (response.status >= 200 && response.status < 300) {
      return response
    }
    throw new Error(response.statusText)
  },

  json: function(response) {
    return response.json()
  },
  // end fetch helpers

  render: function() {
    var loadingScreen = this.state.loadingLocation ? <LoadingView isLoading={true} /> : null;
    return (

      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={ {latitude: Number(this.state.currentLat), longitude: Number(this.state.currentLong), latitudeDelta: 10, longitudeDelta: 10} }
          showsUserLocation={true}
        />
        <TextInput
          style={styles.inputField}
          onChangeText={(text) => this.setState({currentMessageInput: text})}
        />
        
        <TouchableHighlight onPress={this.saveNewMessageForThisLocation} style={styles.submitButton}>
          <Text>Post Locations</Text>
        </TouchableHighlight>

        <RefreshableListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <SingleMessageView message={rowData}/>}
          loadData={this.getMessagesForThisLocation}
          refreshDescription="Refreshing articles"
        />

        <Text>{this.state.loadingLocation ? 'Loading' : 'Not Loading'}</Text>

        {loadingScreen}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  map: {
    height: 200
  },
  inputField: {
    alignSelf: 'stretch',
    flex: 0,
    height: 50,
    borderWidth: 1,
    borderColor: '#cccccc'
  },
  submitButton: {
    alignSelf: 'stretch',
    flex: 0,
    height: 50,
    borderWidth: 1,
    borderColor: '#cccccc'
  }

});

AppRegistry.registerComponent('locanon', () => locanon);
