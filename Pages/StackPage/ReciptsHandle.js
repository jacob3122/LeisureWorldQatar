import React, { Component } from 'react'
import {View,ScrollView,StyleSheet,Text,Slider,Object} from 'react-native';
import PropTypes from 'prop-types';
// import RNPickerSelect from 'react-native-picker-select';
import moment from'moment'
// import Loader from 'react-native-easy-content-loader';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);

import {Dimensions } from "react-native";
const window = Dimensions.get('window');

export default class ReciptsHandle extends Component {
    
    
    _myScroll=ScrollView;
    
    constructor(props){
        super(props);
        this.state={
            topFiler:false,
            transactions:[],
            loading:true,
            dateRange:'0',
            filter:'A',
            droppositiony:0
        }
    }
  
    
    drawGap=(valueGap)=>{
        return(
            <View
            style={{paddingTop:valueGap}}/>
            );
        }
        getRange(){
            const dateplaceholder = {
                label: 'All',
                value: "0",
                color: '#9EA0A4',
            };
            const dateRanges = [
                {
                    label: 'Last 1 Month',
                    value: '1',
                },
                {
                    label: 'Last 2 Months',
                    value: '2',
                },
                {
                    label: 'Last 3 Months',
                    value: '3',
                },
                {
                    label: 'Last 4 Months',
                    value: '4',
                },
                {
                    label: 'Last 5 Months',
                    value: '5',
                },
                {
                    label: 'Last 6 Months',
                    value: '6',
                }
            ];
            const Filterplaceholder = {
                label: 'All',
                value: "A",
                color: '#9EA0A4',
            };
            const FilterRanges = [
                {
                    label: 'AngryBirds Indoor',
                    value: 'ABI',
                },
                {
                    label: 'AngryBirds Outdoor',
                    value: 'ABO',
                },
                {
                    label: 'Virtuocity',
                    value: 'VC',
                },
                {
                    label: 'SnowDunes',
                    value: 'S',
                }
            ];
            return(
                <View style={styles.rowView}>
                {/* {this.loadUpdate()} */}
                {/* <RNPickerSelect
                placeholder={dateplaceholder}
                items={dateRanges}
                onValueChange={value => {
                    this.setState({dateRange:value},()=>{this.setTransactions()});
                }}
                style={styles}
                value={this.state.dateRange}
                />
                <RNPickerSelect
                placeholder={Filterplaceholder}
                items={FilterRanges}
                onValueChange={value => {
                    this.setState({filter:value},()=>{this.setTransactions()});
                }}
                style={styles}
                value={this.state.filter}
                /> */}
                </View>);
            }
            
            drawLine=(colorstr)=>{
                return(
                    <View
                    style={{
                        borderBottomColor: colorstr,
                        borderBottomWidth: 0.5,
                    }}/>
                    );
                }
                
