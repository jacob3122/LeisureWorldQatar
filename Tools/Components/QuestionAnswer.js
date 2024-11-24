import React, { Component } from 'react'
import {StyleSheet,View,Text,Image,TouchableOpacity,Dimensions,Animated,Easing,ScrollView,FlatList} from 'react-native'
import * as UiElements from './UIElements'
// import Colors from '../constants/Colors';
import proceedB from '../../assets/Icons/back.png'
import SecureStore from '../../Tools/Components/SecureStore';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import * as Tools from './Tools';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeProvider';


let scaleValue = new Animated.Value(0); // declare an animated value
export default function(props){
    const Colors=useTheme();
    return <QuestionAnswer {...props} Colors={Colors}/>
}

class QuestionAnswer extends Component {
    styles=undefined;
    
    constructor(props){
        super(props);
        this.state={
            showAnswer:0,
            prevAnswer:0,
            language:'',
            isloading:true,
            gotValue:0,
            
        }
        scaleValue.setValue(0);
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 250,
            easing: Easing.linear,
            useNativeDriver:false
        }).start();

        this.onTextLayout=this.onTextLayout.bind(this);
        this.checkAnswer=this.checkAnswer.bind(this);
    }
    datatoDisplay=[];
    heightsOfAnswers=[];
    componentDidMount(){
        SecureStore.getItemAsync('languageENAR').then(languagecheck=>{
            // console.info(this.props.data)
            this.setState({gotValue:0});
            this.datatoDisplay=this.props.data;//(Tools.stringIsContains(languagecheck,'en')? this.props.data.en.Questions:this.props.data.ar.Questions);
            this.setState({language:languagecheck,isloading:false});
            for(let t=0;t<this.datatoDisplay.length;t++){
                this.heightsOfAnswers.push(0);
            }
        });

    }
    
    showAnswerButton(idshow){
        if(idshow==this.state.showAnswer)
        return;
        this.setState({prevAnswer:this.showAnswer});
        
        this.setState({showAnswer:idshow},()=>{
            scaleValue.setValue(0);
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver:false
            }).start();
        });
        // console.log(idshow+"/");
        this.linesHad=this.datatoDisplay[idshow].answer.length;
    }
    heightCA=0;
    yCA=0;
    linesHad=0;

    onTextLayout(selected, event){
        // console.log(selected);
        // console.log(this.state.showAnswer+"=="+selected);
        if(this.state.showAnswer===selected){
            // console.log(event.nativeEvent.lines.length);
            // console.log(event.nativeEvent.height);
            // this.linesHad=event.nativeEvent.lines.length;
        }
    }
    sampletest=[];
    onLayoutCA(selected,event){

        if(this.state.gotValue==1)
        return;
            const{height,y}=event.nativeEvent.layout;
            // console.log(height);
            // console.log(y);
            if(selected<this.heightsOfAnswers.length){
                this.heightsOfAnswers[selected]=height;
            }
            this.sampletest.push(height);
        if(this.state.showAnswer===selected){
            this.heightCA=height;
            this.yCA=y;
        }
        if(this.sampletest.length==this.datatoDisplay.length){
            this.setState({gotValue:1})
        }
    }

    checkAnswer(currentAns){
        const {Colors}=this.props;
        const cardtrans = scaleValue.interpolate({
            inputRange: [0, 1],
            // outputRange: [this.yCA-(this.heightCA/2),this.yCA]
            outputRange: [0,(this.heightsOfAnswers[currentAns])]

        });

        const cardtransM = scaleValue.interpolate({
            inputRange: [0, 1],
            outputRange: [this.linesHad*.5,0]
        });

        const cardScale = scaleValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0,1]
        });
        const cardScaleM = scaleValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1,0]
        });
        let transformStyle =[{
            width:'100%',
            overflow:'hidden',
            backgroundColor:Colors.whiteColor,borderRadius:15,padding:10},
        this.state.gotValue==1?{
            height:cardtrans,

        }:{}];
        
        let transformStyleM = [{
            overflow:'hidden',backgroundColor:Colors.whiteColor,borderColor:Colors.whiteColor,borderRadius:15,padding:10},
            this.state.gotValue==1?{
                height:0,padding:0
            }:{}];
        
        const currentCheck=currentAns;
        return(
            <View  key={'T'+currentCheck}>
            {UiElements.drawGap(10)}
            <TouchableOpacity style={this.styles.rowView} key={'TO'+currentCheck} onPress={()=>this.showAnswerButton(currentCheck)} >
            <Text key={currentCheck} allowFontScaling={false} style={this.styles.subheading} >{this.datatoDisplay[currentCheck].question}</Text>
            {/* {(this.state.showAnswer!=currentAns)&&(<Image source={proceedB} style={styles.proceedstyle}></Image>)} */}
            </TouchableOpacity>
            
            {/* {this.state.showAnswer===currentCheck&& */}
            <Animated.View
             onLayout={(e)=>this.onLayoutCA(currentCheck,e)} 
             style={this.state.showAnswer===currentCheck? transformStyle :transformStyleM}>
                <Text
                // onTextLayout={(e)=>this.onTextLayout(currentCheck,e)}
                allowFontScaling={false} numberOfLines={100} style={this.styles.answers}>{this.datatoDisplay[currentCheck].answer}</Text>
                </Animated.View>
                {/* } */}

            {UiElements.drawGap(10)}
            </View>
            );
        }
        
        
        AddQuestion(){
            alllines=[];
            // console.log('Q :'+this.datatoDisplay.length);
            for(let t=0;t<this.datatoDisplay.length;t++){
                alllines.push(this.checkAnswer(t))
            }
            return alllines;
        }
        _renderItem = ({item, index}) => {
            return(this.checkAnswer(index))
        }
        render() {
            const {Colors}=this.props;
        const styles = StyleSheet.create({
            rowView:{
                flexDirection:'row'
            },
            proceedstyle:{
                alignSelf:'center',
                transform:[{rotateZ:'-90deg'}],
                width:18,
                height:18
            },
            homeScrollView:{
                flexDirection:'column',
                alignContent:'center',
            },
            homeView:{
                marginTop:10,
                height:heightPercentageToDP('52%'),
                // minHeight:heightPercentageToDP('40%'),
            },
            subheading: {
                fontSize: 17,
                lineHeight:22,
                // height:25,
                paddingBottom:5,
                width:'90%',
                textAlign:'left',
                color:Colors.inputfontColor,
                fontFamily:'Cairo-Regular'
            },
            answers: {
                width:'100%',
                textAlign:'left',
                fontSize: 15,
                lineHeight:19,
                resizeMode:'contain',
                // paddingBottom:5,
                color:Colors.tealGreen,
                fontFamily:'Cairo-Regular'
            }
        });
        this.styles=styles;
            return (
                <View >

                {!this.state.isloading&&(
                <FlatList
                removeClippedSubviews={false}
                data={this.datatoDisplay}
                                    // removeClippedSubviews
                                    ItemSeparatorComponent={()=><View style={{height:20}}></View>}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{paddingBottom:'25%'}}
                                    renderItem={this._renderItem}
                style={styles.homeView}>
                </FlatList>)}

                </View>
                )
            }
            
        }
        
        