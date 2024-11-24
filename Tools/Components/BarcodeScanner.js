import React, {PureComponent} from 'react';
import {
    SafeAreaView,
    StyleSheet,Dimensions,Text, View,Platform, Alert
}from 'react-native';
// import { RNCamera } from 'react-native-camera';
import * as Tools from '../Components/Tools';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {request} from 'react-native-permissions';
// import QRCodeScanner from 'react-native-qrcode-scanner';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

export default class BarcodeScanner extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            scanned: false,
        }
    }
    
    
    
    
    async componentDidMount() {
        Tools.updateRatePoints(2);
        this.getPermissionsAsync();
    }
    
    getPermissionsAsync = async () => {
        if(Platform.OS=='android'){
            check(PERMISSIONS.ANDROID.CAMERA)
            .then((result) => {
                switch (result) {
                    case RESULTS.GRANTED:
                    this.setState({ hasCameraPermission: true },()=>{this.forceUpdate()});
                    // console.log('GrantCamera');
                    break;
                    case RESULTS.BLOCKED:
                    this.setState({ hasCameraPermission: false },()=>{this.forceUpdate()});
                    // console.log('No');
                    
                    break;
                }
            })
            .catch((error) => {
                // …
                // console.log('No'+error);
            });
            
            request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
                // console.log("Permi "+result)
                if(Tools.stringIsContains(result,'granted')){
                    this.setState({ hasCameraPermission: true },()=>{this.forceUpdate()});
                }
                
            });
            
        }else{
            check(PERMISSIONS.IOS.CAMERA)
            .then((result) => {
                switch (result) {
                    case RESULTS.GRANTED:
                    this.setState({ hasCameraPermission: true },()=>{this.forceUpdate()});
                    // console.log('GrantCamera');
                    break;
                    case RESULTS.BLOCKED:
                    this.setState({ hasCameraPermission: false },()=>{this.forceUpdate()});
                    // console.log('No');
                    
                    break;
                }
            })
            .catch((error) => {
                // …
                // console.log('No'+error);
            });
            
            request(PERMISSIONS.IOS.CAMERA).then((result) => {
                // console.log("Permi "+result)
                if(Tools.stringIsContains(result,'granted')){
                    this.setState({ hasCameraPermission: true },()=>{this.forceUpdate()});
                }
                
            });
        }
        // const { status } = RNCamera.refreshAuthorizationStatus().then();
        // console.log('Camera :'+status);
        // this.setState({ hasCameraPermission: status === 'authorized' },()=>{this.forceUpdate()});
    };
    
    // getPermissionsAsync = async () => {
    //     const { status } = await Camera.requestPermissionsAsync();
    //     this.setState({ hasCameraPermission: status === 'granted' },()=>{console.log("hi"); this.forceUpdate()});
    // };
    // componentDidMount(){
    //     Tools.updateRatePoints(2);
    // }
    
    
    render() {
        // const isFocused = useIsFocused();
        const { hasCameraPermission } = this.state;
        
        if (hasCameraPermission === null) {
            return <Text allowFontScaling={false} style={styles.heading} >Requesting for camera permission</Text>;
        }
        if (hasCameraPermission === false) {
            return <Text allowFontScaling={false} style={styles.heading}  >No access to camera</Text>;
        }
        
        return (
            <View style={{height:heightPercentageToDP('50'),position:'absolute',top:-1*(height/3.4),
            width:widthPercentageToDP('100%'),justifyContent:'center',alignSelf:'center'}}>
            {/* {(isActive)&& */}
            {/* <BScan
            onBarCodeScanned={this.handleBarCodeScanned}
            style={[styles.preview,Platform.OS==='ios'?{}:{}]}
        /> */}
            {/* <QRCodeScanner ref={(node) => { this.scanner = node }}
            cameraStyle={{width:'100%',height:'100%'}}
            onRead={this.onBarCodeRead}/> */}
            {/* // } */}
            {/* // <RNCamera
            // ref={cam => this.camera = cam}
            // style={this.props.style}
            // type={RNCamera.Constants.Type.back}
            // onBarCodeRead={this.onBarCodeRead}
            //   captureAudio={false}
        //   /> */}
        </View>
        )
    }
    handleBarCodeScanned = ({ type, data }) => {

        // console.log(data);
        var onDone=this.props.onBarCodeScanGotData;
        onDone(data);
    };
    
    onBarCodeRead = (e) => {
        var onDone=this.props.onBarCodeScanGotData;
        onDone(e.data);
    }
    
}

const styles = StyleSheet.create({
    heading:{
        justifyContent:'center',
        textAlign:'center',
        fontSize:20,
        fontWeight:'300',
        color:'white',
        fontFamily:'Cairo-Regular',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        width:width,
        alignSelf:'center',
        height:'45%',
        position:'absolute',
        top:'25%',
        // width:300,height:300,
        // width:width/1.1,
        // height:height/9
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    cameraIcon: {
        margin: 5,
        height: 40,
        width: 40
    },
    bottomOverlay: {
        position: "absolute",
        width: "100%",
        flex: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
});
