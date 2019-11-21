import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export default class MapStyles {
  static interviewerStyle = new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: 'rgba(74, 144, 226, 0.7)',
      }),
      stroke: new Stroke({
        color: 'rgba(74, 144, 226, 1)',
        width: 2,
      }),
    }),
  });

  static areaStyle = new Style({
    fill: new Fill({
      color: 'rgba(74, 144, 226, 0.3)',
    }),
  });

  static addressStyle = new Style({
    image: new Circle({
      radius: 1,
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.3)',
      }),
      stroke: new Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 2,
      }),
    }),
  });
};
