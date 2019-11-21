import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import logo from '../../img/logo.svg';
import './top-bar.scss';

const TopBar = () => {
    return(
        <div className="top-bar">
            <div className="top-bar__logo">
                <img src={logo} alt="Logo"/>
            </div>
            <div className="top-bar__actions">
                <div className="top-bar__actions-item top-bar__actions-language">
                    <div className="top-bar__actions-item-label top-bar__actions-language-label">Keel:</div>
                    <div className="top-bar__actions-item-value top-bar__actions-language-switcher">
                        EST <KeyboardArrowDownIcon/>
                    </div>
                </div>
                <div className="top-bar__actions-item top-bar__actions-user">
                    <div className="top-bar__actions-item-label top-bar__actions-user-label">Kasutaja:</div>
                    <div className="top-bar__actions-item-value top-bar__actions-user-name">Maarika Maasikas</div>
                </div>
                <div className="top-bar__actions-item top-bar__actions-logout">
                    <ExitToAppIcon />
                </div>
            </div>
        </div>
    );
};

export default TopBar;

