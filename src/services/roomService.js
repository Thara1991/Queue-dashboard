// API service for examination rooms
class RoomService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';
  }

  // Get all examination rooms from QNurse database
  async getExaminationRooms() {
    try {
      const response = await fetch(`${this.baseURL}/examination-rooms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching examination rooms:', error);
      throw error;
    }
  }

  // Get active examination rooms only
  async getActiveExaminationRooms() {
    try {
      const response = await fetch(`${this.baseURL}/examination-rooms?status=active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching active examination rooms:', error);
      throw error;
    }
  }

  // Get room by ID
  async getRoomById(roomId) {
    try {
      const response = await fetch(`${this.baseURL}/examination-rooms/${roomId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching room by ID:', error);
      throw error;
    }
  }

  // Mock data for development/testing
  getMockRooms() {
    return [
      { 
        id: 1, 
        room_code: 'A101', 
        room_name: 'ห้องตรวจทั่วไป 1', 
        capacity: 1, 
        status: 'active',
        department: 'General Medicine',
        floor: 1
      },
      { 
        id: 2, 
        room_code: 'A102', 
        room_name: 'ห้องตรวจโรคหัวใจ', 
        capacity: 1, 
        status: 'active',
        department: 'Cardiology',
        floor: 1
      },
      { 
        id: 3, 
        room_code: 'A103', 
        room_name: 'ห้องตรวจเด็ก', 
        capacity: 1, 
        status: 'active',
        department: 'Pediatrics',
        floor: 1
      },
      { 
        id: 4, 
        room_code: 'B101', 
        room_name: 'ห้องตรวจทั่วไป 2', 
        capacity: 1, 
        status: 'active',
        department: 'General Medicine',
        floor: 2
      },
      { 
        id: 5, 
        room_code: 'B102', 
        room_name: 'ห้องตรวจตา', 
        capacity: 1, 
        status: 'active',
        department: 'Ophthalmology',
        floor: 2
      },
      { 
        id: 6, 
        room_code: 'C101', 
        room_name: 'ห้องตรวจผิวหนัง', 
        capacity: 1, 
        status: 'active',
        department: 'Dermatology',
        floor: 3
      },
      { 
        id: 7, 
        room_code: 'C102', 
        room_name: 'ห้องตรวจหูคอจมูก', 
        capacity: 1, 
        status: 'active',
        department: 'ENT',
        floor: 3
      },
      { 
        id: 8, 
        room_code: 'D101', 
        room_name: 'ห้องตรวจกระดูก', 
        capacity: 1, 
        status: 'active',
        department: 'Orthopedics',
        floor: 4
      }
    ];
  }
}

export default new RoomService();
