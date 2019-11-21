import React from 'react';
import Grid from '@material-ui/core/Grid';
import MapSettings from "./components/MapSettings";
import Map from "./components/Map";
import interviewers from './data/interviewers.json';
import addresses from './data/addresses.json';

class MapApp extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            interviewers,
            addresses,
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
                        <Map
                            interviewers={this.state.interviewers}
                            addresses={this.state.addresses}
                        />
                    </Grid>
                </Grid>
            </div>
        )
    };
}

export default MapApp;