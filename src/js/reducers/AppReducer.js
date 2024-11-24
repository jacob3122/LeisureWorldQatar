import { createContext, useContext, useReducer } from "react";

export const initialState = {
    ShowInfo:undefined,
    profile: undefined,
    claims:undefined,
    memberID:'',
    accessToken:'',
    isLoading:false,
    locale:'',
    onExitDismiss:undefined,
    isConnected:true,
    needUpdate:false,
    shopCartInfo:undefined,
    mediaInfo:[],
    cartItems:[],
    OpenProduct:'',
    i18ntranslation:{}
};

const AppContext = createContext();

function AppReducer(state,action){
    // console.log('action.type : '+action.type);
    switch (action.type) {
        case 'update_Translation':{
            return{
                ...state,i18ntranslation:action.payload
            }
        }
        case 'update_ShowInfo':{
            return{
                ...state,ShowInfo:action.payload
            }
        }
        case 'update_Profile': {
            return {
                ...state,profile:action.payload
            };
        }
        case 'update_Claims': {
            return {
                ...state,claims:action.payload
            };
        }
        case 'update_Redeem': {
            return {
                ...state,redeem:action.payload
            };
        }
        case 'update_Loading': {
            return {
                ...state,isLoading:action.stateIn
            };
        }
        case 'update_MemberID': {
            return {
                ...state,memberID:action.payload
            };
        }
        case 'update_AccessToken': {

            return {
                ...state,accessToken:action.payload
            };
        }
        case 'update_onDismiss': {
            return {
                ...state,onExitDismiss:action.stateIn
            };
        }
        case 'update_Network': {
            return {
                ...state,isConnected:action.stateIn
            };
        }

        case 'update_App': {
            return {
                ...state,needUpdate:action.stateIn
            };
        }
        case 'update_Cart': {
            return {
                ...state,shopCartInfo:action.stateIn
            };
        }
        case 'update_CartItems': {
            return {
                ...state,cartItems:action.stateIn
            };
        }
        case 'update_Media': {
            return {
                ...state,mediaInfo:action.stateIn
            };
        }
        case 'get_Locale': {
            return {
                ...state,locale:action.locale
            };
        }
        case 'update_BannerInfo': {
            return {
                ...state,bannerInfo:action.payload
            };
        }case 'update_OpenProduct': {
            // console.log(JSON.stringify(action.payload)+' stateIn : '+(action.type));

            return {
                ...state,OpenProduct:action.payload
            };
        }
    }
    throw Error('Unknown action: ' + action.type);
}

export default function AppProvider({ children }) {
    const [state, dispatch] = useReducer(AppReducer, initialState);
  
    return (
      <AppContext.Provider value={{ state, dispatch }}>
        {children}
      </AppContext.Provider>
    );
  }

  export function useAppContext() {
    return useContext(AppContext);
  }
