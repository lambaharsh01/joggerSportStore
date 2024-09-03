import {createStore} from 'redux';

const Reducer=(state={
    header:false,
    newReleaseMain:[],
    newReleaseSub:[],
    menMain:[],
    menSub:[],
    womenMain:[],
    womenSub:[],
    kidsMain:[],
    kidsSub:[],
    products:[]

}, action)=>{

   switch(action.type){
    case 'insertData':
        return {...state, ...action.payload};

    case 'clearData':
        return { 
    header:false,
    newReleaseMain:[],
    newReleaseSub:[],
    menMain:[],
    menSub:[],
    womenMain:[],
    womenSub:[],
    kidsMain:[],
    kidsSub:[],
    products:[]
}

    default:
        return state

   }
}


const HeaderStore=createStore(Reducer);


export default HeaderStore;