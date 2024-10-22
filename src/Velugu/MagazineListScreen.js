import React, { useEffect,useState,useCallback } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ScrollView,
    Alert,
    Dimensions,
    Platform,
    FlatList
} from "react-native";
// import {
//     Appbar,
//     DarkTheme,
//     DefaultTheme,
//     Provider,
//     Surface,
//     ThemeProvider,
//     RadioButton,
//     Checkbox
//   } from 'react-native-paper';
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, OtrixAlert, OtrixLoader
} from '@component';
import { Input, Text, FormControl, Button, InfoOutlineIcon } from "native-base"
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors, isValidEmail, isValidMobile, isValidpassword, isValidConfirmPassword } from '@helpers'
import { logfunction } from "@helpers/FunctionHelper";
import Fonts from "@helpers/Fonts";
import AsyncStorage from '@react-native-community/async-storage';
import { bindActionCreators } from "redux";
import { useFocusEffect } from '@react-navigation/native';
// import DropDown from "react-native-paper-dropdown";
import DropDown from "react-native-paper-dropdown";  
import DropDownPicker from 'react-native-dropdown-picker';
import { selectSong,setSongType,setSongs,setSongsDonated, setPaymentModuleType } from '@actions';
const { width, height } = Dimensions.get('screen');
const ssData = require('../assets/searchTheScripture.json');
import getApi from "@apis/getApi";
import {DataTable, Divider,Card,Avatar} from  "react-native-paper";

