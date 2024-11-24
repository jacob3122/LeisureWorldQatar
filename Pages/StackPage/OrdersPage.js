import React, { Component, useEffect, useState } from 'react'
import {TouchableOpacity,Image,SafeAreaView, TouchableWithoutFeedback,View,Text,StyleSheet, RefreshControl, ScrollView, Modal, StatusBar} from 'react-native'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import Colors from '../../Tools/constants/Colors';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'
import backButton from '../../assets/Icons/back.png'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { PureComponent } from 'react';
import moment from'moment'
import * as Tools from '../../Tools/Components/Tools'

// import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';
// import * as Tools from '../../Tools/Components/Tools'
import itemsButton from '../../assets/Icons/items.png'
import WebServices from '../../Tools/constants/WebServices';
import { useTheme } from '../../Tools/context/ThemeProvider';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import QRCode from 'react-native-qrcode-svg';

export default function OrdersPage(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [showOrder, setShowOrder] = useState(false);
    const [selectedItem, setSelectedItem] = useState(0);
    const [loaded, setLoaded] = useState(1);
    const [accessToken,setAccessToken] = useState(state.accessToken);
    const [profile,setProfile] = useState(state.profile);
    const [refreshing, setRefreshing] = useState(false);
    const [orderObjs, setOrderObjs] = useState([]);
    const [orderObj, setOrderObj] = useState({});
    const [isLoading,setIsLoading]=useState(false);
    useEffect(()=>{
        onDataLoad();
        fetchOrders();
        logScreenViewEvent("OrdersPage","Orders");
    },[])
    
    const onDataLoad=()=>{
        setLoaded(1);
    }
    const refreshControl=()=>{
        return (
            <RefreshControl
            tintColor={Colors.orangeShadeColor}
            refreshing={refreshing}
            onRefresh={()=>refreshListView()} />
            )
        }
        const refreshListView=()=>{
            setRefreshing(false);
            fetchOrders();
        }
        const fetchOrder=(_pnr)=>{
            updateLoad(true);
            
            var orders=WebServices.getOrder.replace("{MemberID}",accessToken.MemberID).replace("{PNR}",_pnr)
            fetch (WebServices.MainURL+orders,{
                method: 'GET',
                headers: {
                    'Authorization':'Bearer '+accessToken.access_token,
                    'Content-Type': 'application/json',
                },
            },5000)
            .then((response) => response.text())
            .then((responseJson) => {
                updateLoad(false);
                // console.log("Order"+responseJson)
                var responseObj=JSON.parse(responseJson);
                setOrderObj(responseObj);
                setShowOrder(true);
            }).catch((error) =>{
                console.log(error)
                updateLoad(false);
            });
        }
        const fetchOrders=()=>{
            var loading=props.updateLoading;
            loading(true);
            var orders=WebServices.getOrders.replace("{MemberID}",accessToken.MemberID)
            fetch (WebServices.MainURL+orders,{
                method: 'GET',
                headers: {
                    'Authorization':'Bearer '+accessToken.access_token,
                    'Content-Type': 'application/json',
                },
            },5000)
            .then((response) => response.text())
            .then((responseJson) => {
                loading(false);
                console.log(responseJson)
                var responseObj=JSON.parse(responseJson);
                if(Tools.stringIsEmpty(responseObj.Error)){
                    setOrderObjs(responseObj.Orders);
                }else{
                    loading(false);
                }
                
            }).catch((error) =>{
                console.log(error)
                loading(false);
            });
        }
        const getItems=(_order)=>{
            for(var t=0;t<_order.length;t++){
            }
        }
        const updateLoad=(_state)=>{
            var loading=props.updateLoading;
            loading(_state);
            setIsLoading(_state);
        }
        const getOrders=()=>{
            order=[];
            if(orderObjs!==undefined){
                for(var t=0;t<orderObjs.length;t++){
                    const dataIn=orderObjs[t];
                    order.push(
                        <TouchableOpacity style={{backgroundColor:Colors.whiteColor,borderRadius:15,padding:15,paddingTop:5,marginTop:15,width:'100%'}}
                        onPress={()=>{
                            const _t=t;
                            const _dataIn=dataIn.SaleCode;
                            fetchOrder(_dataIn)
                        }}>
                        <View style={{flexDirection:'row'}}>
                        <Image style={{width:heightPercentageToDP(6),height:heightPercentageToDP(6),alignSelf:'center'}} source={itemsButton}/>
                        <View style={{flex:1,alignSelf:'center'}}>
                        <Text allowFontScaling={false} style={[styles.title]}>{i18n.t('orderno')+"  "+orderObjs[t].SaleCode}</Text>
                        
                        {/* {getItems(orderObjs[t])} */}
                        </View>
                        </View>
                        <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('date')}</Text>
                        <Text allowFontScaling={false} style={styles.subtitle}>{moment(orderObjs[t].TransactionDateTime).format('DD-MM-YYYY hh:mm a')}</Text></View>
                        <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('totalamount')}</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{orderObjs[t].TotalAmount} QAR</Text></View>
                        <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('totalitems')}</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{orderObjs[t].ItemCount}</Text></View>
                        </TouchableOpacity>
                        )
                    }
                }
                return order;
            }
            const getAllOrderItems=()=>{
                order=[]
                if(!Tools.stringIsEmpty(orderObj.ItemList)){
                    for(let t=0;t<orderObj.ItemList.length;t++){
                        var currenItem=orderObj.ItemList[t];
                        order.push(<View style={{borderBottomColor:Colors.black,borderBottomWidth:2,marginTop:'1%',marginBottom:'1%'}}>
                        <Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',fontSize:widthPercentageToDP('4%'),alignSelf:'flex-end'}]}>{"Item "+(t+1)}</Text>
                        <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('productid')}</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{currenItem.ProductCode}</Text></View>
                        <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('productname')}</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{currenItem.ProductName}</Text></View>
                        <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('quantity')}</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{currenItem.Quantity}</Text></View>
                        <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('amount')}</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{currenItem.TotalAmount}</Text></View>
                        </View>)
                    }
                }
                return order;
            }
            
            const styles = StyleSheet.create({
                subtitle:{
                    color:Colors.black,
                    fontFamily:'Cairo-Regular',
                    fontSize:widthPercentageToDP(3.5),
                },
                title:{
                    color:Colors.black,
                    fontFamily:'Cairo-Bold',
                    fontSize:widthPercentageToDP(5),
                },
                tagline:{
                    color:Colors.black,
                    fontFamily:'Cairo-Bold',
                    // fontFamily:'Cairo-Bold',
                    fontSize:widthPercentageToDP(7),
                },
                homeView: {
                    flex: 1,
                },
                homeScrollView: {
                    width:'100%',
                    alignItems:'center',
                    justifyContent:'center',
                    alignSelf:'center',
                    paddingBottom:'35%'
                },storedesc:{
                    color:Colors.inputfontColor,
                    width:'100%',
                    textAlign:'left',
                    fontFamily:'Cairo-Regular',
                    fontSize:widthPercentageToDP(4),
                    lineHeight:widthPercentageToDP(4)*1.5,
                    flexWrap:'wrap',
                    alignSelf:'center',
                }
            });
            const getPointData=()=>{
                let ItemIn=-1;
                let returnData=[];
                if(orderObj.PaymentList.length>1){
                    for (let index = 0; index < orderObj.PaymentList.length; index++) {
                        const element = orderObj.PaymentList[index];
                        if(Tools.stringIsContains(element.PaymentDesc,WebServices.tejory))
                        returnData.push(<View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('card')}</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{element.PaymentAmount} {i18n.t('points')}</Text></View>);
                        else{
                            returnData.push(<View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('amount')}</Text>
                            <Text allowFontScaling={false} style={[styles.subtitle]}>{element.PaymentAmount} QAR</Text></View>);
                        }
                    }
                }
                return returnData;
            }
            return (
                <View style={{flex:1,backgroundColor:Colors.bgColor}}>  
                <BackgroundWall/>
                <SafeAreaView style={{width:'93%',height:'100%',alignSelf:'center',marginTop:StatusBar.currentHeight}}>
                <TouchableOpacity style={{}} onPress={()=>{
                    setLoaded(0);
                    props.navigation.goBack()
                }}>
                <Image style={{tintColor:Colors.blueColor,width:25,height:25,marginTop:heightPercentageToDP(1),transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                </TouchableOpacity>
                <Text allowFontScaling={false} style={styles.tagline}>
                {i18n.t('myorders')}
                </Text>
                <ScrollView 
                contentContainerStyle={styles.homeScrollView}
                style={styles.homeView}
                showsVerticalScrollIndicator = {false}
                refreshControl={refreshControl()}>
                <Text allowFontScaling={false} style={[styles.storedesc,{paddingTop:'2%'}]}>{i18n.t("orderdesc")}</Text>
                {getOrders()}
                </ScrollView>
                </SafeAreaView>
                {showOrder&&
                    <Modal transparent={true}>
                    <View style={{width:'100%',height:'100%',justifyContent:'center'}}>
                    <BackgroundWall blur opacity={0.8}/>
                    <View style={{width:'100%',height:'100%',justifyContent:'center'}}>
                    <View style={{width:'80%',maxHeight:'80%',borderRadius:15,backgroundColor:Colors.whiteColor,alignSelf:'center',padding:'5%',paddingTop:'2%',paddingBottom:'2%'}}>
                    
                    <View style={{width:'100%',marginTop:heightPercentageToDP(1),justifyContent:'center',alignItems:'center'}}>
                                    <QRCode value={orderObj.SaleCode}
                                    
                                     size={widthPercentageToDP(40)}
        
                                     color={Colors.black}
                                     backgroundColor={Colors.backgroudColor}/></View>
                    <View style={{flexDirection:'row'}}>
                    <Image style={{width:heightPercentageToDP(6),height:heightPercentageToDP(6),alignSelf:'center'}} source={itemsButton}/>
                    <View style={{flex:1,alignSelf:'center'}}>
                    <Text allowFontScaling={false} style={[styles.title]}>{i18n.t('orderno')+"  "+orderObj.SaleCode}</Text>
                    
                    </View>
                    </View>

                    
                    <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('date')}</Text>
                    <Text allowFontScaling={false} style={styles.subtitle}>{moment(orderObj.TransactionDateTime).format('DD-MM-YYYY hh:mm a')}</Text></View>
                    {getPointData()}
                    <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('totalamount')}</Text>
                    <Text allowFontScaling={false} style={[styles.subtitle]}>{orderObj.TotalAmount} QAR</Text></View>
                    <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('totalitems')}</Text>
                    <Text allowFontScaling={false} style={[styles.subtitle]}>{orderObj.ItemCount}</Text></View>
                    <ScrollView style={{maxHeight:'100%'}} >
                    {getAllOrderItems()}
                    </ScrollView>
                    <TouchableOpacity style={{marginTop:'2%',height:40,marginBottom:heightPercentageToDP(1),
                    borderRadius:widthPercentageToDP(6),justifyContent:'center',width:widthPercentageToDP(35),paddingLeft:'1%',paddingRight:'1%',alignSelf:'center',
                    backgroundColor:Colors.blueColor}}
                    onPress={()=>{
                        setShowOrder(false);
                    }}>
                    <Text style={{fontSize:widthPercentageToDP(4),fontFamily:'Cairo-Regular',color:Colors.black,textAlign:'center',alignSelf:'center'}}>{i18n.t('close')}</Text></TouchableOpacity>
                    </View></View>
                    </View>
                    </Modal>
                }
                </View>
                )
            }
            