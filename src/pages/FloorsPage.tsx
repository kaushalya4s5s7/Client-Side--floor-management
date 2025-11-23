import React, { useState, useEffect } from 'react';
import { floorService } from '@/api/FloorService';
import { toast } from '@/factory/ToastFactory';
import { formatErrorForDisplay } from '@/errors/errorHandler';
import { LoaderFactory } from '@/factory/LoaderFactory';
import { ButtonFactory } from '@/factory/ButtonFactory';
import { FloorRoomCard } from '@/components/floors/FloorRoomCard';
import { AddFloorRoomModal } from '@/components/floors/AddFloorRoomModal';
import { EditFloorRoomModal } from '@/components/floors/EditFloorRoomModal';
import type { Floor, FloorRoom } from '@/types';

export const FloorsPage: React.FC = () => {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [rooms, setRooms] = useState<FloorRoom[]>([]);
  const [isLoadingFloors, setIsLoadingFloors] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<FloorRoom | null>(null);

  // Load all floors on mount
  useEffect(() => {
    loadFloors();
  }, []);

  // Load rooms when floor is selected
  useEffect(() => {
    if (selectedFloor) {
      loadRoomsByFloor(selectedFloor.id);
    }
  }, [selectedFloor]);

  const loadFloors = async () => {
    setIsLoadingFloors(true);
    try {
      const data = await floorService.getAllFloors();
      setFloors(data);

      // Auto-select first floor
      if (data.length > 0 && !selectedFloor) {
        setSelectedFloor(data[0]);
      }
    } catch (error) {
      toast.error(formatErrorForDisplay(error));
    } finally {
      setIsLoadingFloors(false);
    }
  };

  const loadRoomsByFloor = async (floorId: string) => {
    setIsLoadingRooms(true);
    try {
      const data = await floorService.getRoomsByFloorId(floorId);
      setRooms(data);
    } catch (error) {
      toast.error(formatErrorForDisplay(error));
      setRooms([]);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const handleFloorSelect = (floor: Floor) => {
    setSelectedFloor(floor);
  };

  const handleAddRoom = () => {
    if (!selectedFloor) {
      toast.error('Please select a floor first');
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleEditRoom = (room: FloorRoom) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await floorService.deleteFloorRoom(roomId);
      toast.success('Room deleted successfully');

      // Refresh rooms list
      if (selectedFloor) {
        loadRoomsByFloor(selectedFloor.id);
      }
    } catch (error) {
      toast.error(formatErrorForDisplay(error));
    }
  };

  const handleSuccess = () => {
    if (selectedFloor) {
      loadRoomsByFloor(selectedFloor.id);
    }
  };

  if (isLoadingFloors) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoaderFactory size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4" style={{ fontFamily: '"Elms Sans", sans-serif' }}>
      {/* Page Header */}
      <div className="flex justify-between items-center p-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Floor Management</h1>
          <p className="text-gray-600 text-sm">
            Manage rooms across different floors
          </p>
        </div>
        <ButtonFactory onClick={handleAddRoom} disabled={!selectedFloor}>
          Add Room
        </ButtonFactory>
      </div>

      {/* Floor Selection Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-3 border border-gray-100">
        <div className="flex gap-2 overflow-x-auto custom-scrollbar">
          {floors.map((floor) => (
            <button
              key={floor.id}
              onClick={() => handleFloorSelect(floor)}
              className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedFloor?.id === floor.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {floor.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Floor Info */}
      {selectedFloor && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-primary-900">
            {selectedFloor.name}
          </h2>
          {selectedFloor.description && (
            <p className="text-sm text-primary-700 mt-2">
              {selectedFloor.description}
            </p>
          )}
          <p className="text-sm text-primary-600 mt-3 font-medium">
            {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} on this floor
          </p>
        </div>
      )}

      {/* Rooms List */}
      {isLoadingRooms ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <LoaderFactory size="lg" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No Rooms Yet
            </h3>
            <p className="text-gray-600 mb-8 text-sm">
              {selectedFloor
                ? `Add the first room to ${selectedFloor.name}`
                : 'Select a floor to view rooms'}
            </p>
            {selectedFloor && (
              <ButtonFactory onClick={handleAddRoom} className=' mx-auto'>
                Add First Room
              </ButtonFactory>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <FloorRoomCard
              key={room.id}
              room={room}
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoom}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedFloor && (
        <AddFloorRoomModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          floorId={selectedFloor.id}
          floorName={selectedFloor.name}
          onSuccess={handleSuccess}
        />
      )}

      <EditFloorRoomModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRoom(null);
        }}
        room={selectedRoom}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
