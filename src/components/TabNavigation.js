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

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
  </svg>
);

const ChevronUpIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/>
  </svg>
);

const SkipIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
  </svg>
);

class TabNavigation extends React.Component {
  render() {
    const { activeTab, setActiveTab, countByStatus, lang, allRoomsExpanded = false } = this.props;

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
            {activeTab === 'active' && countByStatus('active') > 0 && (
              allRoomsExpanded ? (
                <ChevronUpIcon className="w-4 h-4 opacity-75" title={lang === 'EN' ? 'Click to collapse all rooms' : 'คลิกเพื่อย่อห้องทั้งหมด'} />
              ) : (
                <ChevronDownIcon className="w-4 h-4 opacity-75" title={lang === 'EN' ? 'Click to expand all rooms' : 'คลิกเพื่อขยายห้องทั้งหมด'} />
              )
            )}
          </div>
        </button>

        <button
          onClick={function() { setActiveTab('skip'); }}
          className={'flex-1 px-6 py-4 font-semibold text-center transition-all ' + 
            (activeTab === 'skip' 
              ? 'bg-orange-500 text-white border-b-4 border-orange-600' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100')}
        >
          <div className="flex items-center justify-center gap-2">
            <SkipIcon className="w-5 h-5" />
            <span>{lang === 'EN' ? 'Skip' : 'ข้ามคิว'} ({countByStatus('skip')})</span>
          </div>
        </button>
      </div>
    );
  }
}

export default TabNavigation;
