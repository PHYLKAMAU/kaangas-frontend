import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GoogleMap = ({ 
  center = { lat: -1.2921, lng: 36.8219 }, 
  zoom = 12, 
  vendors = [], 
  onVendorSelect = () => {},
  height = '400px' 
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places', 'geometry']
      });

      try {
        const google = await loader.load();
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          setMap(mapInstance);

          // Add user location marker
          new google.maps.Marker({
            position: center,
            map: mapInstance,
            title: 'Your Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#20B2AA">
                  <circle cx="12" cy="12" r="8"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24)
            }
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [center, zoom]);

  useEffect(() => {
    if (map && vendors.length > 0) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));

      // Add vendor markers
      const newMarkers = vendors.map(vendor => {
        if (vendor.latitude && vendor.longitude) {
          const marker = new window.google.maps.Marker({
            position: { lat: parseFloat(vendor.latitude), lng: parseFloat(vendor.longitude) },
            map,
            title: vendor.name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#FF6347">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32)
            }
          });

          marker.addListener('click', () => {
            onVendorSelect(vendor);
          });

          return marker;
        }
        return null;
      }).filter(Boolean);

      setMarkers(newMarkers);
    }
  }, [map, vendors, onVendorSelect]);

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height }} 
      className="rounded-3"
    />
  );
};

export default GoogleMap;