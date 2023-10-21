import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWltaW8iLCJhIjoiY2l6ZjJoenBvMDA4eDJxbWVkd2IzZjR0ZCJ9.ppwGNP_-LS2K4jUvgXG2pA";

function Map() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    console.log(ref.current);
    if (ref?.current && typeof ref?.current !== undefined) {
      const m = new mapboxgl.Map({
        container: ref?.current || "",
        center: {
          lng:35.6823,
          lat:32.9911
        },
        zoom: 13.1,
        pitch: 85,
        bearing: 80,
        antialias: true,
        style: 'mapbox://styles/mapbox/dark-v11',
      });
      setMap(m);

      m.on("load", () => {
        const bins = 16;
        const maxHeight = 500;
        const binWidth = maxHeight / bins;

        // Divide the buildings into 16 bins based on their true height, using a layer filter.
        for (let i = 0; i < bins; i++) {
          m.addLayer({
            id: `3d-buildings-${i}`,
            source: "composite",
            "source-layer": "building",
            filter: [
              "all",
              ["==", "extrude", "true"],
              [">", "height", i * binWidth],
              ["<=", "height", (i + 1) * binWidth]
            ],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": "#aaa",
              "fill-extrusion-height-transition": {
                duration: 0,
                delay: 0
              },
              "fill-extrusion-opacity": 0.6
            }
          });
        }

        m.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14
        });
        m.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
        m.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 0.0],
            "sky-atmosphere-sun-intensity": 15
          }
        });

        const fogOpts = {
          range: [2, 12],
          color: "white",
          "horizon-blend": 0.1
        };
        m.setFog(fogOpts);

          // Add geolocation control
           const geolocate = new mapboxgl.GeolocateControl({
         positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      });
  
        m.addControl(geolocate);
      });
    }
  }, [ref]);

  return <div id="map-container" ref={ref} />;
}

export default Map;
