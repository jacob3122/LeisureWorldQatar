import { useState } from "react";
import ProfileData from "./ProfileData";
import { View } from "react-native";

function OpenAuthenticate({showLogin,showRegister,setRegister,setLogin,navigation}) {
    
    // const [showLogin,setLogin]=useState(false);
    // const [showRegister,setRegister]=useState(false);
    return(
        <View>
        {showLogin&&(<ProfileData pagetogo='signinuser' showsignin='1' navigation={navigation} onDismiss={()=>setLogin(false)} />)}
        {/* {logOff&&(<ProfileData setSignOff={true} pagetogo='home' navigation={navigation}/>)} */}
        {showRegister&&(<ProfileData pagetogo='register' pagefrom='getstart' navigation={navigation} onDismiss={(_stateIn)=>{
            if(_stateIn)
            setLogin(true);
            else
            setLogin(false);
            setRegister(false)}} />)}
            </View> 
            )
            
        }
        
        export default OpenAuthenticate;