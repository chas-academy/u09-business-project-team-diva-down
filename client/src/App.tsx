// import AppRoutes from './routes/Routes'
// import { BrowserRouter as MainRouter } from 'react-router'

// function App() {

//   return (
//     <>
//       <MainRouter>
//         <div id="container">
//           <AppRoutes />
//         </div>
//       </MainRouter>
//     </>
//   )
// }

// export default App

import AppRoutes from './routes/Routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 


function App() {
  return (
    <Router> 
      <AuthProvider> 
        <div id="container">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;