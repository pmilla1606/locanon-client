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

    var queryUrl = 'http://localhost:1337/app/'+currentLocation;
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch(queryUrl, {method: 'get'}).then(function(response) {
      return response.json().then(function(json) {
        console.log(json)
        that.setState({
          dataSource: ds.cloneWithRows(json),
          loadingLocation: false
        });

      });
    });
  },

  saveNewMessageForThisLocation: function() {
    var data;
    var that = this;

    if (this.state.currentMessageInput === '') {

      return false

    } else {

      this.setState({
        loadingLocation: true
      });

      data = {
        lng: this.state.currentLong,
        lat: this.state.currentLat,
        message: this.state.currentMessageInput
      };

      fetch('http://localhost:1337/app', {
          method: 'post',
          headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          body: 'data='+JSON.stringify(data)
        }).then(function(response) {
        return response.json().then(function(json){
          that.getMessagesForThisLocation();
        });
      });
    }
  },

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
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({currentMessageInput: text})}
        />
        <TouchableHighlight onPress={this.getMessagesForThisLocation}>
          <Text>Get Locations</Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.saveNewMessageForThisLocation}>
          <Text>Post Locations</Text>
        </TouchableHighlight>

        <RefreshableListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <SingleMessageView message={rowData}/>}
          loadData={this.getMessagesForThisLocation}
          refreshDescription="Refreshing articles"
        />


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
    height: 100
  }
});

AppRegistry.registerComponent('locanon', () => locanon);
