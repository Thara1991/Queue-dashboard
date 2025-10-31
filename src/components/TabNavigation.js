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

class TabNavigation extends React.Component {
  render() {
    const { activeTab, setActiveTab, countByStatus, lang } = this.props;

    return (
      <div className="flex border-b border-gray-200">
        <button
          onClick={function() { setActiveTab('waiting'); }}
          className={'flex-1 px-6 py-4 font-semibold text-center transition-all ' + 
            (activeTab === 'waiting' 
              ? 'bg-yellow-500 text-white border-b-4 border-yellow-600' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100')}
        >
          <div className="flex items-center justify-center gap-2">
            <ClockIcon className="w-5 h-5" />
            <span>{lang === 'EN' ? 'Waiting' : 'รอตรวจ'} ({countByStatus('waiting')})</span>
          </div>
        </button>

        <button
          onClick={function() { setActiveTab('active'); }}
          className={'flex-1 px-6 py-4 font-semibold text-center transition-all ' + 
            (activeTab === 'active' 
              ? 'bg-blue-500 text-white border-b-4 border-blue-600' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100')}
        >
          <div className="flex items-center justify-center gap-2">
            <UserIcon className="w-5 h-5" />
            <span>{lang === 'EN' ? 'Active' : 'กำลังตรวจ'} ({countByStatus('active')})</span>
          </div>
        </button>

        <button
          onClick={function() { setActiveTab('completed'); }}
          className={'flex-1 px-6 py-4 font-semibold text-center transition-all ' + 
            (activeTab === 'completed' 
              ? 'bg-green-500 text-white border-b-4 border-green-600' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100')}
        >
          <div className="flex items-center justify-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            <span>{lang === 'EN' ? 'Completed' : 'ตรวจเสร็จแล้ว'} ({countByStatus('completed')})</span>
          </div>
        </button>
      </div>
    );
  }
}

export default TabNavigation;
