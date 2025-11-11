import React from 'react';
import roomService from '../services/roomService';

// Custom SVG Icons
const MapPinIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

class EditableRoomCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      rooms: [],
      selectedRoom: null,
      selectedRoomIndex: null,
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    this.loadRooms();
    const p = this.props.patient;
    const roomId = p.room_id || p.room;
    const noRoom = !p || roomId === 0 || roomId === '0' || roomId === null || typeof roomId === 'undefined' || roomId === '';
    if (noRoom) {
      this.setState({ isEditing: true });
    }
  }

  componentDidUpdate(prevProps) {
    // If patient changed and we have rooms loaded, rematch the room
    if (prevProps.patient.id !== this.props.patient.id || 
        prevProps.patient.room_id !== this.props.patient.room_id ||
        prevProps.patient.room !== this.props.patient.room) {
      const { patient } = this.props;
      const { rooms } = this.state;
      const roomId = patient.room_id || patient.room;
      
      let matchedRoom = null;
      let matchedIndex = null;
      
      if (roomId && rooms && rooms.length > 0) {
        matchedIndex = rooms.findIndex(function(room) {
          return room.id == roomId || room.id === roomId;
        });
        if (matchedIndex >= 0) {
          matchedRoom = rooms[matchedIndex];
        }
      }
      
      const noRoom = !patient || roomId === 0 || roomId === '0' || roomId === null || typeof roomId === 'undefined' || roomId === '';
      
      this.setState({
        selectedRoom: matchedRoom,
        selectedRoomIndex: matchedIndex,
        isEditing: noRoom && !this.state.isEditing ? true : this.state.isEditing
      });
    }
  }

  loadRooms = async () => {
    this.setState({ loading: true, error: null });
    
    try {
      let rooms;
      try {
        rooms = await roomService.getActiveExaminationRooms();
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        rooms = roomService.getMockRooms();
      }
      
      // Match patient room_id with rooms list
      const { patient } = this.props;
      const roomId = patient.room_id || patient.room;
      let matchedRoom = null;
      let matchedIndex = null;
      
      if (roomId && rooms && rooms.length > 0) {
        matchedIndex = rooms.findIndex(function(room) {
          return room.id == roomId || room.id === roomId;
        });
        if (matchedIndex >= 0) {
          matchedRoom = rooms[matchedIndex];
        }
      }
      
      this.setState({ 
        rooms: Array.isArray(rooms) ? rooms : [],
        loading: false,
        selectedRoom: matchedRoom,
        selectedRoomIndex: matchedIndex
      });
      
    } catch (error) {
      this.setState({ 
        error: 'ไม่สามารถโหลดข้อมูลห้องตรวจได้',
        loading: false 
      });
    }
  }

  handleEdit = () => {
    this.setState({ isEditing: true });
  }

  handleCancel = () => {
    this.setState({ 
      isEditing: false,
      selectedRoom: null 
    });
  }

  handleRoomSelect = (room) => {
    const index = this.state.rooms.findIndex(function(r) { return r === room; });
    this.setState({ selectedRoom: room, selectedRoomIndex: index >= 0 ? index : null });
  }

  handleSave = async () => {
    const { selectedRoom } = this.state;
    const { patient, onRoomChange } = this.props;
    
    if (!selectedRoom || !onRoomChange) {
      return;
    }

    try {
      const url = 'http://localhost:3002/api/v1/queues/EnterQueue';
      console.log('Full API path: POST', url);
      console.log('Request body:', JSON.stringify({
        ...patient,
        room_id: selectedRoom.id,
        status: 'ADD'
      }));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...patient,
          room_id: selectedRoom.id,
          status: 'ADD'
        })
      });

      if (!response.ok) {
        let serverMessage = '';
        try {
          const errorBody = await response.json();
          serverMessage = errorBody && (errorBody.message || errorBody.error || JSON.stringify(errorBody));
        } catch (_) {
          try {
            serverMessage = await response.text();
          } catch (_) {
            serverMessage = '';
          }
        }
        const details = serverMessage ? `: ${serverMessage}` : '';
        throw new Error(`HTTP ${response.status}${details}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      // Call onRoomChange to update local state
      onRoomChange(patient.id, selectedRoom);
      
      this.setState({ 
        isEditing: false,
        selectedRoom: null,
        selectedRoomIndex: null
      });
    } catch (error) {
      console.error('Error EnterQueue:', error);
      alert(`Failed to enter queue. Please try again.\n${error && error.message ? error.message : ''}`);
    }
  }

  render() {
    const { patient } = this.props;
    const { isEditing, rooms, selectedRoom, selectedRoomIndex, loading, error } = this.state;

    if (!isEditing) {
      const roomId = patient.room_id || patient.room;
      const hasRoom = roomId && roomId !== 0 && roomId !== '0' && roomId !== null && typeof roomId !== 'undefined' && roomId !== '';
      
      // Use matched room name if available, otherwise use patient.roomName
      let roomDisplayName = patient.roomName;
      if (!roomDisplayName && selectedRoom && selectedRoom.room_name) {
        roomDisplayName = selectedRoom.room_name;
      }
      
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={this.handleEdit}
            className="p-1.5 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
            title="เปลี่ยนห้อง"
          >
            <MapPinIcon className="w-5 h-5" />
          </button>
          <div 
            className="cursor-pointer hover:bg-gray-50 hover:border-b-2 hover:border-blue-400 p-1.5 rounded transition-all"
            onClick={this.handleEdit}
          >
            <div className="text-gray-900 font-semibold">{hasRoom ? (roomDisplayName || '-') : '-'}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <div className="flex-1">
              <select
                value={selectedRoomIndex !== null ? selectedRoomIndex : ''}
                onChange={(e) => {
                  const idx = parseInt(e.target.value);
                  const room = rooms[idx];
                  if (room) {
                    this.handleRoomSelect(room);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={loading}
              >
                <option value="">เลือกห้องตรวจ</option>
                {rooms.map((room, index) => (
                  <option key={room.id || index} value={index}>
                    {room.id} - {room.room_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedRoom && (
            <div className="flex justify-end items-center gap-3 pl-6">
              <button
                type="button"
                onClick={this.handleSave}
                className="text-green-600 hover:text-green-700 p-1"
                title="ยืนยัน"
              >
                <CheckIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={this.handleCancel}
                className="text-red-500 hover:text-red-600 p-1"
                title="ยกเลิก"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-xs mt-1">{error}</div>
        )}
      </div>
    );
  }
}

export default EditableRoomCell;
