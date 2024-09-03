 import {createStore} from 'redux';

const Reducer=(state={
    auth:null,
    user_email:null,
    user_name:null,
    user_type:null,
    loginTime:null,
    logOutTime:null
}, action)=>{

   switch(action.type){
    case 'insertData':
        return {...state, ...action.payload};

    case 'clearData':
        return { auth:null,
            user_email:null,
            user_name:null,
            user_type:null,
            loginTime:null,
            logOutTime:null
            }

    default:
        return state

   }
}


const Store=createStore(Reducer);


export default Store;