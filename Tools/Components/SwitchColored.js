import { View,StyleSheet, TouchableOpacity } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
// import Colors from "../constants/Colors";
import { useState } from "react";
import { useTheme } from "../context/ThemeProvider";

function SwitchColored({disabled=false,stateIn,setOnOff}) {
    const Colors=useTheme();
    const[stateOnOff,setOnOffIn]=useState(stateIn);
    const styles = StyleSheet.create({
        outerlayer:{
            width:widthPercentageToDP(12),height:heightPercentageToDP(3.25),
            borderRadius:heightPercentageToDP(3.25)
            ,borderWidth:2,borderColor:Colors.blueColor,
            justifyContent:'center'
        },
        innerBall:{
            marginHorizontal:widthPercentageToDP(0.5),
            width:widthPercentageToDP(5),
            height:widthPercentageToDP(5),
            borderRadius:widthPercentageToDP(5),
            backgroundColor:Colors.blueColor
        }
    })
    return(
        <TouchableOpacity
        disabled={disabled}
        onPress={()=>{
            // setOnOffIn(!stateOnOff);
            setOnOff(stateIn);
        }} style={[styles.outerlayer,!stateIn?{borderColor:Colors.inactiveTab,}:{}]}>
        <View style={[styles.innerBall,!stateIn?{backgroundColor:Colors.inactiveTab, alignSelf:'flex-start'}:{alignSelf:'flex-end'}]}>
        
        </View>
        </TouchableOpacity>
        )
        
    }
  
    
    export default SwitchColored;