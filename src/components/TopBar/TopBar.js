import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import logo from '../../img/logo.svg';
import './top-bar.scss';

const TopBar = ({ homePage}) => {
    return(
        <div className={"top-bar " + (!homePage ? 'top-bar--not-home' : '')}>
            <div className="top-bar__logo">
                <img src={logo} alt="Logo"/>
            </div>
            <div className="top-bar__actions">
                {homePage &&
                    <React.Fragment>
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
                    </React.Fragment>
                }

                {!homePage &&
                    <React.Fragment>
                        <div className="top-bar__actions-item--not-home top-bar__actions-language">
                            <div className="top-bar__actions-item-label top-bar__actions-language-label">Uuring:</div>
                            <div className="top-bar__actions-item-value top-bar__actions-language-switcher">
                                CUTI-2020
                            </div>
                        </div>
                        <div className="top-bar__actions-item--not-home top-bar__actions-user">
                            <div className="top-bar__actions-item-label top-bar__actions-user-label">Tähtaeg:</div>
                            <div className="top-bar__actions-item-value top-bar__actions-user-name">31.01.2020</div>
                        </div>
                    </React.Fragment>
                }
                <div className="top-bar__actions-item top-bar__actions-logout">
                    <ExitToAppIcon />
                </div>
            </div>
        </div>
    );
};

export default TopBar;

