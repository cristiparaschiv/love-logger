import { useState, useEffect, FormEvent } from 'react';
import { Vacation, CreateVacationRequest, UpdateVacationRequest } from '../../types/vacation.types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PhotoUpload } from './PhotoUpload';
import { API_CONFIG } from '../../config/api.config';

interface VacationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVacationRequest | UpdateVacationRequest) => Promise<void>;
  vacation?: Vacation | null;
  isLoading?: boolean;
}

export const VacationForm = ({ isOpen, onClose, onSubmit, vacation, isLoading = false }: VacationFormProps) => {
  const [formData, setFormData] = useState({
    location: '',
    startDate: '',
    durationDays: 1,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vacation) {
      // Edit mode - populate form with existing vacation data
      setFormData({
        location: vacation.location,
        startDate: new Date(vacation.startDate).toISOString().split('T')[0],
        durationDays: vacation.durationDays,
      });
    } else {
      // Create mode - reset form
      setFormData({
        location: '',
        startDate: '',
        durationDays: 1,
      });
      setPhoto(null);
    }
    setErrors({});
  }, [vacation, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.durationDays < 1) {
      newErrors.durationDays = 'Duration must be at least 1 day';
    } else if (formData.durationDays > 365) {
      newErrors.durationDays = 'Duration cannot exceed 365 days';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const submitData: CreateVacationRequest | UpdateVacationRequest = {
        location: formData.location.trim(),
        startDate: new Date(formData.startDate).toISOString(),
        durationDays: formData.durationDays,
        ...(photo && { photo }),
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting vacation:', error);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getCurrentPhotoUrl = () => {
    if (vacation?.photoUrl) {
      // Get the backend base URL (remove /api suffix from API_CONFIG.BASE_URL)
      const backendBaseUrl = API_CONFIG.BASE_URL.replace(/\/api$/, '');
      // Use /uploads route for public static files (no auth required)
      return `${backendBaseUrl}/uploads${vacation.photoUrl}`;
    }
    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={vacation ? 'Edit Vacation' : 'Add New Vacation'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location */}
        <div>
          <Input
            label="Location"
            type="text"
            placeholder="e.g., Bali, Indonesia"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            error={errors.location}
            disabled={isLoading}
            required
          />
        </div>

        {/* Start Date */}
        <div>
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            error={errors.startDate}
            disabled={isLoading}
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="durationDays" className="block text-sm font-medium text-gray-700 mb-2">
            Duration (days)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              id="durationDays"
              min="1"
              max="30"
              value={formData.durationDays}
              onChange={(e) => handleChange('durationDays', parseInt(e.target.value, 10))}
              disabled={isLoading}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="text-lg font-semibold text-gray-900 w-16 text-right">
              {formData.durationDays} {formData.durationDays === 1 ? 'day' : 'days'}
            </div>
          </div>
          {errors.durationDays && <p className="mt-1 text-sm text-red-500">{errors.durationDays}</p>}
        </div>

        {/* Photo Upload */}
        <PhotoUpload
          onPhotoSelect={setPhoto}
          currentPhotoUrl={getCurrentPhotoUrl()}
          disabled={isLoading}
        />

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading} isLoading={isLoading} className="flex-1">
            {vacation ? 'Update Vacation' : 'Create Vacation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
