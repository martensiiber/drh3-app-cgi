import React from 'react';
import Grid from '@material-ui/core/Grid';
import MapSettings from "./components/MapSettings";
import Map from "./components/Map";

class MapApp extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            interviewers: [
                { id: 1, name: "Test Interviewer 1", selected: false },
                { id: 2, name: "Test Interviewer 2", selected: false },
                { id: 3, name: "Test Interviewer 3", selected: false },
                { id: 4, name: "Test Interviewer 4", selected: false },
                { id: 5, name: "Test Interviewer 5", selected: false },
                { id: 6, name: "Test Interviewer 6", selected: false },
                { id: 7, name: "Test Interviewer 7", selected: false },
                { id: 8, name: "Test Interviewer 8", selected: false },
            ]
        }
    }

    handleInterviewerSelect = (id) => {
        this.setState(prevState => ({
            interviewers: prevState.interviewers.map(
                int => int.id === id ? { ...int, selected: !int.selected } : int
            )
        }))
    };

    render() {
        return (
            <div className="app">
                <Grid container>
                    <Grid item container xs={4}>
                        <MapSettings
                            interviewers={this.state.interviewers}
                            handleSelectInterviewer={this.handleInterviewerSelect}
                        />
                    </Grid>
                    <Grid item container xs={8}>
                        <Map/>
                    </Grid>
                </Grid>
            </div>
        )
    };
}

export default MapApp;