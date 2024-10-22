import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    useWindowDimensions,
    StyleSheet,
    StatusBar,
    ScrollView,
    Image,
    Alert,
    Linking,
    ToastAndroid,
    SafeAreaView,
    Modal,
    Pressable
} from "react-native";
import { Input } from "native-base"
import { connect } from 'react-redux';
import {
    OtrixContainer, OtrixHeader, OtrixDivider, OtirxBackButton, OtrixContent, OtrixLoader,OtirxHomeButton
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Fonts from "@helpers/Fonts";
import getApi from "@apis/getApi";
import { logfunction } from "@helpers/FunctionHelper";
import RenderHtml from 'react-native-render-html';
import FastImage from 'react-native-fast-image';
import { Button,Card,Avatar,List, Divider } from 'react-native-paper';
import { position } from "native-base/lib/typescript/theme/styled-system";
import { homeScreen } from '../common';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import { useNetInfo } from "@react-native-community/netinfo";
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { bindActionCreators } from 'redux';
import { addToWishList, storeFCM, doLogin, setReloginVerified } from '@actions';
import { getUniqueId, getManufacturer, getDeviceName } from 'react-native-device-info';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,//
} from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
    webClientId: '910722162039-gisd4ja9a00dhor501jckvajhsk47c57.apps.googleusercontent.com',
    scopes: ['profile', 'email']
});

function HistoricalDatesScreen(props) {
    const [state, setState] = React.useState({  email: null, homePageData: [], loading: true, profileImageURL: null });
    const { width } = useWindowDimensions();
    const [expanded, setExpanded] = React.useState(true);
    const handlePress = () => setExpanded(!expanded);
    const [UESIhistoricalEventsDates, setUESIhistoricalEventsDates] = React.useState([]);

    

    useEffect(() => {
        async function getHistoricalEventsDates() {
            try {
             getApi.getData(
                 "getHistoricalEventsDates",
                 [],
             ).then(( response => {
                console.log(JSON.stringify(response));
                  if(response.status === 1){
                    response.data.map((event,index)=>{
                        event['id'] = index+1;
                        event['expanded'] = false;
                    });
                    setUESIhistoricalEventsDates(response.data);
                  }
             }));
         } catch (error) {
           console.log(error);
         }
         }
         getHistoricalEventsDates();
    }, []);


    const accordionHandlePressDynamic = (events, selectedEvent) => {
        events.map((event,index)=>{
            if(selectedEvent.id == event.id){
                event.expanded = !selectedEvent.expanded;
            }else{
                event.expanded = false;
            }
        });
        setUESIhistoricalEventsDates([...events]);
    }
    return (
        // <>
        <SafeAreaView style={styles1.container}>
        <ScrollView>
<View>
        <Card >
            {/* <Card.Title title={<Text style={styles.cardTitle}>Historical Dates & Events</Text> }/> */}
            <Card.Content>
            {UESIhistoricalEventsDates.length>0?UESIhistoricalEventsDates.map((data,i)=>{
                       return <View key={i}><List.Accordion expanded={data.expanded} style={styles.ListAccordion}
                    title={ <Text style={styles.accordionTitle}>{i+1+'. '+data.title}</Text> } 
                    onPress={()=>{accordionHandlePressDynamic(UESIhistoricalEventsDates,data)}}
                    left={props => <Text style={styles.contentText}></Text> }>
                        <View style={{marginLeft:-60,marginTop:10}}>
                        {(data.events && data.events.length>0)?data.events.map((event,index)=>{
                            return<View key={index} style={{display:'flex',flexDirection:'row', alignItems:'center',borderWidth:0.2}}>
                               <View style={{flex:1,borderRightWidth:0.2}}><Text style={[styles.tableCellText,{marginHorizontal:5}]}>{event.event_name}</Text></View>
                               <View style={{flex:1, marginHorizontal:5}}><Text style={styles.tableCellText}>{event.event_date}</Text></View>
                           </View>}):null}
               </View>
                </List.Accordion><OtrixDivider></OtrixDivider></View>}):null}
            </Card.Content>
        </Card>
       </View>
       </ScrollView>
       </SafeAreaView>
        // </>

    )
}

function mapStateToProps(state) {
    return {
        USER_AUTH: state.auth.USER_AUTH,
        wishlistData: state.wishlist.wishlistData,
        wishlistCount: state.wishlist.wishlistCount,
        customerData: state.auth.USER_DATA,
        strings: state.mainScreenInit.strings,
        reloginVerified: state.song.reloginVerified
    }
}

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        addToWishList,
        storeFCM,
        doLogin,
        setReloginVerified
    }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(HistoricalDatesScreen);

const styles = StyleSheet.create({
    contentText:{
        fontFamily:Fonts.Font_Reguler,
        fontSize: 15,
        color:'#000000',
        marginTop:10,
        lineHeight:25,
        textAlign:'justify'
    },
    contentTitle:{
        fontFamily:Fonts.Font_Medium,
        fontSize: 15,
        color:'#000000'
    },
    cardTitle:{
        fontFamily:Fonts.Font_Medium,
        fontSize: 18,
        color: Colors().themeSecondColor
    },
    accordionTitle:{
        fontFamily:Fonts.Font_Medium
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: hp('1.5%'),
        backgroundColor: Colors().white,
        marginVertical: hp('1%'),
        marginHorizontal: wp('1%'),
        borderRadius: wp('2%'),
        borderWidth: 0.5,
        borderColor: Colors().custom_gray,
        fontFamily:'Poppins-Medium'
    },
    txt: {
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Medium,
        color: Colors().text_color,
        textAlign: 'left'
    },
    image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        height: hp('16%'),
        width: wp('30%'),
    },
    ListAccordion:{
        marginTop:-5,
        marginBottom:-5
    },
    tableCellText:{
        fontFamily:Fonts.Font_Reguler,
        fontSize: 15,
        lineHeight:25,
        color:'#000000'
    }

});

const styles1 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', //36454F
      },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      //marginTop: 22,
    },
    button: {
      borderRadius: 5,
      padding: 10,
      marginTop:30,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: Colors().themeColor,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      fontFamily: Fonts.Font_Bold,
      marginBottom: 15,
      textAlign: 'center',
    }
  });