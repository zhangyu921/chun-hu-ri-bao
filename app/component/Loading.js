/**
 * Created by z5141 on 2017/3/2.
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  ActivityIndicator
} from 'react-native';

export default class Loading extends Component {
  
  render() {
    
    if(this.props.isNightMode){
      return(
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:'#111'
          }}>
          <ActivityIndicator animating={true} size='large'/>
        </View>
      )
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator animating={true} size='large'/>
      </View>
    
    
    )
    
  }
}