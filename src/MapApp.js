import React from 'react';
import Grid from '@material-ui/core/Grid';
import MapSettings from "./components/MapSettings";
import Map from "./components/Map";
import cloneDeep from "lodash-es/cloneDeep";
import TopBar from "./components/TopBar/TopBar";
import rawAddresses from './data/adr_valim_xy_aggr_cityurban.json';

import rawInterviewers2 from './data/kysitlejad_cityurban_v2.json';
// import rawData from './data/';

import rawData from './data/all_adr_all_notnull.json';

// Temporary transformation
const interviewers = rawInterviewers2
    .filter((interviewer) => interviewer.adr_xy && interviewer.adr_xy.coordinates)
    .map((interviewer) => ({
        id: interviewer.kysitleja_id,
        name: interviewer.nimi,
        address: interviewer.sisendaadress,
        selected: true, // interviewer.linn_vald === 'Tallinn',
        fromCity: interviewer.linnalinemaaline === 'linnaline',
        coordinates: interviewer.adr_xy.coordinates
    }));

const addresses = rawAddresses
    .filter((address) => address.adr_xy && address.adr_xy.coordinates)
    .map((address) => ({
        id: +address.adr_id,
        coordinates: address.adr_xy.coordinates,
        //intersectingZones: rawData
        //    .filter(data => data.target_id === address.adr_id)
        //    .map(data => ({ id: data.src_id, distance: data.agg_cost })),
        surveys: address.uuring,
        isVisited: address.is_visited,
        fromCity: address.linnalinemaaline === 'linnaline' || address.linnalinemaaline === null,
    }));


const addrCityMap = {}
addresses.forEach(addr => addrCityMap[addr.id] = addr.fromCity);

const findInterviewerById = (interviewers, address, zone) => {
    return interviewers
        .filter(interviewer => interviewer.addresses.length < 50 && interviewer.fromCity === address.fromCity)
        .find(interviewer => interviewer.id === zone.id);
}

const splitAddresses = (addresses, interviewers) => {
    const addressesCopy = cloneDeep(addresses);
    const interviewersCopy = cloneDeep(interviewers);
    // Add empty address array
    interviewersCopy.forEach((interviewer) => {
        interviewer.addresses = [];
    });

    // Add addresses to interviewers
    addressesCopy.forEach((address) => {
        // Remove not selected interviewers
        address.intersectingZones = address.intersectingZones.filter((zone) => {
            const found = findInterviewerById(interviewersCopy, address, zone);
            return !!found;
        });
        if (address.intersectingZones.length === 0) return;
        const closest = address.intersectingZones.reduce((closest, current) => {
            return current.distance < closest.distance ? current : closest
        });
        const interviewer = findInterviewerById(interviewersCopy, address, closest);
        if (!interviewer) return;
        interviewer.addresses.push({
            id: address.id,
            coordinates: address.coordinates,
        });
    });
    return interviewersCopy;
}

const prepareAddresses = (addresses) => {
    const addressesPerInterview = {};
    rawData.forEach(distRow => {
        if (addressesPerInterview[+distRow.src_id]) {
            addressesPerInterview[+distRow.src_id].push({ id: +distRow.target_id, distance: +distRow.round });
        } else {
            addressesPerInterview[+distRow.src_id] = [{ id: +distRow.target_id, distance: +distRow.round }]
        }
    });
    Object.values(addressesPerInterview).forEach((list) =>
        list.sort((a, b) => a.distance - b.distance)
    );
    return addressesPerInterview;
}

const divideAddresses = (addressesPerSurvey, interviewers) => {
    const usedAddresses = new Set();
    const dividedAreas = {};

    const intCity = {};
    interviewers.forEach(i => intCity[i.id] = i.fromCity);
    // do not touch
    const abcdef = Object.keys(addressesPerSurvey).map(a=>+a);
    let keys = interviewers.map(a => a.id).filter(a=> abcdef.includes(a));
    let counter = 0;
    const CAP = 550;

    keys.forEach(key => dividedAreas[key] = []);

    while (keys.length !== 0) {
        keys.forEach(key => {
            const adrid = addressesPerSurvey[key][counter].id;
            if (!usedAddresses.has(adrid) && addrCityMap[adrid] === intCity[key] ) {
                dividedAreas[key].push(adrid);
                usedAddresses.add(adrid);
            }
        });
        counter += 1;
        keys = keys.filter((key) => dividedAreas[key].length < CAP);
        keys = keys.filter((key) => counter < addressesPerSurvey[key].length);
    }
    return dividedAreas;
};

const splitAddresses2 = (interviewers, dividedAddresses) => {
    const interviewersCopy = cloneDeep(interviewers);

    interviewersCopy.forEach((interviewer) => {
        interviewer.addresses = [];
    });
    Object.keys(dividedAddresses).forEach((interviewId) => {
        const interviewer = interviewersCopy.find(interviewer => interviewer.id === +interviewId);
        if (!interviewer) return;
        dividedAddresses[interviewId].forEach(addressId => {
            const address = addresses.find(address => address.id === addressId);
            if (!address) return;
            interviewer.addresses.push({
                id: address.id,
                coordinates: address.coordinates,
            });
        })
    });
    return interviewersCopy;
}

let MIN_STEP = 1;
let MAX_STEP = 4;
let step = MIN_STEP;

