import React from 'react';

// Custom SVG Icons
const PlusIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const RefreshIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
);

class Header extends React.Component {
  render() {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ระบบจัดการคิวผู้ป่วย
            </h1>
            <p className="text-gray-600">Manage Dashboard Queue System</p>
          </div>
          
          <div className="flex items-center gap-3">
            {this.props.onRefresh && (
              <button
                onClick={this.props.onRefresh}
                disabled={this.props.isRefreshing}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                title="รีเฟรชข้อมูล"
              >
                <RefreshIcon className={`w-5 h-5 ${this.props.isRefreshing ? 'animate-spin' : ''}`} />
                <span>{this.props.isRefreshing ? 'กำลังรีเฟรช...' : 'รีเฟรช'}</span>
              </button>
            )}
            
            {this.props.onAddPatient && (
              <button
                onClick={this.props.onAddPatient}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <PlusIcon className="w-5 h-5" />
                <span>เพิ่มผู้ป่วย</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
