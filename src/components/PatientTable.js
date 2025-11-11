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

class PatientTable extends React.Component {
  getStatusColor(status) {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
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
      case 'completed':
        return this.props.lang === 'EN' ? 'Completed' : 'ตรวจเสร็จแล้ว';
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

  render() {
    const { patients, handleStart, onRoomChange } = this.props;
    const self = this;

    if (patients.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">{this.props.lang === 'EN' ? 'No items in this category' : 'ไม่มีรายการในหมวดนี้'}</p>
        </div>
      );
    }

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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {this.props.lang === 'EN' ? 'Status' : 'สถานะ'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {this.props.lang === 'EN' ? 'Actions' : 'จัดการ'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map(function(patient) {
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
                      <span className="font-medium text-gray-900">{patient.patient_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <EditableRoomCell 
                      patient={patient} 
                      onRoomChange={onRoomChange}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{self.formatDate(patient.pdate || patient.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{self.formatTime(patient.ptime || patient.time)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{patient.station}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={'px-3 py-1 rounded-full text-xs font-semibold border ' + self.getStatusColor(patient.status) + (patient.status === 'CALL' ? ' animate-pulse' : '')}>
                      {self.getStatusText(patient.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {patient.status !== 'IN' && patient.status !== 'FIN' && (function() {
                        const hasRoom = patient.room !== 0 && patient.room !== '0' && patient.room !== null && typeof patient.room !== 'undefined';
                        const handleButtonClick = (fstatus) => {
                          if (hasRoom) {
                            handleStart(patient, fstatus);
                          } else {
                            alert(self.props.lang === 'EN' ? 'Please select a room first!' : 'กรุณาเลือกห้องตรวจก่อน!');
                          }
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
                              onClick={function() { handleButtonClick('IN'); }}
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
                      {patient.status === 'IN' && (
                        <button
                          // onClick={function() { handleFinish(patient.id); }}
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PatientTable;
