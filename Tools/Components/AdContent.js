import React, { Component, useEffect } from 'react';
import  { View,Text,StyleSheet,Dimensions,TextInput, TouchableOpacity,Linking,Image,ScrollView, SafeAreaView } from 'react-native';
import * as UiElements from './UIElements';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import FastImage from 'react-native-fast-image'
// import Gradient from 'react-native-css-gradient';
import Colors from '../constants/Colors';
import {SliderBox} from 'react-native-image-slider-box';
import Video from 'react-native-video';
import * as Tools from '../../Tools/Components/Tools.js'
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import TopBackBar from './TopBackBar';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import AppText from './AppText';
import RenderHtml,{RenderHTML, defaultSystemFonts}from 'react-native-render-html';
import WebView from 'react-native-webview';
import { useTheme } from '../context/ThemeProvider';
import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const systemFonts = [...defaultSystemFonts, 'Cairo-Regular']

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default function AdContent(props){
    const Colors =useTheme();
    const insets = useSafeAreaInsets();
    useEffect(()=>{
        i18n.locale=global.locale;
    },[global.locale])

    return <AdContentC {...props} locale={i18n.locale} insets={insets} Colors={Colors}/>
}

class AdContentC extends Component {
    // static navigationOptions = ({navigation}) => {
    //     return{
    //         header:null,
    //     };
    // };
    constructor(props){
        super(props);
        this.state={
            isloading:true,
            Bheight:300,imagesin:0,calcImgHeight:0,calcVideoHeight:0,url:this.props.route.params.url
        }
    }
    
    Bwidth='100%';
    Bheight=300;
    onloadEnd(){
        
    }
    componentDidMount(){
        // const DataInfo=Tools.stringIsEmpty(this.props.route.params.info)?{}:JSON.parse(this.props.route.params.info);
        // console.log(DataInfo.Banner.BannerVideo)
        
    }
    
    checkLoading(elements){
        const {Colors}=this.props;

        return(<View style={{flex:1,backgroundColor:Colors.bgColor}} >
            {elements}
            {this.state.isLoading&&<OverlayLoad size='small' color={Colors.whiteColor} isopen={this.state.isLoading} onDismiss={this.onloadEnd} />}
            </View>);
        }
        