const stepOneNames = ['Rasmus', 'Maria', 'Svetlana', 'Sirje', 'Kreet', 'Igor', 'Teet'];
const stepTwoNames = ['Rasmus', 'Maria', 'Svetlana', 'Sirje', 'Erik', 'Kreet', 'Igor', 'Teet'];
const stepThreeNames = ['Rasmus', 'Maria', 'Svetlana', 'Sirje', 'Erik', 'Kreet', 'Igor', 'Piret', 'Teet'];

class MapApp extends React.Component {
    constructor(props) {
        super(props);
        const survey = props.location.search ? props.location.search.substring(3) : null;
        const filteredAddresses = addresses.filter((address) => survey === '' || !address.surveys || address.surveys.includes(survey));
        // console.log(filteredAddresses);
        this.state = {
            survey,
            interviewersDefault: interviewers,
            interviewers: [],
            interviewersAmount: 0,
            addressedInterviewers: [],
            addresses: filteredAddresses,
            nameFilter: '',
        }

        window.addEventListener('keydown', this.stepListener)
    }

    componentDidMount() {
        this.setState({
            interviewersAmount: this.state.interviewersDefault.filter(int => int.selected).length,
            preparedAddresses: prepareAddresses(this.state.addresses)
        });
        this.followStep();
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.stepListener);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.interviewers !== this.state.interviewers) {
            // Interviewers changed
            const selectedInterviewers = this.state.interviewers.filter(interviewer => interviewer.selected);
            const dividedAddresses = divideAddresses(this.state.preparedAddresses, selectedInterviewers);
            const addressedInterviewers = splitAddresses2(selectedInterviewers, dividedAddresses);
            this.setState({addressedInterviewers});
        }
    }

    stepListener = (event) => {
        const key = event.key;
        if (key === 'ArrowRight') {
            step = Math.min(step + 1, MAX_STEP);
            this.followStep();
        }
        if (key === 'ArrowLeft') {
            step = Math.max(step - 1, MIN_STEP);
            this.followStep();
        }
    }

    followStep = () => {
        if (step === 1) {
            const interviewers = cloneDeep(this.state.interviewersDefault)
            interviewers.forEach(interviewer => interviewer.selected = false);
            interviewers.filter(interviewer => stepOneNames.includes(interviewer.name))
                .forEach(interviewer => interviewer.selected = true);
            this.setState({interviewers});
        } else if (step === 2) {
            const interviewers = cloneDeep(this.state.interviewersDefault)
            interviewers.forEach(interviewer => interviewer.selected = false);
            interviewers.filter(interviewer => stepTwoNames.includes(interviewer.name))
                .forEach(interviewer => interviewer.selected = true);
            this.setState({interviewers});
        } else if (step === 3) {
            const interviewers = cloneDeep(this.state.interviewersDefault)
            interviewers.forEach(interviewer => interviewer.selected = false);
            interviewers.filter(interviewer => stepThreeNames.includes(interviewer.name))
                .forEach(interviewer => interviewer.selected = true);
            this.setState({interviewers});
        } else if (step === 4) {
            const interviewers = cloneDeep(this.state.interviewersDefault)
            this.setState({interviewers});
        }
    }

    handleInterviewersChange = (interviewsCount) => {
        if (this.changeTimeout) {
            clearTimeout(this.changeTimeout);
        }
        this.changeTimeout = setTimeout(() => {
            let interviewers = cloneDeep(this.state.interviewersDefault)
                .slice(0, interviewsCount);
            interviewers.forEach(int => int.selected = true);

            this.setState({interviewers});
            this.changeTimeout = null;
        }, 500);
    };

    handleAmountChange = (event) => {
        const newValue = Math.max(Math.min(+event.target.value, this.state.interviewersDefault.length), 0);
        this.setState({
            interviewersAmount: newValue
        }, () => this.handleInterviewersChange(newValue));
    };

    handleInterviewerSelect = (id) => {
        this.setState(prevState => ({
            ...prevState,
            interviewers: prevState.interviewers.map(
                int => int.id === id ? {...int, selected: !int.selected} : int
            )
        }))
    };

    handleAdd = () => {
        const newValue = Math.min(this.state.interviewersAmount + 1, this.state.interviewersDefault.length);
        this.setState({
            interviewersAmount: newValue
        }, () => this.handleInterviewersChange(newValue));
    };

    handleRemove = () => {
        let newValue = this.state.interviewersAmount - 1;
        this.setState({
            interviewersAmount: newValue >= 0 ? newValue : 0,
        }, () => this.handleInterviewersChange(newValue));
    };

    handleFilterChange = (event) => {
        const newFilter = event.target.value;
        this.setState({
            nameFilter: newFilter
        });
    }

    render() {
        return (
            <div className="app">
                <Grid container>
                    <Grid item container xs={3}>
                        <MapSettings
                            interviewersAmount={this.state.interviewersAmount}
                            interviewers={this.state.interviewers}
                            handleSelectInterviewer={this.handleInterviewerSelect}
                            handleAdd={this.handleAdd}
                            handleRemove={this.handleRemove}
                            handleAmountChange={this.handleAmountChange}
                            handleFilterChange={this.handleFilterChange}
                            nameFilter={this.state.nameFilter}
                        />

                    </Grid>
                    <Grid item container xs={9}>
                        <TopBar
                            homePage={false}
                            survey={this.state.survey}
                        />
                        <Map
                            interviewers={this.state.addressedInterviewers}
                            addresses={this.state.addresses}
                        />
                    </Grid>
                </Grid>
            </div>
        )
    };
}

export default MapApp;