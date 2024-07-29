import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import RepoHome from './pages/RepoHome';
import UsersList from './pages/UsersList';
import FilePage from './pages/FilesPage.jsx'
import './App.css';
import TesterPage from "./pages/SQLTester.jsx";

function App() {
  const users = {'testuser': '1234'};

  const [isVerified, setStatus] = useState(sessionStorage.getItem('isVerified') || 0);
  const verify = (formValue) => {
    console.log('verify caled');
    console.log(formValue);
    const username = formValue['username'];
    const passcode = formValue['pwd'];
    if (users[username] == passcode) {
      console.log('set Session Storage as authenticated')
      sessionStorage.setItem( 'isVerified', formValue['username']);
      setStatus(1);
    } 
  }

  return (
    <>
     <Router>
      <div className="App"> 
      <Routes>
            <Route path="/" element={isVerified != 0 ? <Home />:<Login verifyFn={verify} />}/>
            <Route path="/UsersList" element={<UsersList/>}/>
            <Route path="/:User/:Repo" element={isVerified != 0 ? <RepoHome />:<Login verifyFn={verify} />}/>
            <Route path = "/:User/:Repo/:File" element = {isVerified != 0 ? <FilePage/>: <Login verifyFn={verify}/>}> </Route>
            <Route path = "/testSQL" element = {<TesterPage></TesterPage>}> </Route>
      </Routes>
      </div>
      </Router>
    </>
  );
}

export default App;
