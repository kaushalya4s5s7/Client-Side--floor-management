import React, { useState, useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import { bookingService } from '@/api/BookingService';
import { ModalFactory } from '@/factory/ModalFactory';
import { ButtonFactory } from '@/factory/ButtonFactory';
import { toast } from '@/factory/ToastFactory';
import { formatErrorForDisplay } from '@/errors/errorHandler';
import { getMinDateTime, validateBookingTimes } from '@/utils/dateValidation';
import type { Booking, UpdateBookingPayload } from '@/types';

export const EditBookingModal: React.FC = () => {
  const { modal, closeModal } = useUIStore();
  const booking = modal.data?.booking as Booking | undefined;
  const onSuccess = modal.data?.onSuccess as (() => void) | undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [minDateTime, setMinDateTime] = useState('');
  const [formData, setFormData] = useState<UpdateBookingPayload>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    bufferBefore: 0,
    bufferAfter: 0,
    capacity: 1,
  });

  useEffect(() => {
    setMinDateTime(getMinDateTime());
  }, []);

  useEffect(() => {
    if (booking) {
      setFormData({
        title: booking.title,
        description: booking.description || '',
        startTime: booking.startTime,
        endTime: booking.endTime,
        bufferBefore: booking.bufferBefore || 0,
        bufferAfter: booking.bufferAfter || 0,
        capacity: booking.capacity,
      });
    }
  }, [booking]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'capacity' || name === 'bufferBefore' || name === 'bufferAfter'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking) {
      toast.error('No booking selected');
      return;
    }

    // Validate booking times
    if (formData.startTime && formData.endTime) {
      const validation = validateBookingTimes(
        formData.startTime,
        formData.endTime
      );

      if (!validation.isValid) {
        validation.errors.forEach((error) => toast.error(error));
        return;
      }
    }

    // Validate capacity if room info is available
    if (booking.room && formData.capacity && formData.capacity > booking.room.capacity) {
      toast.error(`Capacity cannot exceed room capacity (${booking.room.capacity})`);
      return;
    }

    setIsLoading(true);

    try {
      await bookingService.updateBooking(booking.id, formData);
      toast.success('Booking updated successfully!');
      if (onSuccess) onSuccess();
      closeModal();
    } catch (error) {
      toast.error(formatErrorForDisplay(error));
    } finally {
      setIsLoading(false);
    }
  };

  const isOpen = modal.isOpen && modal.type === 'edit-booking';

  return (
    <ModalFactory
      isOpen={isOpen}
      onClose={closeModal}
      title="Edit Booking"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Booking Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Start Time *
            </label>
            <input
              id="startTime"
              name="startTime"
              type="datetime-local"
              required
              min={minDateTime}
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
           
          </div>

          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              End Time *
            </label>
            <input
              id="endTime"
              name="endTime"
              type="datetime-local"
              required
              min={formData.startTime || minDateTime}
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be after start time
            </p>
          </div>

          <div>
            <label
              htmlFor="bufferBefore"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Buffer Before (minutes)
            </label>
            <input
              id="bufferBefore"
              name="bufferBefore"
              type="number"
              min="0"
              step="5"
              value={formData.bufferBefore}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="bufferAfter"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Buffer After (minutes)
            </label>
            <input
              id="bufferAfter"
              name="bufferAfter"
              type="number"
              min="0"
              step="5"
              value={formData.bufferAfter}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Expected Capacity *
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

        <div className="flex gap-3 pt-4">
          <ButtonFactory
            type="button"
            variant="secondary"
            onClick={closeModal}
            fullWidth
          >
            Cancel
          </ButtonFactory>
          <ButtonFactory type="submit" loading={isLoading} fullWidth>
            Update Booking
          </ButtonFactory>
        </div>
      </form>
    </ModalFactory>
  );
};
