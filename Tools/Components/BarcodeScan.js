import * as React from 'react';
import { Text, View, StyleSheet,Alert, TouchableOpacity,TouchableHighlight,Dimensions,SafeAreaView } from 'react-native';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);

import BarcodeScanner from './BarcodeScanner';

// import Colors from '../constants/Colors';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import TabBarIcon from './TabBarIcon';
import { useTheme } from '../context/ThemeProvider';
import VisionCamera from './VisionCamera';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default function BarcodeScan(props){
  const Colors=useTheme();
  return <BarcodeScanC {...props} Colors={Colors}/>
}
class BarcodeScanC extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
  };
  
  constructor(props){
    super(props);
    this.handleBarCodeScanned=this.handleBarCodeScanned.bind(this);
  }
  
  
  render() {
    const {Colors}=this.props;
    const styles = StyleSheet.create({
      buttonText:{
        fontFamily:'Cairo-Regular',
        textAlign:'center',
        color:Colors.whiteColor,
        fontSize: widthPercentageToDP(4),
        // lineHeight:15*1.5,
        textTransform:'uppercase'
      },buttonView:{
        position:'absolute',
        bottom:'2%',
        backgroundColor:Colors.blueColor,
        width:widthPercentageToDP(35),
        alignSelf:'center',
        justifyContent:'center',
        height:heightPercentageToDP(4.75),
        borderRadius:heightPercentageToDP(4.75)
      },
    });
    
    return (
      <SafeAreaView style={{ height:heightPercentageToDP(60),borderWidth:0,
        width:widthPercentageToDP(100),alignSelf:'center',justifyContent:'center'}} >
        <View
        style={{
          position:'absolute',
          // height:height/3,
          width:'100%',
          height:'90%',
          flexDirection: 'column',
          justifyContent: 'center',
          // height: heightPercentageToDP('30%') ,
        }}>
        <VisionCamera
        onBarCodeScanGotData={this.handleBarCodeScanned}
        />
        
        {/* <BarcodeScanner
        navigation={this.props.navigation}
        onBarCodeScanGotData={this.handleBarCodeScanned}
        /> */}
        </View>
        
        <TouchableOpacity style={styles.buttonView}
        onPress={()=>{
          var onDone=this.props.onScanDone;
          onDone();
          this.setState({isVisible:false})}} >
          <Text allowFontScaling={false} style ={styles.buttonText} allowFontScaling ={false}>{i18n.t('close')}</Text></TouchableOpacity>
          </SafeAreaView>
          );
        }
        
        
        handleBarCodeScanned( edata) {
          this.setState({ scanned: true });
          var assignValue  =   this.props.onScanDone;
          
          if(edata===undefined)
          assignValue('');
          else{  
            assignValue(edata);
          }
        }
      }
      
      