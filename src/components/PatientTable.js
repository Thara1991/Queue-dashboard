import React from 'react';
import EditableRoomCell from './EditableRoomCell';

// Custom SVG Icons
const PlayIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

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

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29 10.59 10.6 16.89 4.29z"/>
  </svg>
);

class PatientTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRooms: new Set(),
      currentTime: new Date()
    };
    this.timerInterval = null;
  }

  componentDidMount() {
    // Update timer every second
    this.timerInterval = setInterval(() => {
      this.setState({ currentTime: new Date() });
    }, 1000);
    
    // Register toggle callback if active tab
    this.registerToggleCallback();
  }

  componentDidUpdate(prevProps) {
    // Re-register callback if activeTab or patients changed
    if (prevProps.activeTab !== this.props.activeTab || 
        prevProps.patients !== this.props.patients ||
        prevProps.setToggleAllRoomsCallback !== this.props.setToggleAllRoomsCallback) {
      this.registerToggleCallback();
    }
  }

  componentWillUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    // Unregister callback
    if (this.props.setToggleAllRoomsCallback) {
      this.props.setToggleAllRoomsCallback(null);
    }
  }

  registerToggleCallback = () => {
    try {
      if (this.props.activeTab === 'active' && this.props.setToggleAllRoomsCallback) {
        const patients = this.props.patients || [];
        if (patients.length > 0) {
          const groupedRooms = this.groupPatientsByRoom(patients);
          const roomIds = Object.keys(groupedRooms);
          const allExpanded = roomIds.length > 0 && roomIds.every(roomId => this.state.expandedRooms.has(roomId));
          
          // Update expanded state in App
          if (this.props.setAllRoomsExpanded) {
            this.props.setAllRoomsExpanded(allExpanded);
          }
          
          this.props.setToggleAllRoomsCallback(() => {
            this.toggleAllRooms(roomIds);
          });
        } else {
          if (this.props.setAllRoomsExpanded) {
            this.props.setAllRoomsExpanded(false);
          }
          this.props.setToggleAllRoomsCallback(null);
        }
      } else if (this.props.setToggleAllRoomsCallback) {
        this.props.setToggleAllRoomsCallback(null);
        if (this.props.setAllRoomsExpanded) {
          this.props.setAllRoomsExpanded(false);
        }
      }
    } catch (error) {
      console.error('Error in registerToggleCallback:', error);
    }
  }

  toggleRoom = (roomId) => {
    this.setState(prevState => {
      const newExpanded = new Set(prevState.expandedRooms);
      if (newExpanded.has(roomId)) {
        newExpanded.delete(roomId);
      } else {
        newExpanded.add(roomId);
      }
      return { expandedRooms: newExpanded };
    }, () => {
      // Update expanded state in App after state update
      if (this.props.activeTab === 'active' && this.props.setAllRoomsExpanded) {
        const groupedRooms = this.groupPatientsByRoom(this.props.patients || []);
        const roomIds = Object.keys(groupedRooms);
        const allExpanded = roomIds.length > 0 && roomIds.every(id => this.state.expandedRooms.has(id));
        this.props.setAllRoomsExpanded(allExpanded);
      }
    });
  }

  toggleAllRooms = (roomIds) => {
    const allExpanded = roomIds.every(roomId => this.state.expandedRooms.has(roomId));
    
    if (allExpanded) {
      // Collapse all
      this.setState({ expandedRooms: new Set() }, () => {
        if (this.props.setAllRoomsExpanded) {
          this.props.setAllRoomsExpanded(false);
        }
      });
    } else {
      // Expand all
      this.setState({ expandedRooms: new Set(roomIds) }, () => {
        if (this.props.setAllRoomsExpanded) {
          this.props.setAllRoomsExpanded(true);
        }
      });
    }
  }

  parseQueueNumber(value) {
    if (value === undefined || value === null) {
      return Number.MAX_SAFE_INTEGER;
    }
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
    const numericMatch = String(value).match(/\d+/);
    if (numericMatch) {
      const parsed = parseInt(numericMatch[0], 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    return Number.MAX_SAFE_INTEGER;
  }

  sortPatientsByQueueNumber(patients) {
    return patients.sort((a, b) => {
      return this.parseQueueNumber(a.queueNumber) - this.parseQueueNumber(b.queueNumber);
    });
  }

  groupPatientsByRoom = (patients) => {
    const grouped = {};
    patients.forEach(patient => {
      const roomId = patient.room_id || patient.room || 'no-room';
      const roomName = patient.roomName || `Room ${roomId}` || 'No Room';
      if (!grouped[roomId]) {
        grouped[roomId] = {
          roomId: roomId,
          roomName: roomName,
          patients: []
        };
      }
      grouped[roomId].patients.push(patient);
    });
    Object.keys(grouped).forEach(roomId => {
      grouped[roomId].patients = this.sortPatientsByQueueNumber(grouped[roomId].patients);
    });
    return grouped;
  }

  getStatusColor(status) {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'SKIP':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'CANCEL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'ADD':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'CALL':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  getStatusText(status) {
    switch (status) {
      case 'waiting':
        return this.props.lang === 'EN' ? 'Waiting' : 'รอตรวจ';
      case 'active':
        return this.props.lang === 'EN' ? 'Active' : 'กำลังตรวจ';
      case 'SKIP':
        return this.props.lang === 'EN' ? 'Skip' : 'ข้ามคิว';
      case 'CANCEL':
        return this.props.lang === 'EN' ? 'Canceled' : 'ยกเลิก';
      case 'ADD':
        return 'ADD';
      case 'CALL':
        return 'CALL';
      default:
        return status;
    }
  }

  formatDate(dateString) {
    if (!dateString || dateString === '-') return '-';
    
    // Handle YYYYMMDD format (e.g., "20251008")
    if (dateString.length === 8 && /^\d+$/.test(dateString)) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${day}/${month}/${year}`;
    }
    
    // Handle YYYY-MM-DD format (e.g., "2025-10-08")
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    
    // Return as is if format is not recognized
    return dateString;
  }

  formatTime(timeString) {
    if (!timeString || timeString === '-') return '-';
    
    // Handle HHMM format (e.g., "0848")
    if (timeString.length === 4 && /^\d+$/.test(timeString)) {
      const hours = timeString.substring(0, 2);
      const minutes = timeString.substring(2, 4);
      return `${hours}:${minutes}`;
    }
    
    // Handle HH:MM format (already formatted)
    if (timeString.includes(':')) {
      return timeString;
    }
    
    // Return as is if format is not recognized
    return timeString;
  }

  parseDateTime(dateTimeString) {
    // Parse YYYYMMDDHHMM format (e.g., "202511030816")
    if (!dateTimeString || dateTimeString.length !== 12) {
      return null;
    }
    
    try {
      const year = parseInt(dateTimeString.substring(0, 4), 10);
      const month = parseInt(dateTimeString.substring(4, 6), 10) - 1; // Month is 0-indexed
      const day = parseInt(dateTimeString.substring(6, 8), 10);
      const hours = parseInt(dateTimeString.substring(8, 10), 10);
      const minutes = parseInt(dateTimeString.substring(10, 12), 10);
      
      return new Date(year, month, day, hours, minutes);
    } catch (error) {
      return null;
    }
  }

  formatElapsedTime(calledTime) {
    if (!calledTime) return '';
    
    const calledDate = this.parseDateTime(calledTime);
    if (!calledDate) return '';
    
    const now = this.state.currentTime;
    const diffMs = now - calledDate;
    
    if (diffMs < 0) return ''; // Invalid if called time is in the future
    
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  getPatientDisplayName(patient) {
    const name = patient.patient_name || patient.name || patient.patientName || patient.full_name || '-';
    if (patient.hn) {
      return `${patient.hn} - ${name}`;
    }
    return name;
  }

  renderPatientRow = (patient, handleStart, onRoomChange, stationCode, isWaitingTab, hideRoomColumn = false, selectedDate = null) => {
    const self = this;
    const dateToUse = selectedDate || this.props.selectedDate;
    return (
      <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-lg font-bold text-indigo-600">
            {patient.queueNumber}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-900">
              {this.getPatientDisplayName(patient)}
            </span>
          </div>
        </td>
        {!hideRoomColumn && (
          <td className={`px-6 py-4 ${isWaitingTab ? 'w-1/4' : 'whitespace-nowrap'}`}>
            <EditableRoomCell 
              patient={patient} 
              onRoomChange={onRoomChange}
              stationCode={stationCode}
              isWaitingTab={isWaitingTab}
              selectedDate={dateToUse}
            />
          </td>
        )}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{this.formatDate(patient.pdate || patient.date)}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{this.formatTime(patient.ptime || patient.time)}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className="text-sm text-gray-700">{patient.station}</span>
        </td>
        {!isWaitingTab && (
          <>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={'px-3 py-1 rounded-full text-xs font-semibold border ' + this.getStatusColor(patient.status) + (patient.status === 'CALL' ? ' animate-pulse' : '')}>
                {this.getStatusText(patient.status)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex gap-2">
                {this.props.activeTab !== 'skip' && patient.status !== 'IN' && patient.status !== 'FIN' && (function() {
                  const hasRoom = patient.room !== 0 && patient.room !== '0' && patient.room !== null && typeof patient.room !== 'undefined';
                  const handleButtonClick = (fstatus) => {
                    if (hasRoom) {
                      handleStart(patient, fstatus);
                    } else {
                      alert(self.props.lang === 'EN' ? 'Please select a room first!' : 'กรุณาเลือกห้องตรวจก่อน!');
                    }
                  };
                  
                  const handlePutButton = async () => {
                    if (!hasRoom) {
                      alert(self.props.lang === 'EN' ? 'Please select a room first!' : 'กรุณาเลือกห้องตรวจก่อน!');
                      return;
                    }
                    
                    // Check if there are other patients in the same room with status 'IN'
                    const roomId = patient.room_id || patient.room;
                    const otherINPatients = (self.props.patients || []).filter(p => {
                      const pRoomId = p.room_id || p.room;
                      return p.id !== patient.id && 
                             pRoomId === roomId && 
                             p.status === 'IN';
                    });
                    
                    // If there are other 'IN' patients, complete them first
                    if (otherINPatients.length > 0) {
                      try {
                        // Complete all other 'IN' patients in the same room
                        // Use 'FIN' status to complete them (same as clicking Complete button)
                        for (const inPatient of otherINPatients) {
                          await handleStart(inPatient, 'FIN');
                        }
                        // Wait a bit for state to update
                        await new Promise(resolve => setTimeout(resolve, 500));
                      } catch (error) {
                        console.error('Error completing existing IN patient:', error);
                        // Show error but continue anyway to put the new patient in
                        alert(self.props.lang === 'EN' 
                          ? `Warning: Could not complete existing patient. ${error.message || ''}` 
                          : `คำเตือน: ไม่สามารถตรวจเสร็จผู้ป่วยเดิมได้ ${error.message || ''}`);
                      }
                    }
                    
                    // Now put the new patient in
                    handleStart(patient, 'IN');
                  };
                  
                  return (
                    <>
                      <button
                        onClick={function() { handleButtonClick('CALL'); }}
                        className={"flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors shadow-md hover:shadow-lg text-sm " + (!hasRoom ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60" : "bg-indigo-500 hover:bg-indigo-600 text-white")}
                        title={!hasRoom ? (self.props.lang === 'EN' ? 'Please select a room first' : 'กรุณาเลือกห้องตรวจก่อน') : ''}
                      >
                        <PlayIcon className="w-4 h-4" />
                        {self.props.lang === 'EN' ? 'Call' : 'เรียกคิว'}
                      </button>
                      <button
                        onClick={handlePutButton}
                        className={"flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors shadow-md hover:shadow-lg text-sm " + (!hasRoom ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60" : "bg-blue-500 hover:bg-blue-600 text-white")}
                        title={!hasRoom ? (self.props.lang === 'EN' ? 'Please select a room first' : 'กรุณาเลือกห้องตรวจก่อน') : ''}
                      >
                        <PlayIcon className="w-4 h-4" />
                        {self.props.lang === 'EN' ? 'Put' : 'นำเข้า'}
                      </button>
                      <button
                        onClick={function() { handleButtonClick('SKIP'); }}
                        className={"flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors shadow-md hover:shadow-lg text-sm " + (!hasRoom ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60" : "bg-gray-500 hover:bg-gray-600 text-white")}
                        title={!hasRoom ? (self.props.lang === 'EN' ? 'Please select a room first' : 'กรุณาเลือกห้องตรวจก่อน') : ''}
                      >
                        <PlayIcon className="w-4 h-4" />
                        {self.props.lang === 'EN' ? 'Skip' : 'ข้ามคิว'}
                      </button>
                    </>
                  );
                })()}
                {this.props.activeTab === 'skip' && patient.status === 'SKIP' && (
                  <button
                  onClick={function() { handleStart(patient, 'CANCEL'); }}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                    
                  >
                    <XIcon className="w-4 h-4" />
                    {self.props.lang === 'EN' ? 'Cancel' : 'ยกเลิก'}
                  </button>
                )}
                {patient.status === 'IN' && (
                  <button
                    onClick={function() { handleStart(patient, 'FIN'); }}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    {self.props.lang === 'EN' ? 'Complete' : 'ตรวจเสร็จ'}
                  </button>
                )}
                {patient.status === 'FIN' && (
                  <span className="text-green-600 font-semibold flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    {self.props.lang === 'EN' ? 'Done' : 'เสร็จสิ้น'}
                  </span>
                )}
              </div>
            </td>
          </>
        )}
      </tr>
    );
  }

  render() {
    const { patients, handleStart, onRoomChange, stationCode, activeTab } = this.props;
    const self = this;
    const isWaitingTab = activeTab === 'waiting';
    const isSkipTab = activeTab === 'skip';
    const isActiveTab = activeTab === 'active';

    if (patients.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">{this.props.lang === 'EN' ? 'No items in this category' : 'ไม่มีรายการในหมวดนี้'}</p>
        </div>
      );
    }

    // For active tab, group by room
    if (isActiveTab) {
      const groupedRooms = this.groupPatientsByRoom(patients);
      const roomIds = Object.keys(groupedRooms);
      const allExpanded = roomIds.length > 0 && roomIds.every(roomId => this.state.expandedRooms.has(roomId));

      return (
        <div className="space-y-4">
          {/* Toggle All Rooms Button */}
          {roomIds.length > 0 && (
            <div className="flex justify-end mb-2">
              <button
                onClick={() => this.toggleAllRooms(roomIds)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg text-sm font-semibold"
              >
                {allExpanded ? (
                  <>
                    <ChevronRightIcon className="w-4 h-4" />
                    <span>{this.props.lang === 'EN' ? 'Collapse All' : 'ย่อทั้งหมด'}</span>
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="w-4 h-4" />
                    <span>{this.props.lang === 'EN' ? 'Expand All' : 'ขยายทั้งหมด'}</span>
                  </>
                )}
              </button>
            </div>
          )}
          {roomIds.map(roomId => {
            const roomGroup = groupedRooms[roomId];
            const isExpanded = this.state.expandedRooms.has(roomId);
            const patientCount = roomGroup.patients.length;
            const inPatients = roomGroup.patients
              .filter(patient => patient.status === 'IN');

            return (
              <div key={roomId} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                {/* Room Header - Clickable */}
                <button
                  onClick={() => this.toggleRoom(roomId)}
                  className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                    )}
                    <span className="font-semibold text-gray-900 text-lg">{roomGroup.roomName}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {patientCount} {this.props.lang === 'EN' ? 'patient(s)' : 'คน'}
                    </span>
                      {inPatients.length > 0 && (
                        <span className="flex items-center gap-2 text-sm font-semibold text-green-600 flex-wrap">
                          <CheckCircleIcon className="w-4 h-4" />
                          {inPatients.map((patient, index) => {
                            const patientName = this.getPatientDisplayName(patient);
                            const elapsedTime = this.formatElapsedTime(patient.exam_time);
                            return (
                              <span key={patient.id || index} className="flex items-center gap-1.5">
                                {elapsedTime && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-mono text-xs">
                                    {elapsedTime}
                                  </span>
                                )}
                                <span className="text-base">{patientName}</span>
                                {index < inPatients.length - 1 && <span className="mx-1">,</span>}
                              </span>
                            );
                          })}
                        </span>
                      )}
                  </div>
                </button>

                {/* Patient Table - Collapsible */}
                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {this.props.lang === 'EN' ? 'Queue No.' : 'เลขคิว'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {this.props.lang === 'EN' ? 'Patient Name' : 'ชื่อผู้ป่วย'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {this.props.lang === 'EN' ? 'Date' : 'วันที่'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {this.props.lang === 'EN' ? 'Time' : 'เวลา'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {this.props.lang === 'EN' ? 'Station' : 'สถานี'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {this.props.lang === 'EN' ? 'Status' : 'สถานะ'}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {this.props.lang === 'EN' ? 'Actions' : 'จัดการ'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {roomGroup.patients.map(patient => 
                          this.renderPatientRow(patient, handleStart, onRoomChange, stationCode, false, true, this.props.selectedDate)
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // For waiting and skip tabs, show normal table
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {this.props.lang === 'EN' ? 'Queue No.' : 'เลขคิว'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {this.props.lang === 'EN' ? 'Patient Name' : 'ชื่อผู้ป่วย'}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${isWaitingTab ? 'w-1/4' : ''}`}>
                {this.props.lang === 'EN' ? 'Room' : 'ห้อง'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {this.props.lang === 'EN' ? 'Date' : 'วันที่'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {this.props.lang === 'EN' ? 'Time' : 'เวลา'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {this.props.lang === 'EN' ? 'Station' : 'สถานี'}
              </th>
              {!isWaitingTab && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {this.props.lang === 'EN' ? 'Status' : 'สถานะ'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {this.props.lang === 'EN' ? 'Actions' : 'จัดการ'}
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map(patient => 
              this.renderPatientRow(patient, handleStart, onRoomChange, stationCode, isWaitingTab, false, this.props.selectedDate)
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PatientTable;
