mapboxgl.accessToken = 'pk.eyJ1IjoiY2VsaW5laGlsbCIsImEiOiJjbWg5cmt2bjgwYnFmMmpweWp6cXU0b296In0.uyOrJp1PFlIQQZc0iwB-5g';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/celinehill/cmh9s4t4x000101smgngyfop1', //Your Style URL goes here
  center: [-122.27, 37.87], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9 // starting zoom
    });