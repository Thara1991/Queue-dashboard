import React from 'react';

// Custom SVG Icon
const UserIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

class CurrentPatientAlert extends React.Component {
  render() {
    const currentPatient = this.props.currentPatient;
    
    if (!currentPatient) {
      return null;
    }

    return (
      <div className="bg-blue-500 text-white rounded-lg shadow-lg p-6 mb-6 animate-pulse">
        <div className="flex items-center gap-3">
          <UserIcon className="w-8 h-8" />
          <div>
            <p className="text-sm opacity-90">กำลังตรวจ</p>
            <p className="text-2xl font-bold">{currentPatient.name}</p>
            <p className="text-sm opacity-90">
              คิว {currentPatient.queueNumber} - ห้อง {currentPatient.room}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default CurrentPatientAlert;
