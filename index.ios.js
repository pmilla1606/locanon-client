/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var RefreshableListView = require('react-native-refreshable-listview');

// Components
var LoadingView = require('./components/loading_view_component');
var SingleMessageView = require('./components/message_view_component');
var CarouselView = require('./components/carousel_view_component');

var ROUNDING_PRECISION = 3;
// var BASE_QUERY_URL = 'http://45.55.242.156:1337/app/' //prod
var BASE_QUERY_URL = 'http://localhost:1337/app/' //dev

var STORAGE_KEY = '@HasOnboarded:key';
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ActivityIndicatorIOS,
  ListView,
  MapView,
  ScrollView,
  AsyncStorage
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
      hasSeenOnboarding: false
    }
  },

  componentWillMount: function() {
  },

  componentDidMount: function() {
    this.geoInit();
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value !== null){
          console.log(value);
        } else {
          console.log('nothing in async');
        }
      })
      .catch((error) => console.log('AsyncStorage error: ' + error.message))
      .done();
  },

  geoInit: function() {
    navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError, {enableHighAccuracy: true, timeout: 25000, maximumAge: 300000});
  },

  geoSuccess: function(position) {
    this.setState({
      currentLong: position.coords.longitude,
      currentLat: position.coords.latitude,
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

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    fetch(BASE_QUERY_URL+currentLocation, {
      method: 'get'
    })
    .then(that.status)
    .then(that.json)
    .then(function(json){
      console.log('Get success! ', json)
      that.setState({
        dataSource: ds.cloneWithRows(json.reverse()),
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
        lng: Number(that.state.currentLong),
        lat: Number(that.state.currentLat),
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
    var view = this.state.hasSeenOnboarding ? 
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={ {latitude: Number(this.state.currentLat), longitude: Number(this.state.currentLong), latitudeDelta: 10, longitudeDelta: 10} }
          showsUserLocation={true}
        />
        <TextInput
          style={styles.inputField}
          enablesReturnKeyAutomatically={true}
          returnKeyType="go"
          clearTextOnFocue={true}
          onChangeText={(text) => this.setState({currentMessageInput: text})}
          placeholder={'type some thoughts'}
        />

        <TouchableHighlight
          onPress={this.saveNewMessageForThisLocation}
          style={styles.submitButton}
          underlayColor={'#16a085'}>
          <Text style={styles.submitButtonText}>post some thoughts</Text>
        </TouchableHighlight>

        <RefreshableListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <SingleMessageView message={rowData}/>}
          loadData={this.getMessagesForThisLocation}
          refreshDescription="Loading..."
        />
      </View> :
      <CarouselView />

    return view
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  map: {
    height: 50
  },
  inputField: {
    alignSelf: 'stretch',
    flex: 0,
    height: 50,
    borderWidth: 1,
    borderColor: '#1abc9c',
    margin: 10,
    padding: 5,
    marginBottom: 0
  },
  submitButton: {
    alignSelf: 'stretch',
    flex: 0,
    height: 50,
    backgroundColor: '#1abc9c',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '100',
    fontFamily: 'Helvetica',
  }

});

AppRegistry.registerComponent('locanon', () => locanon);
