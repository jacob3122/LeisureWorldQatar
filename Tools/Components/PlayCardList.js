import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import React, { Component, useCallback, useReducer } from 'react'
import { PureComponent } from 'react';
import { StyleSheet,Modal, View,Text,Dimensions,Image, TouchableOpacity,TextInput,FlatList,RefreshControl,TouchableWithoutFeedback,ScrollView, SafeAreaView} from 'react-native';
// import Colors from '../constants/Colors';

import SVGbg from'../../assets/bg/Circles-Pattern.svg'

import backButton from '../../assets/Icons/back.png'
import * as tools from '../../Tools/Components/Tools.js';
import GestureFlipView from 'react-native-gesture-flip-card';
import cameraIcon from '../../assets/Icons/camera.png'

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import proceedB from '../../assets/Icons/back.png'
// import Barcode from 'react-native-barcode-builder';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import OverlayLoad from './OverlayLoad';
import WebServices from '../constants/WebServices';
import FastImage from 'react-native-fast-image'
import { Alert } from 'react-native';
import BarcodeInput from './BarcodeInput';
import LoadingLine from './LoadingLine';
import { useTheme } from '../context/ThemeProvider';
import BackgroundWall from './BackgroundWall';
import Barcode from './Barcode.js';

export default function (props){
    const Colors =useTheme();
    useEffect(()=>{
        i18n.locale=global.locale;
    },[global.locale])

    return <PlayCardList {...props} locale={i18n.locale} Colors={Colors}/>
}

class PlayCardList extends Component {
    _isMounted=false;
    cardsViewRef=React.createRef();
    styles=undefined;
    constructor (props){
        super(props);
        
        this.state={
            currentIndex:-1,
            isLoading:this.props.isLoading,
            cameraView:0,
            card:{
                verify:false,
                CardNo:"0000000000*000"
            },
            canclose:0,
            valuesText:[],
            isVisible:this.props.isopen,
            
        }
        
        this.updateInput=this.updateInput.bind(this)
    }
    componentDidUpdate(prevProps,prevState){
        if(this.props.isLoading!=prevProps.isLoading){
            this.setState({isLoading:this.props.isLoading})
        }
    }
    
    componentDidMount(){
        this._isMounted=true;
        setTimeout(() => {
            var findcard=this.props.findPlayCard;
            findcard();
        }, 100);
        var times=0;
        for (let index = 0; index < this.props.unregcardLists.length; index++) {
            if(this.checkCard(this.props.unregcardLists[index],this.props.cardLists))
            {
                times+=1;
            }
            var val=this.state.valuesText;
            val.push("");
            this.setState({valuesText:val})
        }
        if(times>0&&times==this.props.unregcardLists.length){
            this.setState({showNoItems:true})
        }else{
            this.setState({showNoItems:false})
        }
    }
    componentWillUnmount(){
        this._isMounted=false;
    }
    
    getColor(_parkType){
        const {Colors}=this.props;

        if(_parkType=="Angry Birds World"){
            return Colors.abColor
        }
        else if(_parkType=="Virtuocity"){
            return Colors.vcColor
        }
        else if(_parkType=="Snow Dunes"){
            return Colors.sdColor
        }else{
            return Colors.bgColor
        }
    }
    getbgImage(_parkType){
        if(_parkType=="Angry Birds World"){
            return WebServices.abcard
        }
        else if(_parkType=="Virtuocity"){
            return WebServices.vccard
        }
        else if(_parkType=="Snow Dunes"){
            return WebServices.sdcard
        }
        
        return WebServices.generalcard
    }
    replaceStringtoX(_string){
        var xstring=''
        for (let index = 0; index < _string.length; index++) {
            xstring+='X'
        }
        return xstring;
    }
    
