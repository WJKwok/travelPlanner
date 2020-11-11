import React, { createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

//this is not necessary but good practice
const initialState = {
    user: null
};

if (localStorage.getItem('jwtToken')){
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('jwtToken');
    } else {
        initialState.user = decodedToken;
    }
    
}

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            localStorage.setItem('jwtToken', action.payload.token);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('refreshToken');
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
}

function AuthContextProvider(props) {

    //initial state can be just {} but this is good practice
    const [authState, dispatch] = useReducer(authReducer, initialState);

    return(
        <AuthContext.Provider value={{ authState, dispatch }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthContextProvider };