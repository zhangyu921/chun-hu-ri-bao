/**
 * Created by z5141 on 2017/3/1.
 */

import React, {Component} from 'react';
import {View, Text, Animated, Image, StyleSheet,Dimensions} from 'react-native';


export default class Opening extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0), // init opacity 0
    };
  }
  
  
  componentDidMount() {
    Animated.timing(          // Uses easing functions
      this.state.fadeAnim,    // The value to drive
      {toValue: 1,
      duration:2000}            // Configuration
    ).start();                // Don't forget start!
    
  }
  
  
  render() {
    var {height, width} = Dimensions.get('window');
    
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Animated.Image
          source={require('../img/open.jpg')}
          resizeMode="cover"
          style={{
            height:this.state.fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [height,height*1.1]
            }),
            width:this.state.fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [width,width*1.1]
            }),
            opacity:this.state.fadeAnim
          }}/>

      </View>
      
    
    );
  }
}
