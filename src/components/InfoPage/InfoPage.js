import React from 'react';
import TopBar from "../TopBar/TopBar";
import "./info-page.scss";

class InfoPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <TopBar />
            </React.Fragment>
        )
    }
}

export default InfoPage;