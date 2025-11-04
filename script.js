mapboxgl.accessToken = 'pk.eyJ1IjoiY2VsaW5laGlsbCIsImEiOiJjbWg5cmt2bjgwYnFmMmpweWp6cXU0b296In0.uyOrJp1PFlIQQZc0iwB-5g';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/celinehill/cmh9s4t4x000101smgngyfop1', //Your Style URL goes here
  center: [-122.27, 37.87], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 13 // starting zoom
    });
    
map.on('load', function() {
    map.addSource('points-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/celinehill-10/BAHA-Map/refs/heads/main/data/183data.geojson'
    });

    map.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points-data',
        paint: {
            'circle-color': '#4264FB',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

    map.on('click', 'points-layer', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const properties = e.features[0].properties;

            const popupContent = `
              <div>
                  <h3>${properties.Landmark}</h3>
                  <p><strong>Address:</strong> ${properties.Address}</p>
                  <p><strong>Architect & Date:</strong> ${properties.Architect_Date}</p>
                  <p><strong>Designated:</strong> ${properties.Designated}</p>
                  ${properties.Link ? `<p><a href="${properties.Link}" target="_blank">More Information</a></p>` : ''}
                  ${properties.Notes ? `<p><strong>Notes:</strong> ${properties.Notes}</p>` : ''}
              </div>
          `;

          new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(popupContent)
              .addTo(map);

    });

    // Change cursor to pointer when hovering over points
    map.on('mouseenter', 'points-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change cursor back when leaving points
    map.on('mouseleave', 'points-layer', () => {
        map.getCanvas().style.cursor = '';
    });
    
});
