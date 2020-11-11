import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {AuthRoute, UnAuthRoute} from './utils/AuthRoute';

import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container'
import NavHeader from './Components/navHeader';
import Planner from './Pages/planner'
import Logger from './Pages/logger';
import Landing from './Pages/landing';
import Trips from './Pages/trips';

import PlaceContextProvider from './Store/PlaceContext';
import SnackBarContextProvider from './Store/SnackBarContext'
import { AuthContextProvider } from './Store/AuthContext';
import SpotContextProvider from './Store/SpotContext';

const useStyles = makeStyles((theme) => ({
  container: {
      marginTop: 10, 
      marginBottom: 56,
  },
}));

function App() {

  const classes = useStyles();

  return (
      <AuthContextProvider>
        <PlaceContextProvider>
          <SpotContextProvider>
            <SnackBarContextProvider>
              <BrowserRouter>
                <NavHeader/>
                <Container className={classes.container}>
                  <Route exact path='/' component={Landing}/>
                  <Route exact path='/planner/:guideBookId' component={Planner}/>
                  <Route exact path='/logger' component={Logger}/>
                  <UnAuthRoute exact path='/trips' component={Trips}/>
                  <UnAuthRoute exact path='/planner/:guideBookId/:tripId' component={Planner}/>
                </Container>
              </BrowserRouter>
            </SnackBarContextProvider>
          </SpotContextProvider>
        </PlaceContextProvider>
      </AuthContextProvider>
  );
}

export default App;
