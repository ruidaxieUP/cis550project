import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import PersonPage from './pages/PersonPage';
import MoviePage from './pages/MoviePage';
import ContactPage from './pages/ContactPage';


function App() {

  return (
    <>
      <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/person" element={<PersonPage />} />
        <Route path="/movie" element={<MoviePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
