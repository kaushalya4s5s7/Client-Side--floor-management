import React from 'react';
import type { FloorRoom } from '@/types';
import { ButtonFactory } from '@/factory/ButtonFactory';

interface FloorRoomCardProps {
  room: FloorRoom;
  onEdit: (room: FloorRoom) => void;
  onDelete: (roomId: string) => void;
}

export const FloorRoomCard: React.FC<FloorRoomCardProps> = ({
  room,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${room.name}"?`)) {
      onDelete(room.id);
    }
  };

  return (
    <div className="bg-white rounded-card-lg shadow-card p-6 hover:shadow-card-hover transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Capacity: {room.capacity} people
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
        <div className="flex flex-wrap gap-2">
          {room.features.map((feature) => (
            <span
              key={feature}
              className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <ButtonFactory
          onClick={() => onEdit(room)}
          variant="secondary"
          size="sm"
          fullWidth
        >
          Edit
        </ButtonFactory>
        <ButtonFactory
          onClick={handleDelete}
          variant="danger"
          size="sm"
          fullWidth
        >
          Delete
        </ButtonFactory>
      </div>
    </div>
  );
};
