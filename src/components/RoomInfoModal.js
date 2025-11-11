import React from 'react';
import roomService from '../services/roomService';

// Custom SVG Icons
const MapPinIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

class RoomInfoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      doctors: [],
      loading: false,
      loadingDoctors: false,
      editing: null,
      editedRoom: null
    };
  }

  componentDidMount() {
    this.loadRooms(this.props.stationCode);
    this.loadDoctors();
  }

  componentDidUpdate(prevProps) {
    const prevStation = this.normalizeStationCode(prevProps.stationCode);
    const currentStation = this.normalizeStationCode(this.props.stationCode);
    const opened = !prevProps.isOpen && this.props.isOpen;
    const stationChangedWhileOpen = this.props.isOpen && prevStation !== currentStation;

    if (opened || stationChangedWhileOpen) {
      this.loadRooms(this.props.stationCode);
    }
  }

  loadRooms = async (stationCodeParam) => {
    const targetStation = this.normalizeStationCode(
      stationCodeParam !== undefined ? stationCodeParam : this.props.stationCode
    );

    this.setState({ loading: true });
    try {
      let rooms;
      try {
        rooms = await roomService.getActiveExaminationRooms({
          station: targetStation || undefined
        });
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        rooms = roomService.getMockRooms();
      }
      this.setState({ 
        rooms: Array.isArray(rooms) ? rooms : [],
        loading: false 
      });
    } catch (error) {
      this.setState({ loading: false });
    }
  }

  loadDoctors = async () => {
    this.setState({ loadingDoctors: true });
    try {
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';
      const response = await fetch(`${baseURL}/rooms/DoctorList`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const doctors = Array.isArray(data) ? data : (Array.isArray(data && data.data) ? data.data : []);
      
      this.setState({ 
        doctors,
        loadingDoctors: false 
      });
    } catch (error) {
      console.error('Error fetching doctors:', error);
      this.setState({ loadingDoctors: false });
    }
  }

  startEdit = (room) => {
    console.log('Starting edit for room:', room);
    this.setState({ 
      editing: room.id,
      editedRoom: { ...room }
    });
  }

  cancelEdit = () => {
    this.setState({ editing: null, editedRoom: null });
  }

  handleFieldChange = (field, value) => {
    this.setState({
      editedRoom: {
        ...this.state.editedRoom,
        [field]: value
      }
    });
  }

  saveEdit = async () => {
    const { editedRoom } = this.state;
    
    try {
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/v1';
      const url = `${baseURL}/rooms/DoctorAssign`;
      
      const requestBody = {
        id: editedRoom.id,
        doctor_id: editedRoom.doctor_id
      };
      
      console.log('Full API path: POST', url);
      console.log('Request body:', JSON.stringify(requestBody));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
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
      
      this.setState({
        rooms: this.state.rooms.map(room => 
          room.id === editedRoom.id ? editedRoom : room
        ),
        editing: null,
        editedRoom: null
      });
    } catch (error) {
      console.error('Error saving doctor assignment:', error);
      alert(`Failed to assign doctor. Please try again.\n${error && error.message ? error.message : ''}`);
    }
  }

  render() {
    const { isOpen, onClose, lang } = this.props;
    const { rooms, doctors, loading, loadingDoctors, editing, editedRoom } = this.state;

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              {lang === 'EN' ? 'Room Information' : 'ข้อมูลห้องตรวจ'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <p className="text-gray-500 text-center py-12">
                {lang === 'EN' ? 'Loading...' : 'กำลังโหลด...'}
              </p>
            ) : rooms.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                {lang === 'EN' ? 'No rooms available' : 'ไม่มีห้องตรวจ'}
              </p>
            ) : (
              <div className="space-y-3">
                {rooms.map((room, index) => (
                  <div 
                    key={room.id || index} 
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {editing === room.id ? (
                      <>
                        <MapPinIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              {lang === 'EN' ? 'Room Name' : 'ชื่อห้องตรวจ'}
                            </label>
                            <input
                              type="text"
                              value={editedRoom.room_name || ''}
                              onChange={(e) => this.handleFieldChange('room_name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              {lang === 'EN' ? 'Doctor' : 'แพทย์'}
                            </label>
                            <select
                              value={editedRoom.doctor_id || ''}
                              onChange={(e) => this.handleFieldChange('doctor_id', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={loadingDoctors}
                            >
                              <option value="">{lang === 'EN' ? 'Select Doctor' : 'เลือกแพทย์'}</option>
                              {doctors.map((doctor, idx) => (
                                <option key={doctor.UidCod || doctor.id || idx} value={doctor.UidCod || doctor.id || doctor.Uid || ''}>
                                  {doctor.UidNam || ''}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={this.saveEdit}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                          >
                            {lang === 'EN' ? 'Save' : 'บันทึก'}
                          </button>
                          <button
                            onClick={this.cancelEdit}
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                          >
                            {lang === 'EN' ? 'Cancel' : 'ยกเลิก'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <MapPinIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-gray-900 text-lg">
                            {room.room_name || ''}
                            {room.doctor_id && (() => {
                              const doctor = doctors.find(d => 
                                d.UidCod === room.doctor_id || d.id === room.doctor_id || d.Uid === room.doctor_id
                              );
                              return doctor ? ` - ${doctor.UidNam}` : null;
                            })()}
                          </div>
                        </div>
                        <button
                          onClick={() => this.startEdit(room)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                        >
                          {lang === 'EN' ? 'Edit' : 'แก้ไข'}
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  normalizeStationCode(code) {
    if (code === undefined || code === null) {
      return '';
    }
    return String(code).trim();
  }
}

export default RoomInfoModal;