                getPointBox(){
                    if(this.props.profile.cardData)
                    return(
                        <View>
                        <View style={styles.pointBox}>
                        <Text style={styles.pointheading}>You saved QAR {this.props.profile.cardData.valueSaved} by spending {this.props.profile.cardData.pointSpend} points</Text>
                        {/* {this.drawLine('black')} */}
                        {this.drawGap(10)}
                        <Slider 
                        disabled={true}
                        value={this.props.profile.cardData.bonusPoints/this.props.profile.cardData.basePoints} 
                        maximumTrackTintColor="#ADD8FF"
                        minimumTrackTintColor="#0080f6"
                        style={styles.slider}
                        thumbTintColor='rgba(0,0,0,0)'/>
                        <Text style={styles.pointtxt} >Base Points {this.props.profile.cardData.basePoints}</Text>
                        <Text style={styles.pointtxt}>Bonus Points {this.props.profile.cardData.bonusPoints}</Text>
                        <Text style={styles.pointValue}>{this.props.profile.cardData.basePoints}</Text>
                        <Text style={styles.pointValuetxt}> Your Total Points Value QAR {this.props.profile.cardData.pointsValue}</Text>
                        </View>
                        {this.drawGap(10)}
                        <Text style={styles.pointtxt}> {this.props.profile.cardData.pointstoExpire} Points Expires On {moment(new Date()).format('DD-MM-YYYY')}</Text>
                        </View>
                        
                        );
                    }
                    getTransfers(){
                        if(this.props.profile.transactions)
                        return(
                            <View>
                            <View style={styles.rowView}>
                            <Text style={[styles.subheading,
                                {flex:1,textAlign:'left'}]}>
                                {i18n.t('brandcaps')}
                                </Text>
                                <Text style={[styles.subheading,
                                {flex:0.75,textAlign:'center'}]}>
                                {i18n.t('earnedcaps')}
                                </Text>
                                <Text style={[styles.subheading,
                                {flex:0.75,textAlign:'left'}]}>
                                {i18n.t('spentcaps')}
                                </Text>
                                </View>
                                {this.drawGap(15)}
                                {this.drawLine('black')}
                                {this.getTransactions()}
                                </View>
                                );
                            }
                            setTransactions(){
                                
                                this.setState({loading:true});
                                
                                this.setState({transactions:[]});
                                transactionsArray=[];
                                for(let t=0;t<this.props.profile.transactions.length;t++){
                                    let tdate = moment(this.props.profile.transactions[t].date, 'DD-MM-YYYY');
                                    let todaydate = moment();
                                    let diff= tdate.diff({todaydate}, 'months')*-1;
                                    if(this.state.dateRange==='0'||Number.parseInt(this.state.dateRange)>=diff){
                                        if(this.state.filter==='A'||this.state.filter===this.props.profile.transactions[t].parkID){
                                            transactionsArray.push(
                                                <View key ={t}>
                                                {this.drawGap(15)}
                                                <View style={styles.rowView}>
                                                <Text style={[styles.pointtxt,
                                                    {flex:1}]}>{this.props.profile.transactions[t].parkName}</Text>
                                                    <Text style={[styles.pointtxt,
                                                        {flex:0.5}]}>{this.props.profile.transactions[t].earned}</Text>
                                                        <Text style={[styles.pointtxt,
                                                            {flex:0.5}]}>{this.props.profile.transactions[t].spend}</Text>
                                                            </View>
                                                            {this.drawGap(10)}
                                                            <Text style={[styles.pointtxt,
                                                                {flex:1}]}>QAR {this.props.profile.transactions[t].value} - {this.props.profile.transactions[t].date} </Text>
                                                                {this.drawGap(15)}
                                                                
                                                                {this.drawLine('black')}
                                                                </View>
                                                                );
                                                            }
                                                        }
                                                    }
                                                    // console.log("A L :"+transactionsArray.length);
                                                    this.setState({transactions:transactionsArray});
                                                    this.performActionWithTime(this.setLoadingState.bind(this),false,500);
                                                }
                                                
                                                setLoadingState(stateP){
                                                    this.setState({loading:stateP});
                                                }
                                                
                                                performActionWithTime(callback,params,timeTaken){
                                                    setTimeout(() => {callback(params)},timeTaken);
                                                }
                                                
                                                getTransactions(){
                                                    return this.state.transactions;
                                                }
                                                
                                                getLoading(){
                                                    return(
                                                        <View>
                                                        {/* <Loader active pRows={3} pWidth={["100%", 200, "25%", 45]} /> */}
                                                        {this.drawGap(10)}
                                                        {/* <Loader active pRows={2} pWidth={["100%", 200, "25%", 45]} /> */}
                                                        </View>
                                                        )
                                                    }
                                                    getContent(){
                                                        if(this.state.loading){
                                                            return(
                                                                <View>
                                                                {this.getLoading()}
                                                                </View>
                                                                )
                                                            }else{
                                                                return(
                                                                    <View>
                                                                    {this.getPointBox()}
                                                                    {this.drawGap(20)}
                                                                    {this.getTransfers()}
                                                                    </View>
                                                                    )
                                                                }
                                                            }
                                                            
                                                            _contentViewScroll = (e) => {
                                                                // console.log("pos"+e.nativeEvent.contentOffset.y);

                                                                const scrolled =(e.nativeEvent.contentOffset.y);
                                                                const position = (scrolled > 0) ? scrolled / Dimensions.get('window').width : 0;
                                                                if(scrolled>(this.state.droppositiony-20)){
                                                                    this.setState({topFiler:true});
                                                                }else{
                                                                    this.setState({topFiler:false});
                                                                }
                                                            }

                                                            _onLayout = ({ nativeEvent: { layout: { x, y, width, height } } }) => {
                                                                // console.log("pos init"+y);
                                                                this.setState({
                                                                    droppositiony:y
                                                                });
                                                              };

