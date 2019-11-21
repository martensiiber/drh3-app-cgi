import React from 'react';
import './uplaod-box.scss';

const UploadBox = () => {
    return(
        <React.Fragment>
            <div className='upload-box'>
                <div className="upload-box__title">
                    Tiri & lohista uue uuringu lisamiseks
                </div>
                <div className="upload-box__actions">
                    <span className="upload-box__actions-text">fail siia või</span> <button className="upload-box__actions--button">Vali</button>
                </div>
            </div>
            <div className="upload-box__notice">Mitme faili valimiseks hoia all CTRL/CMND</div>
        </React.Fragment>
    )
};

export default UploadBox;