import React from 'react';
import MainContent from "./components/MainContent/MainContent";
import './App.css';
import TopBar from "./components/TopBar/TopBar";

class TablesPages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fromMap: false
        }
    }
    componentDidMount() {

        if (!!this.props.location.fromMap) {
            const {fromMap} = this.props.location.state;
            this.setState({fromMap});
        }
        console.log(this.props);
        // console.log(fromMap, " from map");

    }

    render() {
        const {fromMap} = this.state;
        return(
            <React.Fragment>
                <div className="app">
                    <TopBar homePage={true}/>
                    <MainContent fromMap={fromMap}/>
                </div>
            </React.Fragment>
        )
    }
};

export default TablesPages;