import './style.css';
import {Map, View} from 'ol';
import {defaults as defaultControls} from 'ol/control';
import MousePosition from 'ol/control/MousePosition';
import {createStringXY} from 'ol/coordinate';
import GeoJSON from 'ol/format/GeoJSON';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import Overlay from 'ol/Overlay';
import {fromLonLat} from 'ol/proj.js';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  projection: 'EPSG:4326',
});

const image = new CircleStyle({
  radius: 5,
  fill: new Fill({color: 'lime'}),
  stroke: new Stroke({color: 'green', width: 3}),
});

const styles = {
  'Point': new Style({
    image: image,
  }),
  'LineString': new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2,
    }),
  }),
}

const styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};

const vectorSource = new VectorSource({
  url: 'data/walks.geojson',
  format: new GeoJSON(),
})

const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: styleFunction,
});

const map = new Map({
  controls: defaultControls().extend([mousePositionControl]),
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vectorLayer,
  ],
  target: document.getElementById('map'),
  view: new View({
    center: fromLonLat([-1, 52]),
    zoom: 8,
  }),
});

const element = document.getElementById('popup');

const popup = new Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
});
map.addOverlay(popup);

let popover;
function disposePopover() {
  if (popover) {
    popover.dispose();
    popover = undefined;
  }
}
// Display popup on click
map.on('click', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  disposePopover();
  if (!feature) {
    return;
  }
  popup.setPosition(evt.coordinate);
  let content;
  const name = feature.get('name');
  if (name) {
    // Point
    content = name;
  } else {
    // LineString
    const date = feature.get('date');
    const img = feature.get('img');
    const map = feature.get('map');
    content = '<div class="tac">' + date + '</div>';
    if (img) {
      content += '<img src="img/' + img + '.jpeg" height="150">';
    }
    if (map) {
      let map_label;
      if (map.includes('plotaroute')) {
        map_label = 'plotaroute';
      } else {
        map_label = 'osmaps';
      }
      content += '<div class="tac"><a href="' + map + '" target="_blank">' + map_label + '</a></div>';
    }
  }
   
  popover = new bootstrap.Popover(element, {
    placement: 'top',
    html: true,
    content: content,
  });
  popover.show();
});

// Change mouse cursor when over marker
map.on('pointermove', function (e) {
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});
// Close the popup when the map is moved
map.on('movestart', disposePopover);