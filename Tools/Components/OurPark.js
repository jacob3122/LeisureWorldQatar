import React, { Component } from 'react'
import  { Linking,ScrollView,View,Text,StyleSheet,TouchableOpacity,Dimensions,Image,PixelRatio } from 'react-native'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import Colors from '../constants/Colors';
import cardbg from '../../assets/card/cardde.png';

// import cardbg from '../../assets/cardbg.png';
// import cardbg1 from '../../assets/cardbg1.png';
import nextbut from '../../assets/Icons/back.png';
import prevbut from '../../assets/Icons/front.png';
import * as UIElements from './UIElements'
import {connect} from 'react-redux';


import FastImage from '@d11/react-native-fast-image'
import AboutPark from './AboutPark';
import * as Tools from './Tools';

// import ProfileData from './ProfileData';
import WebServices from '../../Tools/constants/WebServices';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

import {SliderBox} from 'react-native-image-slider-box';

class OurPark extends Component {
    loaded=0;
    
    constructor(props){
        super(props);
        this.state={
            locale:'',
            showModal:false,
            parkCode:{},
            data:undefined,loading:true,loadData:false,
            scroll:["https://www.leisure.qa/assets/images/abw.jpg",
            "https://www.leisure.qa/assets/images/abw1.jpg",
            "https://www.leisure.qa/assets/images/abw2.jpg"]
            
        }
        this.OnVerifyDone=this.OnVerifyDone.bind(this);
        this.showParkDetails=this.showParkDetails.bind(this);
    }
    
    componentDidMount(){
        this.getParkData();
    }
    
    static getDerivedStateFromProps(props, cstate) {
        if(props.isConnected===true){
            return{
                loadData:props.isConnected}
            }
            return null;
        }
        getParkData(){
            this.loaded=1;
            return fetch(WebServices.MainURL+ WebServices.parkData.replace('{Localize}',Tools.stringIsContains(i18n.locale,'ar')?'ar':'en'))//+"?rand="+ Math.floor(Math.random() * 100000) + 1,)
            .then(response  => response.text())
            .then((findresponse)=>{
                // console.log(findresponse);
                var json = JSON.parse(findresponse).parkdetails;
                this.setState({
                    data:json,loading:false
                },()=>{
                })
                this.loaded=0;
                
            }).catch(function(error) {
                this.loaded=2;
                this.setState({
                    data:undefined,loading:false
                });
            });
        }
        
