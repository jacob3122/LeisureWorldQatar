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
            if (state.i18ntranslation === action.payload) return state;
            return { ...state, i18ntranslation: action.payload };
        }
        case 'update_ShowInfo':{
            if (state.ShowInfo === action.payload) return state;
            return { ...state, ShowInfo: action.payload };
        }
        case 'update_Profile': {
            if (state.profile === action.payload) return state;
            if (state.profile && action.payload && state.profile.Id === action.payload.Id) {
                try {
                    if (JSON.stringify(state.profile) === JSON.stringify(action.payload)) return state;
                } catch(e) {}
            }
            return { ...state, profile: action.payload };
        }
        case 'update_Claims': {
            if (state.claims === action.payload) return state;
            return { ...state, claims: action.payload };
        }
        case 'update_Redeem': {
            if (state.redeem === action.payload) return state;
            return { ...state, redeem: action.payload };
        }
        case 'update_Loading': {
            if (state.isLoading === action.stateIn) return state;
            return { ...state, isLoading: action.stateIn };
        }
        case 'update_MemberID': {
            if (state.memberID === action.payload) return state;
            return { ...state, memberID: action.payload };
        }
        case 'update_AccessToken': {
            if (state.accessToken === action.payload) return state;
            return { ...state, accessToken: action.payload };
        }
        case 'update_onDismiss': {
            if (state.onExitDismiss === action.stateIn) return state;
            return { ...state, onExitDismiss: action.stateIn };
        }
        case 'update_Network': {
            if (state.isConnected === action.stateIn) return state;
            return { ...state, isConnected: action.stateIn };
        }
        case 'update_App': {
            if (state.needUpdate === action.stateIn) return state;
            return { ...state, needUpdate: action.stateIn };
        }
        case 'update_Cart': {
            if (state.shopCartInfo === action.stateIn) return state;
            return { ...state, shopCartInfo: action.stateIn };
        }
        case 'update_CartItems': {
            if (state.cartItems === action.stateIn) return state;
            return { ...state, cartItems: action.stateIn };
        }
        case 'update_Media': {
            if (state.mediaInfo === action.stateIn) return state;
            return { ...state, mediaInfo: action.stateIn };
        }
        case 'get_Locale': {
            if (state.locale === action.locale) return state;
            return { ...state, locale: action.locale };
        }
        case 'update_BannerInfo': {
            if (state.bannerInfo === action.payload) return state;
            return { ...state, bannerInfo: action.payload };
        }
        case 'update_OpenProduct': {
            if (state.OpenProduct === action.payload) return state;
            return { ...state, OpenProduct: action.payload };
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
