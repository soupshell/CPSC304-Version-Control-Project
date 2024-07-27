import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import RepoHome from './pages/RepoHome';
import UsersList from './pages/UsersList';
import FilePage from './pages/FilesPage.jsx'
import './App.css';

function App() {

  return (
    <>
     <Router>
      <div className="App"> 
      <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/Home" element={<Home />}/>
            <Route path="/Repo" element={<RepoHome />}/>
            <Route path = "/:User/:Repo/:file" element = {<FilePage></FilePage>}> </Route>
      </Routes>
      </div>
      </Router>
    </>
  );
}

export default App;