    getCardNo(_card){
        var _cardNo=(_card.CardNo)
        return _cardNo;
        
    }
    renderBack(card){
        const {Colors}=this.props;

        return(
            <View style={{justifyContent:'center',borderRadius:20,overflow:'hidden'
            ,alignSelf:'center',width:widthPercentageToDP(79),height:heightPercentageToDP(25), backgroundColor:this.getColor(card.Location)}}>
            {!card.verify&&<View style={{width:'100%',height:'100%',justifyContent:'center'}}>
            {/* <CacheImage
            style={{position:'absolute',width:'102%',height:'102%'}}
            uri={WebServices.generalcard}
        />  */}
        
        <FastImage
        style={{position:'absolute',width:'102%',height:'102%'}}
        source={{
            uri: WebServices.generalcard,
            // headers: { Authorization: 'someAuthToken' },
            priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
        />
        <TouchableOpacity style={{width:'35%',alignSelf:'center',justifyContent:'center',backgroundColor:Colors.whiteColor,borderRadius:10,borderWidth:2,borderRadius:20,borderColor:Colors.orangeColor,height:'20%'}}
        onPress={()=>{
            this.cardsViewRef.current.flipRight();  // counterclockwise
        }}>
        
        <Text allowFontScaling={false} style={this.styles.buttonTxt}>{i18n.t('add')}</Text>
        </TouchableOpacity>
        <View style={{ position:'absolute',
        bottom:'2%',width:'100%'}}>
        </View>
        </View>}
        {
            card.verify&&
            <View style={{width:'100%',height:'100%',justifyContent:'center'}}>
            <View style={{position:'absolute',top:'5%',right:'5%',backgroundColor:Colors.whiteColor,borderRadius:15,overflow:'hidden'}}>
            <Barcode value={card.CardNo} 
            width={widthPercentageToDP('.5%')} height={heightPercentageToDP('4%')}
            format="CODE128" />
            <Text allowFontScaling={false} style={[this.styles.cardno,{fontSize:14,marginTop:-12,color:Colors.black}]}>{card.CardNo}</Text>
            </View>
            
            </View>
            
        }
        
        
        </View>
        );
    }
    
    
    renderFront(card){
        const {Colors}=this.props;

        return(
            <View style={{justifyContent:'center',borderRadius:20,alignContent:'center',alignItems:'center'
            ,alignSelf:'center',width:widthPercentageToDP(79),height:heightPercentageToDP(25), backgroundColor:this.getColor(card.ParkName)}}>
            {card.verify&&<View style={{width:'100%',height:'100%'}}>
            <View style={{flexDirection:'row',flex:1, alignSelf:'center'}}>
            <TouchableOpacity  style={{width:'35%',alignSelf:'center',justifyContent:'center',backgroundColor:Colors.whiteColor,borderRadius:10,height:'20%'}}
            onPress={()=>{
                
            }}>
            <Text allowFontScaling={false} style={this.styles.buttonTxt}>{i18n.t('topup')}</Text>
            </TouchableOpacity>
            </View>
            <View style={{position:'absolute',flexDirection:'row',justifyContent:'center',right:'5%',bottom:'2%',alignItems:'center'}}><Text style={this.styles.balanceTxt}>{i18n.t("yourbalance")}</Text>
            <Text allowFontScaling={false} style={this.styles.balanceVal}>{card.Balance}</Text>
            </View> 
            </View>
        }
        {!card.verify&&
            <View style={{width:'100%',height:'100%',justifyContent:'center'}}>
            {/* <Text style={[styles.balanceVal,{fontSize:20,textAlign:'center',textTransform:'uppercase'}]}>{i18n.t('confirmcard')}</Text> */}
            {/* <View style={{flexDirection:'row',width:'60%',height:'20%',alignSelf:'center'}}> */}
            <TextInput allowFontScaling={false} maxLength={14} placeholder={this.getCardNo(card)} 
            placeholderTextColor={Colors.placeholdertext}
            onChangeText={(textIn)=>{
                this.setState({valueText : textIn })
            }}
            onEndEditing={(textIn)=>{
                this.setState({valueText : textIn.nativeEvent.text})
            }}
            style={{fontFamily:'Cairo-Regular',backgroundColor:Colors.inputfontColor,
            width:'60%',height:'20%',alignSelf:'center',borderRadius:10,padding:5,fontSize:20,
            textAlign:'center'}}/>
            
            <TouchableOpacity 
            style={{marginTop:'5%',backgroundColor:Colors.whiteColor,justifyContent:'center',alignSelf:'center',borderWidth:2,borderRadius:20,borderColor:Colors.orangeColor,height:'20%',paddingLeft:'5%',paddingRight:'2%'}} 
            onPress={()=>{
                var textVal=this.state.valueText;
                // console.log("T :"+textVal);
                if(tools.stringIsContains(this.state.valueText,"*"))
                textVal=this.state.valueText.substring(0,this.state.valueText.indexOf('*'));
                // console.log("T :"+textVal);
                var search=this.props.searchMedia;
                search(textVal,this.props.accessToken);
            }}>
            <View style={{flexDirection:'row'}}>
            <Text allowFontScaling={false} style={[this.styles.buttonTxt]}>{i18n.t('confirmcard')}</Text>
            {/* <Image source={proceedB} style={styles.backbut} ></Image> */}
            </View>
            </TouchableOpacity> 
            {/* </View> */}
            
            {/* <View style={{position:'absolute',flexDirection:'row',justifyContent:'center',right:'5%',bottom:'2%',alignItems:'center'}}>
            <Text style={styles.balanceTxt}>{i18n.t("yourbalance")}</Text>
            <Text style={styles.balanceVal}>{card.Balance}</Text>
        </View>  */}
        </View>
    }
    </View>
    );
}


refreshControlUnReg(){
    const {Colors}=this.props;
    
    return (
        <RefreshControl
        tintColor={Colors.orangeShadeColor}
        refreshing={this.state.refreshingUR}
        onRefresh={()=>this.refreshListViewUnReg()} />
        )
    }
    refreshListViewUnReg(){
        this.setState({refreshingUR:true});
        var findPlayCard=this.props.findPlayCard;
        findPlayCard(null,null,()=>{this.setState({refreshingUR:false})});
    }
    openCamera(){
        this.setState({cameraView:1})
    }
    renderunRegBack(card,index){
        const {Colors}=this.props;

        var _card=card;
        var _index=index;
        return(
            <View style={{justifyContent:'center',borderRadius:20
            ,alignSelf:'center',width:widthPercentageToDP(79),height:(widthPercentageToDP(79)/1.58), backgroundColor:this.getColor(_card.Location)}}>
            
            <View style={{width:'100%',height:'100%',justifyContent:'center'}}>
            {/* <Text style={[styles.balanceVal,{fontSize:20,textAlign:'center',textTransform:'uppercase'}]}>{i18n.t('confirmcard')}</Text> */}
            {/* <View style={{flexDirection:'row',width:'60%',height:'20%',alignSelf:'center'}}> */}
            <View style={{flexDirection:'row',width:'70%',alignSelf:'center'}}>
            <TextInput 
            ref={ref=>{
                if(this.props.unregcardsInputRef[_index]!=undefined){
                    this.props.unregcardsInputRef[_index].current=ref;
                }
            }}
            value={this.state.valuesText[index]}
            allowFontScaling={false} maxLength={14} 
            placeholder={this.props.unregcardNumber[_index]+"*XXX"} 
            placeholderTextColor={Colors.inputfontColor}
            onChangeText={(textIn)=>{
                var val=this.state.valuesText;
                val[index]=textIn;
                this.setState({valueText : textIn,valuesText:val })
            }}
            onEndEditing={(textIn)=>{
                var val=this.state.valuesText;
                val[index]=textIn.nativeEvent.text;
                this.setState({valueText : textIn.nativeEvent.text,valuesText:val })
            }}
            style={[{fontFamily:'Cairo-Regular',backgroundColor:Colors.whiteColor,
            width:'100%',alignSelf:'center',height:heightPercentageToDP(4.75),borderRadius:heightPercentageToDP(4.75),padding:5,fontSize:widthPercentageToDP(4.5),
            textAlign:'center'},this.styles.shadow]}/>
            <TouchableOpacity style={{position:'absolute',alignSelf:'center',end:'5%'}} onPress={()=>{
                this.setState({currentIndex:_index});
                this.openCamera();
            }}><Image style={{tintColor:Colors.blueColor}} source={cameraIcon}/></TouchableOpacity></View>
            <TouchableOpacity 
            style={{marginTop:'5%',backgroundColor:Colors.blueColor,justifyContent:'center',alignSelf:'center',
            borderRadius:heightPercentageToDP(4.75),
            height:heightPercentageToDP(4.75),paddingLeft:'5%',paddingRight:'2%'}} 
            onPress={()=>{
                
                // var textVal=this.state.valueText;
                var textVal=this.state.valuesText[index];

                // if(tools.stringIsContains(this.state.valueText,"*"))
                // textVal=this.state.valueText.substring(0,this.state.valueText.indexOf('*'));
                if(tools.stringIsContains(this.state.valuesText[index],"*"))
                textVal=this.state.valuesText[index].substring(0,this.state.valuesText[index].indexOf('*'));
                
                
                if(!tools.stringIsContains(this.props.unregcardFullNumber[_index],textVal)){
                    Alert.alert(i18n.t("invalidplaycard"))
                    return;
                }
                // console.log("T :"+textVal);
                var register=this.props.checkandRegister;
                register(_index);
                // var done=this.props.onDone;
                // done(false);
            }}>
            <View style={{flexDirection:'row'}}>
            <Text allowFontScaling={false} style={[this.styles.buttonTxt]}>{i18n.t('confirmcard')}</Text>
            {/* <Image source={proceedB} style={styles.backbut} ></Image> */}
            </View>
            </TouchableOpacity> 
            
            </View>
            
            
            
            </View>
            );
        }
        renderunRegFront(card,index){
            const {Colors}=this.props;

            var _card=card;
            var _index=index;
            return(
                <View style={{justifyContent:'center',borderRadius:20,alignContent:'center',alignItems:'center'
                ,alignSelf:'center',width:widthPercentageToDP(79),height:(widthPercentageToDP(79)/1.58), backgroundColor:this.getColor(card.Location)}}>
                {/* <CacheImage
                style={{position:'absolute',width:'100%',height:'100%'}}
                uri={this.getbgImage(card.Location)}
            />   */}
            <FastImage
            style={{position:'absolute',width:'100%',height:'100%'}}
            source={{
                uri: this.getbgImage(card.Location),
                // headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
            />
            <View style={{width:'100%',height:'100%'}}>
            <View style={[{position:'absolute',flex:1, alignSelf:'flex-end',bottom:'4%'},this.props.locale=='ar'?{start:'3%'}:{end:'3%'}]}>
            <Text allowFontScaling={false} style={{fontSize:widthPercentageToDP(3.7),fontFamily:'Cairo-Regular',color:Colors.whiteColor,alignSelf:'flex-start'}}>{i18n.t("playcardNumber")}</Text>
            {/* </View>
        <View style={{position:'absolute',flexDirection:'row',flex:1, alignSelf:'flex-end',bottom:'25%',right:'4%'}}> */}
        <Text allowFontScaling={false} style={{fontSize:widthPercentageToDP(4.5),fontFamily:'Cairo-Regular',color:Colors.whiteColor,alignSelf:'flex-start',marginBottom:'2%'}}>{this.props.unregcardNumber[_index]+"*XXX"}</Text>
        <TouchableOpacity
        style={{marginTop:'1%',backgroundColor:Colors.blueColor,justifyContent:'center',alignSelf:'flex-start',borderRadius:heightPercentageToDP(4.75),height:heightPercentageToDP(4.75),paddingLeft:'7%',paddingRight:'3%'}} 
        onPress={()=>{
            var localIndex=index
            if(this.props.unregcardsViewRef[localIndex]!=undefined){
                this.props.unregcardsViewRef[localIndex].current.flipLeft();  // counterclockwise
            }
        }}><View style={{flexDirection:'row'}}>
        <Text allowFontScaling={false} style={[this.styles.buttonText]}>{i18n.t('verifycard')}</Text>
        {/* <Image source={proceedB} style={styles.backbut} ></Image> */}
        </View>
        </TouchableOpacity> 
        </View>
        
        </View>
        {/* {!card.verify&&
            <View style={{width:'100%',height:'100%',justifyContent:'center'}}>
            <TextInput disabled={index!=this.state.selectedItem}  placeholder={this.getCardNo(card)} 
            onChangeText={(textIn)=>{
                const valueText="Card"+index;
                const newCardNos = { ...this.state.cardNoInput, valueText : textIn };
                this.setState({cardNoInput:newCardNos})
            }}
            onEndEditing={(textIn)=>{
                const valueText="Card"+index;
                const newCardNos = { ...this.state.cardNoInput, valueText : textIn.nativeEvent.text };
                this.setState({cardNoInput:newCardNos})
                this.verifyCardNo(card,textIn.nativeEvent.text)
            }}
            style={{fontFamily:'Cairo-Regular',backgroundColor:Colors.whiteColor,
            width:'60%',height:'20%',alignSelf:'center',borderRadius:10,padding:5,fontSize:20,
            textAlign:'center'}}/>
            <TouchableOpacity disabled={index!=this.state.selectedItem} 
            style={{marginTop:'5%',backgroundColor:Colors.whiteColor,justifyContent:'center',alignSelf:'center',borderWidth:2,borderRadius:20,borderColor:Colors.orangeColor,height:'20%',paddingLeft:'5%',paddingRight:'2%'}} 
            onPress={()=>{
                const valueText="Card"+index;
                this.verifyCardNo(card,this.state.cardNoInput.valueText)
            }}>
            <View style={{flexDirection:'row'}}>
            <Text style={[styles.buttonText]}>{i18n.t('confirmcard')}</Text>
            <Image source={proceedB} style={styles.backbut} ></Image>
            </View>
            </TouchableOpacity> 
            </View>
        } */}
        </View>
        );
    }
    checkCard(_item,_List){
        for (let index = 0; index < _List.length; index++) {
            if(tools.stringIsContains(_item.MediaId,_List[index].MediaId)){
                return true
            }
        }
        return false
    }
    checkCardNumber(_item,_List){
        for (let index = 0; index < _List.length; index++) {
            // console.log(_item+"//"+_List[index].MediaId)
            if(tools.stringIsContains(_item,_List[index].MediaId)){
                return true
            }
        }
        return false
    }
    _renderunRegItem = ({item, index}) => {
        const localItem=item;
        const localIndex=index;
        
        if(this.state.loaded==0){
            return(<></>);
        }
        else{
            
            if(this.checkCard(localItem,this.props.cardLists))
            {
                return(<></>)
            }else{
                return (
                    <TouchableWithoutFeedback onPress={()=>{
                        if(this.props.unregcardsViewRef[localIndex]!=undefined){
                            this.props.unregcardsViewRef[localIndex].current.flipLeft();  // counterclockwise
                        }
                    }}>
                    <View style={{}}>
                    <GestureFlipView
                    key={localIndex}
                    ref={ref=>{
                        if(this.props.unregcardsViewRef[localIndex]!=undefined){
                            this.props.unregcardsViewRef[localIndex].current=ref;
                        }
                    }}
                    // gestureEnabled={true}
                    width={(widthPercentageToDP(79))}
                    height={(widthPercentageToDP(79)/1.58)}
                    >
                    {this.renderunRegFront(localItem,localIndex)}
                    {this.renderunRegBack(localItem,localIndex)}
                    </GestureFlipView>
                    </View>
                    </TouchableWithoutFeedback>
                    )
                    ;
                }
            }
        }
        
        render() {
            const {Colors}=this.props;
            const styles = StyleSheet.create({
                container:{
                    width:'100%',alignItems:'center',flex:1
                },
                nocards:{
                    fontFamily:'Cairo-Regular',
                    textAlign:'center',
                    fontSize: widthPercentageToDP(4.2),
                    // lineHeight:15*1.5,
                    // textTransform:'uppercase'
                },
                buttonText:{
                    fontFamily:'Cairo-Regular',
                    textAlign:'center',
                    color:Colors.whiteColor,
                    fontSize: widthPercentageToDP(4.2),
                    paddingHorizontal:widthPercentageToDP(4)
                    // lineHeight:15*1.5,
                    // textTransform:'uppercase'
                },buttonView:{
                    position:'absolute',
                    bottom:'6%',
                    backgroundColor:Colors.blueColor,height:heightPercentageToDP(4.75),
                    borderRadius:heightPercentageToDP(4.75),alignSelf:'center',
                    justifyContent:'center',paddingLeft:'2%',paddingRight:'2%'
                },
                
                backbut:{
                    tintColor:Colors.orangeShadeColor,
                    alignSelf:'center',
                    width:25,
                    height:25,
                    transform:[{translateX:0}, {rotateZ:'180deg'}],
                    zIndex:10,
                },
                buttonTxt:{
                    paddingHorizontal:widthPercentageToDP(4),
                    alignSelf:'center',
                    // textTransform:'uppercase',
                    fontFamily:'Cairo-Regular',
                    textAlign:'center',
                    fontSize: widthPercentageToDP(4.2),
                    color:Colors.whiteColor
                },
                cardno:{
                    alignSelf:'center',
                    // textTransform:'uppercase',
                    fontFamily:'Cairo-Regular',
                    fontSize: 30,
                    textAlign:'center',
                    color:Colors.whiteColor,
                },
                balanceTxt:{
                    color:Colors.inputfontColor,
                    // paddingTop:15,
                    fontFamily:'Cairo-Bold',
                    // textTransform:'uppercase',
                    fontFamily:'Cairo-Regular',
                    fontSize: 25,
                    textAlignVertical:'center',
                },
                balanceVal:{
                    textAlignVertical:'center',
                    color:Colors.whiteColor,
                    // paddingTop:15,
                    fontWeight:'100',
                    fontFamily:'Cairo-Regular',
                    fontSize: 30,
                    paddingStart:10,
                },
                loading: {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex:10,
                }, tagline:{
                    fontFamily:'Cairo-Bold',
                    // fontFamily:'Cairo-Bold',
                    fontSize:widthPercentageToDP(7),
                    alignSelf:'flex-start',
                    color:Colors.inputfontColor
                    
                },storedesc:{
                    textAlign:'left',
                    fontFamily:'Cairo-Regular',
                    fontSize:widthPercentageToDP(4),
                    lineHeight:widthPercentageToDP(4)*1.5,
                    flexWrap:'wrap',
                    alignSelf:'flex-start',
                    color:Colors.inputfontColor,
                    marginBottom:'5%',
                }, shadow:{
                    shadowOffset: { width: 0, height: 3 },
                    shadowRadius: 3,
                    shadowOpacity: 0.12,
                },
            });

            this.styles=styles;
            return (
                <Modal  statusBarTranslucent={true} animationType='none' visible={this.state.isVisible}>
                 <BackgroundWall/>
                <View style={styles.loading} >
                <SafeAreaView style={{width:widthPercentageToDP(93),alignSelf:'center'}}>
                <TouchableOpacity style={{marginTop:heightPercentageToDP(1)}} onPress={()=>{
                    var ondone=this.props.onDone;
                    ondone();}}>
                    <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                    </TouchableOpacity>
                    <Text allowFontScaling={false} style={[styles.tagline,{}]}>
                    {i18n.t('lockedcards')}
                    </Text>
                    <View style={{height:'82%',justifyContent:"center",alignItems:'center',alignSelf:'center'}}>
                    
                    {((this.state.showNoItems)|| (this.props.unregcardLists.length==0))&&
                        <ScrollView
                        style={{alignSelf:'center',height:'100%',width:widthPercentageToDP(100),alignContent:'center',position:'absolute'}}
                        contentContainerStyle={{justifyContent:'center',alignItems:'center'}}
                        refreshControl={this.refreshControlUnReg()}>
                        <View style={{width:'90%'}}>
                        <Text allowFontScaling={false}  style={styles.storedesc}>{i18n.t("nocardsavailableplayingcards")}</Text>
                        {(!this.state.isLoading&&!this.state.refreshingUR)&&
                        <Text allowFontScaling={false}  style={styles.nocards}>{i18n.t("nocardsavailable")}</Text>
        }</View>
                        {/* <Text allowFontScaling={false}  style={styles.storedesc}>{i18n.t("nocardsavailableplayingcards")}</Text> */}
                        {(this.state.isLoading|| this.state.refreshingUR) &&<LoadingLine loadBar={Colors.orangeShadeColor}/>}
                        
                        </ScrollView>
                    }
                    {(!this.state.showNoItems)&&this.props.loadedUnreg==1&& this.props.unregcardLists.length>0&&
                        <View style={{flex:1,width:widthPercentageToDP(90),alignSelf:'center'}}>
                        <Text allowFontScaling={false}  style={styles.storedesc}>{i18n.t("nocardsavailableplayingcards")}</Text>
                        <Text allowFontScaling={false}  style={styles.storedesc}>{i18n.t("moredetailsplayingcards")}</Text>
                        {(this.state.isLoading|| this.state.refreshingUR) &&<LoadingLine loadBar={Colors.blueColor}/>}
                        
                        <View style={styles.container}>
                        <FlatList
                        removeClippedSubviews={false}
                        // removeClippedSubviews
                        // onViewableItemsChanged={this.onViewableItemsChanged }
                        viewabilityConfig={{
                            itemVisiblePercentThreshold: 50
                        }}
                        ItemSeparatorComponent={()=><View style={{height:20}}></View>}
                        initialNumToRender={5}
                        showsVerticalScrollIndicator={false}
                        refreshControl={this.refreshControlUnReg()}
                        data={this.props.unregcardLists}
                        contentContainerStyle={{paddingTop:'5%',paddingBottom:'15%',justifyContent:'center',alignItems:'center'}}
                        renderItem={this._renderunRegItem}
                        /></View>
                        </View>}
                        </View>
                        </SafeAreaView>
                        {/* <TouchableOpacity style={styles.buttonView}
                        onPress={()=>{
                            var ondone=this.props.onDone;
                            ondone(true);
                        }} >
                        <Text style ={styles.buttonText} allowFontScaling ={false}>{i18n.t('manualaddcards')} </Text></TouchableOpacity> */}
                        </View>
                        {this.state.cameraView==1&&<BarcodeInput visible={this.state.cameraView==1} onDone={this.updateInput}/>}
                        {/* {(this.state.isLoading|| this.state.refreshingUR) &&<OverlayLoad isopen={this.state.isLoading||this.state.refreshingUR}/>} */}
                        </Modal>
                        )
                    }
                    // onViewableItemsChanged = ({ viewableItems, changed }) => {
                    //     console.log("Visible items are", viewableItems);
                    //     console.log("Changed in this iteration", changed);
                    // }
                    updateInput(_output){
                        if(this.state.currentIndex!=-1){//&&this.props.unregcardsInputRef[this.state.currentIndex]!=undefined){
                            // (() => {
                                // this.props.unregcardsInputRef[this.state.currentIndex].current.setNativeProps({ text: "Edited Text" });
                            //   });
                            // this.props.unregcardsInputRef[this.state.currentIndex].current.setNativeProps({ text: _output })
                            var val=this.state.valuesText;
                            val[this.state.currentIndex]=_output;
                            
                            // console.log(val[this.state.currentIndex]+'/');
                            
                            this.setState({valueText :_output,valuesText:val})
                        }
                        this.setState({cameraView:0})
                    }
                }
                