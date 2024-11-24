import { createStore,applyMiddleware} from 'redux'
import profileReducer  from './js/reducers/ProfileReducer'
import thunk from "redux-thunk";

export const store = createStore(profileReducer,{},applyMiddleware(thunk));