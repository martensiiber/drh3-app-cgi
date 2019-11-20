import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export default class MapStyles {
  static interviewersStyle = new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.3)',
      }),
      stroke: new Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 2,
      }),
    }),
  });

  static interviewerAreaStyle = new Style({
    fill: new Fill({
      color: 'rgba(74, 144, 226, 0.3)',
    }),
  });
};
