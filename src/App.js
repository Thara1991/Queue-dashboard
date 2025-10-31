import React from 'react';
import Header from './components/Header';
import CurrentPatientAlert from './components/CurrentPatientAlert';
import Statistics from './components/Statistics';
import TabNavigation from './components/TabNavigation';
import PatientTable from './components/PatientTable';
import AddPatientModal from './components/AddPatientModal';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: [],
      currentPatient: null,
      activeTab: 'waiting',
      showAddPatientModal: false,
      selectedDate: '2025-10-08'
    };
  }

  componentDidMount() {
    // Mock API data
    const mockData = [
      {
        id: 1,
        queueNumber: 'Q001',
        name: 'สมชาย ใจดี',
        room: 'A101',
        roomName: 'ห้องตรวจทั่วไป 1',
        pdate: '2025-10-08',
        station: 'ห้องตรวจทั่วไป',
        status: 'waiting',
        time: '09:00'
      },
      {
        id: 2,
        queueNumber: 'Q002',
        name: 'สมหญิง รักษ์ดี',
        room: 'A102',
        roomName: 'ห้องตรวจโรคหัวใจ',
        pdate: '2025-10-08',
        station: 'ห้องตรวจโรคหัวใจ',
        status: 'waiting',
        time: '09:15'
      },
      {
        id: 3,
        queueNumber: 'Q003',
        name: 'วิชัย สุขสันต์',
        room: 'A103',
        roomName: 'ห้องตรวจเด็ก',
        pdate: '2025-10-08',
        station: 'ห้องตรวจทั่วไป',
        status: 'active',
        time: '09:30'
      },
      {
        id: 4,
        queueNumber: 'Q004',
        name: 'มาลี ดีมาก',
        room: 'A101',
        roomName: 'ห้องตรวจทั่วไป 1',
        pdate: '2025-10-08',
        station: 'ห้องตรวจเด็ก',
        status: 'waiting',
        time: '09:45'
      },
      {
        id: 5,
        queueNumber: 'Q005',
        name: 'สมศักดิ์ มั่งมี',
        room: 'A102',
        roomName: 'ห้องตรวจโรคหัวใจ',
        pdate: '2025-10-08',
        station: 'ห้องตรวจทั่วไป',
        status: 'completed',
        time: '08:30'
      },
      {
        id: 6,
        queueNumber: 'Q006',
        name: 'วารี สวยงาม',
        room: 'A103',
        roomName: 'ห้องตรวจเด็ก',
        pdate: '2025-10-08',
        station: 'ห้องตรวจเด็ก',
        status: 'completed',
        time: '08:45'
      }
    ];
    
    // this.setState({ patients: mockData });

    // โหลดข้อมูลครั้งแรกตามวันที่ที่เลือก
    this.fetchPatients(this.state.selectedDate);
  }

  fetchPatients = (date) => {
    const acpDte = (date || '').replace(/-/g, '');
    const url = `http://localhost:3002/api/v1/kiosk/getPatientList?AcpDte=${encodeURIComponent(acpDte)}`;
    return fetch(url)
      .then(response => response.json())
      .then(data => this.setState({ patients: data.data || [] }))
      .catch(error => console.error('Error:', error));
  }

  handleStart = async (patient, fstatus) => {
    try {
      const response = await fetch('http://localhost:3002/api/v1/queues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...patient,
          room_id: patient.room,
          status: fstatus
        })
      });

      if (!response.ok) {
        // Try to surface server error details
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

      // Update local state according to requested fstatus
      this.setState({
        currentPatient: fstatus === 'active' ? patient : this.state.currentPatient,
        patients: this.state.patients.map(function(p) {
          if (p.id === patient.id) {
            return Object.assign({}, p, { status: fstatus });
          }
          return p;
        })
      });

      // Optionally reconcile with server payload if it returns updated patient
      if (data && data.patient && data.patient.id) {
        this.setState({
          patients: this.state.patients.map(function(p) {
            if (p.id === data.patient.id) {
              return Object.assign({}, p, data.patient);
            }
            return p;
          })
        });
      }
    } catch (error) {
      console.error('Error updating queue:', error);
      alert(`Failed to start patient. Please try again.\n${error && error.message ? error.message : ''}`);
    }
  }

  handleFinish = (patientId) => {
    const currentPatient = this.state.currentPatient;
    this.setState({
      patients: this.state.patients.map(function(p) {
        if (p.id === patientId) {
          return Object.assign({}, p, { status: 'completed' });
        }
        return p;
      }),
      currentPatient: currentPatient && currentPatient.id === patientId ? null : currentPatient
    });
  }

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab });
  }

  handleAddPatient = (newPatient) => {
    const nextId = Math.max(...this.state.patients.map(p => p.id)) + 1;
    const nextQueueNumber = 'Q' + String(nextId).padStart(3, '0');
    
    const patient = {
      id: nextId,
      queueNumber: nextQueueNumber,
      name: newPatient.name,
      room: newPatient.room,
      roomName: newPatient.roomName,
      pdate: newPatient.date,
      station: newPatient.station,
      status: newPatient.status,
      ptime: newPatient.time
    };

    this.setState({
      patients: [...this.state.patients, patient],
      showAddPatientModal: false
    });
  }

  toggleAddPatientModal = () => {
    this.setState({ showAddPatientModal: !this.state.showAddPatientModal });
  }

  // Removed old refresh simulation; data now refreshes on date change

  handleRoomChange = (patientId, newRoom) => {
    this.setState({
      patients: this.state.patients.map(patient => {
        if (patient.id === patientId) {
          return {
            ...patient,
            room: newRoom.room_code,
            roomName: newRoom.room_name
          };
        }
        return patient;
      })
    });
    // No auto-refresh here; date change controls refresh
  }

  handleDateChange = (newDate) => {
    this.setState({ selectedDate: newDate });
    this.fetchPatients(newDate);
  }

  handleToggleLang = (lang) => {
    this.setState({ lang });
  }

  countByStatus = (status) => {
    return this.state.patients.filter(function(p) {
      return p.status === status;
    }).length;
  }

  getFilteredPatients = () => {
    const activeTab = this.state.activeTab;
    return this.state.patients.filter(function(p) {
      if (activeTab === 'waiting') {
        return p.status === 'waiting';
      } else if (activeTab === 'active') {
        return p.status === 'active';
      } else if (activeTab === 'completed') {
        return p.status === 'completed';
      }
      return true;
    });
  }

  render() {
    const filteredPatients = this.getFilteredPatients();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Header 
            onAddPatient={this.toggleAddPatientModal}
            selectedDate={this.state.selectedDate}
            onDateChange={this.handleDateChange}
            lang={this.state.lang || 'TH'}
            onToggleLang={this.handleToggleLang}
          />
          
          <CurrentPatientAlert currentPatient={this.state.currentPatient} />
          
          <Statistics 
            countByStatus={this.countByStatus}
            activeTab={this.state.activeTab}
            setActiveTab={this.setActiveTab}
            lang={this.state.lang || 'TH'}
          />
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <TabNavigation 
              activeTab={this.state.activeTab}
              setActiveTab={this.setActiveTab}
              countByStatus={this.countByStatus}
              lang={this.state.lang || 'TH'}
            />
            
            <PatientTable 
              patients={filteredPatients}
              handleStart={this.handleStart}
              onRoomChange={this.handleRoomChange}
              lang={this.state.lang || 'TH'}
            />
          </div>
        </div>

        <AddPatientModal
          isOpen={this.state.showAddPatientModal}
          onClose={this.toggleAddPatientModal}
          onAddPatient={this.handleAddPatient}
        />
      </div>
    );
  }
}

export default App;
