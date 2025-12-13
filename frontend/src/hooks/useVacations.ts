import { useEffect, useCallback } from 'react';
import { useVacationStore } from '../store/vacationStore';
import { vacationService } from '../services/vacation.service';
import { websocketService } from '../services/websocket.service';
import { Vacation, CreateVacationRequest, UpdateVacationRequest } from '../types/vacation.types';

export const useVacations = () => {
  const {
    vacations,
    upcomingVacations,
    pastVacations,
    selectedVacation,
    isLoading,
    error,
    setVacations,
    addVacation,
    updateVacation,
    removeVacation,
    setSelectedVacation,
    setLoading,
    setError,
    clearError,
  } = useVacationStore();

  // Fetch all vacations
  const fetchVacations = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const fetchedVacations = await vacationService.getAllVacations();
      setVacations(fetchedVacations);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch vacations');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setVacations, setError, clearError]);

  // Create a new vacation
  const createVacation = useCallback(
    async (data: CreateVacationRequest) => {
      setLoading(true);
      clearError();
      try {
        const newVacation = await vacationService.createVacation(data);
        addVacation(newVacation);
        return newVacation;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to create vacation';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, addVacation, setError, clearError]
  );

  // Update a vacation
  const updateVacationById = useCallback(
    async (id: string, data: UpdateVacationRequest) => {
      setLoading(true);
      clearError();
      try {
        const updatedVacation = await vacationService.updateVacation(id, data);
        updateVacation(updatedVacation);
        return updatedVacation;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to update vacation';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, updateVacation, setError, clearError]
  );

  // Delete a vacation
  const deleteVacation = useCallback(
    async (id: string) => {
      setLoading(true);
      clearError();
      try {
        await vacationService.deleteVacation(id);
        removeVacation(id);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to delete vacation';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, removeVacation, setError, clearError]
  );

  // Setup WebSocket listeners for real-time updates
  useEffect(() => {
    const handleVacationCreated = (data: unknown) => {
      const vacationData = data as { vacation: Vacation };
      addVacation(vacationData.vacation);
    };

    const handleVacationUpdated = (data: unknown) => {
      const vacationData = data as { vacation: Vacation };
      updateVacation(vacationData.vacation);
    };

    const handleVacationDeleted = (data: unknown) => {
      const vacationData = data as { id: string };
      removeVacation(vacationData.id);
    };

    websocketService.on('vacation:created', handleVacationCreated);
    websocketService.on('vacation:updated', handleVacationUpdated);
    websocketService.on('vacation:deleted', handleVacationDeleted);

    return () => {
      websocketService.off('vacation:created', handleVacationCreated);
      websocketService.off('vacation:updated', handleVacationUpdated);
      websocketService.off('vacation:deleted', handleVacationDeleted);
    };
  }, [addVacation, updateVacation, removeVacation]);

  // Fetch vacations on mount
  useEffect(() => {
    fetchVacations();
  }, []);

  return {
    vacations,
    upcomingVacations,
    pastVacations,
    selectedVacation,
    isLoading,
    error,
    fetchVacations,
    createVacation,
    updateVacation: updateVacationById,
    deleteVacation,
    setSelectedVacation,
    clearError,
  };
};
