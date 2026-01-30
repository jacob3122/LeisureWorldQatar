import { ActivityIndicator, Button, FlatList, Image, Platform, RefreshControl, StyleSheet, Text, View ,TouchableOpacity} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SVGbg from'../../assets/bg/Circles-Pattern.svg'
// import Colors from "../constants/Colors";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import WebServices from "../constants/WebServices";
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import * as Tools from './Tools';
import NewsFeed from "./NewsFeed";
// import StaticSafeAreaInsets from "react-native-static-safe-area-insets";
import SecureStore from "./SecureStore";
import ContentLoader, { Rect } from "react-content-loader/native"
import NotificationPage from "./NotificationPage";
import notify from '../../assets/Icons/notify.png';
import { useTheme } from "../context/ThemeProvider";
import BackgroundWall from "./BackgroundWall";
import { useSelector } from "react-redux";
import InviteCode from "../Navigation/InviteCode";
import { useAppContext } from "../../src/js/reducers/AppReducer";
import { StateContext } from "../context/ContextState";
import FastImage from "@d11/react-native-fast-image";

function AdnHome({navigation,setSignOff,accessToken,lookStored,assignProfile,route}) {
  const Colors = useTheme(); // Get the current color scheme's colors
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useAppContext(); 
  // const {openProductCode, setOpenProductCode} = useContext(StateContext);
  i18n.translations = state.i18ntranslation;
  // const profileIn = state.profile;
  const displayItem={
    "Id": 1,
    "Name": "View",
    "InternalId": "signin",
    "Settings": {
      "orientation": "horizontal",
      "maxitems": 4,
      "itemwidth": 245,
      "itemheight": 160
    },
    "ContentItems": [
      {
        "Id": 1,
        "ContentTypeId": 1,
        "ContentTypeName": "view",
        "ContentTypeSettings": {
          "openDetailsView": true,
          "allowShare": true
        },
        "TierIds": null,
        "Title": "signin",
        "SubTitle": "",
        "Banner": {
          "MainBannerImgURL": "",
          "BannerSlider": [
          ],
          "BannerVideo": ""
        },
        "Navigation": {
          "NavType": "appview",
          "NavURL": "home",
          "NavParameter": "signin"
        },
        "CustomContent": null,
        "PublishStart": null,
        "PublishEnd": null,
        "DiplayOrder": 10
      }]
    };
    const [oneTime,setOneTime]=useState(-1);
    const [currentSelf,setCurrentSelf]=useState(-1);
    const [homeData, setData] = useState([{
      "Id": 1,
      "Name": "Home",
      "InternalId": "mainview",
      "Settings": null,
      "ContentItems": [
        
      ],
      "SubHolders": []
    }]);

    const [homeFolderData,setFolderData]=useState(undefined);
    const [hamData, setHamData] = useState(undefined);
    const [showNofication, setShowNofication] = useState(false);
    const [unReadCount, setUnreadCount] = useState(0);
    
    const [profileData,setProfileData] =useState('');
    const [isLoading, setLoading]=useState(false);
    const [pageNo, setPage]=useState(false);
    const [moreLoading, setmoreLoading]=useState(false);
    const [isListEnd, setListEnd]=useState(false);
    
    const signinwithSavedPass=()=>{
      // SecureStore.setItemAsync('accessToken',dateGot.access_token);
      // SecureStore.setItemAsync('refreshToken',dateGot.refresh_token);
      // SecureStore.setItemAsync('userID',dateGot.MemberID);
      
      if(global.initProfile===undefined){
        // console.log("signinwithSavedPass");
        // var updateLoad=this.props.updateLoading;
        // updateLoad(true);
        
        SecureStore.getItemAsync('accessToken').then(savedPass=>{
          global.initProfile="Y";
          // Call the backend API to authenticate using the stored username+password
          // this.signinProfilewithBio(savedCredential,savedPass);
          if(savedPass!=undefined&&savedPass!=null&&savedPass.length>0){
            // console.log("SavedPAss:"+savedPass);
            dataGot=JSON.parse(savedPass);
            dispatch({
              type:"update_AccessToken",
              payload:dataGot
            })
            var handleToUpdate  =  assignProfile;
            handleToUpdate(savedPass,"","");
          }
          // else{
          //     var updateLoad=this.props.updateLoading;
          //     updateLoad(false);
          // }
        }).catch(error => {
          // console.log(error);
          
        });
      } else {
        
      }
    }
    useEffect(()=>{
      if(setSignOff==true){
        var assignSignout  =  assignProfile;
        assignSignout('','','');
      }
    },[setSignOff])
    
    // useEffect(()=>{
    //   if(openProductCode.length>0){
    //     navigation.navigate('Storescreen')
    //     navigation.popToTop();
    //   }
    //   console.log("PGuseEffect");
    // },[openProductCode])
    
    useEffect(() => {
      const focusListener = navigation.addListener('focus', () => {
        handleUnRead();
      });
      return () => {
        focusListener();  // React Navigation 5+ returns unsubscribe function
      };
    }, [navigation]);
    
    // const { onGoBack } = (route&&route.params) || {};
    
    useEffect(() => {
      const { onGoBack } = (route&&route.params) || {};
      if (onGoBack) {
        handleUnRead();
      }
    }, [route]);
    
    // Function to be called when navigating back
    const handleGoBack = () => {
      if (onGoBack) {
        handleUnRead();
      }
    };
    
    const handleUnRead=()=>{
      if(!Tools.IsNull(state.profile)){
        // console.log("Data checked on focus :"+JSON.stringify(profileIn));
        setUnreadCount(state.profile.UnreadNotifications);
      }
    }
    useEffect(()=>{
      if(Tools.stringIsEmpty(profileData)||(!Tools.IsNull(state.profile)&&(state.profile.Id!=profileData))||Tools.IsNull(state.profile)){
        // console.log("PH :"+JSON.stringify(profileIn));
        getHomeData();
      }
      if(!Tools.IsNull(state.profile)){
        setUnreadCount(state.profile.UnreadNotifications);
      }
      // this.getNotifications=this.getNotifications.bind(this);
      // getHomeData();
      // getHamBurger();
    },[state.profile])
    
    const getNotifications=()=>{
      valIn=Tools.IsNull(state.profile)||Tools.IsNull(state.profile.Id);
      // console.log("getNotifications-"+valIn)
      // if(this.props.profile!=null&&this.props.profile.FirstName!=null)
      return(
        <TouchableOpacity
        disabled={valIn}
        // style={[{},(valIn?{opacity:0.45}:{opacity:1,shadowOffset: { width: 0, height: 2 },
        //   shadowRadius: 6,
        //   shadowOpacity: 0.26,
        //   elevation: 8,})]} 
        onPress={()=>{
          setNotificationVisible(true);
        }}><View
        style={[{},(valIn?{opacity:0}:{opacity:1})]} 
        >
        <Image style={{width:30,height:30,tintColor:Colors.blueColor}} source={notify} />
        {!valIn&&unReadCount!=undefined&&unReadCount>0&&<View style={{width:10,height:10,borderRadius:10,backgroundColor:Colors.warningColor,position:'absolute',top:0,right:10}}>
        </View>}</View>
        </TouchableOpacity>
        )
      }
      const setNotificationVisible=(_visible)=>{
        setShowNofication(_visible);
        if(_visible){
          navigation.navigate("notify",{updateUnread:handleUnRead});
        }
      }
      
      const getHomeData=()=>{
        setLoading(true);
        verifyurl=WebServices.homepageData.replace('{Lang}',Tools.stringIsContains(i18n.locale,'ar')?'ar':'en').replace('{MemberID}',Tools.stringIsEmpty(state.profile)?'':state.profile.Id);
        // console.log("HP"+ verifyurl);
        return fetch (WebServices.MainURL+verifyurl+("&rand="+ (Math.floor(Math.random() * 100000) + 1)),{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },WebServices.timeout)
        .then((response) =>  response.text())
        .then((responseJson) => {
          if(!Tools.IsNull(state.profile)){
            setProfileData(state.profile.Id);
            // console.log("P "+JSON.stringify(profileData));
          }else{
            setProfileData('');
          }
          // console.log("D:"+responseJson);
          setLoading(false);
          setCurrentSelf(-1);
          dataToDisplay=JSON.parse(responseJson);
          setData(dataToDisplay);
          
          var subHolder=dataToDisplay[0].SubHolders.filter((itemFIn)=>(!Tools.IsNull(itemFIn.Name)&&Tools.stringIsContains(itemFIn.Name,"-")));
          if(!Tools.IsNull(subHolder[0]))
            setOneTime(subHolder[0].Id);
          setFolderData(subHolder);
        })
        .catch((error) =>{
          setLoading(false);
          // console.log("HP E "+error);
          
        });
      }
      const getHamBurger=()=>{
        setLoading(true);
        verifyurl=WebServices.hampageData.replace('{Lang}',Tools.stringIsContains(i18n.locale,'ar')?'ar':'en').replace('{MemberID}',Tools.IsNull(state.profile.Id)?'':state.profile.Id);
        // console.log(verifyurl);
        return fetch (WebServices.MainURL+verifyurl+("&rand="+ (Math.floor(Math.random() * 100000) + 1)),{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },WebServices.timeout)
        .then((response) =>  response.text())
        .then((responseJson) => {
          // console.log("HAM: "+responseJson);
          global.hamData=JSON.parse(responseJson)
          setLoading(false);
          setHamData(global.hamData);
        })
        .catch((error) =>{
          setLoading(false);
        });
      }
      
      useEffect(() => {
        if(!Tools.IsNull(state.profile)){
          
        }else{
          var handleToUpdate  = lookStored;
          handleToUpdate();
          // this.signinwithSavedPass();
          setTimeout(() => {
            signinwithSavedPass();
          }, 100);  
          
        }
      }, []);
      
      
      const fetchMoreData = () => {
        if (!isListEnd && !moreLoading) {
          setPage(pageNo + 1)
        }
      }
      
      const renderHeader = () => (
        <></>
        // <Text style={styles.title}>News</Text>
        )
        
        const renderFooter = () => (
          <View style={styles.footerText}>
          {moreLoading && 
            <ActivityIndicator />
          }
          {isListEnd && <Text>No more ads at the moment</Text>}
          </View>
          )
          const getOneTimePark=()=>{
            var dataOneTime=[];
            if(!Tools.IsNull(homeFolderData)){
            homeFolderData.map(itemOne=>{
              var itemOneIn=itemOne;
              dataOneTime.push(
              <TouchableOpacity onPress={()=>{
                setCurrentSelf(itemOneIn.Id);
              }} style={{borderRadius:widthPercentageToDP(5),backgroundColor:Colors.whiteColor,margin:widthPercentageToDP(2)}}>
              <FastImage resizeMode="contain" style={{width:widthPercentageToDP(40),aspectRatio:1}} 
              source={{
                uri: getFolderImage(itemOne.Name),
                priority: FastImage.priority.high,
            }}/>
            </TouchableOpacity>
            )
            });
            }
            return(
            // <NewsFeed news={item} profile={state.profile}/>
            <View style={{width:widthPercentageToDP(90),alignSelf:'center',justifyContent:'space-between',flexDirection:'row',flexWrap:'wrap'}}>
            {dataOneTime}
            </View>)
          }
          const getLoading=()=>{
            allLoad=[];
            {for (let index = 0; index < 3; index++) {
              randHeight=Tools.randomNumberInRange(32,35);
              allLoad.push (
                <ContentLoader 
                speed={Tools.randomNumberInRange(.75,1)}
                width={widthPercentageToDP(93)}
                height={heightPercentageToDP(randHeight)}
                style={{alignSelf:'center'}}
                // viewBox="0 0 400 460"
                backgroundColor={Colors.whiteColor}
                foregroundColor={Colors.bgColor}
                >
                <Rect x="0" y={index==0?30:10} rx="2" ry="2" width={widthPercentageToDP(40)} height={heightPercentageToDP(3)} />
                <Rect x="0" y={(index==0?30:10)+heightPercentageToDP(3.5)} rx={widthPercentageToDP(2)} ry={widthPercentageToDP(2)} width={widthPercentageToDP(93)} height={heightPercentageToDP(randHeight)-(index==0?30:10)-heightPercentageToDP(3.5)} />
                </ContentLoader>
                )
              }}
              return allLoad;
            }

            const getFolderImage=(folderName)=>{
              const folderParts = folderName.split('-');
              var pathin= WebServices.folderImage.replace('{park}',folderParts[0]);
              // console.log(pathin);
              return pathin;
            }
            
            const renderEmpty = () => (
              <View style={{width:widthPercentageToDP(100),height:heightPercentageToDP(100)}}>
              <TouchableOpacity style={styles.button} onPress={getHomeData}><Text style={styles.buttontxt}>{i18n.t('refresh')}</Text></TouchableOpacity>
              </View>
              )

              // Memoized renderItem with null safety check
              const renderFeedItem = useCallback(({ item, index }) => {
                if (Tools.IsNull(item)) {
                    return null;
                }
                return <NewsFeed news={item} profile={state.profile} />;
              }, [state.profile]);

              // Memoized keyExtractor
              const keyExtractor = useCallback((item, index) =>
                item.Id ? `feed-${item.Id}` : `feed-index-${index}`,
              []);

              const styles = StyleSheet.create({
                button:{
                  alignSelf:'center',justifyContent:'center',
                  backgroundColor:Colors.blueColor,
                  height:heightPercentageToDP(4.75),
                  borderRadius:heightPercentageToDP(4.75)
                },
                buttontxt:{
                  alignSelf:'center',
                  fontFamily:'Cairo-Regular',
                  fontSize:widthPercentageToDP(4.5),
                  paddingHorizontal:widthPercentageToDP(4),
                  color:Colors.whiteColor
                },
              })
              return(
                <>
                <View
                style={{
                  paddingTop: insets.top,
                  paddingBottom: insets.bottom,
                  backgroundColor:Colors.bgColor,
                  flex: 1
                }}
                >
                <BackgroundWall/>
                {/* <SVGbg preserveAspectRatio="xMinYMax meet" width="540" height={heightPercentageToDP(100)} style={{position:'absolute',tintColor:Colors.whiteColor}}
              viewBox="0 -200 540 663"/> */}
              {/* <SVGbg style={{position:'absolute',borderWidth:2}} viewBox="0 0 540 663" preserveAspectRatio="xMinYMin slice"/> */}

              <View style={{alignSelf:'flex-end',marginEnd:'1.5%',width:40,height:40,marginTop:heightPercentageToDP(1),}}>
              {getNotifications()}
              </View>

              <View style={{flex: 1}}>
              {isLoading?
                (<View style={styles.loading}>
                {getLoading()}
                </View>)
                :(homeData!=undefined&&
                  <FlatList
                  removeClippedSubviews={Platform.OS === 'ios'}
                  initialNumToRender={3}
                  maxToRenderPerBatch={2}
                  windowSize={5}
                  onEndReachedThreshold={0.1}
                  showsVerticalScrollIndicator={false}
                  refreshControl={<RefreshControl
                    colors={["#9Bd35A", "#689F38"]}
                    onRefresh={getHomeData} />}
                    contentContainerStyle={{paddingBottom:heightPercentageToDP(15)}}
                    data={homeData[0].SubHolders}
                    keyExtractor={keyExtractor}
                    renderItem={renderFeedItem}
                    extraData={state.profile}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={renderEmpty}
                    onEndReached={fetchMoreData}
                    />)
                    }

                    {/* {showNofication&&<NotificationPage assignProfile={this.props.assignProfile} accessToken={this.props.accessToken} isopen={this.state.showNofication} profile={profile} isopen={showNofication} onDone={()=>{
                      setShowNofication(false);
                    }}/>} */}

                    </View>
                    </View>
                </>
                    );
                    
                  }
                  
                  export default AdnHome;