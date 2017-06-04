/**
 * Created by z5141 on 2017/3/3.
 */
import React,{Component} from 'react';
import {StatusBar,View,} from 'react-native';


export default class StatusBarWithNightMode extends Component{
  constructor(p){
    super(p);
  }

  render(){
    if(this.props.nightMode){
      return(
        <StatusBar
          backgroundColor='#000'
          barStyle='light-content'
        />
        
      )
    } else {
      return(
        <StatusBar
          backgroundColor='#fff'
          barStyle='dark-content'
        />
      )
    }
  }
  
}
