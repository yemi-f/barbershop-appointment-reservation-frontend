import './App.css';
import React, { useState } from 'react';
import AppHeader from './components/AppHeader';
import { ReservationForm, Success } from './components/ReservationForm';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckCircle, faExclamationCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Dashboard from './pages/Dashboard';
library.add(faCheckCircle, faExclamationCircle, faExclamationTriangle);
axios.defaults.baseURL = `http://localhost:5000`;


function App() {
  const [loggedIn, setLoggedIn] = useState(Cookies.get("token") && Cookies.get("token")[0] === "b");
  const updateLoggedIn = bool => setLoggedIn(bool)

  return (
    <Router>
      <AppHeader loggedIn={loggedIn} updateLoggedIn={updateLoggedIn} />
      <Switch>
        <Route path="/dashboard">
          <Dashboard loggedIn={loggedIn} updateLoggedIn={updateLoggedIn} />
        </Route>
        <Route path="/success">
          <Success />
        </Route>
        <Route path="/error">
          <Success />
        </Route>
        <Route path="/">
          <ReservationForm />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