                                                            getTopFilter(){
                                                                if(this.state.topFiler){
                                                                    return(
                                                                        <View
                                                                         style={{
                                                                            position:'absolute',
                                                                            width:window.width,
                                                                            paddingStart:15,
                                                                            paddingEnd:15,
                                                                            backgroundColor:'white',
                                                                            zIndex: 5,
                                                                            alignItems:'center',
                                                                            // shadowColor: "#000",
                                                                            // shadowOffset: {
                                                                            //     width: 0,
                                                                            //     height: 2,
                                                                            // },
                                                                            // shadowOpacity: 0.25,
                                                                            // shadowRadius: 3.84,
                                                                        }}>
                                                                        {this.drawGap(10)}
                                                                        <View style={[(styles.rowView),({})]}>
                                                                        <Text style={styles.subheading} >
                                                                        Date Range
                                                                        </Text>
                                                                        <Text style={styles.subheading} >
                                                                        Filter by brand
                                                                        </Text>
                                                                        </View>
                                                                        {this.drawGap(5)}                                                                
                                                                        {this.getRange()}
                                                                        </View>
                                                                        );
                                                                    }
                                                                }
                                                                
                                                                render() {
                                                                    return (
                                                                        <View style={{
                                                                            flex:1,
                                                                        }}>
                                                                        {this.getTopFilter()}
                                                                        <ScrollView 
                                                                        scrollEventThrottle={32}
                                                                        ref="scrollview"
                                                                        onScroll={this._contentViewScroll}
                                                                        // onScroll={() => this.checkScroll()}
                                                                        showsVerticalScrollIndicator = {false}
                                                                        contentContainerStyle={styles.homeScrollView}
                                                                        style={styles.homeView}>
                                                                        <View style={styles.inner}>
                                                                        <Text style={styles.heading} >
                                                                        {i18n.t('receiptsandtransactions')}
                                                                        </Text>
                                                                        </View>
                                                                        {this.drawGap(25)}
                                                                        <View style={styles.rowView} onLayout={this._onLayout}>
                                                                        <Text style={styles.subheading} >
                                                                        Date Range
                                                                        </Text>
                                                                        <Text style={styles.subheading} >
                                                                        Filter by brand
                                                                        </Text>
                                                                        </View>
                                                                        {this.drawGap(5)}
                                                                        {this.getRange()}
                                                                        {this.getContent()}
                                                                        </ScrollView>
                                                                        </View>
                                                                        )
                                                                    }
                                                                    
                                                                }
                                                                
                                                                
                                                                const styles = StyleSheet.create({
                                                                    slider:{
                                                                        height:20,
                                                                    },
                                                                    homeScrollView:{
                                                                        padding:15,
                                                                        // margin:15
                                                                    },
                                                                    pointheading:{
                                                                        padding:10,
                                                                        flex:1,
                                                                        fontSize:15,
                                                                        fontWeight:'200',
                                                                        textAlign:'left'
                                                                    },
                                                                    pointtxt:{
                                                                        textAlign:'left',
                                                                        fontSize:15,
                                                                        fontWeight:'400'
                                                                    },
                                                                    pointValue:{
                                                                        textAlign:'right',
                                                                        fontSize:15,
                                                                        fontFamily:'Cairo-Bold'
                                                                    },
                                                                    pointValuetxt:{
                                                                        textAlign:'right',
                                                                        fontSize:12,
                                                                        fontWeight:'200'
                                                                    },
                                                                    pointBox:{
                                                                        padding:10,
                                                                        borderWidth:0.5,
                                                                        borderRadius:10,
                                                                        flex:1,
                                                                    },
                                                                    inputIOS: {
                                                                        fontSize: 16,
                                                                        textAlign:'center',
                                                                        fontFamily:'Cairo-Bold',
                                                                        height:45,
                                                                        color: 'black',
                                                                        width:(window.width/2)-15,
                                                                        // flex:1,
                                                                    },
                                                                    inputAndroid: {
                                                                        fontSize: 16,
                                                                        textAlign:'center',
                                                                        fontFamily:'Cairo-Bold',
                                                                        height:45,
                                                                        width:(window.width/2)-8,
                                                                        // flex:1,
                                                                        color: 'black',
                                                                    },
                                                                    inner: {
                                                                        flex: 1,
                                                                        justifyContent: "flex-end",
                                                                    },
                                                                    rowView:{
                                                                        flex: 1, flexDirection: 'row',
                                                                    },   
                                                                    homeView: {
                                                                        flex: 1,
                                                                        backgroundColor:'#fff',
                                                                        // paddingLeft:15,
                                                                        // paddingRight:15,
                                                                    }, heading: {
                                                                        textAlign:'left',
                                                                        fontSize: 40,
                                                                        fontFamily:'Cairo-Bold',
                                                                    },
                                                                    subheading: {
                                                                        flex:0.5,
                                                                        textAlign:'center',
                                                                        paddingLeft:10,
                                                                        fontSize: 20,
                                                                        fontFamily:'Cairo-Bold',
                                                                        // borderWidth:2
                                                                    },
                                                                    
                                                                });
                                                                ReciptsHandle.propTypes = {
                                                                    profile: PropTypes.object.isRequired,
                                                                }