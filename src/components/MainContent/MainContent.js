import React from 'react';
import './main-content.scss';
import UploadBox from "../UploadBox/UploadBox";
import InfoTable from "../InfoTable/InfoTable";

class MainContent extends React.Component {
    render() {
        return (
            <div className="main-content">
                <UploadBox />
                <InfoTable />
            </div>
        )
    };
}

export default MainContent;