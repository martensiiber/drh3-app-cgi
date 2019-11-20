import React from 'react';

import View from 'ol/View';
import { get as getProjection } from 'ol/proj';
import olMap from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

require('ol/ol.css');

class Map extends React.Component {
    constructor(props) {
        super(props);

        proj4.defs('EPSG:3301', '+proj=lcc +lat_1=59.33333333333334 +lat_2=58 '
            + '+lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 '
            + '+towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
        register(proj4);
    }

    componentDidMount() {
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
                new Tile({
                    source: new OSM()
                })
            ],
            target: this.refs.mapContainer
        });
    }

    render() {
        return (
            <div id="map" ref="mapContainer"> </div>
        );
    }
}

export default Map;