function MagazineListScreen(props) {
    // const [colors, setColors] = useState('');
    // const [nightMode, setNightmode] = useState(false);
    const [custmerData,setCustmerData] = React.useState({});
    const [userAccess,setUserAccess] = React.useState({});

    const [showDayDropDown, setShowDayDropDown] = useState(false);
    const [showMonthDropDown, setShowMonthDropDown] = useState(false);
    const [showYearDropDown, setShowYearDropDown] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [ssContent, setSSContent] = useState('');

    const [year, setYear] = React.useState(null);
    const [month, setMonth] = React.useState(null);
    const [day, setDay] = React.useState('1');

    const [mangzineList, setMangzineList] = useState([]); 
    const [filteredMangzineList, setFilteredMangzineList] = useState([]); 
    const [showLoader,setShowLoader]=useState(true);
    const [yearList, setYearList] = React.useState([]);
    const [monthList, setMonthList] = React.useState([{"label": "Jan", "value": "01"}, {"label": "Feb", "value": "02"}, {"label": "Mar", "value": "03"}, {"label": "Apr", "value": "04"}, {"label": "May", "value": "05"}, {"label": "Jun", "value": "06"}, {"label": "July", "value": "07"}, {"label": "Aug", "value": "08"}, {"label": "Sep", "value": "09"}, {"label": "Oct", "value": "10"}, {"label": "Nov", "value": "11"}, {"label": "Dec", "value": "12"}]);
        useFocusEffect(
            useCallback(() => {
                setShowDayDropDown(false);
                setShowMonthDropDown(false);
                setShowYearDropDown(false);
                async function getCustomerData() {
                    await AsyncStorage.getItem("CUSTOMER_DATA").then(data=>{
                        setCustmerData(JSON.parse(data));
                    });
                }
                getCustomerData();
                setYear(null);
                setMonth(null);
            }, [props])
        )

    useEffect(() => {
       
        async function getMagzinesList() {
            let sendData = new FormData();
            sendData.append('type', '');
            try {
              setShowLoader(true);
             getApi.postData(
                 "user/getVeluguMagazines",
                 sendData
             ).then(( async response => {
                console.log(JSON.stringify(response));
              setShowLoader(false);
                 if(response.status === 1){
                  let filteredVideos = [];
                  setMangzineList(response.data);
                  setFilteredMangzineList(response.data);
                  let yearsList = [];
                  response.data.forEach(item=>{
                    let i =  yearsList.findIndex(object=>object.value == item.year);
                    if(i==-1){
                        yearsList.push({"label": item.year, "value": item.year});
                     }
                  });
                  yearsList.sort((a, b) => b.value - a.value );
                  setYearList(yearsList);
                 }
                 console.log(filteredMangzineList);
                 console.log(filteredMangzineList);
             })).error(() => {
              setShowLoader(false);
             });
         } catch (error) {
          setShowLoader(false);
           console.log(error);
         }
         }

        async function getUserAccess() {
            await AsyncStorage.getItem("USER_ACCESS").then(data=>{
                let userAccessInfo = JSON.parse(data);
                setUserAccess(userAccessInfo);
                if((userAccessInfo && userAccessInfo?.vidyarthi_velugu=='1')){
                    getMagzinesList();
                }else{
                    
                }
            });
        }
        getUserAccess();
    }, [props]);

    const dropDownClosed = (type,value) =>{
      if(type === 'day'){
        setShowDayDropDown(false);
      }else if(type === 'month'){
        setShowMonthDropDown(false);
      }else if(type === 'year'){
        setShowYearDropDown(false);
      }
    }
    const dropDownOpen = (value) =>{
      if(value === 'day'){
        setShowDayDropDown(true);
        setShowMonthDropDown(false);
        setShowYearDropDown(false);
      }else if(value === 'month'){
        setShowDayDropDown(false);
        setShowMonthDropDown(true);
        setShowYearDropDown(false);
      }else if(value === 'year'){
        setShowDayDropDown(false);
        setShowMonthDropDown(false);
        setShowYearDropDown(true);
      }
    }
    // const setDayValues = (value) =>{
    //   if(!(userAccess && userAccess?.song_book=='1')){
    //     let days = [];
    //     for(let i=1;i<=31;i++){
    //       days.push({"label":'Day - '+i,"value":i});
    //     };
    //     setDayList(days);
    //   }else{
    //   let days = [];
    //   if(value == 1 || value == 3 || value == 5 || value == 7 || value == 8 || value == 10 || value == 12 ){
    //     // upto 31
    //     for(let i=1;i<=31;i++){
    //       days.push({"label":'Day - '+i,"value":i});
    //     };
    //   } else if(value == 2){ // upto 28 
    //     for(let i=1;i<=28;i++){
    //       days.push({"label":'Day - '+i,"value":i});
    //     };
    //   }else { // upto 30 
    //     for(let i=1;i<=30;i++){
    //       days.push({"label":'Day - '+i,"value":i});
    //     };
    //   } 
    //   setDayList(days);
      
    // }
    // setDay('1');
    // }
    const onDayOpen = useCallback(() => {
      setShowYearDropDown(false);
      setShowMonthDropDown(false);
      setContentVisible(false);
    });
    const onMonthOpen = useCallback(() => {
      setShowYearDropDown(false);
      setShowDayDropDown(false);
      setContentVisible(false);
    });
    const onYearOpen = useCallback(() => {
      setShowMonthDropDown(false);
      setShowDayDropDown(false);
      setContentVisible(false);
    });
    const onDayClose = useCallback(() => {
      setContentVisible(true);
    });

    // const onDayChangeValue = useCallback((value) => {
    //   setDay(value);
    //   setContent('day',value);
    // });

    const onMonthChangeValue = useCallback((value) => {
      setMonth(value);
      //setDayValues(value);
      setContent('month',value);
    });

    const onYearChangeValue = useCallback((value) => {
      setYear(value);
      setContent('year',value);
    });

    const setContent = (type,value) =>{
        console.log(type);
        console.log(value);
     if(value){
        if(type==='year'){
        if(month){
            setFilteredMangzineList(mangzineList.filter(list=>list.year == value && list.month == month));
        }else{
            setFilteredMangzineList(mangzineList.filter(list=>list.year == value));
        }
      }else if(type==='month'){
        if(year){
            setFilteredMangzineList(mangzineList.filter(list=>list.year == year && list.month == value));
        }else{
            setFilteredMangzineList(mangzineList.filter(list=>list.month == value));
        }
      }
    }
      
    }

    const yearDropdown = () => {
        return (
            <>
            <DropDownPicker
        open={showYearDropDown}
        placeholder="Select Year"
        value={year}
        items={yearList}
        setOpen={setShowYearDropDown}
        onChangeValue={()=>onYearChangeValue(year)}
        setValue={setYear}
        onOpen={onYearOpen}
        onClose={onDayClose}
        setItems={yearList}
        multiple={false}
        labelStyle={{
          fontWeight: "bold",
          color: Colors().themeColor
        }}
        textStyle={{
          fontSize: 15,
          color: Colors().themeColor
        }}
        placeholderStyle={{
          fontSize: 15,
          fontWeight: "bold",
          color: Colors().themeColor
        }}
        dropDownContainerStyle={{
          borderColor: Colors().themeColor
        }}
      />
          </>
        );
    };
    const monthDropdown = () => {
      return (
          <>
          <DropDownPicker
        open={showMonthDropDown}
        placeholder="Select Month"
        maxHeight={height-450}
        value={month}
        items={monthList}
        setOpen={setShowMonthDropDown}
        setValue={setMonth}
        onOpen={onMonthOpen}
        onClose={onDayClose}
        onChangeValue={()=>onMonthChangeValue(month)}
        setItems={monthList}
        multiple={false}
        labelStyle={{
          fontWeight: "bold",
          color: Colors().themeColor
        }}
        textStyle={{
          fontSize: 15,
          color: Colors().themeColor
        }}
        placeholderStyle={{
          fontSize: 15,
          fontWeight: "bold",
          color: Colors().themeColor
        }}
        dropDownContainerStyle={{
          borderColor: Colors().themeColor
        }}
      />
        </>
      );
  };
//     const dayDropdown = () => {
//       return (
//           <>
//       <DropDownPicker
//         open={showDayDropDown}
//         placeholder="Day"
//         maxHeight={height-450}
//         value={day}
//         items={dayList}
//         setOpen={setShowDayDropDown}
//         onChangeValue={()=>onDayChangeValue(day)}
//         onOpen={onDayOpen}
//         onClose={onDayClose}
//         setValue={setDay}
//         setItems={dayList}
//         multiple={false}
//         labelStyle={{
//           fontWeight: "bold",
//           color: Colors().themeColor
//         }}
//         textStyle={{
//           fontSize: 15,
//           color: Colors().themeColor
//         }}
//         placeholderStyle={{
//           fontSize: 15,
//           fontWeight: "bold",
//           color: Colors().themeColor
//         }}
//         dropDownContainerStyle={{
//           borderColor: Colors().themeColor,
//           backgroundColor:'#fff'
//         }}
//       />

//         </>
//       );
//   };
//   const openSongRegistrationPage = () => {
//     props.setPaymentModuleType('song_book');
//     if(custmerData){
//        props.navigation.navigate('PaymentScreen',{paymentModuleType:'song_book'});
//      }else{
//        props.navigation.push("LoginScreen",{paymentModuleType:'song_book'});
//      }
//    }
   const openMagazinePage = (item)=> {
    props.navigation.navigate('MagazineScreen',{ magazineLink: item.link });
  }

//   const showPaymentButton = () => {
//     return (
//       <>
//       <View style={styles.bottomSection}>
//         <View style={styles.bottomIconContainer}>
//         <OtrixContent>
//           <Button style={{backgroundColor: Colors().themeColor}} onPress={() => openSongRegistrationPage()}>
//                     <Text style={styles.buttonText}>Donate for Search the scripture book</Text>
//           </Button>
//         </OtrixContent>
//           </View>
//           </View>
//           </>
//     );
//   };
    const { strings } = props;

    return (
        <SafeAreaView style={{height:'100%', backgroundColor:'#fff'}}>
          <View style={{display:'flex', flexDirection:'column',marginLeft:10, marginTop:5}}>
            <View style={{position:'absolute', top:0}}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', }}>
                    <View style={{ width:'45%'}}>
                        {yearDropdown()}
                    </View>
                    <View style={{width:'45%'}}>
                        {monthDropdown()}
                    </View>
                    {/* <View style={{width:'35%'}}>
                        {dayDropdown()}
                    </View> */}
                </View>
            </View >
            <View style={{position:'absolute',top:-200}}>
              
                  <View style={{ display:'flex',marginTop:280,paddingHorizontal:10}}>
                    
                  <ScrollView style={{ height:height-290}}>
                    
                  <FlatList style={{paddingBottom:50}}
                        data={filteredMangzineList}
                        renderItem={({item}) => 
                        <View style={{paddingBottom:15}}>
                                <Card onPress={()=>openMagazinePage(item)}>
                                    <View style={{display:'flex',flexDirection:'row'}}>
                                        <View style={{width:'30%'}}>
                                            <Image source={{ uri: item.thumb_link }} resizeMode="stretch" style={styles.image} />
                                            </View>
                                        <View style={{display:'flex', flexDirection:'column', justifyContent:'space-between', paddingHorizontal:10,width:'70%', paddingBottom:10}}>
                                            <View><Text style={{color:'#000', fontFamily:Fonts.Font_Medium, fontSize:15}}>{item.title}</Text></View>
                                            <View><Text style={{paddingTop:5, color:'#000', fontFamily:Fonts.Font_Medium, fontSize:15}}>{item.description}  </Text></View>
                                            <View><Button style={{}}>Read</Button></View>
                                        </View>
                                    </View>
                                    
                                
                               
                                </Card>
                            <Divider style={{ backgroundColor: '#5b5c5c' }} />
                        </View>}
                    />
                  
                  </ScrollView>
                  </View>
             
            </View>
            {/* {!(userAccess && userAccess?.song_book=='1')?showPaymentButton():null} */}
          </View>
        </SafeAreaView>
    )
}


