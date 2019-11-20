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


class Map extends React.Component {
    constructor(props) {
        super(props);

        proj4.defs('EPSG:3301', '+proj=lcc +lat_1=59.33333333333334 +lat_2=58 '
            + '+lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 '
            + '+towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
        register(proj4);
    }

    componentDidMount() {
        const interviewerCoordinates = getInterviewersCoordinates(this.props.interviewers);

        this.interviewersLayer = new VectorLayer({
            source: new VectorSource({
                features: interviewerCoordinates
            }),
            style: MapStyles.interviewersStyle,
        });

        const interviewerAreas = getInterviewersAreas(this.props.interviewers);
        this.interviewerAreas = new VectorLayer({
            source: new VectorSource({
                features: interviewerAreas
            }),
            style: MapStyles.interviewerAreaStyle,
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
                this.interviewerAreas,
            ],
            target: this.refs.mapContainer
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.interviewers !== this.props.interviewers) {
            const interviewerCoordinates = getInterviewersCoordinates(this.props.interviewers);
            const interviewerAreas = getInterviewersAreas(this.props.interviewers);
            this.interviewersLayer.setSource(new VectorSource({
                features: interviewerCoordinates
            }));

            this.interviewerAreas.setSource(new VectorSource({
                features: interviewerAreas
            }))
        }
    }

    render() {
        return (
            <div id="map" ref="mapContainer"> </div>
        );
    }
}

export default Map;
