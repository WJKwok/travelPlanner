import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom'

import { AuthContext } from '../Store/AuthContext';

function AuthRoute({component: Component, ...rest}) {
    const { authState : {user} } = useContext(AuthContext)
    return (
        <Route
            {...rest} // exact, path, other props
            render={(props) => 
                user ? <Redirect to='/itineraries'/> : <Component {...props}/>
            }
        />
    )
}

function UnAuthRoute({component: Component, ...rest}) {
    const { authState : {user} } = useContext(AuthContext)
    return (
        <Route
            {...rest} // exact, path, other props
            render={(props) => 
                user ? <Component {...props}/> : <Redirect to='/'/> 
            }
        />
    )
}

export{ AuthRoute, UnAuthRoute }