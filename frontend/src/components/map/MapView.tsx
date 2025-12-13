import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Event } from '../../types/event.types';

// Fix Leaflet default icon issue with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom heart icon for markers
const heartIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" width="32" height="32">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapViewProps {
  events: Event[];
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (event: Event) => void;
  center?: [number, number];
  zoom?: number;
}

// Component to handle map click events
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to handle map center changes
function MapCenterController({ center, zoom }: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  const prevCenterRef = useRef<[number, number] | null>(null);
  const prevZoomRef = useRef<number | null>(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    // Validate center array exists and has 2 elements
    if (!Array.isArray(center) || center.length !== 2) {
      return;
    }

    const [lat, lng] = center;

    // Validate lat/lng are finite numbers (not NaN, not Infinity)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    // Validate zoom is a finite number
    if (!Number.isFinite(zoom)) {
      return;
    }

    // Check if this is the first render or if values actually changed
    const prevCenter = prevCenterRef.current;
    const prevZoom = prevZoomRef.current;

    // Skip if center and zoom haven't changed
    if (prevCenter && prevCenter[0] === lat && prevCenter[1] === lng && prevZoom === zoom) {
      return;
    }

    // Update refs
    prevCenterRef.current = [lat, lng];
    prevZoomRef.current = zoom;

    // Skip animation on first render, just update the refs
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    // Helper function to check if map is ready for animation
    const isMapReady = (): boolean => {
      try {
        const size = map.getSize();
        return size.x > 0 && size.y > 0;
      } catch (error) {
        console.warn('MapCenterController: Error checking map size', error);
        return false;
      }
    };

    // Helper function to safely animate to new position
    const animateToPosition = () => {
      if (!isMapReady()) {
        // Fallback to instant view change if map isn't ready
        try {
          map.setView([lat, lng], zoom);
        } catch (error) {
          console.error('MapCenterController: setView failed', error);
        }
        return;
      }

      try {
        // Stop any in-progress animations
        map.stop();

        // Attempt flyTo animation
        map.flyTo([lat, lng], zoom, {
          duration: 1.5,
        });
      } catch (error) {
        console.error('MapCenterController: flyTo failed, falling back to setView', error);
        // Fallback to instant view change
        try {
          map.setView([lat, lng], zoom);
        } catch (fallbackError) {
          console.error('MapCenterController: setView fallback also failed', fallbackError);
        }
      }
    };

    // Use requestAnimationFrame to ensure map is fully rendered
    // This handles the race condition where Leaflet's internal state
    // might not be ready even though the map object exists
    requestAnimationFrame(() => {
      animateToPosition();
    });
  }, [center, zoom, map]);

  return null;
}

// Default coordinates (London)
const DEFAULT_CENTER: [number, number] = [51.505, -0.09];
const DEFAULT_ZOOM = 3;

export const MapView = ({
  events,
  onMapClick,
  onMarkerClick,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
}: MapViewProps) => {
  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full rounded-lg z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onClick={onMapClick} />
        <MapCenterController center={center} zoom={zoom} />

        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={heartIcon}
            eventHandlers={{
              click: () => onMarkerClick(event),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-1">{event.nearestCity || 'Unknown'}</h3>
                <p className="text-xs text-gray-600 mb-1">
                  {new Date(event.eventDate).toLocaleDateString()}
                </p>
                <p className="text-sm">{event.note}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Instructions overlay */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg shadow-lg px-4 py-2 z-10 max-w-xs">
        <p className="text-sm text-gray-700">Click on the map to add a new event</p>
      </div>
    </div>
  );
};
