import React from 'react';

import View from 'ol/View';
import { get as getProjection } from 'ol/proj';
import olMap from 'ol/Map';
import Overlay from 'ol/Overlay';
import { click } from 'ol/events/condition';
import Select from 'ol/interaction/Select';
import TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import VectorLayer from 'ol/layer/Vector';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import OSMSource from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import MapStyles from '../MapStyles';
import { toLonLat, fromLonLat } from 'ol/proj';
import * as concaveman from 'concaveman';
import cloneDeep from 'lodash/cloneDeep';

import 'ol/ol.css';

const CONCAVITY = 6;

const getInterviewersCoordinates = (interviewers) => {
    return interviewers
        .map(interviewer => {
            const feature = new Feature(new Point(interviewer.coordinates));
            feature.setId(interviewer.id);
            feature.set('type', 'interviewer');
            return feature;
        });
};

const getAddressCoordinates = (addresses, isVisited) => {
    return addresses
        .filter(address => address.isVisited === isVisited)
        .map(address => {
            const feature = new Feature(new Point(address.coordinates));
            feature.setId(address.id);
            feature.set('type', 'address');
            return feature;
        })
}

const findInterviewerById = (interviewers, id) => {
    return interviewers
        .filter(interviewer => interviewer.addresses.length < 50)
        .find(interviewer => interviewer.id === id);
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
            const found = findInterviewerById(interviewersCopy, zone.id);
            return !!found;
        });
        if (address.intersectingZones.length === 0) return;
        const closest = address.intersectingZones.reduce((closest, current) => {
            return current.distance < closest.distance ? current : closest
        });
        const interviewer = findInterviewerById(interviewersCopy, closest.id);
        if (!interviewer) return;
        interviewer.addresses.push({
            id: address.id,
            coordinates: address.coordinates,
        });
    });
    return interviewersCopy;
}

class Map extends React.Component {
    constructor(props) {
        super(props);

        proj4.defs('EPSG:3301', '+proj=lcc +lat_1=59.33333333333334 +lat_2=58 '
            + '+lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 '
            + '+towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
        register(proj4);
        this.overlay = null;
        this.content = React.createRef();
        this.popup = React.createRef();
        this.closer = React.createRef();
        this.select = null;
        this.map = null;
    }

    componentDidMount() {
        // Interviewers coordinates layer
        const selectedInterviewers = this.props.interviewers.filter(interviewer => interviewer.selected);
        const interviewerCoordinates = getInterviewersCoordinates(selectedInterviewers);

        const addressedInterviewers = splitAddresses(this.props.addresses, selectedInterviewers);

        this.interviewersLayer = new VectorLayer({
            source: new VectorSource({
                features: interviewerCoordinates
            }),
            style: MapStyles.interviewerStyle,
        });

        // Interviewers areas layer
        const interviewerAreas = addressedInterviewers.map((interviewer) => {
            const wgsCoords = interviewer.addresses.map(address => (
                toLonLat(address.coordinates, 'EPSG:3301')
            ));
            const concave = concaveman(wgsCoords, CONCAVITY);
            const lestCoords = concave.map(coordinate => fromLonLat(coordinate, 'EPSG:3301'));
            return new Feature(new Polygon([lestCoords]));
        });

        this.areasLayer = new VectorLayer({
            source: new VectorSource({
                features: interviewerAreas
            }),
            style: MapStyles.areaStyle,
        });

        // Addresses coordinates layer
        const incompleteAddressCoordinates = getAddressCoordinates(this.props.addresses, false);
        this.incompleteAddressesLayer = new WebGLPointsLayer({
            source: new VectorSource({
                features: incompleteAddressCoordinates
            }),
            style: MapStyles.incompleteAddressStyle,
            disableHitDetection: false
        });

        const completeAddressCoordinates = getAddressCoordinates(this.props.addresses, true);
        this.completeAddressesLayer = new WebGLPointsLayer({
            source: new VectorSource({
                features: completeAddressCoordinates
            }),
            style: MapStyles.completeAddressStyle,
            disableHitDetection: false
        });

        this.view = new View({
            center: [541932, 6589304],
            zoom: 12,
            minZoom: 2,
            maxZoom: 28,
            projection: getProjection('EPSG:3301')
        });

        this.overlay = new Overlay({
            element: this.popup.current,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        this.map = new olMap({
            view: this.view,
            controls: [],
            layers: [
                new TileLayer({
                    source: new OSMSource(),
                }),
                this.incompleteAddressesLayer,
                this.completeAddressesLayer,
                this.areasLayer,
                this.interviewersLayer,
            ],
            overlays: [this.overlay],
            target: this.refs.mapContainer
        });

        let localOverlay = this.overlay;
        let localCloser = this.closer.current;

        localCloser.onclick = function() {
            console.log(this);
            localOverlay.setPosition(undefined);
            localCloser.blur();
            return false;
        };
    }

    changeInteraction = (interviewers) => {
        if (this.select !== null) {
            this.map.removeInteraction(this.select);
        }
        this.select = new Select({
            condition: click,
            layers: [this.interviewersLayer]
        });

        const localOverlay = this.overlay;
        let content = this.content;

        if (this.select !== null) {
            this.map.addInteraction(this.select);
            this.select.on('select', function(e) {
                const feature = e.selected[0];

                if(!!feature) {
                    const featureId = feature.getId();
                    const selectedInterviewer = interviewers.find(int => int.id === featureId);

                    content.current.innerHTML = `id: ${selectedInterviewer.id}<br> name: ${selectedInterviewer.name}`;

                    localOverlay.setPosition(selectedInterviewer.coordinates);
                }
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.interviewers !== this.props.interviewers) {
            // Addresses or interviewers changed
            const selectedInterviewers = this.props.interviewers.filter(interviewer => interviewer.selected);
            const interviewerCoordinates = getInterviewersCoordinates(selectedInterviewers);

            const addressedInterviewers = splitAddresses(this.props.addresses, selectedInterviewers);
            const interviewerAreas = addressedInterviewers
                .filter(interviewer => interviewer.addresses.length !== 0)
                .map((interviewer) => {
                    const wgsCoords = interviewer.addresses.map(address => (
                        toLonLat(address.coordinates, 'EPSG:3301')
                    ));
                    const concave = concaveman(wgsCoords, CONCAVITY);
                    const lestCoords = concave.map(coordinate => fromLonLat(coordinate, 'EPSG:3301'));
                    return new Feature(new Polygon([lestCoords]));
                });

            this.interviewersLayer.setSource(new VectorSource({
                features: interviewerCoordinates
            }));

            this.areasLayer.setSource(new VectorSource({
                features: interviewerAreas
            }))
            this.changeInteraction(this.props.interviewers);
        }
    }

    render() {
        return (
            <React.Fragment>
                <div id="map" ref="mapContainer"></div>
                <div id="popup" className="ol-popup" ref={this.popup}>
                    <a href="#" id="popup-closer" className="ol-popup-closer" ref={this.closer}></a>
                    <div id="popup-content" ref={this.content}></div>
                </div>
            </React.Fragment>
        );
    }
}

export default Map;
