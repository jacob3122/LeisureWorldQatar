import React, { Component } from 'react';
import  ProfileData  from '../../Tools/Components/ProfileData';
import {Text,Alert,TouchableOpacity} from 'react-native';
import i18n from 'i18n-js';
import Colors from '../../Tools/constants/Colors';
export default class ProfileEditor extends Component {
    
    constructor(props){
        super(props);
        this.state={
            change:false,
        }
        this.SaveChange = this.SaveChange.bind(this);
    }
    
    
    SaveChange(saveBool) {
        // console.log("Save :"+saveBool);
        this.setState({change:saveBool});
        this.props.navigation.setParams({ change: saveBool });
    }
    componentDidMount(){
        // this.SaveChange(false);
    }
    // _savechange = () => {
    //     this.setState({ count: this.state.count + 1 });
    // };
    
   
    
    
    static navigationOptions = ({navigation}) => {
        return{
            header:null,
            headerVisible:false
            // statusBarStyle: 'dark-content',          
            // headerTitle: (i18n.t('yourprofile')),
            // headerTintColor: Colors.darkfontColor,
            // headerStyle: {
            //     backgroundColor: Colors.yellowColor
            // },
            // headerTitleStyle:{textAlign:'center',
            // fontWeight: 'bold',flex:1,fontFamily:'Cairo-Bold'},
            // headerRight: (
            //     <TouchableOpacity
            //     style={{
            //         height: 45,
            //         alignItems: 'center',
            //         justifyContent: 'center',
            //         margin: 5,
                    
            //     }}
            //     onPress={()=>{
            //         if(navigation.getParam('change')){
            //             // i18n.locale=global.locale;
            //             // Works on both iOS and Android
            //             Alert.alert(i18n.t('havntsave'),
            //             "",
            //             [
            //                 {text: i18n.t('keepedit'),onPress: () => console.log('Cancel Pressed')},
            //                 {text: i18n.t('nevermind'), onPress: () => navigation.goBack()},
            //             ],
            //             {cancelable: false},
            //             );
            //         }else{
            //             navigation.goBack();
            //         }
            //     }
            // }
            // >
            // <Text style= {{ fontSize: 20,fontWeight:'bold', color: Colors.darkfontColor}}>
            // {(navigation.getParam('change')?i18n.t('cancel'):i18n.t('back'))}
            // </Text>
            // </TouchableOpacity>
            // ),headerLeft: null
        }
    };
    
    render() {
        return (
            <ProfileData pagetogo="accountEdit" /*saveChange={this.SaveChange}*/ navigation={this.props.navigation} />
            )
        }
        
    }
    
    
    
    
    