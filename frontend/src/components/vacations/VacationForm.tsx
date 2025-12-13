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

  // DEBUG: Track photo state changes
  useEffect(() => {
    console.log('=== VACATION FORM PHOTO STATE CHANGED ===');
    console.log('Photo:', photo);
    if (photo) {
      console.log('Photo details:', {
        name: photo.name,
        type: photo.type,
        size: photo.size,
      });
    } else {
      console.log('Photo is NULL');
    }
  }, [photo]);

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

      // DEBUG: Log photo state before submission
      console.log('=== VACATION FORM SUBMIT DEBUG ===');
      console.log('Photo state:', photo);
      console.log('Photo exists?', !!photo);
      if (photo) {
        console.log('Photo details:', {
          name: photo.name,
          type: photo.type,
          size: photo.size,
          lastModified: photo.lastModified,
        });
      }
      console.log('Submit data keys:', Object.keys(submitData));
      console.log('Submit data contains photo?', 'photo' in submitData);
      console.log('Full submit data:', submitData);

      // Show alert with photo status
      const photoStatus = photo
        ? `YES - ${photo.name} (${(photo.size / 1024).toFixed(2)} KB)`
        : 'NO - No photo selected';
      alert(`SUBMITTING FORM\n\nPhoto: ${photoStatus}\n\nLocation: ${formData.location}`);

      await onSubmit(submitData);

      // DEBUG: Log after successful submission
      console.log('Form submitted successfully');
      alert('FORM SUBMITTED - Check console for response details');

      onClose();
    } catch (error) {
      console.error('Error submitting vacation:', error);
      alert(`SUBMISSION ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        {/* DEBUG PANEL - Shows current photo state */}
        <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-blue-900 mb-2">FORM STATE DEBUG</h4>
              <div className="text-xs text-blue-800 space-y-1 font-mono">
                <div>Photo State: <strong>{photo ? 'HAS PHOTO' : 'NO PHOTO'}</strong></div>
                {photo && (
                  <>
                    <div>File Name: <strong>{photo.name}</strong></div>
                    <div>File Type: <strong>{photo.type}</strong></div>
                    <div>File Size: <strong>{(photo.size / 1024).toFixed(2)} KB</strong></div>
                  </>
                )}
                <div className="pt-2 border-t border-blue-300 mt-2">
                  When you click submit, watch for alerts showing:
                  <ul className="list-disc ml-4 mt-1">
                    <li>Form submission status</li>
                    <li>API response with photoUrl</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

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
