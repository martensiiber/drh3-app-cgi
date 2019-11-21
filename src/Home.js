import React from 'react';
import MainContent from "./components/MainContent/MainContent";
import './App.css';
import TopBar from "./components/TopBar/TopBar";


const Home = () => {
    return(
        <React.Fragment>
            <div className="app">
                <TopBar homePage={true}/>
                <MainContent/>
            </div>
        </React.Fragment>
    )
};

export default Home;