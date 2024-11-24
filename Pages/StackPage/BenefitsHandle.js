import { Image, SafeAreaView, TouchableOpacity, View,StyleSheet, Text, FlatList, Linking, ScrollView, StatusBar, ActivityIndicator } from "react-native";
import CardTopBar from "../../Tools/Components/CardTopBar";
import BackgroundWall from "../../Tools/Components/BackgroundWall";
import BackButton from "../../Tools/Components/BackButton";
import backButton from '../../assets/Icons/back.png'
import { useTheme } from "../../Tools/context/ThemeProvider";
import * as Tools from '../../Tools/Components/Tools';
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import * as UiElements from '../../Tools/Components/UIElements'
import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import WebServices from "../../Tools/constants/WebServices";
import OTP from "../../Tools/Components/OTP";
import RenderHtml,{defaultSystemFonts}from 'react-native-render-html';
import FastImage from "react-native-fast-image";
import PopUpModal from "../../Tools/Components/PopUpModal";
import OverlayLoad from "../../Tools/Components/OverlayLoad";
import TabBarIcon from "../../Tools/Components/TabBarIcon";
import { Alert } from "react-native";
const systemFonts = [...defaultSystemFonts, 'Cairo-Regular']
// import { MarqueeLine } from '../../Tools/Components/MarqueeLine';
import { RefreshControl } from "react-native";
// import Barcode from "react-native-barcode-builder";
import WebView from "react-native-webview";
import MarqueeLine from "../../Tools/Components/MarqueeLine";
import { useAppContext } from "../../src/js/reducers/AppReducer";
import Barcode from "../../Tools/Components/Barcode";

