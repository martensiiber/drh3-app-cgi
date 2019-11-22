import React from 'react';
import Grid from '@material-ui/core/Grid';
import MapSettings from "./components/MapSettings";
import Map from "./components/Map";
import cloneDeep from "lodash-es/cloneDeep";
import TopBar from "./components/TopBar/TopBar";
import rawInterviewers from './data/kysitlejad_cityurban.json';
import rawAddresses from './data/adr_valim_xy_aggr_cityurban.json';

import rawInterviewers2 from './data/kysitlejad_cityurban_v2.json';

let rawData = require(`./data/all_adr_all_notnull.json`);
// let rawData = []
// for (let index = 1; index <= 56; index++) {
//     try {
//         const file = require(`./data/all_new_adr/src_id_${index}_to_adr.json`);
//         rawData = rawData.concat(file);
//     } catch {}
// }
// console.log(rawData.length);


// Temporary transformation
const interviewers = rawInterviewers2
    .filter((interviewer) => interviewer.adr_xy && interviewer.adr_xy.coordinates)
    .map((interviewer) => ({
        id: interviewer.kysitleja_id,
        name: interviewer.nimi,
        selected: true, // interviewer.linn_vald === 'Tallinn',
        fromCity: interviewer.linnalinemaaline === 'linnaline',
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
        isVisited: address.is_visited,
        fromCity: address.linnalinemaaline === 'linnaline',
    }));

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
    console.log("Starting preparing addresses.");
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
    
    console.log("Finished preparing addresses.");
    return addressesPerInterview;
}

const divideAddresses = (addressesPerSurvey, interviewers) => {
    console.log("Starting dividing addresses.")
    const usedAddresses = new Set();
    const dividedAreas = {};
    
    // do not touch
    const abcdef = Object.keys(addressesPerSurvey).map(a=>+a);
    let keys = interviewers.map(a => a.id).filter(a=> abcdef.includes(a));//Object.keys(addressesPerSurvey); // list of strs
    let counter = 0;
    const CAP = 450;

    keys.forEach(key => dividedAreas[key] = []);

    while (keys.length !== 0) {
        keys.forEach(key => {
            const address = addressesPerSurvey[key][counter]; // addressil ainult id ja kaugus väli, puudub from city, too much calc to add
            if (!usedAddresses.has(address.id)) { // && address.fromCity === interviewers[key].fromCity 
                dividedAreas[key].push(address.id);
                usedAddresses.add(address.id);
            }
        });
        counter += 1;
        keys = keys.filter((key) => dividedAreas[key].length < CAP);
        keys = keys.filter((key) => counter < addressesPerSurvey[key].length);
        
        //keys = keys.filter((key) => );
    }
    console.log("Finishing dividing addresses.");
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

class MapApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            interviewersDefault: interviewers,
            interviewers: [],
            interviewersAmount: 0,
            addressedInterviewers: [],
            addresses,
            nameFilter: '',
        }
    }

    componentDidMount() {
        this.setState(prevState => ({
            ...prevState,
            interviewers: cloneDeep(this.state.interviewersDefault.filter(int => int.selected)),
            interviewersAmount: this.state.interviewersDefault.filter(int => int.selected).length,
            preparedAddresses: prepareAddresses(this.state.addresses)
        }))
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.interviewers !== this.state.interviewers) {
            // Interviewers changed
            const selectedInterviewers = this.state.interviewers.filter(interviewer => interviewer.selected);
            // const addressedInterviewers = splitAddresses(this.state.addresses, selectedInterviewers);

            const dividedAddresses = divideAddresses(this.state.preparedAddresses, selectedInterviewers);
            const addressedInterviewers = splitAddresses2(selectedInterviewers, dividedAddresses);
            this.setState({addressedInterviewers});
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
                        <TopBar homePage={false}/>
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