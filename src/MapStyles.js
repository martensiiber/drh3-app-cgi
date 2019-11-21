import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export default class MapStyles {
  static interviewerStyle = new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: 'rgb(77, 138, 240)',
      }),
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 1)',
        width: 2,
      }),
    }),
  });

  static areaStyle = new Style({
    fill: new Fill({
      color: 'rgba(0, 90, 163, 0.2)',
    }),
    stroke: new Stroke({
      color: 'rgb(0, 90, 163)',
      width: 2,
    }),
  });

  static addressStyle = {
    symbol: {
      symbolType: 'circle',
      size: 6,
      color: '#ff2200',
      rotateWithView: false,
      offset: [0, 0],
      opacity: 1
    },
  };
  static incompleteAddressStyle = {
    symbol: {
        symbolType: 'circle',
        size: 6,
        color: '#cc0000',
        rotateWithView: false,
        offset: [0, 0],
        opacity: 1
    },
  };

  static completeAddressStyle = {
    symbol: {
        symbolType: 'circle',
        size: 6,
        color: '#308428',
        rotateWithView: false,
        offset: [0, 0],
        opacity: 1
      },
  };
};
