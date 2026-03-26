import './App.css'
import { BrowserRouter, Route, Routes } from "react-router"
import Login from './pages/Login/login'
import Signup from './pages/Login/signup'
import ItemList from './pages/Items/itemList'
import InvoiceDashboard from './pages/Invoice/invoiceDashboard'
import InvoiceEditor from './pages/Invoice/invoiceEditor'
import ProtectedRoute from './routes/ProtectedRoute'
const envType = import.meta.env.VITE_USE_MOCK_ENV;

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/invoice/items"
            element={
              <ProtectedRoute>
                <ItemList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoice/dashboard"
            element={
              <ProtectedRoute>
                <InvoiceDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoice/:id"
            element={
              <ProtectedRoute>
                <InvoiceEditor />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
