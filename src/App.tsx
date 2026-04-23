import { Navigate, Route, Routes } from 'react-router-dom'
import DocumentBooking from './pages/booking/document-booking'
import DocumentQueueing from './pages/queueing/document-queueing'
import FrontPage from './pages/front-page'

function App() {
  return (
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/booking-page" element={<DocumentBooking />} />
      <Route path="/queue-page" element={<DocumentQueueing />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
