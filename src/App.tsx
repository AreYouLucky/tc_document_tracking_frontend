import { Routes, Route, Navigate } from 'react-router-dom'
import DocumentBooking from './pages/booking/document-booking'

function App() {
  return (
    <Routes>
      <Route path="/booking-page" element={<DocumentBooking />} />
    </Routes>
  )
}

export default App
