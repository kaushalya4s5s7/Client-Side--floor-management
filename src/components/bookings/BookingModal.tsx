import React, { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useBookingStore } from '@/store/bookingStore';
import { bookingService } from '@/api/BookingService';
import { ModalFactory } from '@/factory/ModalFactory';
import { ButtonFactory } from '@/factory/ButtonFactory';
import { toast } from '@/factory/ToastFactory';
import { formatErrorForDisplay } from '@/errors/errorHandler';
import type { CreateBookingPayload } from '@/types';

export const BookingModal: React.FC = () => {
  const { modal, closeModal } = useUIStore();
  const selectedRoom = useBookingStore((state) => state.selectedRoom);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<CreateBookingPayload>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    bufferBefore: 0,
    bufferAfter: 0,
    capacity: selectedRoom?.capacity || 1,
    participants: [],
  });

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

    if (!selectedRoom) {
      toast.error('No room selected');
      return;
    }

    setIsLoading(true);

    try {
      await bookingService.createBooking(selectedRoom.id, formData);
      toast.success('Booking created successfully!');
      closeModal();
    } catch (error) {
      toast.error(formatErrorForDisplay(error));
    } finally {
      setIsLoading(false);
    }
  };

  const isOpen = modal.isOpen && modal.type === 'booking';

  return (
    <ModalFactory
      isOpen={isOpen}
      onClose={closeModal}
      title={`Book ${selectedRoom?.name || 'Room'}`}
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
            placeholder="e.g., Team Meeting"
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
            placeholder="Add any additional details..."
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
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
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
              max={selectedRoom?.capacity || 100}
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            {selectedRoom && (
              <p className="text-xs text-gray-500 mt-1">
                Room capacity: {selectedRoom.capacity}
              </p>
            )}
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
            Create Booking
          </ButtonFactory>
        </div>
      </form>
    </ModalFactory>
  );
};
