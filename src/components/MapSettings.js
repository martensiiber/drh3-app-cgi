import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import './mapSettings.scss';
import InterviewerInput from "./InterviewerInput/InterviewerInput";
import {Link} from "react-router-dom";
import TextField from "@material-ui/core/TextField";

const MapSettings = ({
                         interviewers,
                         handleSelectInterviewer,
                         handleAmountChange,
                         handleAdd,
                         handleRemove,
                         interviewersAmount,
                         nameFilter,
                         handleFilterChange,
                }) => {
    return (
        <div className="interviewers-settings">
            <div className="interviewers-settings__title">
                <PermIdentityIcon/> Küsitlejad
            </div>
            <InterviewerInput
                interviewersAmount={interviewersAmount}
                handleAdd={handleAdd}
                handleRemove={handleRemove}
                handleAmountChange={handleAmountChange}
            />
            <div className="interviewer-input__filter-wrapper">
                <TextField
                    className="interviewer-input__filter"
                    label="Filtreeri nime järgi"
                    variant="outlined"
                    value={nameFilter}
                    onChange={handleFilterChange}
                />
            </div>

            <List className="interviewers-list">
                {
                    interviewers
                        .filter(interviewer => nameFilter === '' || interviewer.name.includes(nameFilter))
                        .map((interviewer) => {
                            const labelId = `checkbox-list-label-${interviewer.id}`;
                            return(
                                <ListItem key={interviewer.id} button onClick={handleSelectInterviewer.bind(this, interviewer.id)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={interviewer.selected}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={interviewer.name} />
                                </ListItem>
                            )

                        })
                }
            </List>

            <div className="interviewers-settings__indicators">
                <div className="interviewers-settings__indicators-item interviewers-settings__indicators-item--blue">Küsitleja</div>
                <div className="interviewers-settings__indicators-item interviewers-settings__indicators-item--green">Küsitlus tehtud</div>
                <div className="interviewers-settings__indicators-item interviewers-settings__indicators-item--red">Küsitlus tegemata</div>
            </div>

            <div className="interviewers-settings__confirm">
                <Link to={{pathname: "/tables", state: {fromMap: true}}} className="interviewers-settings__confirm-button">Kinnita</Link>
            </div>
        </div>
    );
}

export default MapSettings;