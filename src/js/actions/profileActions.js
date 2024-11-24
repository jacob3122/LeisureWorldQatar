import {update_Profile,update_Claims,update_Redeem,update_Loading,update_AccessToken,update_MemberID,get_Locale,update_onDismiss,update_Network,update_Cart,update_Media,update_BannerInfo} from '../constants/action-types'

export const updateProfile= profile =>( 
     { 
         type: update_Profile,
         payload:profile,
     }
  );

  export const updateClaims= claim =>( 
    { 
        type: update_Claims,
        payload:claim,
    }
 );

 export const updateRedeem= redeem =>( 
    { 
        type: update_Redeem,
        payload:redeem,
    }
 );

 export const updateMemberID= memberID =>( 
    { 
        type: update_MemberID,
        payload:memberID,
    }
 );

 export const updateAccessToken= token =>( 
    { 
        type: update_AccessToken,
        payload:token,
    }
 );

  export const updateLoading= loadState =>( 
    { 
        type: update_Loading,
        stateIn:loadState,
    }
 );

 export const updateonDismiss= loadState =>( 
    { 
        type: update_onDismiss,
        stateIn:loadState,
    }
 );

 export const updateNetwork= internetReach =>( 
    { 
        type: update_Network,
        stateIn:internetReach,
    }
 );
 export const updateCart= cartInfo =>( 
    { 
        type: update_Cart,
        stateIn:cartInfo,
    }
 );

 export const updateMedia= mediaInfo =>( 
    { 
        type: update_Media,
        stateIn:mediaInfo,
    }
 );

 export const updateBannerInfo=bannerInfo =>( 
    { 
        type: update_BannerInfo,
        stateIn:bannerInfo,
    }
 );
 export const getLocale= locale =>( 
    { 
        type: get_Locale,
        payload:locale,
    }
);