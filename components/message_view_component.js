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
      duration: 350,
      easing: 'easeInQuad',
      property: 'opacity',
      toValue: 1,
    });
  },
  downVote: function(){
    console.log('downvote ', this.props.message._id)
  },
  upVote: function() {
    console.log('upvote ', this.props.message._id)
  },
  render: function() {
    //console.log(this.props)
    return(
      <View ref="singleMessageView" style={styles.messageViewContainer}>
        <Icon name="thumbs-down" size={30} color="#e3e3e3"  onPress={this.downVote} style={styles.vote} />
        

        <Text style={styles.messageText}>{this.props.message.messageString}</Text>
        <Text style={styles.voteCountText}>({this.props.message.likes - this.props.message.dislikes})</Text>
        
        <Icon name="thumbs-up" size={30} color="#e3e3e3"  onPress={this.upVote} style={styles.vote} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  messageViewContainer: {
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
    height: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  vote: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    flex: 1
  }
});

module.exports = SingleMessageView;
