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

class RoomSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      selectedRoom: '',
      isOpen: false,
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    this.loadRooms(this.props.stationCode);
  }

  componentDidUpdate(prevProps) {
    if (this.normalizeStationCode(prevProps.stationCode) !== this.normalizeStationCode(this.props.stationCode)) {
      this.loadRooms(this.props.stationCode);
    }
  }

  loadRooms = async (stationCodeParam) => {
    const targetStation = this.normalizeStationCode(
      stationCodeParam !== undefined ? stationCodeParam : this.props.stationCode
    );

    this.setState({ loading: true, error: null });
    
    try {
      // Try to fetch from API first, fallback to mock data
      let rooms;
      try {
        rooms = await roomService.getActiveExaminationRooms({
          station: targetStation || undefined
        });
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        rooms = roomService.getMockRooms();
      }
      
      const { selectedRoom } = this.state;
      let nextSelectedRoom = selectedRoom;
      if (selectedRoom && selectedRoom.id) {
        const stillExists = Array.isArray(rooms) && rooms.some(function(room) {
          return room.id === selectedRoom.id;
        });
        if (!stillExists) {
          nextSelectedRoom = '';
        }
      }
      
      this.setState({ 
        rooms,
        loading: false,
        selectedRoom: nextSelectedRoom
      });
      
    } catch (error) {
      this.setState({ 
        error: 'ไม่สามารถโหลดข้อมูลห้องตรวจได้',
        loading: false 
      });
    }
  }

  handleRoomSelect = (room) => {
    this.setState({ 
      selectedRoom: room,
      isOpen: false 
    });
    
    if (this.props.onRoomSelect) {
      this.props.onRoomSelect(room);
    }
  }

  toggleDropdown = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const { rooms, selectedRoom, isOpen, loading, error } = this.state;
    const { placeholder = "เลือกห้องตรวจ", className = "" } = this.props;

    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={this.toggleDropdown}
          className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          disabled={loading}
        >
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <span className={selectedRoom ? "text-gray-900" : "text-gray-500"}>
              {selectedRoom ? `${selectedRoom.room_code} - ${selectedRoom.room_name}` : placeholder}
            </span>
          </div>
          <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-3 text-center text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                <span className="ml-2">กำลังโหลด...</span>
              </div>
            ) : error ? (
              <div className="px-4 py-3 text-center text-red-500">
                <span>{error}</span>
                <button 
                  onClick={this.loadRooms}
                  className="ml-2 text-blue-500 hover:text-blue-700 underline"
                >
                  ลองใหม่
                </button>
              </div>
            ) : rooms.length === 0 ? (
              <div className="px-4 py-3 text-center text-gray-500">
                ไม่พบข้อมูลห้องตรวจ
              </div>
            ) : (
              rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => this.handleRoomSelect(room)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{room.room_code}</div>
                      <div className="text-sm text-gray-600">{room.room_name}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      ความจุ: {room.capacity}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Overlay to close dropdown when clicking outside */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

RoomSelector.prototype.normalizeStationCode = function(code) {
  if (code === undefined || code === null) {
    return '';
  }
  return String(code).trim();
};

export default RoomSelector;
