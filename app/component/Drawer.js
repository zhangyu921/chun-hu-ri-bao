/**
 * Created by z5141 on 2017/3/3.
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet
} from 'react-native';


export default class Drawer extends Component {
  constructor(...props) {
    super(...props);
    this.state = {
      isNightSwitchOn: false,
    }
  }
  
  
  render() {
    return (
      <View style={this.state.isNightSwitchOn?stylesNight.container :styles.container}>
        <View style={{flex:1}}>
          
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between',marginBottom:10}}>
          <Text style={this.state.isNightSwitchOn?{color:'#888'}:{}}>夜间模式</Text>
          <Switch
            value={this.state.isNightSwitchOn}
            onValueChange={()=> {
              let nowState = !this.state.isNightSwitchOn;
              this.setState({
                isNightSwitchOn: nowState
              });
              global.isNightMode = nowState;
              this.props.onNightSwitchChange();
            }}
          />
        </View>
      
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
    backgroundColor:'#fff',
  },
  
})

var stylesNight = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
    backgroundColor:'#111',
  },
  
})