        onImageIn=(evt)=>{
            this.setState({imagesin:(this.state.imagesin+1)},()=>{
                if(this.state.imagesin>=2){
                    this.setState({isloading:false});
                }
            });
            this.setState({
                calcImgHeight:
                evt.nativeEvent.height / evt.nativeEvent.width// By this, you keep the image ratio
            })
        }
        render() {
            const {Colors,insets}=this.props;

            const DataInfo=Tools.stringIsEmpty(this.props.route.params.info)?{}:JSON.parse(this.props.route.params.info);
            return (
                this.checkLoading(
                    <SafeAreaView style={{marginTop:StatusBar.currentHeight}}>
                    <TopBackBar navigation= {this.props.navigation}/>
                    {!Tools.stringIsEmpty(this.state.url)&&
                        <View style={{width:'100%',
                        height:heightPercentageToDP(89)-(insets.bottom+insets.top)
                    }}>
                    <WebView
                    style={{}}
                    source={{uri:this.state.url}}
                    /></View>}
                    {!Tools.stringIsEmpty(this.props.route.params.info)&&<ScrollView
                        showsVerticalScrollIndicator = {false}>
                        {(Tools.stringIsEmpty(DataInfo.Banner.BannerSlider)&&Tools.stringIsEmpty(DataInfo.Banner.BannerVideo))&&
                            <FastImage
                            onLoad={this.onImageIn}
                            style={[styles.banner,{width:widthPercentageToDP(100),height:this.state.calcImgHeight*widthPercentageToDP(100)}]}
                            source={{
                                uri: DataInfo.Banner.MainBannerImgURL,
                                // headers: { Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                            />
                        }
                        {!Tools.stringIsEmpty(DataInfo.Banner.BannerSlider)&&
                            <View 
                            style={[styles.banner,{width:widthPercentageToDP(100),flex:1}]} 
                            ><SliderBox
                            dotColor={Colors.blueColor}
                            firstItem={0}
                            autoplay={false}
                            key={"sb"}
                            parentWidth={widthPercentageToDP(100)}
                            // circleLoop ={Banners.length>1?true:false}
                            // autoplay={Banners.length>1?true:false}
                            activeOpacity={0.5}
                            images={DataInfo.Banner.BannerSlider}/></View>}
                            {!Tools.stringIsEmpty(DataInfo.Banner.BannerVideo)&&
                                <Video 
                                // onLoadStart={()=>{
                                //     // console.log("V :");

                                // }}
                                repeat
                                playWhenInactive
                                playInBackground
                                source={{uri:DataInfo.Banner.BannerVideo , type: 'mp4'}}   // Can be a URL or a local file.
                                onLoad={({ naturalSize }) => {
                                    // console.log("V :"+naturalSize.width +" / "+naturalSize.height);
                                    this.setState({
                                        calcImgHeight:(naturalSize.height / naturalSize.width)
                                    })  
                                }}
                                ref={(ref) => {
                                    this.player = ref
                                }}                                      // Store reference
                                // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                // onError={this.videoError}               // Callback when video cannot be loaded
                                style={[styles.banner,{width:widthPercentageToDP(100),height:this.state.calcImgHeight*widthPercentageToDP(100)}]} />}
                                <View style={styles.roundedView}>
                                <AppText type="h1">{DataInfo.Title}</AppText>
                                <AppText type="h2">
                                {DataInfo.SubTitle}
                                </AppText>
                                <AppText type="p">
                                {DataInfo.ShortDescription}
                                </AppText>
                                <RenderHTML
                                defaultTextProps={{allowFontScaling:false}}
                                baseStyle={{
                                    textAlign:'left',fontFamily:'Cairo-Regular',
                                    fontSize:widthPercentageToDP(3.5),
                                    lineHeight:widthPercentageToDP(5.5),
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
                                            fontSize:widthPercentageToDP(3.5)
                                            ,lineHeight:widthPercentageToDP(5.5),
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
                                    source={{ html: "<p>"+(this.props.locale=='ar'?DataInfo.FullDescription:DataInfo.FullDescription
                                    )+"</p>"}}
                                    />   
                                    {UiElements.drawGap(50)}
                                    
                                    </View>
                                    </ScrollView>}
                                    
                                    </SafeAreaView>)
                                    )
                                }
                                
                                reDirect(url){
                                    Linking.openURL(url);
                                }
                                
                                closeStack = () =>{
                                    {
                                        this.props.navigation.goBack();
                                    }
                                }
                            }
                            
                            
                            
                            const styles = StyleSheet.create({
                                buttonSign:{
                                    // flex:1,
                                    width:width/1.25,
                                    height:60,
                                    alignSelf:'center',
                                    alignItems:'center',
                                    backgroundColor:'grey',
                                    borderRadius:10,
                                    justifyContent:'center'
                                },
                                buttontext:{
                                    fontSize:20,
                                    color:'white'
                                },
                                logo:{
                                    alignSelf:'center',
                                    width:300,
                                    height:100,
                                    resizeMode:'contain'
                                },
                                banner: {
                                    alignSelf:'center',
                                },heading:{
                                    fontFamily:'Cairo-Bold',
                                    fontSize:30,
                                    textAlign:'left'
                                },duration:{
                                    fontSize:20,
                                    fontWeight:'600',
                                    textAlign:'left'
                                },details:{
                                    fontSize:20,
                                    fontWeight:'300',
                                    textAlign:'justify',
                                    color:Colors.darkfontColor
                                },
                                roundedView:{
                                    padding:widthPercentageToDP(3),
                                    borderRadius:10,
                                    width:'100%',
                                    // height:'100%',
                                },
                                rowView:{
                                    paddingLeft:width/2.5,
                                    flexDirection:'row',
                                    alignContent:'center',
                                    alignItems:'center',
                                },
                                homeView: {
                                    flex:1,
                                    // alignItems:'center',
                                },
                                controlBar:{
                                    paddingTop:40,
                                    zIndex:1,
                                    width:width,
                                },cancelB:{
                                    padding:10,
                                    color:'white',
                                    fontSize:20,
                                    fontWeight:'300',
                                    alignSelf:'flex-end'
                                }
                            });