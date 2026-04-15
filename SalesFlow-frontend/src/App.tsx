import './App.css'
import { ContextUserAppProvider } from './context/contextApp';
import { RouterApp } from './routes/routerApp'
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <ContextUserAppProvider>
        <RouterApp />
        <ToastContainer />
      </ContextUserAppProvider>
    </BrowserRouter>
  )
}

export default App