import React from 'react';

import View from 'ol/View';
import { get as getProjection } from 'ol/proj';
import olMap from 'ol/Map';
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

require('ol/ol.css');

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

        this.map = new olMap({
            view: this.view,
            controls: [],
            layers: [
                new TileLayer({
                    source: new OSMSource(),
                }),
                this.interviewersLayer,
                this.areasLayer,
                this.addressesLayer,
            ],
            target: this.refs.mapContainer
        });
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
            }))
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
            <div id="map" ref="mapContainer"> </div>
        );
    }
}

export default Map;
