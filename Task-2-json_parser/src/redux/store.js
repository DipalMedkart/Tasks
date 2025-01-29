import { createStore } from "redux";

const intialState = {
    json : '',
    parsedJson : null,
    error : null,
}

const reducer = (state = intialState, action) => {
    switch(action.type){
        case 'JSON':
            return {...state, json : action.payload}
        case 'PARSE_JSON':
            return {...state, parsedJson : action.payload}
        case 'ERROR':
            return {...state, error : action.payload}
        case 'CLEAR_INPUT':
            return {...state, json : '', parsedJson : null, error : null}
        default : 
            return state;
    }
}

const store = createStore(reducer);
export default store;