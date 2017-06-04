import React, {Component} from 'react';
import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
  Navigator,
  ToastAndroid,
  Platform,
  BackAndroid,
  DrawerLayoutAndroid
  
} from 'react-native';

import Drawer from './component/Drawer'
import StoryList from './scene/StoryList';

export default class Index extends Component {
  constructor(props){
    super(props);
    this.state={
      isNightMode:false
    }
    global.isNightMode=false;
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
    if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
      return false;//退出应用如果小于2秒
    }
    this.lastBackPressed = Date.now();
    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
    return true;
  };
  
  handleNightSwitchOn = () => {
    this.setState({
      isNightMode:!this.state.isNightMode
    })
  };
  
  
  render() {
    let defaultName = 'StoryList';
    let defaultComponent = StoryList;
    
    return (
      <DrawerLayoutAndroid
        drawerWidth={250}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => <Drawer onNightSwitchChange={this.handleNightSwitchOn}/>}>
        <View style={styles.container}>
          <Navigator
            initialRoute={{name: defaultName, component: defaultComponent}}
            configureScene={(route)=> {
              return Navigator.SceneConfigs.FloatFromBottom;
            }}
            renderScene={(route, navigator)=> {
              let Component = route.component;
              return <Component {...route.params} navigator={navigator} isNightMode={this.state.isNightMode}/>
            }}
          />
        </View>
      </DrawerLayoutAndroid>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});


AppRegistry.registerComponent('chunhuribao', () => Index);