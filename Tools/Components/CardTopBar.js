import { View,TouchableOpacity,Text,StyleSheet} from "react-native";
import { useTheme } from "../context/ThemeProvider";
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { useAppContext } from "../../src/js/reducers/AppReducer";
import * as Tools from '../../Tools/Components/Tools.js'

function CardTopBar({navigation,assignProfile,redeem,redeemPoint,redeemProfile,profile,isLoading,selected=null}) {
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const styles = StyleSheet.create({
        detailstitle:{
            includeFontPadding:false,
            // paddingVertical:widthPercentageToDP(2),
            textAlign:'center',
            alignSelf:'center',
            color:Colors.whiteColor,
            fontFamily:'Cairo-SemiBold',
            fontSize:14,
            paddingHorizontal:widthPercentageToDP(2.5)
        },
        pointsVal:{
            includeFontPadding:false,
            position:'absolute',
            bottom:(-15*1.5),
            overflow:'visible',
            // paddingVertical:widthPercentageToDP(2),
            textAlign:'center',
            alignSelf:'center',
            color:Colors.black,
            fontFamily:'Cairo-Regular',
            fontSize:12,
            paddingHorizontal:widthPercentageToDP(2.5)
        },
        bottomBar:
        {
            width:'30%',
            height:heightPercentageToDP(4),
            backgroundColor:Colors.tealGreen,
            justifyContent:'center',
            overflow:'visible',
            borderRadius:heightPercentageToDP(4)
        }
        
    });
    
    return(
        (!Tools.IsNull(state.profile))&&
        <View style={{
            width:'93%', borderRadius:20,flexDirection:'row',alignSelf:'center',marginBottom:16,
            justifyContent:'space-between'}}>
            <TouchableOpacity 
            style={[styles.bottomBar,selected==null?{}:{backgroundColor:selected==0?Colors.tealGreen:Colors.silver}]}
            onPress={() =>
                navigation.navigate('benefits',{
                    profile:state.profile,redeem:redeem,redeemPoint:redeemPoint,redeemProfile:redeemProfile
                })}>
                <Text numberOfLines={1} style={styles.detailstitle} allowFontScaling ={false}>{i18n.t('benefits').toUpperCase()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.bottomBar,selected==null?{}:{backgroundColor:selected==1?Colors.tealGreen:Colors.silver}]}
                onPress={() => 
                    {
                        var redeemprofile=redeemProfile;
                        redeemprofile();
                        navigation.navigate('claims',{assignProfile:assignProfile,isLoading:isLoading,
                            otherParam: 'Redeem Points',backParam: i18n.t('mycard') ,pagefrom:'card',profile:state.profile,redeem:redeem,redeemPoint:redeemPoint,redeemProfile:redeemProfile
                        })
                    }
                }>
                <Text numberOfLines={1} lineBreakMode='head' style={styles.detailstitle} allowFontScaling ={false}>{i18n.t('points').toUpperCase()}</Text>
                {selected==1&&<Text numberOfLines={1} lineBreakMode='head' style={styles.pointsVal} allowFontScaling ={false}>{state.profile.Points+" "+i18n.t('points')}</Text>}
                </TouchableOpacity>
                
                
                <TouchableOpacity 
                style={[styles.bottomBar,selected==null?{}:{backgroundColor:selected==2?Colors.tealGreen:Colors.silver}]}
                onPress={()=>navigation.navigate('rules',{
                    navigation:navigation,
                })}>
                
                <Text numberOfLines={1} style={styles.detailstitle} allowFontScaling ={false}>{i18n.t('rules').toUpperCase()}</Text>
                </TouchableOpacity>
                </View>
                )
            }
            
            export default CardTopBar;