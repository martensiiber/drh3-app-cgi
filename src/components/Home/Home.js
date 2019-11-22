import React from 'react';
import logo from '../../img/logo.svg';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import './home.scss';
import {Link} from "react-router-dom";

const Home = () => {
    return(
        <div className="home-page">
            <div className="home-page__logo">
                <img src={logo} alt="Satikas"/>
            </div>
            <div className="home-page__content">
                <h1>Statikas</h1>

                <Link to={"/tables"} className="home-page__content-action">
                    Sisene <ArrowForwardIosIcon fontSize='small'/>
                </Link>
            </div>
        </div>
    )
};

export default Home;