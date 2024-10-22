import React, { useEffect, useState,useCallback } from 'react'
import { View, Text,SafeAreaView, ScrollView, StyleSheet,FlatList,Dimensions,Keyboard,Image,TouchableOpacity} from 'react-native';
//import { Button, DataTable, Divider,Searchbar,TextInput } from  "react-native-paper";
const { width,height } = Dimensions.get('screen');
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { bindActionCreators } from "redux";
import getApi from "@apis/getApi";
import { selectSong,setSongType,setSongs,setSongsDonated } from '@actions';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Fonts from "@helpers/Fonts";
import AsyncStorage from '@react-native-community/async-storage';
import {DataTable, Divider,Button} from  "react-native-paper";
import { Colors } from '../helpers';

const teluguSongIndexList =  require('../common/telugu-song-index-list.json');
const englishSongIndexList =  require('../common/english-song-index-list.json');
const hindiSongIndexList =  require('../common/hindi-song-index-list.json');
const newSongIndexList =  require('../common/new-song-index-list.json');

const AlbumSongsListScreen = (props) => {  
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [keyboardStatus, setKeyboardStatus] = useState('');
  const [teluguSongsList, setTeluguSongsList] = useState([]);
  const [englishSongsList, setEnglishSongsList] = useState([]);
  const [hindiSongsList, setHindiSongsList] = useState([]);
  const [newSongsList, setNewSongsList] = useState([]);
  const [filteredSongsList, setFilteredSongsList] = useState([]);
  const [selectedPlayList, setSelectedPlayList] = useState('');
  const playBackState = usePlaybackState();
  const progress = useProgress();
  const [userAccess,setUserAccess] = React.useState(null);
  const [songsList, setSongsList] = useState([]);
  let playlist = [];
  const [showLoader,setShowLoader]=useState(true);
  //let navigation = props.navigation;

  // useFocusEffect(
  //   useCallback(() => {
  //     const { songs } = props.route.params;
  //     setFilteredSongsList(songs);
  //   }, [])
  // )

  useFocusEffect(
    useCallback(() => {
      const { selectedVideo } = props.route.params;
      //setSelectedVideo(selectedVideo);
      async function getAlbumSongs(album_id) {
        let sendData = new FormData();
          sendData.append('song_type', album_id);
        try {
          setShowLoader(true);
          getApi.postData(
              "user/getAlbumSongs",
              sendData
          ).then(( async response => {
          //console.log(JSON.stringify(response.data[0].song_json));
          setShowLoader(false);
              if(response.status === 1){
                let teluguPlayList = [];
                let TeluguSongsData = response.data[0].song_json;
                TeluguSongsData = TeluguSongsData.replaceAll('\"','"');
                TeluguSongsData = TeluguSongsData.replaceAll('"[','[');
                TeluguSongsData = TeluguSongsData.replaceAll(']"',']');
                let TeluguSongs = JSON.parse(TeluguSongsData);
                setFilteredSongsList(TeluguSongs);
                props.setSongs(TeluguSongs);
                //addSongsToPlayer(TeluguSongs);
              }
          })).error(() => {
          setShowLoader(false);
          });
      } catch (error) {
      setShowLoader(false);
        console.log(error);
      }
      }
      getAlbumSongs(selectedVideo.album_id);
    }, [])
  )


  useEffect(() => { 
        setFilteredDataSource(props.selectedSongsList);
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
          setKeyboardStatus('Keyboard Shown');
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardStatus('Keyboard Hidden');
        });
    
        return () => {
          showSubscription.remove();
          hideSubscription.remove();
        };
      
  }, [props.navigation]);

  const togglePlayBack = async playBackState => {
    try {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if (currentTrack != null) {
            if (playBackState == State.Paused) {
                await TrackPlayer.play();
            } else if(playBackState == State.Playing){
                await TrackPlayer.pause();
            }else {
                await TrackPlayer.play();
            }
            await AsyncStorage.setItem('currentTrack',''+currentTrack);
        }
    } catch (error) {
        console.log(error);
    }
  };

  const goback = (props) =>{
    props.navigation.goBack()
  }
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = props.selectedSongsList.filter(function (item) {
        // Applying filter for the inserted text in search bar
        let itemData = item.local_hint
          ? item.local_hint.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        if(itemData.indexOf(textData) > -1){
          return itemData.indexOf(textData) > -1;
        }else{
          let itemData = item.local_id
          ? item.local_id
          : '';
          return itemData.indexOf(textData) > -1;
        }
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(props.selectedSongsList);
      setSearch(text);
    }
  };

  const ItemView = ({ item,type }) => {
    return (
      <>
        <Text style={styles.itemTelugu} onPress={() => getItem(item)}>
            {item.local_id}
            {'.  '}
            {item.local_title.toUpperCase()}
          </Text> 
      </>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };
  const audioPlayer = () => {
    
    return (
      <View style={style.bottomSection}>
        <View style={style.bottomIconContainer}>
      <TouchableOpacity onPress={() => togglePlayBack(playBackState)}>
          <Ionicons name={ playBackState === State.Playing ? 'ios-pause-circle' : 'ios-play-circle' } size={30} color="#000000" />
          </TouchableOpacity>
          <View>
          <Slider
            style={style.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#000000"
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
            onSlidingComplete={async value => {
              try{
                if(value>0){
                await TrackPlayer.seekTo(value);
                }else{
                  stopSongIfPlaying();
                }
              } catch (error) {
                console.log(error);
              }
            }}
            
          />
        
          {/* Progress Durations */}
          <View style={style.progressLevelDuraiton}>
            <Text style={style.progressLabelText}>
              {new Date(progress.position * 1000)
                .toLocaleTimeString()
                .substring(3).slice(0,-3)}
            </Text>
            <Text style={style.progressLabelText}>
              {new Date((progress.duration - progress.position) * 1000)
                .toLocaleTimeString()
                .substring(3).slice(0,-3)}
            </Text>
          </View>
        </View>

          <TouchableOpacity>
            <Ionicons name="information-circle" size={30} color="#000000" />
          </TouchableOpacity>
          </View>
          </View>
    );
  };
  const getItem = async (item) => {
    props.selectSong(item);
      props.setSongType('telugu');
      try{
        TrackPlayer.reset();
     }catch(error){
        console.log(error);
     }
      props.navigation.navigate('AlbumSongScreen');
  //  try{
  //     await TrackPlayer.getQueue().then(data=>{
  //       let index = 0;
  //       index = data.findIndex(song=>song.id === item.local_id);
  //       if(index>-1){
  //         const currentTrack = TrackPlayer.getCurrentTrack();
  //         TrackPlayer.skip(index);
  //         TrackPlayer.play();
  //         AsyncStorage.setItem('currentTrack',''+index);
  //       }
  //     });
  //     //props.selectSong(item);
  // }catch(error){
  //     console.log(error);
  //  }
  };

  return (
    <>
    <SafeAreaView style={{ backgroundColor:'#ffffff',height:height  }}>
      <View style={styles.container}>
        {filteredSongsList.length>0?<FlatList
          data={filteredSongsList}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />:null}
      </View>
      {/* bottom section */}     
    </SafeAreaView>
    </>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    //borderTopColor: '#000000',
    borderTopWidth: 0.5,
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
    position:'absolute',
    bottom:0,
    backgroundColor:'#ffffff'
  },

  bottomIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginLeft:-50
  },

  mainWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  imageWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  elevation: {
    elevation: 5,

    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  songContent: {
    textAlign: 'center',
    color: '#EEEEEE',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  songArtist: {
    fontSize: 16,
    fontWeight: '300',
  },

  progressBar: {
    width: 300,
    height: 30,
    marginTop: 0,
    flexDirection: 'row',
  },
  progressLevelDuraiton: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#000000',
  },

  musicControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    width: '60%',
  },
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 210,
    //marginBottom: 100
  },
  table:{
    backgroundColor: Colors().themeColor,
    color:'white',
    height:45
},
headSection:{
    borderBottomWidth:2,
    borderColor:'black',
    paddingBottom:15,
    
},
titleHeading:{
    marginTop:30,
    fontWeight:'bold',
    marginHorizontal:167,
},
tableHeading:{
    //fontWeight:'bold',
    color:'white',
    fontSize:13,
    fontFamily:Fonts.Font_Medium
},
header:{
    padding:15,
    borderColor: 'white',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1
},
  itemStyle: {
    padding: 10,
    color:'#000000',
    fontSize:18,
    fontFamily: Fonts.Font_Reguler
  },
  itemTelugu: {
    flex:1,
    paddingLeft: 12,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 12,
    fontSize: 18,
    color:'black',
    width:width,
    //fontFamily:'suranna'
},
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: -10,
    marginLeft: -15,
    marginTop: 5,
    backgroundColor: Colors().themeColor,
    borderColor:Colors().themeColor,
    tintColor:'#ffffff',
    width: width-60,
    fontWeight:'700',
    color:'#fff',
    textColor:'#fff',
    underlineColor:Colors().themeColor
  },
});
function mapStateToProps(state) {
  return {
      selectedSong: state.song.selectedSong,
      songType: state.song.songType,
      selectedSongsList: state.song.selectedSongsList,
      songsDonated: state.song.songsDonated,
      
  }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
      selectSong,
      setSongType,
      setSongsDonated,
      setSongs
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps) (AlbumSongsListScreen);