import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import InterviewersSlider from "./InterviewersSlider";
import './mapSettings.css';

const MapSettings = ({
                         interviewers,
                         handleSelectInterviewer,
                         handleSliderChange,
                         interviewersAmount,
                         maxInterviewers
                }) => {
    return (
        <div className="interviewers-settings">
            <InterviewersSlider
                handleSliderChange={handleSliderChange}
                interviewersAmount={interviewersAmount}
                maxInterviewers={maxInterviewers}
            />
            <List>
                {
                    interviewers.map((interviewer) => {
                        const labelId = `checkbox-list-label-${interviewer.id}`;
                        return(

                            <ListItem key={interviewer.id} dense button onClick={handleSelectInterviewer.bind(this, interviewer.id)}>
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
        </div>
    );
}

export default MapSettings;