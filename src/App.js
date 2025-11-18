import React from 'react';
import Header from './components/Header';
import CurrentPatientAlert from './components/CurrentPatientAlert';
import Statistics from './components/Statistics';
import TabNavigation from './components/TabNavigation';
import PatientTable from './components/PatientTable';
import AddPatientModal from './components/AddPatientModal';
import RoomInfoModal from './components/RoomInfoModal';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: [],
      currentPatient: null,
      activeTab: 'waiting',
      showAddPatientModal: false,
      selectedDate: '2025-11-03',
      selectedStationCode: '90',
      showRoomInfo: false,
      allRoomsExpanded: false
    };
    this.toggleAllRoomsCallback = null;
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
        status: 'SKIP',
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
        status: 'SKIP',
        time: '08:45'
      }
    ];
    
    // this.setState({ patients: mockData });

    // โหลดข้อมูลครั้งแรกตามวันที่และสถานีที่เลือก
    this.fetchPatients(this.state.selectedDate, this.state.selectedStationCode);
  }

  fetchPatients = (date, stationCode) => {
    const acpDte = (date || '').replace(/-/g, '');
    const effectiveStation = stationCode !== undefined ? stationCode : this.state.selectedStationCode;
    const params = new URLSearchParams();

    if (acpDte) {
      params.append('AcpDte', acpDte);
    }

    if (effectiveStation) {
      params.append('station', effectiveStation);
    }

    const queryString = params.toString();
    const url = queryString 
      ? `http://localhost:3002/api/v1/kiosk/getPatientList?${queryString}`
      : 'http://localhost:3002/api/v1/kiosk/getPatientList';
    console.log('Full API path: GET', url);
    return fetch(url)
      .then(response => response.json())
      .then(data => this.setState({ patients: data.data || [] }))
      .catch(error => console.error('Error:', error));
  }

  handleStart = async (patient, fstatus) => {
    try {
      const url = 'http://localhost:3002/api/v1/queues/EnterQueue';
      // Format CurDate as 'YYYYMMDD' (e.g., '20251103')
      const curDateFormatted = (this.state.selectedDate || '').replace(/-/g, '');
      const requestBody = {
        ...patient,
        room_id: patient.room,
        status: fstatus,
        CurDate: curDateFormatted
      };
      console.log('Full API path: POST', url);
      console.log('Request body:', JSON.stringify(requestBody));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
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
      console.log('API response from EnterQueue:', data);
      if (fstatus === 'IN') {
        console.log('Complete button clicked - API return data:', JSON.stringify(data, null, 2));
      }

      // Extract exam_time from response (check multiple possible response structures)
      let examTime = null;
      if (data && data.exam_time !== undefined && data.exam_time !== null) {
        examTime = data.exam_time;
      } else if (data && data.data && data.data.exam_time !== undefined && data.data.exam_time !== null) {
        examTime = data.data.exam_time;
      } else if (data && data.patient && data.patient.exam_time !== undefined && data.patient.exam_time !== null) {
        examTime = data.patient.exam_time;
      }

      // Update local state according to requested fstatus and exam_time
      const updateData = { status: fstatus };
      if (examTime !== null && fstatus === 'IN') {
        updateData.exam_time = examTime;
      }

      this.setState({
        currentPatient: fstatus === 'CALL' ? patient : this.state.currentPatient,
        patients: this.state.patients.map(function(p) {
          if (p.id === patient.id) {
            return Object.assign({}, p, updateData);
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
          return Object.assign({}, p, { status: 'SKIP' });
        }
        return p;
      }),
      currentPatient: currentPatient && currentPatient.id === patientId ? null : currentPatient
    });
  }

  setActiveTab = (tab) => {
    // If clicking the active tab while it's already active, toggle all rooms
    if (tab === 'active' && this.state.activeTab === 'active' && this.toggleAllRoomsCallback) {
      this.toggleAllRoomsCallback();
    } else {
      this.setState({ activeTab: tab });
    }
  }

  setToggleAllRoomsCallback = (callback) => {
    this.toggleAllRoomsCallback = callback;
  }

  setAllRoomsExpanded = (expanded) => {
    this.setState({ allRoomsExpanded: expanded });
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

  toggleRoomInfo = () => {
    this.setState({ showRoomInfo: !this.state.showRoomInfo });
  }

  // Removed old refresh simulation; data now refreshes on date change

  handleRoomChange = (patientId, newRoom, queueNumber = null) => {
    this.setState({
      patients: this.state.patients.map(patient => {
        if (patient.id === patientId) {
          const update = {
            ...patient,
            room: newRoom.id,
            roomName: newRoom.room_name,
            status: 'ADD'
          };
          if (queueNumber !== null && queueNumber !== undefined) {
            update.queueNumber = queueNumber;
          }
          return update;
        }
        return patient;
      })
    });
    // No auto-refresh here; date change controls refresh
  }

  handleDateChange = (newDate) => {
    this.setState({ selectedDate: newDate }, () => {
      this.fetchPatients(newDate);
    });
  }

  handleStationChange = (station) => {
    const stationCode = station && station.Station_Code != null ? String(station.Station_Code) : '';
    this.setState({ selectedStationCode: stationCode }, () => {
      this.fetchPatients(this.state.selectedDate, stationCode);
    });
  }

  handleToggleLang = (lang) => {
    this.setState({ lang });
  }

  countByStatus = (status) => {
    if (status === 'waiting') {
      return this.state.patients.filter(function(p) {
        return p.status === '';
      }).length;
    } else if (status === 'active') {
      return this.state.patients.filter(function(p) {
        return p.status === 'ADD' || p.status === 'IN' || p.status === 'CALL';
      }).length;
    } else if (status === 'skip') {
      return this.state.patients.filter(function(p) {
        return p.status === 'SKIP';
      }).length;
    }
    return 0;
  }

  getFilteredPatients = () => {
    const activeTab = this.state.activeTab;
    return this.state.patients.filter(function(p) {
      if (activeTab === 'waiting') {
        return p.status === '';
      } else if (activeTab === 'active') {
        return p.status === 'ADD' || p.status === 'IN' || p.status === 'CALL';
      } else if (activeTab === 'skip') {
        return p.status === 'SKIP';
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
            selectedDate={this.state.selectedDate}
            onDateChange={this.handleDateChange}
            lang={this.state.lang || 'TH'}
            onToggleLang={this.handleToggleLang}
            onToggleRoomInfo={this.toggleRoomInfo}
            onStationChange={this.handleStationChange}
            initialStationCode={this.state.selectedStationCode}
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
              allRoomsExpanded={this.state.allRoomsExpanded}
            />
            
            <PatientTable 
              patients={filteredPatients}
              handleStart={this.handleStart}
              onRoomChange={this.handleRoomChange}
              lang={this.state.lang || 'TH'}
              stationCode={this.state.selectedStationCode}
              activeTab={this.state.activeTab}
              selectedDate={this.state.selectedDate}
              setToggleAllRoomsCallback={this.setToggleAllRoomsCallback}
              setAllRoomsExpanded={this.setAllRoomsExpanded}
            />
          </div>
        </div>

        <AddPatientModal
          isOpen={this.state.showAddPatientModal}
          onClose={this.toggleAddPatientModal}
          onAddPatient={this.handleAddPatient}
          stationCode={this.state.selectedStationCode}
        />

        <RoomInfoModal
          isOpen={this.state.showRoomInfo}
          onClose={this.toggleRoomInfo}
          lang={this.state.lang || 'TH'}
          stationCode={this.state.selectedStationCode}
        />
      </div>
    );
  }
}

export default App;
