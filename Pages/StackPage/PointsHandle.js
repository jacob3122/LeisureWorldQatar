import React, { Component } from 'react'
import {View,ScrollView,StyleSheet,Text,Slider,TextInput,TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
// import RNPickerSelect from 'react-native-picker-select';
import moment from'moment'
// import Loader from 'react-native-easy-content-loader';
import ButtonGroup from '../../Tools/Components/ButtonGroup';
import * as UiElements from '../../Tools/Components/UIElements'
// import DatePicker from 'react-native-datepicker';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);

import {Dimensions } from "react-native";
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');


export default class PointsHandle extends Component {
    
    
    _myScroll=ScrollView;
    
    constructor(props){
        super(props);
        this.state={
            loading:true,
            selectedPage:0,
            chosenDate:new Date(),
        }
        this.handler = this.handler.bind(this);
    }
  
    handler(someValue) {
        this.setState({selectedPage: someValue});
        this.refs.scrollview.scrollTo({x: someValue*(width-30), y: 0, animated: true});
    }
    
    _contentViewScroll = (e) => {
        const scrolled =(e.nativeEvent.contentOffset.x);
        const position = (scrolled > 0) ? scrolled / width : 0;
        this.setState({selectedPage:Math.round(position)});
    }
            
            setLoadingState(stateP){
                this.setState({loading:stateP});
            }
            
            performActionWithTime(callback,params,timeTaken){
                setTimeout(() => {callback(params)},timeTaken);
            }

            getDate(){
                // return(
                //     <DatePicker
                //     style={{width: 200}}
                //     date={this.state.chosenDate}
                //     showIcon={false}
                //     mode="date"
                //     placeholder={this.props.profile.dob}
                //     format="DD-MM-YYYY"
                //     confirmBtnText="Done"
                //     cancelBtnText="Cancel"
                //     customStyles ={{
                //         dateInput: {
                //             borderWidth:0,
                //         },
                //         btnTextConfirm:{
                //             color:'#0079d4'
                //         },
                //         dateText:{
                //             width:200,
                //             textAlign:'left',
                //             alignSelf:'center',
                //             fontSize: 20,
                //             fontWeight: 'bold',
                //         }
                //     }}
                    
                //     onDateChange={(date) => {
                //         this.setState({chosenDate:date});
                //     }}
                //         />
                //         );
                    }
            
            getLoading(){
                return(
                    <View>
                    {/* <Loader active pRows={3} pWidth={["100%", 200, "25%", 45]} /> */}
                    {UiElements.drawGap(10)}
                    {/* <Loader active pRows={2} pWidth={["100%", 200, "25%", 45]} /> */}
                    </View>
                    )
                }
                
                render() {
                        
                        buttonsInit = [i18n.t('earnpoints'), i18n.t('spendpoints')];

                    return (
                        <View style={styles.homeView}>
                        {UiElements.drawGap(10)}
                        <ButtonGroup 
                        ButtonNames={buttonsInit} 
                        ContentStyle={styles.tabItem}
                        ContainerStyle={styles.rowView} 
                        selectedButton={this.state.selectedPage} 
                        handler = {this.handler}/>

                        <ScrollView 
                    ref='scrollview'
                    style={styles.container}
                    onMomentumScrollEnd={this._contentViewScroll}
                    pagingEnabled={true}
                    horizontal= {true}
                    vertical= {false}
                    scrollEnabled={false}
                    decelerationRate='fast'
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={width - 30}
                    snapToAlignment={"center"}
                    contentInset={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                    }}>
                    <ScrollView style={styles.view1}
                    showsVerticalScrollIndicator={false}>
                        {UiElements.drawGap(10)}
                        <Text style={styles.simplelabel} >
                        {i18n.t('selectbrand')}
                        </Text>
                       

                    </ScrollView>
                    <ScrollView style={styles.view2}
                    showsVerticalScrollIndicator={false}>
                    {UiElements.drawGap(10)}
                    <Text style={styles.simplelabel} >
                    {i18n.t('checkhowmuch')}
                    </Text>
                    </ScrollView>
                    </ScrollView>
                        </View>
                        )
                    }
                    
                }
                
                
                const styles = StyleSheet.create({
                    tabItem:{
                        flex:1,
                        height:45,
                    },
                    rowView:{
                        flex: 1, flexDirection: 'row'
                    },   
                    inputValue: {
                        textAlign:'left',
                        alignItems:'center',
                        alignContent:'center',
                        fontSize: 20,
                        flex:1,
                        height:50,
                        fontFamily:'Cairo-Bold',
                    },
                    homeView: {
                        flex: 1,
                        backgroundColor:'#fff',
                        paddingLeft:15,
                        paddingRight:15,
                    }, detailstitle:{
                        width:150,
                        fontSize: 20,
                        fontFamily:'Cairo-Bold',
                        paddingTop:15,
                        paddingBottom:15,
                    },
                    heading: {
                        textAlign:'left',
                        fontSize: 40,
                        fontFamily:'Cairo-Bold',
                    },
                    subheading: {
                        flex:0.5,
                        textAlign:'center',
                        fontSize: 20,
                        fontFamily:'Cairo-Bold',
                    },
                    simplelabel: {
                        textAlign:'center',
                        fontSize: 20,
                        fontWeight: '400',
                    },container: {},
                    view1: {
                        marginTop: 10,
                        width: width - 30,
                        height: height-250,
                        borderRadius: 10,
                      },
                    view2: {
                      marginTop: 10,
                      width: width - 30,
                      height: height-250,
                      borderRadius: 10,
                    },tryagain:{
                        margin:10,
                        backgroundColor:'#1d78cb',
                        borderRadius:10,
                        width:width/1.5,
                        height:60,
                        justifyContent:'center',
                        alignSelf:'center',
                        alignContent:'center',
                        flex:1,
                    },
                    tryagaintext:{
                        alignSelf:'center',
                        color:'white',
                        fontSize:20,
                        fontWeight:'400',
                    },claimButton:{
                        margin:10,
                        backgroundColor:'#1d78cb',
                        borderRadius:10,
                        height:60,
                        justifyContent:'center',
                        alignSelf:'center',
                        alignContent:'center',
                        width:width/1.15,
                    },
                    claimButtontext:{
                        alignSelf:'center',
                        color:'white',
                        fontSize:20,
                        fontWeight:'400',
                    }
                    
                });
               