# Queue Dashboard Management System

ระบบจัดการคิวผู้ป่วย สำหรับโรงพยาบาลและคลินิก

## วิธีติดตั้ง

1. ติดตั้ง dependencies:
\`\`\`bash
npm install
\`\`\`

2. รันโปรเจค:
\`\`\`bash
npm start
\`\`\`

3. เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

## ฟีเจอร์

- ✅ แสดงรายชื่อผู้ป่วยแบบเรียลไทม์
- ✅ แยกรายการตามสถานะ (รอตรวจ, กำลังตรวจ, ตรวจเสร็จ)
- ✅ เรียกคิวผู้ป่วย
- ✅ บันทึกการตรวจเสร็จ
- ✅ แสดงสถิติแบบเรียลไทม์

## การเชื่อมต่อ API

แก้ไขไฟล์ `src/App.js` ในส่วน `componentDidMount()`:

\`\`\`javascript
fetch('YOUR_API_ENDPOINT')
  .then(response => response.json())
  .then(data => this.setState({ patients: data }))
  .catch(error => console.error('Error:', error));
\`\`\`

## ข้อกำหนดระบบ

- Node.js 12+
- React 17+
- npm หรือ yarn
```

---

## วิธีใช้งาน

1. **สร้างโฟลเดอร์ project:**
   ```bash
   mkdir queue-dashboard
   cd queue-dashboard
   ```

2. **Copy ไฟล์ทั้งหมดตามโครงสร้างด้านบน**

3. **ติดตั้ง dependencies:**
   ```bash
   npm install
   ```

4. **รัน project:**
   ```bash
   npm start
   ```

5. **เปิดเบราว์เซอร์ที่:** http://localhost:3000

---

## หมายเหตุ

- ใช้ Tailwind CDN ใน index.html (ไม่ต้องติดตั้งแยก)
- รองรับ Node.js 12+
- ใช้ Class Components แทน Hooks
- แยกไฟล์ตาม Component เพื่อความเป็นระเบียบ
