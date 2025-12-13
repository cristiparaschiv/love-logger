import { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Countdown } from '../components/vacations/Countdown';
import { VacationGrid } from '../components/vacations/VacationGrid';
import { VacationForm } from '../components/vacations/VacationForm';
import { useVacations } from '../hooks/useVacations';
import { Vacation, CreateVacationRequest, UpdateVacationRequest } from '../types/vacation.types';

export const Vacations = () => {
  const {
    upcomingVacations,
    pastVacations,
    isLoading,
    error,
    createVacation,
    updateVacation,
    deleteVacation,
    clearError,
  } = useVacations();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVacation, setEditingVacation] = useState<Vacation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextVacation = upcomingVacations[0] || null;

  const handleAddClick = () => {
    setEditingVacation(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (vacation: Vacation) => {
    setEditingVacation(vacation);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingVacation(null);
    clearError();
  };

  const handleSubmit = async (data: CreateVacationRequest | UpdateVacationRequest) => {
    setIsSubmitting(true);
    try {
      if (editingVacation) {
        await updateVacation(editingVacation.id, data as UpdateVacationRequest);
      } else {
        await createVacation(data as CreateVacationRequest);
      }
      handleCloseForm();
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to submit vacation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVacation(id);
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to delete vacation:', err);
    }
  };

  if (isLoading && upcomingVacations.length === 0 && pastVacations.length === 0) {
    return (
      <Layout>
        <div className="container-app py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-app py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Vacations</h1>
          <Button variant="primary" onClick={handleAddClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Vacation
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-red-400 mt-0.5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-3 text-red-400 hover:text-red-600"
                aria-label="Dismiss error"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Upcoming Vacation Countdown or Empty State */}
        {nextVacation ? (
          <Countdown vacation={nextVacation} />
        ) : (
          <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg shadow-md p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-pink-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Time to book a vacation!</h2>
            <p className="text-gray-600 mb-6">You don't have any upcoming vacations planned. Let's change that!</p>
            <Button variant="primary" onClick={handleAddClick}>
              Plan Your Next Adventure
            </Button>
          </div>
        )}

        {/* Upcoming Vacations Grid */}
        {upcomingVacations.length > 0 && (
          <VacationGrid
            vacations={upcomingVacations}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            title="Upcoming Vacations"
            emptyMessage=""
          />
        )}

        {/* Past Vacations Grid */}
        <VacationGrid
          vacations={pastVacations}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          title="Past Vacations"
          emptyMessage="No past vacations yet. Your memories will appear here!"
        />

        {/* Vacation Form Modal */}
        <VacationForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          vacation={editingVacation}
          isLoading={isSubmitting}
        />
      </div>
    </Layout>
  );
};
