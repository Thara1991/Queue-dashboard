import React from 'react';

// Custom SVG Icons
const ClockIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

class Statistics extends React.Component {
  render() {
    const { countByStatus, activeTab, setActiveTab } = this.props;
    const self = this;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div 
          className={'bg-white rounded-lg shadow p-6 cursor-pointer transform transition-all hover:scale-105 ' + 
            (activeTab === 'waiting' ? 'ring-4 ring-yellow-400' : '')}
          onClick={function() { setActiveTab('waiting'); }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">รอตรวจ</p>
              <p className="text-3xl font-bold text-yellow-600">
                {countByStatus('waiting')}
              </p>
              <p className="text-xs text-gray-500 mt-1">Waiting</p>
            </div>
            <ClockIcon className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div 
          className={'bg-white rounded-lg shadow p-6 cursor-pointer transform transition-all hover:scale-105 ' + 
            (activeTab === 'active' ? 'ring-4 ring-blue-400' : '')}
          onClick={function() { setActiveTab('active'); }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">กำลังตรวจ</p>
              <p className="text-3xl font-bold text-blue-600">
                {countByStatus('active')}
              </p>
              <p className="text-xs text-gray-500 mt-1">Active</p>
            </div>
            <UserIcon className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div 
          className={'bg-white rounded-lg shadow p-6 cursor-pointer transform transition-all hover:scale-105 ' + 
            (activeTab === 'completed' ? 'ring-4 ring-green-400' : '')}
          onClick={function() { setActiveTab('completed'); }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">ตรวจเสร็จแล้ว</p>
              <p className="text-3xl font-bold text-green-600">
                {countByStatus('completed')}
              </p>
              <p className="text-xs text-gray-500 mt-1">Complete</p>
            </div>
            <CheckCircleIcon className="w-12 h-12 text-green-500" />
          </div>
        </div>
      </div>
    );
  }
}

export default Statistics;
