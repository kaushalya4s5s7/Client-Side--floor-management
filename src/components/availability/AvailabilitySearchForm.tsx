import React, { useState, useEffect } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { bookingService } from '@/api/BookingService';
import { ButtonFactory } from '@/factory/ButtonFactory';
import { toast } from '@/factory/ToastFactory';
import { formatErrorForDisplay } from '@/errors/errorHandler';
import { getMinDateTime, validateSearchWindow } from '@/utils/dateValidation';
import type { AvailabilitySearchParams } from '@/types';

export const AvailabilitySearchForm: React.FC = () => {
  const { setSearchResults, setSearchParams } = useBookingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [minDateTime, setMinDateTime] = useState('');
  const [formData, setFormData] = useState<AvailabilitySearchParams>({
    windowStart: '',
    windowEnd: '',
    duration: 60,
    capacity: 1,
    features: [],
  });

  useEffect(() => {
    // Set minimum datetime on component mount
    setMinDateTime(getMinDateTime());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' || name === 'capacity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate search window
    const validation = validateSearchWindow(
      formData.windowStart,
      formData.windowEnd,
      formData.duration
    );

    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    setIsLoading(true);

    try {
      const results = await bookingService.searchAvailability(formData);
      setSearchResults(results);
      setSearchParams(formData);
      toast.success(`Found ${results.length} available rooms`);
    } catch (error) {
      toast.error(formatErrorForDisplay(error));
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-card-lg shadow-card p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Search Available Rooms
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="windowStart"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Window Start *
            </label>
            <input
              id="windowStart"
              name="windowStart"
              type="datetime-local"
              required
              min={minDateTime}
              value={formData.windowStart}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be in the future
            </p>
          </div>

          <div>
            <label
              htmlFor="windowEnd"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Window End *
            </label>
            <input
              id="windowEnd"
              name="windowEnd"
              type="datetime-local"
              required
              min={formData.windowStart || minDateTime}
              value={formData.windowEnd}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be after window start
            </p>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Duration (minutes) *
            </label>
            <input
              id="duration"
              name="duration"
              type="number"
              required
              min="15"
              step="15"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              Meeting duration (minimum 15 min)
            </p>
          </div>

          <div>
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Capacity Required
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              required
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <ButtonFactory
          type="submit"
          loading={isLoading}
          fullWidth
          size="lg"
        >
          Search Availability
        </ButtonFactory>
      </form>
    </div>
  );
};