        drawGap=(valueGap)=>{
            return(
                <View
                style={{paddingTop:valueGap}}/>
                );
            }
            
            
            _renderItem (item, index) {
                return (
                    <View key={"vv1"+index} style={{
                        width:wp('70%'),flexDirection:'column'}}>
                        <View key={"vv2"+index} style={styles.bottompart}>
                        
                        <SliderBox
                        key={"sb"+index}
                        parentWidth={wp('70%')}
                        circleLoop ={item.scroll.length>1?true:false}
                        autoplay={item.scroll.length>1?true:false}
                        activeOpacity={0.5}
                        images={item.scroll}/>
                        
                        </View>
                        <Image key={"im"+index} source={cardbg} style={[styles.bgcard,{transform: [
                            { scaleX: Tools.stringIsContains(i18n.locale,'ar')? -1:1 }
                        ],}]}/>
                        
                        </View>
                        );
                    }
                    reDirect(url){
                        Linking.openURL(url);
                    }
                    showallvenues(){
                        alllines=[];
                        if(this.state.data!==undefined&&this.state.data!==undefined){
                            this.state.data.map((item,index)=>{
                                if(index<100){alllines.push(
                                    <View key={"v1"+index} style={{paddingLeft:wp('12.5%')}}>
                                    <View key={"v2"+index} style={styles.totalView}>
                                    <ScrollView
                                    horizontal={false}
                                    showsVerticalScrollIndicator = {false}
                                    key={"sv1"+index} 
                                    >
                                    {this._renderItem(item,index)}
                                    <TouchableOpacity key={"to"+index} style={styles.buttonB}
                                    onPress={()=>{
                                        this.showParkDetails(item);
                                    }}>
                                    
                                    <FastImage
                                    key={"fi"+index} 
                                    style={styles.imagelogo}
                                    source={{
                                        uri: item.logo,
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                    />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                    key={"to1"+index}style={styles.buttonBInfo}
                                    onPress={()=>{this.reDirect(item.website)}}>
                                    <Text key={"t1"+index} allowFontScaling={false} numberOfLines={1} style={[styles.itemTxt]}>{i18n.t('readmore')}</Text>
                                    </TouchableOpacity>
                                    {UIElements.drawGap((80))}
                                    <View key={"v1"+index}
                                    style={{ backgroundColor:Colors.whiteColor,opacity:0.9,borderRadius:15,alignSelf:'center',width:wp('60%')}}>
                                    <Text allowFontScaling={false} style={[styles.detailsTxt]}>{item.details}</Text>
                                    </View>
                                    </ScrollView>
                                    </View></View>)}});
                                }
                                return alllines;
                            }
                            
                            checkLoading(){
                                return(
                                    (!this.state.loading)&&this.showallvenues())
                                }
                                
                                render() {
                                    return (
                                        this.checkLoading()
                                        )
                                    }
                                    OnVerifyDone(){
                                        this.setState({showModal:false});
                                    }
                                    showParkDetails(pData){
                                        // console.info(pData);
                                        this.setState({parkCode:pData, showModal:true});
                                    }
                                    
                                }
                                const mapStateToProps = state=>{
                                    return {
                                        isConnected:state.profileReducer.isConnected,
                                    }                
                                };
                                
                                const mapDispatchToProps = (dispatch) => {
                                    return{
                                    };
                                }
                                
                                export default connect(
                                    mapStateToProps,
                                    mapDispatchToProps
                                    )(OurPark)
                                    
                                    const styles = StyleSheet.create({
                                        
                                        bottompart:{
                                            // position:'absolute',
                                            backgroundColor:Colors.orangeColor,
                                            width:wp('70%'),
                                            height:wp('55%'),
                                            top:0,
                                            left:0,
                                            // borderRadius:30,
                                            overflow:'hidden'
                                        },
                                        totalView:{
                                            overflow:'hidden',
                                            alignSelf:'center',
                                            justifyContent:'center',
                                            height:'98.5%',
                                            width:wp('70%'),
                                            borderRadius:30,
                                            backgroundColor:Colors.whiteColor
                                        },
                                        nextprev:{
                                            margin:5,
                                            width:20,height:20,marginTop:(hp('19%')/2)-15,justifyContent:'center',
                                        },
                                        imagescroll:{
                                            width:wp('70%'),
                                            height:'100%',
                                            resizeMode:'contain',
                                            overflow:'hidden',
                                            // borderRadius: 10,
                                        },
                                        imagelogo:{
                                            // bottom:15,
                                            width:hp('16%'),
                                            height:hp('18%'),
                                            resizeMode:'contain',
                                            overflow:'visible',
                                        },
                                        rowView:{
                                            // flex: 1, 
                                            flexDirection: 'row',
                                            
                                            // justifyContent:'space-between',
                                        },
                                        scrollView:{
                                            flex:1
                                            // width:hp('43%'),
                                        },
                                        detailsTxt:{
                                            alignSelf:'flex-start',
                                            textAlign:'center',
                                            color:Colors.inputfontColor,
                                            fontWeight:'100',
                                            fontFamily:'Cairo-Regular',
                                            fontSize: hp('2%'),
                                            lineHeight: hp('2%')*1.4,
                                            // lineHeight:AdaptiveWidth(24),
                                            padding:15,
                                        },
                                        itemTxt:{
                                            textAlign:'center',
                                            textTransform:'uppercase',
                                            fontWeight:'100',
                                            fontFamily:'Cairo-Regular',
                                            fontSize: 13,
                                            color:Colors.orangeColor,
                                            // lineHeight:AdaptiveWidth(24),
                                        },
                                        bgcard:{
                                            position:'absolute',
                                            resizeMode:'contain',
                                            alignSelf:'center',
                                            // aspectRatio:1417/895,
                                            // width:wp('99%'),
                                            width:wp('70%'),
                                            // left:0,
                                            top:(wp('57%')/2)-20,
                                        },
                                        
                                        heading:{
                                            fontSize:hp('4%'),
                                            fontWeight:'300',
                                            // paddingBottom:AdaptiveWidth(40),
                                            color:Colors.darkfontColor,
                                            fontFamily:'Cairo-Regular',
                                            
                                            // fontSize: AdaptiveWidth(12),
                                            // lineHeight: AdaptiveWidth(12)*1.4,
                                            // fontSize: AdaptiveWidth(12)*1.1,
                                            
                                        }
                                        ,buttonB:{
                                            position:'absolute',
                                            top:wp('45%'),
                                            width:hp('18%'),
                                            // height: hp('15%'),
                                            alignItems:'center',
                                            // backgroundColor:'rgba(231,64,32,0.5)',
                                            justifyContent:'center'
                                        } ,buttonBInfo:{
                                            height:35,
                                            backgroundColor:Colors.whiteColor,
                                            position:'absolute',
                                            right:10,
                                            borderWidth:2,
                                            borderColor:Colors.orangeColor,
                                            borderRadius:15,
                                            top:wp('52%'),
                                            width:hp('15%'),
                                            // height: hp('15%'),
                                            alignItems:'center',
                                            // backgroundColor:'rgba(231,64,32,0.5)',
                                            justifyContent:'center'
                                        }
                                    });
                                    