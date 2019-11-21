import React from 'react';
import Grid from '@material-ui/core/Grid';
import MapSettings from "./components/MapSettings";
import Map from "./components/Map";
import cloneDeep from "lodash-es/cloneDeep";
import rawInterviewers from './data/kysitlejad.json';
import rawAddresses from './data/adr_valim_xy_aggr.json';

// Temporary transformation
const interviewers = rawInterviewers
    .filter((interviewer) => interviewer.adr_xy && interviewer.adr_xy.coordinates)
    .map((interviewer) => ({
        id: interviewer.sisendaadressi_id,
        name: interviewer.nimi,
        selected: false,
        coordinates: interviewer.adr_xy.coordinates
    }));

const intersectingZones = interviewers.map((interviewer) => ({
    id: interviewer.id,
    distance: Math.random() * 1500,
}));

const addresses = rawAddresses
    .filter((address) => address.adr_xy && address.adr_xy.coordinates)
    .map((address) => ({
        id: +address.adr_id,
        address: '',
        coordinates: address.adr_xy.coordinates,
        intersectingZones,
        isVisited: address.is_visited,
    }));

class MapApp extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            interviewersDefault: interviewers,
            interviewers: [],
            interviewersAmount: 30,
            addresses
        }
    }

    componentDidMount() {
        this.setState(prevState => ({
            ...prevState,
            interviewers: cloneDeep(this.state.interviewersDefault)
        }))
    }

    handleSliderChange = (event, newValue) => {
        let interviewers = this.getLimitedRandomElements(this.state.interviewersDefault, newValue);
        interviewers.forEach(int => int.selected = false);

        this.setState(prevState => ({
            ...prevState,
            interviewers,
            interviewersAmount: newValue
        }))
    };

    getLimitedRandomElements  = (array, limit) => {
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
    };

    handleInterviewerSelect = (id) => {
        this.setState(prevState => ({
            ...prevState,
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
                            maxInterviewers={this.state.interviewersDefault.length}
                            interviewersAmount={this.state.interviewersAmount}
                            interviewers={this.state.interviewers}
                            handleSelectInterviewer={this.handleInterviewerSelect}
                            handleSliderChange={this.handleSliderChange}
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