function mapStateToProps(state) {
    return {
        
    }
}
const mapDispatchToProps = dispatch => (
    bindActionCreators({
      setPaymentModuleType
    }, dispatch)
  );

export default connect(mapStateToProps, mapDispatchToProps) (MagazineListScreen);

const styles = StyleSheet.create({
    registerView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    registerTxt: {
        fontSize: wp('3.5%'),
        textAlign: 'center',
        fontFamily: Fonts.Font_Reguler,
        color: Colors().secondry_text_color
    },
    signupTxt: {
        fontSize: wp('3.5%'),
        textAlign: 'right',
        fontFamily: Fonts.Font_Medium,
        color: Colors().link_color
    },
    bottomSection: {
      borderTopColor: '#000000',
      borderTopWidth: 0.5,
      width: width,
      alignItems: 'center',
      paddingVertical: 20,
      position:'absolute',
      top:height-200,
      backgroundColor:'#ffffff'
    },
    centerSection:{
      borderTopColor: '#000000',
      borderTopWidth: 0.5,
      width: width,
      alignItems: 'center',
      paddingVertical: 20,
      position:'absolute',
      top:height-200,
      backgroundColor:'#ffffff',
      zIndex:99999
    },
    bottomIconContainer: {
      flexDirection: 'row',
      //justifyContent: 'space-between',
      width: '80%',
      marginLeft:-50
    },
    donateButton:{
      height: Platform.isPad === true ? wp('6%') : wp('11%'),
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      shadowColor: 'rgba(0,0,0, .4)',
      shadowOffset: { height: 1, width: 1 },
      shadowOpacity: 1,
      shadowRadius: 1,
      elevation: 2
    },
    buttonText: {
      fontFamily: Fonts.Font_Bold,
      color:'#fff',
      fontSize: Platform.isPad === true ? wp('2.5%') : wp('3.5%'),
    },
    image: {
        resizeMode: 'stretch',
        alignSelf: 'center',
        height: hp('20%'),
        width: wp('30%'),
    }
});
const styles1 = StyleSheet.create({
    containerStyle: {
       // flex: 1,
        
      },
      spacerStyle: {
        marginBottom: 15,
      },
      safeContainerStyle: {
        flex: 1,
        margin: 0,
        justifyContent: "center",
      },
      viewStyle:{
        position:'absolute',
        top:0,
        left:0,
        overflow:'scroll',
        marginBottom: 15,
        zIndex:99999999999999999
      }
  });