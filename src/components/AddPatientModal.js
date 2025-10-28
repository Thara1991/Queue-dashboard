import React from 'react';
import RoomSelector from './RoomSelector';

// Custom SVG Icons
const UserIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

class AddPatientModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patientName: '',
      selectedRoom: null,
      selectedDate: new Date().toISOString().split('T')[0],
      selectedTime: new Date().toTimeString().slice(0, 5),
      station: '',
      isSubmitting: false,
      errors: {}
    };
  }

  handleInputChange = (field, value) => {
    this.setState({ 
      [field]: value,
      errors: { ...this.state.errors, [field]: null }
    });
  }

  handleRoomSelect = (room) => {
    this.setState({ 
      selectedRoom: room,
      errors: { ...this.state.errors, selectedRoom: null }
    });
  }

  validateForm = () => {
    const { patientName, selectedRoom, selectedDate, selectedTime, station } = this.state;
    const errors = {};

    if (!patientName.trim()) {
      errors.patientName = 'กรุณากรอกชื่อผู้ป่วย';
    }

    if (!selectedRoom) {
      errors.selectedRoom = 'กรุณาเลือกห้องตรวจ';
    }

    if (!selectedDate) {
      errors.selectedDate = 'กรุณาเลือกวันที่';
    }

    if (!selectedTime) {
      errors.selectedTime = 'กรุณาเลือกเวลา';
    }

    if (!station.trim()) {
      errors.station = 'กรุณากรอกสถานี';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.setState({ isSubmitting: true });

    try {
      const newPatient = {
        name: this.state.patientName,
        room: this.state.selectedRoom.room_code,
        roomName: this.state.selectedRoom.room_name,
        date: this.state.selectedDate,
        time: this.state.selectedTime,
        station: this.state.station,
        status: 'waiting'
      };

      if (this.props.onAddPatient) {
        await this.props.onAddPatient(newPatient);
      }

      // Reset form
      this.setState({
        patientName: '',
        selectedRoom: null,
        selectedDate: new Date().toISOString().split('T')[0],
        selectedTime: new Date().toTimeString().slice(0, 5),
        station: '',
        isSubmitting: false,
        errors: {}
      });

      if (this.props.onClose) {
        this.props.onClose();
      }

    } catch (error) {
      console.error('Error adding patient:', error);
      this.setState({ isSubmitting: false });
    }
  }

  render() {
    const { isOpen, onClose } = this.props;
    const { 
      patientName, 
      selectedRoom, 
      selectedDate, 
      selectedTime, 
      station, 
      isSubmitting, 
      errors 
    } = this.state;

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">เพิ่มผู้ป่วยใหม่</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={this.handleSubmit} className="p-6 space-y-4">
            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ป่วย *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => this.handleInputChange('patientName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.patientName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="กรอกชื่อผู้ป่วย"
                />
              </div>
              {errors.patientName && (
                <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>
              )}
            </div>

            {/* Room Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ห้องตรวจ *
              </label>
              <RoomSelector
                onRoomSelect={this.handleRoomSelect}
                placeholder="เลือกห้องตรวจ"
                className={errors.selectedRoom ? 'border-red-300' : ''}
              />
              {errors.selectedRoom && (
                <p className="text-red-500 text-sm mt-1">{errors.selectedRoom}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่ *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => this.handleInputChange('selectedDate', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.selectedDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.selectedDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.selectedDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เวลา *
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => this.handleInputChange('selectedTime', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.selectedTime ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.selectedTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.selectedTime}</p>
                )}
              </div>
            </div>

            {/* Station */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สถานี *
              </label>
              <input
                type="text"
                value={station}
                onChange={(e) => this.handleInputChange('station', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.station ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="กรอกสถานี"
              />
              {errors.station && (
                <p className="text-red-500 text-sm mt-1">{errors.station}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มผู้ป่วย'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddPatientModal;