export default function BenefitsHandle({navigation,assignProfile,isLoading,redeem,redeemPoint,redeemProfile,redeemPoints,claimpoint,claimprofile}) {
    const Colors=useTheme();
    const route=useRoute();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    // const [allBenefits,setAllBenefits]=useState([{"Id":"97435cc1-5fce-4bc0-acde-5561d3584200","Icon":"https://leisure.qa/assets/images/icons/noun-discount-612434.png","NameEn":"Free Drink (Week Days)","NameAr":"مشروب مجانى (أيام الأسبوع)","ValidFrom":"2023-09-01T00:00:00","ValidTo":"2024-08-31T00:00:00","DescriptionEn":"<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p><ol><li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li><li>Aliquam tincidunt mauris eu risus.</li><li>Vestibulum auctor dapibus neque.</li></ol>, <h1>HTML Ipsum Presents</h1>\r\n\r\n\t\t\t\t<p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,","DescriptionAr":"مشروب مجانا ( بيبسى, كوكاكولا, سبرايت أو ماونتن ديو)","AvailableAt":[{"Id":"a77685fc-fd7c-49f5-8977-928d94039fb7","Title":"Angry Birds World","Image":"angry-birds.png"},{"Id":"24dbaae7-5ce6-4178-a8a7-930b1daa6e6a","Title":"Virtuocity","Image":"virtual-city.png"}],"IsAllowed":false},{"Id":"01675632-4926-47c7-b25e-1cca5178b852","Icon":"https://leisure.qa/assets/images/icons/noun-game-play-love-.png","NameEn":"Free Drink (Week Ends)","IsRedeemable":true,"NameAr":"مشروب مجانى (أيام الأجازات)","ValidFrom":"2023-09-01T00:00:00","ValidTo":"2024-08-31T00:00:00","DescriptionEn":"<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p><ol><li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li><li>Aliquam tincidunt mauris eu risus.</li><li>Vestibulum auctor dapibus neque.</li></ol> <h1>HTML Ipsum Presents</h1>\r\n\r\n\t\t\t\t<p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,","DescriptionAr":"مشروب مجانا ( بيبسى, كوكاكولا, سبرايت أو ماونتن ديو)","AvailableAt":[{"Id":"a77685fc-fd7c-49f5-8977-928d94039fb7","Title":"Angry Birds World","Image":"angry-birds.png"},{"Id":"24dbaae7-5ce6-4178-a8a7-930b1daa6e6a","Title":"Virtuocity","Image":"virtual-city.png"}],"IsAllowed":true},{"Id":"97435cc1-5fce-4bc0-acde-5561d3584200","Icon":"https://leisure.qa/assets/images/icons/noun-discount-612434.png","NameEn":"Free Drink (Week Days)","NameAr":"مشروب مجانى (أيام الأسبوع)","ValidFrom":"2023-09-01T00:00:00","ValidTo":"2024-08-31T00:00:00","DescriptionEn":"<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p><ol><li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li><li>Aliquam tincidunt mauris eu risus.</li><li>Vestibulum auctor dapibus neque.</li></ol>, <h1>HTML Ipsum Presents</h1>\r\n\r\n\t\t\t\t<p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,","DescriptionAr":"مشروب مجانا ( بيبسى, كوكاكولا, سبرايت أو ماونتن ديو)","AvailableAt":[{"Id":"a77685fc-fd7c-49f5-8977-928d94039fb7","Title":"Angry Birds World","Image":"angry-birds.png"},{"Id":"24dbaae7-5ce6-4178-a8a7-930b1daa6e6a","Title":"Virtuocity","Image":"virtual-city.png"}],"IsAllowed":false},{"Id":"01675632-4926-47c7-b25e-1cca5178b852","Icon":"https://leisure.qa/assets/images/icons/noun-game-play-love-.png","NameEn":"Free Drink (Week Ends)","NameAr":"مشروب مجانى (أيام الأجازات)","ValidFrom":"2023-09-01T00:00:00","ValidTo":"2024-08-31T00:00:00","DescriptionEn":"<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p><ol><li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li><li>Aliquam tincidunt mauris eu risus.</li><li>Vestibulum auctor dapibus neque.</li></ol> <h1>HTML Ipsum Presents</h1>\r\n\r\n\t\t\t\t<p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,","DescriptionAr":"مشروب مجانا ( بيبسى, كوكاكولا, سبرايت أو ماونتن ديو)","AvailableAt":[{"Id":"a77685fc-fd7c-49f5-8977-928d94039fb7","Title":"Angry Birds World","Image":"angry-birds.png"},{"Id":"24dbaae7-5ce6-4178-a8a7-930b1daa6e6a","Title":"Virtuocity","Image":"virtual-city.png"}],"IsAllowed":true}]);
    const [allBenefits,setAllBenefits]=useState([]);
    const [allUsedBenefits,setAllUsedBenefits]=useState([]);
    const [showUsed,setShowUsed]=useState(false);
    const [showTiers,setShowTiers]=useState(false);
    const [benefit,setbenefit]=useState(undefined);//Id:'in',IsRedeemable:true,AvailableAt:'AngryBirds'
    const [useit,setuseIt]=useState(false);
    const [useitpop,setuseItPop]=useState(false);
    const [Loading,setLoading]=useState(false);
    const [refreshing,setRefreshing]=useState(false);
    const [finalPage,showFinalPage]=useState(undefined);//{Result:'5M6BSZBQXB52BV'}
    const [passCode,setPassCode]=useState('');
    
    useEffect(() => {
        getBenefits();
    }, []);
    
    const getBenefits=()=>{
        setRefreshing(true);
        
        verifyurl=WebServices.getBenefits.replace('{MemberId}',Tools.IsNull(state.profile.Id)?'':state.profile.Id);
        // console.log(verifyurl);
        return fetch (WebServices.MainURL+verifyurl,{
            method: 'GET',
            headers:{
                'Authorization':'Bearer '+state.accessToken.access_token,
                'Content-Type': 'application/json',
            },
        },WebServices.timeout)
        .then((response) =>  response.text())
        .then((responseJson) => {
            setRefreshing(false);
            
            if(Tools.stringIsContains(responseJson,'denied')){
                if(assignProfile!=null){
                    assignProfile("user",'','',() =>{getBenefits()})
                }
                return;
            }
            // console.log("getBenefits: "+responseJson);
            var DataGot=[];
            DataGot=JSON.parse(responseJson);
            setAllBenefits(DataGot);
        })
        .catch((error) =>{
            setRefreshing(false);
            
        });
    }
    const getUsedBenefits=()=>{
        setRefreshing(true);
        
        verifyurl=WebServices.getUsedBenefits.replace('{MemberId}',Tools.IsNull(state.profile.Id)?'':state.profile.Id);
        // console.log(verifyurl);
        return fetch (WebServices.MainURL+verifyurl,{
            method: 'GET',
            headers:{
                'Authorization':'Bearer '+state.accessToken.access_token,
                'Content-Type': 'application/json',
            },
        },WebServices.timeout)
        .then((response) => {
            if(response.status==200)
            return (response.text())
            else{
                setRefreshing(false);
            }
        })
        .then((responseJson) => {
            setRefreshing(false);
            if(Tools.stringIsContains(responseJson,'denied')){
                if(assignProfile!=null){
                    assignProfile("user",'','',() =>{getUsedBenefits()})
                }
                return;
            }
            // console.log("getUsedBenefits: "+responseJson);
            var DataGot=JSON.parse(responseJson);
            setAllUsedBenefits(DataGot);
        })
        .catch((error) =>{
            setRefreshing(false);
            
        });
    }
    const redeemBenefit=(_passcode)=>{
        setLoading(true);
        verifyurl=WebServices.redeemBenefits.replace('{MemberBenefitId}',benefit.Id).replace('{PassCode}',_passcode);
        // console.log(verifyurl);
        return fetch (WebServices.MainURL+verifyurl,{
            method: 'POST',
            headers:{
                'Authorization':'Bearer '+state.accessToken.access_token,
                'Content-Type': 'application/json',
            },
        },WebServices.timeout)
        .then((response) =>  response.text())
        .then((responseJson) => {
            // console.log("redeemBenefit: "+responseJson);
            if(Tools.stringIsContains(responseJson,'denied')){
                if(assignProfile!=null){
                    assignProfile("user",'','',(_passcode) =>{redeemBenefit(_passcode)})
                }
                return;
            }
            dataGot=JSON.parse(responseJson);
            // if(!Tools.stringIsContains(responseJson,'error')){
            
            //     showFinalPage(dataGot);
            // }else
            {
                if(!Tools.stringIsEmpty(dataGot.Error)){
                    Alert.alert(dataGot.Error);
                }else{
                    showFinalPage(dataGot);
                    // Alert.alert(I18n.t('error'),I18n.t('tryagain'));
                }
            }
            getBenefits();
            setLoading(false);
        })
        .catch((error) =>{
            setLoading(false);
            Alert.alert(i18n.t('error'),i18n.t('tryagain'));
        });
    }
    
    const styles = StyleSheet.create({
        closeIcon:{
            position:'absolute',alignSelf:'center',justifyContent:'center',
            bottom:heightPercentageToDP(2),
            width:widthPercentageToDP(7),
            height:widthPercentageToDP(7),
            borderRadius:widthPercentageToDP(8),
            color:Colors.blueColor,
            backgroundColor:Colors.blueColor
        },
        tabButton:{
            width:'50%',
            height:'100%',
            justifyContent:'center'
        },
        tabText:{
            includeFontPadding:false,
            alignSelf:'center',
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular',
            fontSize:widthPercentageToDP(4),
        },
        innershadowC:{
            borderTopWidth:2,
            borderLeftWidth:2,
            borderColor:'rgba(0,0,0,0.16)',
            backgroundColor:Colors.blueColor
        },
        innershadowR:{
            borderTopWidth:2,
            borderRightWidth:2,
            borderColor:'rgba(0,0,0,0.16)',
            backgroundColor:Colors.blueColor
        },
        titlepass:{
            includeFontPadding:false,
            fontFamily:'Cairo-SemiBold',fontSize:widthPercentageToDP(5),color:Colors.black,
            lineHeight:widthPercentageToDP(5)*1.3,alignSelf:'center'
        },
        title:{
            includeFontPadding:false,
            fontFamily:'Cairo-Bold',fontSize:widthPercentageToDP(4),color:Colors.black,
            lineHeight:widthPercentageToDP(4)*1.3
        },
        description:{
            includeFontPadding:false,
            fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(4),color:Colors.black,
            lineHeight:widthPercentageToDP(4)*1.3,alignSelf:'center'
        },
        content:{
            includeFontPadding:false,
            fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(3.5),color:Colors.whiteColor,
            lineHeight:widthPercentageToDP(3.5)*1.3
        },contentHistory:{
            includeFontPadding:false,
            fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(3.5),color:Colors.black,
            lineHeight:widthPercentageToDP(3.5)*1.3
        },contentCode:{
            includeFontPadding:false,
            fontFamily:'Cairo-Bold',fontSize:widthPercentageToDP(6),color:Colors.black,alignSelf:'center'
        },
        contentButton:{
            includeFontPadding:false,
            fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(3.5),color:Colors.whiteColor,
        }
        
    });
    getUsedBenefit= ({item, index}) => {
        // console.log(Tools.stringIsContains(i18n.locale,'en')?item.NameEn:item.NameAr);
        validIn='';
        return (
            <TouchableOpacity disabled={!item.IsAllowed} onPress={()=>{
                setbenefit(item);
            }} style={{flexDirection:'row',marginBottom:heightPercentageToDP(index==(allBenefits.length-1)?0:2),width:'85%',borderRadius:widthPercentageToDP(3)
            ,alignSelf:'center',overflow:'hidden'}}>
            <View style={{width:'100%',borderBottomWidth:1,borderBottomColor:Colors.blueColor,height:'100%',padding:widthPercentageToDP(3)}}>
            <Text style={styles.title}>{Tools.stringIsContains(i18n.locale,'en')?item.NameEn:item.NameAr}</Text>
            <View style={{flexDirection:'row',width:'95%'}}>
            <Text numberOfLines={1} style={styles.contentHistory}>{i18n.t('redeemcode')} : </Text>
            <Text style={[styles.contentHistory]}>{(item.RedeemCode)}</Text>
            </View>
            <View style={{flexDirection:'row',width:'95%'}}>
            <Text numberOfLines={1} style={styles.contentHistory}>{i18n.t('redeemdate')} : </Text>
            <Text style={styles.contentHistory}>{Tools.getTimefromString(item.RedeemDate)}</Text>
            </View>
            <View style={{flexDirection:'row',width:'95%'}}>
            <Text numberOfLines={1} style={styles.contentHistory}>{i18n.t('redeemlocation')} : </Text>
            <Text style={styles.contentHistory}>{Tools.stringIsContains(i18n.locale,'en')?(item.RedeemLocationEn):(item.RedeemLocationAr)}</Text>
            </View>
            </View>
            </TouchableOpacity>
            )
        }
        getBenefit= ({item, index}) => {
            // console.log(Tools.stringIsContains(i18n.locale,'en')?item.NameEn:item.NameAr);
            validIn='';
            for (let index = 0; index < item.AvailableAt.length; index++) {
                const element = item.AvailableAt[index];
                validIn+=element.Title;
                if(index < (item.AvailableAt.length-1))
                validIn+=', '
            }
            return (
                <TouchableOpacity disabled={!item.IsAllowed} onPress={()=>{
                    setbenefit(item);
                }} style={{opacity:(item.IsAllowed?1:0.5),flexDirection:'row',marginBottom:-heightPercentageToDP(4),
                width:'85%',borderRadius:widthPercentageToDP(3),maxHeight:heightPercentageToDP(30),overflow:'hidden',
                alignSelf:'center'}}>
                <View style={{width:'25%',backgroundColor:Colors.yellowShadeColor,height:'100%',justifyContent:'center'}}>
                <FastImage style={[{alignSelf:'center',width:widthPercentageToDP(12),height:widthPercentageToDP(12)}]}
                source={{
                    uri: item.Icon,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.stretch}/>    
                </View>
                <View style={{width:'75%',backgroundColor:Colors.blueColor,height:'100%',padding:widthPercentageToDP(3)}}>
                <Text style={styles.title}>{Tools.stringIsContains(i18n.locale,'en')?item.NameEn:item.NameAr}</Text>
                <View style={{flexDirection:'row',width:'99%'}}>
                <Text numberOfLines={1} style={styles.content}>{i18n.t('validuntill')} : {Tools.getTimefromString(item.ValidTo)}</Text>
                </View>
                <View style={{flexDirection:'row',width:'99%'}}>
                <Text numberOfLines={2} style={styles.content}>{i18n.t('validin')} : {validIn}</Text>
                </View>
                </View>
                </TouchableOpacity>
                )
            }
            const refreshControl=()=>{
                const Colors=useTheme();
                return (
                    <RefreshControl
                    tintColor={Colors.blueColor}
                    refreshing={refreshing}
                    onRefresh={()=>refreshListView()} />
                    )
                }
                const refreshListView=()=>{
                    if(showUsed){
                        getUsedBenefits();
                    }else{
                        getBenefits();
                    }
                }
                getBenefitIn= (item,onlybar=false) => {
                    // console.log(Tools.stringIsContains(i18n.locale,'en')?item.NameEn:item.NameAr);
                    validIn='';
                    for (let index = 0; index < item.AvailableAt.length; index++) {
                        const element = item.AvailableAt[index];
                        validIn+=element.Title;
                        if(index < (item.AvailableAt.length-1))
                        validIn+=','
                    }
                    return (
                        <View >
                        <View style={{flexDirection:'row',width:'85%',maxHeight:heightPercentageToDP(12),minHeight:heightPercentageToDP(10),borderRadius:widthPercentageToDP(3),alignSelf:'center',overflow:'hidden'}}>
                        <View style={{width:'25%',backgroundColor:Colors.yellowShadeColor,height:'100%',justifyContent:'center'}}>
                        <FastImage style={[{alignSelf:'center',width:widthPercentageToDP(12),height:widthPercentageToDP(12)}]}
                        source={{
                            uri: item.Icon,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.stretch}/>   
                        </View>
                        <View style={{width:'75%',backgroundColor:Colors.blueColor,padding:widthPercentageToDP(3)}}>
                        <Text style={styles.title}>{Tools.stringIsContains(i18n.locale,'en')?item.NameEn:item.NameAr}</Text>
                        <View style={{flexDirection:'row',width:'95%'}}>
                        <Text numberOfLines={1} style={styles.content}>{i18n.t('validuntill')} :</Text>
                        <Text style={styles.content}>{Tools.getTimefromString(item.ValidTo)}</Text>
                        </View>
                        <View style={{flexDirection:'row',width:'95%'}}>
                        <Text numberOfLines={1} style={styles.content}>{i18n.t('validin')} :</Text>
                        <Text style={styles.content}>{validIn}</Text>
                        </View>
                        </View>
                        </View>
                        {!onlybar&&<>
                            <ScrollView
                            showsVerticalScrollIndicator={false}
                            horizontal={false}
                            contentContainerStyle={{paddingBottom:heightPercentageToDP(6)}}
                            style={{width:'80%',height:'78%',paddingTop:widthPercentageToDP(4),alignSelf:'center'}}>
                            <RenderHtml
                            defaultTextProps={{allowFontScaling:false}}
                            baseStyle={{
                                textAlign:'left',fontFamily:'Cairo-Regular',
                                fontSize:widthPercentageToDP(3.75),
                                marginTop:-heightPercentageToDP(0.02),
                                marginBottom:-heightPercentageToDP(0.15),
                                color:Colors.black,
                            }}
                            GenericPressable={ (evt, href) => {
                                if(Tools.stringIsContains(href,WebServices.appurl)){
                                }else{
                                    Linking.openURL(href); 
                                }}}
                                tagsStyles={{
                                    p: {
                                        fontSize:widthPercentageToDP(3.75),
                                        marginTop:-heightPercentageToDP(0.02),
                                        marginBottom:-heightPercentageToDP(0.15),
                                        color:Colors.black,
                                        width:'100%',
                                    },
                                }}
                                // fallbackFonts='Cairo-Regular'
                                systemFonts={systemFonts} 
                                // onLinkPress={ (evt, href) => { Linking.openURL(href); }}
                                contentWidth={widthPercentageToDP(80)}
                                source={{ html: "<p>"+(i18n.locale=='ar'?item.DescriptionAr:item.DescriptionEn)+"</p>"}}
                                
                                />  
                                </ScrollView></>}
                                </View>
                                )
                            }
                            const getBenefitPage=()=>{
                                return(
                                    <View style={{width:'90%',height:'75%',borderWidth:0,backgroundColor:Colors.whiteColor,alignSelf:'center',borderRadius:widthPercentageToDP(6),overflow:'visible',paddingTop:heightPercentageToDP(3)}}>
                                    {showTiers&& <WebView
                                        source={{uri:WebServices.MainURL+(Tools.stringIsContains(i18n.locale,'en')?WebServices.tierPageEn:WebServices.tierPageAr)}}
                                        />
                                    }
                                    {refreshing&&allBenefits==undefined&&<ActivityIndicator
                                        size='large'
                                        color={Colors.bluedarkShadeColor}/>}
                                        {benefit==undefined&&!showUsed&&!showTiers&&allBenefits!=undefined&&<FlatList
                                            horizontal={false}
                                            style={{borderWidth:0,maxHeight:'88%',height:'88%'}}
                                            // contentContainerStyle={{justifyContent:'center',alignContent:'space-around'}}
                                            snapToAlignment="center"
                                            data={allBenefits}
                                            ItemSeparatorComponent={UiElements.drawGap(10)}
                                            ListEmptyComponent={<View style={{width:'80%',alignSelf:'center'}}><Text style={styles.titlepass}>{i18n.t("nobenefits")}</Text></View>}
                                            refreshControl={refreshControl()}
                                            renderItem={getBenefit}/>
                                        }
                                        {allUsedBenefits!=undefined&&showUsed&&!showTiers&&<View style={{overflow:'hidden',height:'90%'}}>
                                        <Text style={styles.titlepass}>{i18n.t('usedbenefits')}</Text>
                                        <FlatList
                                        removeClippedSubviews={false}
                                        refreshControl={refreshControl()}
                                        style={{borderWidth:0,maxHeight:'90%',height:'90%'}}
                                        ListEmptyComponent={<View style={{width:'80%',alignSelf:'center'}}><Text style={styles.titlepass}>{i18n.t("nobenefitshistory")}</Text></View>}
                                        data={ allUsedBenefits==undefined?[]:allUsedBenefits}
                                        renderItem={getUsedBenefit}/>
                                        </View>
                                    }
                                    {benefit!=undefined&&!useit&&<View style={{marginBottom:benefit.IsRedeemable?heightPercentageToDP(6.5):0}}>
                                    {getBenefitIn(benefit)}
                                    </View>
                                }
                                {
                                    finalPage!=undefined&&benefit!=undefined&&<View>
                                    {getBenefitIn(benefit,true)}
                                    {UiElements.drawGap(heightPercentageToDP(3))}
                                    <Text style={styles.titlepass}>{i18n.t("redeemcode")}</Text>
                                    {UiElements.drawGap(heightPercentageToDP(3))}
                                    <Text style={[styles.contentCode,{textTransform:'uppercase'}]}>{finalPage.Result}</Text>
                                    {!Tools.stringIsEmpty(finalPage.Result)&&<Barcode value={finalPage.Result} 
                                    viewStyle={{marginTop:heightPercentageToDP(1),marginBottom:heightPercentageToDP(1)}} width={widthPercentageToDP('.32%')} height={heightPercentageToDP('5%')}
                                    format="CODE128" />}
                                    <MarqueeLine bgColor={Colors.black} style={{width:widthPercentageToDP(70)}}/>
                                    </View>
                                }
                                {
                                    finalPage==undefined&&benefit!=undefined&&useit&&<>
                                    {getBenefitIn(benefit,true)}
                                    {UiElements.drawGap(heightPercentageToDP(3))}
                                    <Text style={styles.titlepass}>{i18n.t("benefitpasscode")}</Text>
                                    <OTP title={false} onChangeText={(text) => {setPassCode(text)}}/>
                                    <View style={{width:'80%',height:'53%',alignSelf:'center',
                                }}>
                                {UiElements.drawGap(heightPercentageToDP(5))}
                                <TouchableOpacity onPress={()=>{
                                    redeemBenefit(passCode);
                                }} style={{backgroundColor:Colors.blueColor,borderRadius:widthPercentageToDP(5),paddingHorizontal:widthPercentageToDP(3)
                                    ,height:heightPercentageToDP(4),justifyContent:'center',alignSelf:'center'}}><Text style={styles.contentButton}>{i18n.t('submit').toUpperCase()}</Text></TouchableOpacity>
                                    </View>
                                    </>
                                }
                                {benefit==undefined&&!showUsed&&!showTiers&&<View style={{flexDirection:'row',justifyContent:'space-between',width:'75%',alignSelf:'center',position:'absolute',bottom:heightPercentageToDP(1)}}><TouchableOpacity onPress={()=>{
                                    setShowUsed(true);
                                    getUsedBenefits();
                                }} style={{backgroundColor:Colors.blueColor,borderRadius:widthPercentageToDP(5),paddingHorizontal:widthPercentageToDP(3),bottom:heightPercentageToDP(2)
                                    ,height:heightPercentageToDP(4),justifyContent:'center',alignSelf:'center',color:Colors.whiteColor}}><Text style={styles.contentButton}>{i18n.t('usedbenefits').toUpperCase()}</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{
                                        setShowTiers(true);
                                        getUsedBenefits();
                                    }} style={{backgroundColor:Colors.blueColor,borderRadius:widthPercentageToDP(5),paddingHorizontal:widthPercentageToDP(3),bottom:heightPercentageToDP(2)
                                        ,height:heightPercentageToDP(4),justifyContent:'center',alignSelf:'center',color:Colors.whiteColor}}><Text style={styles.contentButton}>{i18n.t('tierbenefits').toUpperCase()}</Text></TouchableOpacity>
                                        </View>
                                        
                                    }
                                    {benefit==undefined&&(showUsed||showTiers)&&<>
                                        <TouchableOpacity onPress={()=>{
                                            setShowUsed(false);
                                            setShowTiers(false);
                                        }}
                                        style={styles.closeIcon}>
                                        <TabBarIcon
                                        style={{alignSelf:'center'}}
                                        width={widthPercentageToDP(8)}
                                        height={widthPercentageToDP(8)}
                                        focused={true}
                                        name={'close'}/>
                                        </TouchableOpacity>
                                        {UiElements.drawGap(20)}</>
                                    }
                                    {
                                        benefit!=undefined&&benefit.IsRedeemable&&!useit&&<><TouchableOpacity onPress={()=>{
                                            setuseItPop(true);
                                        }} style={{backgroundColor:Colors.blueColor,borderRadius:widthPercentageToDP(5),paddingHorizontal:widthPercentageToDP(5),position:'absolute',bottom:heightPercentageToDP(6.5)
                                        ,height:heightPercentageToDP(4),justifyContent:'center',alignSelf:'center'}}><Text style={styles.contentButton}>{i18n.t('useit').toUpperCase()}</Text></TouchableOpacity>
                                        {UiElements.drawGap(heightPercentageToDP(1))}
                                        </>}
                                        {
                                            benefit!=undefined&&<>
                                            <TouchableOpacity onPress={()=>{
                                                if(finalPage!=undefined)
                                                {
                                                    showFinalPage(undefined);
                                                    setShowUsed(false);
                                                    setbenefit(undefined);
                                                }
                                                if(!useit)
                                                {
                                                    setbenefit(undefined);
                                                }
                                                setuseIt(false);
                                            }}
                                            style={styles.closeIcon}>
                                            <TabBarIcon
                                            style={{alignSelf:'center'}}
                                            width={widthPercentageToDP(8)}
                                            height={widthPercentageToDP(8)}
                                            focused={true}
                                            name={'close'}/>
                                            </TouchableOpacity>
                                            </>
                                        }
                                        
                                        </View>
                                        )
                                    }
                                    const OnVerifyDone=(_param,_stateIn)=>{
                                        // console.log('OnVerifyDone'+_stateIn)
                                        setuseIt(_stateIn);
                                        setuseItPop(false);
                                    }
                                    
                                    return(
                                        <View style={{flex:1,backgroundColor:Colors.bgColor}}>
                                        <BackgroundWall/>
                                        <SafeAreaView style={{marginTop:StatusBar.currentHeight}}>
                                        <TouchableOpacity style={{marginTop:heightPercentageToDP(1),marginRight:20,marginLeft:20}} onPress={()=>{navigation.goBack()}}>
                                        <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                                        </TouchableOpacity>
                                        {UiElements.drawGap(heightPercentageToDP(1))}
                                        <CardTopBar selected={0} navigation={navigation} assignProfile={assignProfile} isLoading={isLoading} redeem={redeem} redeemPoint={redeemPoint} redeemProfile={redeemProfile}/>
                                        </SafeAreaView>
                                        {UiElements.drawGap(heightPercentageToDP(2))}
                                        {getBenefitPage()}
                                        {useitpop&&(<PopUpModal title={i18n.t('areyousuretobenefit')+
                                        (i18n.t('questionmark'))} onDone={OnVerifyDone}/>)}
                                        {Loading&&<OverlayLoad size='small' color={Colors.whiteColor} isopen={Loading} />}
                                        </View>
                                        );
                                    }
                                    