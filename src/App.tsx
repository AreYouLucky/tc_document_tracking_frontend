import { Routes, Route } from 'react-router-dom'
import DocumentBooking from './pages/booking/document-booking'
import DocumentQueueing from './pages/queueing/document-queueing'

function App() {
  return (
    <Routes>
      <Route path="/booking-page" element={<DocumentBooking />} />
      <Route path="/queue-page" element={<DocumentQueueing />} />

    </Routes>
  )
}

export default App
