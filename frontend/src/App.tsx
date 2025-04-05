import './App.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { ProfileCard } from './pages/profileCard';
import { ProfileForm } from './pages/profileForm';

const routes = (
  <Router>
    <Routes>
      <Route path='/' element={<ProfileForm />} />
      <Route path='/:userid/profile' element={<ProfileCard />} />
    </Routes>
  </Router>
);
function App() {
  return <div>{routes}</div>;
}

export default App;
