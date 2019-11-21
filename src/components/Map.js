import React from 'react';

import View from 'ol/View';
import { get as getProjection } from 'ol/proj';
import olMap from 'ol/Map';
import control from 'ol/control/Control';
import {toStringHDMS} from 'ol/coordinate';
import {toLonLat} from 'ol/proj';
import Overlay from 'ol/Overlay';
import TileJSON from 'ol/source/TileJSON';
import { click } from 'ol/events/condition';
import Select from 'ol/interaction/Select';
import TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import VectorLayer from 'ol/layer/Vector';
import OSMSource from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import MapStyles from '../MapStyles';

import 'ol/ol.css';

const getInterviewersCoordinates = (interviewers) => {
    return interviewers
        .filter(interviewer => interviewer.selected)
        .map(interviewer => {
            const feature = new Feature(new Point(interviewer.coordinates));
            feature.setId(interviewer.id);
            return feature;
        });
};

const getInterviewersAreas = (interviewers) => {
    return interviewers
        .filter(interviewer => interviewer.selected)
        .map(interviewer => {
            const feature = new Feature(new Polygon([interviewer.area]));
            feature.setId(interviewer.id);
            return feature;
        })
}

const getAddressCoordinates = (addresses) => {
    return addresses
        .map(address => {
            const feature = new Feature(new Point(address.coordinates));
            feature.setId(address.id);
            return feature;
        })
}

class Map extends React.Component {
    constructor(props) {
        super(props);

        proj4.defs('EPSG:3301', '+proj=lcc +lat_1=59.33333333333334 +lat_2=58 '
            + '+lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 '
            + '+towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
        register(proj4);
        // this.popup = React.createRef();
        this.overlay = null;
        // this.container = React.createRef();
        this.content = React.createRef();
        // this.closer = React.createRef();
        this.select = null;
        this.map = null;

    }

    componentDidMount() {
        // Interviewers coordinates layer
        const interviewerCoordinates = getInterviewersCoordinates(this.props.interviewers);
        this.interviewersLayer = new VectorLayer({
            source: new VectorSource({
                features: interviewerCoordinates
            }),
            style: MapStyles.interviewerStyle,
        });

        // Interviewers areas layer
        const interviewerAreas = getInterviewersAreas(this.props.interviewers);
        this.areasLayer = new VectorLayer({
            source: new VectorSource({
                features: interviewerAreas
            }),
            style: MapStyles.areaStyle,
        });

        // Addresses coordinates layer
        const addressCoordinates = getAddressCoordinates(this.props.addresses);
        this.addressesLayer = new VectorLayer({
            source: new VectorSource({
                features: addressCoordinates
            }),
            style: MapStyles.addressStyle,
        });

        this.view = new View({
            center: [541932, 6589304],
            zoom: 12,
            minZoom: 2,
            maxZoom: 28,
            projection: getProjection('EPSG:3301')
        });

        this.overlay = new Overlay({
            element: this.refs.popup,
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
                this.areasLayer,
                this.addressesLayer,
                this.interviewersLayer,
            ],
            overlays: [this.overlay],
            target: this.refs.mapContainer
        });



        // this.map.addOverlay(this.overlay);

        // console.log(this.props);

        // this.changeInteraction(this.props.interviewers);
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
                    // let element = localOverlay.element;

                    content.current.innerHTML = '<p>test</p>';

                    localOverlay.setPosition(selectedInterviewer.coordinates);
                }
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.interviewers !== this.props.interviewers) {
            // Interviewers prop changed
            const interviewerCoordinates = getInterviewersCoordinates(this.props.interviewers);
            const interviewerAreas = getInterviewersAreas(this.props.interviewers);
            this.interviewersLayer.setSource(new VectorSource({
                features: interviewerCoordinates
            }));

            this.areasLayer.setSource(new VectorSource({
                features: interviewerAreas
            }));

            this.changeInteraction(this.props.interviewers);
        }
        if (prevProps.addresses !== this.props.addresses) {
            // Addresses prop changed
            const addressCoordinates = getAddressCoordinates(this.props.addresses);
            this.addressesLayer.setSource(new VectorSource({
                features: addressCoordinates
            }));
        }
    }

    render() {
        return (
            <React.Fragment>
                <div id="map" ref="mapContainer"></div>
                <div id="popup" className="ol-popup" ref={this.popup}>
                    <a href="#" id="popup-closer" className="ol-popup-closer"></a>
                    <div id="popup-content" ref={this.content}></div>
                </div>
            </React.Fragment>
        );
    }
}

export default Map;
