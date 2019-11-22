import React from 'react';
import './main-content.scss';
import UploadBox from "../UploadBox/UploadBox";
import InfoTable from "../InfoTable/InfoTable";

class MainContent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('from map value in content via props', this.props.fromMap);
    }

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