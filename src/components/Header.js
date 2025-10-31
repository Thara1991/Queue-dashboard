import React from 'react';

// Custom SVG Icons
const PlusIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);


const CalendarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1zm12 7H5v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9zM6 7h12V6H6v1z"/>
  </svg>
);

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.dateInputRef = React.createRef();
  }

  focusDateInput = () => {
    if (this.dateInputRef && this.dateInputRef.current) {
      this.dateInputRef.current.showPicker ? this.dateInputRef.current.showPicker() : this.dateInputRef.current.focus();
    }
  }

  setToday = () => {
    if (this.props.onDateChange) {
      const today = new Date().toISOString().slice(0, 10);
      this.props.onDateChange(today);
    }
  }

  render() {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {this.props.lang === 'EN' ? 'Patient Queue Management' : 'ระบบจัดการคิวผู้ป่วย'}
            </h1>
            <p className="text-gray-600">
              {this.props.lang === 'EN' ? 'Manage Dashboard Queue System' : 'จัดการแดชบอร์ดระบบคิว'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg overflow-hidden border border-gray-300 shadow-sm">
              <button
                type="button"
                onClick={() => this.props.onToggleLang && this.props.onToggleLang('TH')}
                className={`px-3 py-2 text-sm font-semibold ${this.props.lang !== 'EN' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >TH</button>
              <button
                type="button"
                onClick={() => this.props.onToggleLang && this.props.onToggleLang('EN')}
                className={`px-3 py-2 text-sm font-semibold ${this.props.lang === 'EN' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >EN</button>
            </div>
            {this.props.onAddPatient && (
              <button
                onClick={this.props.onAddPatient}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <PlusIcon className="w-5 h-5" />
                <span>{this.props.lang === 'EN' ? 'Add Patient' : 'เพิ่มผู้ป่วย'}</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <div
                className="px-3 py-3 rounded-lg border border-gray-300 text-gray-700 shadow-md focus-within:ring-2 focus-within:ring-blue-400 cursor-pointer"
                onClick={this.focusDateInput}
              >
                <input
                  ref={this.dateInputRef}
                  type="date"
                  value={this.props.selectedDate}
                  onChange={(e) => this.props.onDateChange && this.props.onDateChange(e.target.value)}
                  className="outline-none"
                />
              </div>
              <button
                type="button"
                onClick={this.setToday}
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                title={this.props.lang === 'EN' ? 'Quick select today' : 'เลือกวันนี้อย่างรวดเร็ว'}
              >
                <CalendarIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
