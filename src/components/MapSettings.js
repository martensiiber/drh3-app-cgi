import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const MapSettings = ({ interviewers, handleSelectInterviewer }) => {
    return (
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
    );
}

export default MapSettings;