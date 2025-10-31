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
    const noRoom = !p || p.room === 0 || p.room === '0' || p.room === null || typeof p.room === 'undefined';
    if (noRoom) {
      this.setState({ isEditing: true });
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
      
      this.setState({ 
        rooms: Array.isArray(rooms) ? rooms : [],
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
    const index = this.state.rooms.findIndex(function(r) { return r === room; });
    this.setState({ selectedRoom: room, selectedRoomIndex: index >= 0 ? index : null });
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
    const { isEditing, rooms, selectedRoom, selectedRoomIndex, loading, error } = this.state;

    if (!isEditing) {
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
            <div className="text-gray-900 font-semibold">{(patient.room === 0 || patient.room === '0' || patient.room === null || typeof patient.room === 'undefined') ? '-' : patient.room}</div>
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
              value={selectedRoomIndex !== null ? selectedRoomIndex : ''}
              onChange={(e) => {
                const idx = parseInt(e.target.value);
                const room = rooms[idx];
                if (room) {
                  // Immediately save selection and close editor
                  const { onRoomChange } = this.props;
                  if (onRoomChange) {
                    onRoomChange(this.props.patient.id, room);
                  }
                  this.setState({ selectedRoom: null, selectedRoomIndex: null, isEditing: false });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={loading}
            >
              <option value="">เลือกห้องตรวจ</option>
              {rooms.map((room, index) => (
                <option key={room.id || index} value={index}>
                  {room.room_code} - {room.room_name}
                </option>
              ))}
            </select>
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
