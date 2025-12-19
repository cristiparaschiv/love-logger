import { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { MapView } from '../components/map/MapView';
import { EventList } from '../components/map/EventList';
import { EventForm } from '../components/map/EventForm';
import { LocationSearch } from '../components/map/LocationSearch';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useEvents } from '../hooks/useEvents';
import { eventService } from '../services/event.service';
import { Event } from '../types/event.types';

export const Map = () => {
  const { events, isLoading, error, createEvent, updateEvent, deleteEvent } = useEvents();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestCity, setNearestCity] = useState<string>('');
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]);
  const [mapZoom, setMapZoom] = useState(3);

  // Handle map click - open modal to create event
  const handleMapClick = async (lat: number, lng: number) => {
    setSelectedCoords({ lat, lng });
    setEditingEvent(null);
    setIsGeocodingLoading(true);
    setIsModalOpen(true);

    // Reverse geocode to get city name
    try {
      const result = await eventService.reverseGeocode(lat, lng);
      setNearestCity(result.city);
    } catch (error) {
      console.error('Geocoding error:', error);
      setNearestCity('Unknown Location');
    } finally {
      setIsGeocodingLoading(false);
    }
  };

  // Handle marker click - show event details in list
  const handleMarkerClick = (event: Event) => {
    // Scroll to the event in the list
    const element = document.getElementById(`event-${event.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Handle event click from list - zoom map to event location
  const handleEventClick = (event: Event) => {
    // Validate coordinates before updating state
    if (!Number.isFinite(event.latitude) || !Number.isFinite(event.longitude)) {
      console.error('Invalid event coordinates:', event);
      return;
    }
    setMapCenter([event.latitude, event.longitude]);
    setMapZoom(16);
  };

  // Handle edit event
  const handleEditEvent = async (event: Event) => {
    setEditingEvent(event);
    setSelectedCoords({ lat: event.latitude, lng: event.longitude });
    setNearestCity(event.nearestCity || '');
    setIsModalOpen(true);
  };

  // Handle delete event
  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Handle form submit
  const handleFormSubmit = async (data: {
    note: string;
    eventDate: string;
    latitude: number;
    longitude: number;
  }) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, data);
      } else {
        await createEvent(data);
      }
      setIsModalOpen(false);
      setEditingEvent(null);
      setSelectedCoords(null);
      setNearestCity('');
    } catch (error) {
      console.error('Form submit error:', error);
    }
  };

  // Handle location search
  const handleLocationSelect = (lat: number, lon: number) => {
    // Validate coordinates before updating state
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      console.error('Invalid coordinates received:', { lat, lon });
      return;
    }
    setMapCenter([lat, lon]);
    setMapZoom(10);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setSelectedCoords(null);
    setNearestCity('');
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)]">
        {/* Desktop Layout: Side by side */}
        <div className="hidden lg:grid lg:grid-cols-2 h-full gap-4 p-4">
          {/* Map Section */}
          <div className="flex flex-col gap-4">
            <LocationSearch onSelectLocation={handleLocationSelect} />
            <div className="flex-1 min-h-0">
              <MapView
                events={events}
                onMapClick={handleMapClick}
                onMarkerClick={handleMarkerClick}
                center={mapCenter}
                zoom={mapZoom}
              />
            </div>
          </div>

          {/* Event List Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Events ({events.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading && events.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <EventList
                  events={events}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  onEventClick={handleEventClick}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout: Stacked */}
        <div className="lg:hidden flex flex-col h-full">
          {/* Location Search */}
          <div className="p-4 bg-white border-b border-gray-200">
            <LocationSearch onSelectLocation={handleLocationSelect} />
          </div>

          {/* Map (takes 50% of height) */}
          <div className="flex-1 min-h-0">
            <MapView
              events={events}
              onMapClick={handleMapClick}
              onMarkerClick={handleMarkerClick}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>

          {/* Event List (takes 50% of height) */}
          <div className="flex-1 min-h-0 bg-gray-50 border-t border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 bg-white border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Events ({events.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading && events.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <EventList
                  events={events}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  onEventClick={handleEventClick}
                />
              )}
            </div>
          </div>
        </div>

        {/* Event Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingEvent ? 'Edit Event' : 'Create New Event'}
        >
          {selectedCoords && (
            <div>
              {isGeocodingLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <EventForm
                  event={editingEvent}
                  latitude={selectedCoords.lat}
                  longitude={selectedCoords.lng}
                  nearestCity={nearestCity}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCloseModal}
                  isLoading={isLoading}
                />
              )}
            </div>
          )}
        </Modal>

        {/* Error Toast */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {error}
          </div>
        )}
      </div>
    </Layout>
  );
};
