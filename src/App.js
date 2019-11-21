import React from 'react';
import MapApp from "./MapApp";

import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import Home from "./Home";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Route exact path='/' component={Home}></Route>
                <Route path='/map' component={MapApp}></Route>
            </Router>
        )
    }
}

export default App;