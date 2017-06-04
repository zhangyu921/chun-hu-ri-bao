/**
 * Created by z5141 on 2017/3/1.
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  ListView,
  StyleSheet,
  Image,
  Navigator,
  TouchableOpacity,
  RefreshControl,
  StatusBar
} from 'react-native';

import Opening from '../component/Opening'
import NavigationBar from 'react-native-navbar';
import StoryTeller from './StoryTeller'
import StatusBarWithNightMode from '../component/StatusBarWithNightMode'

const LATEST_STORY_URL = 'http://news-at.zhihu.com/api/4/news/latest';
const OLD_STORY_URL = 'http://news-at.zhihu.com/api/4/news/before/';


export default class StoryList extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
      loaded: false,//第一次加载时候完成
      isAnimated: false,//是否完成首页动画
      isLoading: false,//是否在下拉刷新和上拉刷新中
      storyArr: null,// 数组记录
      passDay: 0,//读取多少天后的消息
      isNeedGoTop: false,//回到顶部按钮标志位
    };
    
    this.fetchData = this.fetchData.bind(this);
    this.fetchOldData = this.fetchOldData.bind(this);
    this._pressButton = this._pressButton.bind(this);
    this._renderLatestStory = this._renderLatestStory.bind(this);
    this._renderSectionHeader=this._renderSectionHeader.bind(this);
  };
  
  _pressButton(id) {
    console.log(id);
    const {navigator} = this.props;
    if (navigator) {
      navigator.push({
        name: 'StoryTeller',
        component: StoryTeller,
        params: {
          id: id
        }
      })
    }
  }
  
  
  componentDidMount() {
    this.fetchData();
    setTimeout(() => {
      this.setState({
        isAnimated: true
      })
    }, 2000)
    
  }
  
  componentWillReceiveProps() {
    //处理切换夜间模式 刷新ListView内部已经加载的部分
    // const newData = this.state.storyArr.map((story) => {
    //   return {...story}
    // })
    // this.setState({
    //   isNightMode: this.props.isNightMode,
    //   dataSource: this.state.dataSource.cloneWithRows(newData)
    // });
    
    //无效
    // let newData = {};
    // newData = Object.assign(newData,this.state.storyArr);
    // console.log(newData,'newdata');
    //
    // this.setState({
    //   isNightMode: this.props.isNightMode,
    //   dataSource: this.state.dataSource.cloneWithRowsAndSections(newData)
    // });
    if(this.setState.isNightMode !==this.props.isNightMode){
      this.fetchData();
    }
  }
  
  
  countDate(passDay) { //过去的天数 =》 要加载的日期
    let now = Date.now();
    let oldDate = new Date(now - passDay * 1000 * 60 * 60 * 24);
    return oldDate.toJSON().slice(0, 10).split('-').join('');
  }
  
  fetchData() {
    fetch(LATEST_STORY_URL)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        let data = {0:responseData.stories};
        console.log(data);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(data),
          loaded: true,
          isLoading: false,
          storyArr: data,
          passDay:0
        })
      })
  }
  
  fetchOldData() {
    if (this.state.isLoading) {
      return;
    }
    this.setState({
      isLoading: true,
      isNeedGoTop: true
    });
    console.log(OLD_STORY_URL + this.countDate(this.state.passDay));
    fetch(OLD_STORY_URL + this.countDate(this.state.passDay))
      .then((response) => response.json())
      .then((responseData) => {
        let data = {[this.state.passDay+1]: responseData.stories};
        let storyArrNew = Object.assign(this.state.storyArr, data);
        console.log(storyArrNew);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(storyArrNew),
          loaded: true,
          storyArr: storyArrNew,
          passDay: this.state.passDay + 1,
          isLoading: false
        })
      })
  }
  
  _onRefresh = () => {
    this.setState({isLoading: true});
    this.fetchData();
  };
  
  _renderLatestStory(story, sectionID, rowID) {
    return (
      <TouchableOpacity style={this.props.isNightMode ? stylesNight.item : styles.item} onPress={() => {
        this._pressButton(story.id)
      }}>
        <View style={styles.leftContainer}>
          <Text style={styles.title}>{story.title}</Text>
        </View>
        <Image
          source={{uri: story.images[0]}}
          style={styles.thumbnail}
        />
      </TouchableOpacity>
    )
    
  }
  
  _renderSectionHeader(data, sectionID) {
    if(sectionID === '0'){
      return null
    }
    
    let dateOld=this.countDate(sectionID);
    let date = dateOld.slice(0,4)+'年'+dateOld.slice(4,6)+'月'+dateOld.slice(6)+'日';
    return (
      <View style={{marginTop:5,marginLeft:15}}>
        <Text>{date}</Text>
      </View>
    )
  }

  rightButtonConfig = {
    title: '↑',
    tintColor: '#333',
    style: {
      paddingHorizontal: 6,
      borderBottomWidth: 1,
      borderBottomColor: '#666'
    },
    handler: () => {
      this.refs.ListV.scrollTo({
        y: 0,
        animated: true
      });
      this.setState({
        isNeedGoTop: false
      })
    }
  };

  
  render() {
    if (!this.state.loaded || !this.state.isAnimated) {
      return <Opening/>
    }
    
    return (
      <View style={this.props.isNightMode ? stylesNight.container : styles.container}>
        <NavigationBar
          title={{
            title: "纯 乎 阅 读"
          }}
          style={styles.navBar}
          containerStyle={this.props.isNightMode ? stylesNight.navBarContainer : styles.navBarContainer}
          rightButton={this.state.isNeedGoTop ? this.rightButtonConfig : null}
        />
        <StatusBarWithNightMode nightMode={this.props.isNightMode}/>
        <ListView
          ref="ListV"
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this._onRefresh}
            />
          }
          dataSource={this.state.dataSource}
          renderRow={this._renderLatestStory}
          renderSectionHeader={this._renderSectionHeader}
          style={this.props.isNightMode ? stylesNight.listView : styles.listView}
          onEndReached={this.fetchOldData}
          onEndReachedThreshold={5}
        
        />
      </View>
    )
  }
  
}

const styles = StyleSheet.create({
  navBar: {
    height: 30,
  },
  navBarContainer: {
    elevation: 5,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: '#eee'
  },
  
  listView: {
    flex: 1,
    backgroundColor: '#eee',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    marginTop: 6,
    marginHorizontal: 10,
    borderRadius: 3,
    height: 110,
    elevation: 3,
  },
  
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  
  
  title: {
    color: '#333',
    fontSize: 18,
    marginBottom: 8,
  },
  
  thumbnail: {
    width: 90,
    height: 80
  }
});

const stylesNight = StyleSheet.create({
  navBar: {
    height: 30,
  },
  navBarContainer: {
    elevation: 5,
    backgroundColor: '#111'
  },
  container: {
    flex: 1,
    backgroundColor: '#111'
  },
  
  listView: {
    flex: 1,
    backgroundColor: '#333',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#666',
    padding: 14,
    marginTop: 6,
    marginHorizontal: 10,
    borderRadius: 3,
    height: 110,
    elevation: 3,
  },
  
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  
  
  title: {
    color: '#000',
    fontSize: 18,
    marginBottom: 8,
  },
  
  thumbnail: {
    width: 90,
    height: 80
  }
});