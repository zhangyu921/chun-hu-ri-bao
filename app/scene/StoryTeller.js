/**
 * Created by z5141 on 2017/2/28.
 */

import React, {Component} from 'react';
import {View, Text, WebView, Platform, BackAndroid,StatusBar} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Loading from '../component/Loading'

const REQUEST_URL = 'http://news-at.zhihu.com/api/4/news/';

export default class StoryTeller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loaded: false,
    }
  }
  
  componentWillMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid)
    }
  }
  
  onBackAndroid = ()=> {
    const {navigator} = this.props;
    const routers = navigator.getCurrentRoutes();
    if (routers.length > 1) {
      navigator.pop();
      return true;
    }
    return false;
  };
  
  
  componentDidMount() {
    this.fetchStory();
  }
  
  fetchStory() {
    console.log(REQUEST_URL + this.props.id);
    fetch(REQUEST_URL + this.props.id)
      .then((response)=>response.json())
      .then((responseData)=> {
        console.log(responseData);
        this.setState({
          data: responseData,
          loaded: true
        })
      },(error)=>{console.error(error)})
  }
  
  render() {
    if (!this.state.loaded) {
      return (
        <Loading isNightMode={this.props.isNightMode}/>
      )
    }
  
    const leftButtonConfig = {
      title: '<<<',
      handler: () => this.props.navigator.pop(),
      tintColor:'#aaa',
      style:{
        padding:10
      }
    };
    
    
    var HTMLNight = '<!DOCTYPE html><html lang="en"> <head> <meta charset="UTF-8"> <title>Story</title> <link rel="stylesheet" href="'
      + this.state.data.css[0]
      + '">'
      + '<style>div.img-place-holder {background-image:url('
      + this.state.data.image
      + '); background-size:cover; }'
      + 'div.content-inner{background:#222}'
      + '</style>'
        
      + '</head><body>'
      + this.state.data.body
      + '</body></html>';

    var HTML = '<!DOCTYPE html><html lang="en"> <head> <meta charset="UTF-8"> <title>Story</title> <link rel="stylesheet" href="'
      + this.state.data.css[0]
      + '">'
    
      + '<style>div.img-place-holder {background-image:url('
      + this.state.data.image
      + '); background-size:cover; background-position:center;}'
      + ''
      + '</style>'
    
      + '</head><body>'
      + this.state.data.body
      + '</body></html>';

    
    return (
      <View style={{flex:1,backgroundColor:'#333'}}>
        <StatusBar
          hidden={true}
        />
        <NavigationBar
          leftButton={leftButtonConfig}
          tintColor='#000'
          style={{
            height:22,
          }}
        />
        <WebView source={this.props.isNightMode?{html:HTMLNight}:{html:HTML}} />
      </View>
      
    )
  }
  
}