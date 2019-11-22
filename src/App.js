import React from 'react';
import MapApp from "./MapApp";

import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import TablesPages from "./TablesPage";
import Home from "./components/Home/Home";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Route exact path='/' component={Home}></Route>
                <Route exact path='/tables' component={TablesPages}></Route>
                <Route path='/map' component={MapApp}></Route>
            </Router>
        )
    }
}

export default App;