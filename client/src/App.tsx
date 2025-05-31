import AppRoutes from './routes/Routes'
import { BrowserRouter as MainRouter } from 'react-router'

function App() {

  return (
    <>
      <MainRouter>
        <div id="container">
          <AppRoutes />
        </div>
      </MainRouter>
    </>
  )
}

export default App
