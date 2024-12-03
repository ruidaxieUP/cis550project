import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import PersonPage from './pages/PersonPage';
import MoviePage from './pages/MoviePage';
import PersonInfoPage from './pages/PersonInfoPage.jsx';
import MovieInfoPage from './pages/MovieInfoPage';
import Footer from './components/Footer';


function App() {
  return (
    <>
      <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/persons" element={<PersonPage />} />
        <Route path="/persons/:person_id" element={<PersonInfoPage />} />
        <Route path="/movies" element={<MoviePage />} />
        <Route path="/movies/:movie_id" element={<MovieInfoPage />} />
      </Routes>
      <Footer />
    </Router>
    </>
  )
}

export default App
