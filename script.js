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
            'circle-color': '#ff63f7',
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

    map.on('mouseenter', 'points-layer', () => {
        map.setPaintProperty('points-layer', 'circle-radius', 10);
    });
    map.on('mouseleave', 'points-layer', () => {
        map.setPaintProperty('points-layer', 'circle-radius', 6);
    });
    
    function filterByArchitect(name) {
        if (!name || name === 'all') {
          map.setFilter('points-layer', null);
        } else {
          map.setFilter('points-layer', ['==', ['get', 'Architect'], name]);
        }
      }
    
      // Optional fly-to coordinates
      const architectCoords = {
        "Ratcliff": [-122.25398674024402, 37.86694861342043],
        "Gutterson": [-122.28328404650837, 37.87923185988532],
        "Fox": [-122.26635850676648, 37.86702556511129],
        "Maybeck": [-122.2561368209097, 37.880741334084306],
        "McNally/Estey": [-122.26249573991412, 37.86708832565816],
        "Snyder": [-122.26683129329301, 37.8693539957692],
        "Hays & Plachek": [-122.27823223561958, 37.85850219391396],
        "Morgan": [-122.25603469384087, 37.86526546726611],
        "Broad 1": [-122.26872120677623, 37.86733743485117],
        "Broad 2": [-122.25744270678044, 37.87763643424825]
      };
    
      let currentMarker = null;
      function flyToArchitect(name) {
        if (currentMarker) {
          currentMarker.remove();
          currentMarker = null;
        }
    
        const coords = architectCoords[name];
        if (!coords) return;
        map.flyTo({ center: coords, zoom: 15, essential: true });
    
        currentMarker = new mapboxgl.Marker({ color: '#ff63f7' })
          .setLngLat(coords)
          .addTo(map);
      }
    
      // Dropdown click handling
      document.querySelectorAll('.dropdown-content a[data-architect]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const architect = link.getAttribute('data-architect');
          console.log('Clicked architect:', architect);
    
          // Filter map
          filterByArchitect(architect);
    
          // Optional: also fly to that architect
          flyToArchitect(architect);
        });
      });
    
      // "Show all" option
      const showAll = document.getElementById('showAll');
      if (showAll) {
        showAll.addEventListener('click', (e) => {
          e.preventDefault();
          filterByArchitect('all');
          if (currentMarker) { currentMarker.remove(); currentMarker = null; }
          map.flyTo({ center: [-122.27, 37.87], zoom: 13 });
        });
      }
    
      // Debugging: confirm GeoJSON property names
      fetch('https://raw.githubusercontent.com/celinehill-10/BAHA-Map/refs/heads/main/data/183data.geojson')
        .then(r => r.json())
        .then(data => {
          if (data.features && data.features.length) {
            console.log('First feature properties:', data.features[0].properties);
          } else {
            console.log('GeoJSON has no features.');
          }
        })
        .catch(err => console.warn('Error loading geojson for debug:', err));
    });
    
