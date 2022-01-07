import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYS10cmV0eWFrb3YiLCJhIjoiY2t5MTZvM2xrMDhtNjJ2cG52MWxzNHFsayJ9._L-NcIHL-lgOjGNVgBvjaQ';

const markersLngLat = [
  [2.3364, 48.86091],
  [2.3333, 48.8602],
  [2.3397, 48.8607],
  [2.3330, 48.8619],
  [2.3365, 48.8625],
]
const centerMarkerIndex = 0;
const markers = [];

export default function init() {
  const map = new mapboxgl.Map({
    container: 'contacts-map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: markersLngLat[centerMarkerIndex],
    zoom: 16
  });

  markersLngLat.forEach((lngLat, i) => {
    const marker = new mapboxgl.Marker({
      color: i === centerMarkerIndex ? '#171717' : '#757575'
    })
      .setLngLat(lngLat)
      .addTo(map);
    markers.push(marker);
  })
}
