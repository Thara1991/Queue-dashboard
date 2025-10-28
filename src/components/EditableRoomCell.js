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
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    this.loadRooms();
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
      
      this.setState({ 
        rooms,
        loading: false 
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
    this.setState({ selectedRoom: room });
  }

  handleSave = () => {
    const { selectedRoom } = this.state;
    const { patient, onRoomChange } = this.props;
    
    if (selectedRoom && onRoomChange) {
      onRoomChange(patient.id, selectedRoom);
    }
    
    this.setState({ 
      isEditing: false,
      selectedRoom: null 
    });
  }

  render() {
    const { patient } = this.props;
    const { isEditing, rooms, selectedRoom, loading, error } = this.state;

    if (!isEditing) {
      return (
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-gray-400" />
          <div className="cursor-pointer hover:bg-gray-50 p-1 rounded" onClick={this.handleEdit}>
            <div className="text-gray-900 font-semibold">{patient.room}</div>
            {patient.roomName && (
              <div className="text-xs text-gray-500">{patient.roomName}</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-gray-400" />
          <div className="flex-1">
            <select
              value={selectedRoom ? selectedRoom.id : ''}
              onChange={(e) => {
                const room = rooms.find(r => r.id === parseInt(e.target.value));
                this.handleRoomSelect(room);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={loading}
            >
              <option value="">เลือกห้องตรวจ</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.room_code} - {room.room_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={this.handleSave}
              disabled={!selectedRoom}
              className="p-1 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              title="บันทึก"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
            <button
              onClick={this.handleCancel}
              className="p-1 text-red-600 hover:text-red-700"
              title="ยกเลิก"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 text-xs mt-1">{error}</div>
        )}
      </div>
    );
  }
}

export default EditableRoomCell;
