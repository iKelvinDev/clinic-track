import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import NotificationList from './pages/NotificationList'
import PatientDetail from './pages/PatientDetail'
import PatientForm from './pages/PatientForm'
import PatientList from './pages/PatientList'

function App() {

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PatientList />} />
        <Route path="patients/new" element={<PatientForm />} />
        <Route path="patients/:id/edit" element={<PatientForm />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="notifications" element={<NotificationList />} />
      </Routes>
    </Layout>
  )
}

export default App
