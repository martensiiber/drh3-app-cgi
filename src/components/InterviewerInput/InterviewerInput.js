import React from 'react';
import './interviewer-input.scss';
import TextField from "@material-ui/core/TextField";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

class InterviewerInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { interviewersAmount, handleAdd, handleRemove, handleAmountChange } = this.props;
        return(
            <div className="interviewer-input__wrapper">
                <label htmlFor="klAmount" className="interviewer-input__label">Küsitlejate arv</label>
                <div className="interviewer-input__actions">
                    <span className="interviewer-input__action interviewer-input__action--minus" onClick={handleRemove.bind(this)}>
                        <RemoveIcon/>
                    </span>
                    <TextField
                        className="interviewer-input"
                        id="klAmount"
                        label="Arv"
                        onChange={handleAmountChange}
                        value={interviewersAmount}
                        variant="outlined"
                    />
                    <span className="interviewer-input__action interviewer-input__action--plus" onClick={handleAdd.bind(this)}>
                        <AddIcon/>
                    </span>
                </div>

            </div>

        )
    }
}

export default InterviewerInput;