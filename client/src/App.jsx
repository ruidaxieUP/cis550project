import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import PersonPage from './pages/PersonPage';
import MoviePage from './pages/MoviePage';
import ContactPage from './pages/ContactPage';
import PersonInfoPage from './pages/PersonInfoPage.jsx';
import MovieInfoPage from './pages/MovieInfoPage';


function App() {
  return (
    <>
      <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/person" element={<PersonPage />} />
        <Route path="/person/:person_id" element={<PersonInfoPage />} />
        <Route path="/movies" element={<MoviePage />} />
        <Route path="/movies/:movie_id" element={<MovieInfoPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
