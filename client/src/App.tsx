import AppRoutes from './routes/Routes'
import { BrowserRouter as MainRouter } from 'react-router'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <MainRouter>
        <AppRoutes />
      </MainRouter>
    </>
  )
}

export default App
