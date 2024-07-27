import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import RepoHome from './pages/RepoHome';
import UsersList from './pages/UsersList';
import './App.css';

function App() {
  const users = {'test@gmail.com': '1234'};

  const [isVerified, setStatus] = useState(sessionStorage.getItem('isVerified') || 0);
  const verify = (formValue) => {
    console.log('verify caled');
    console.log(formValue);
    const email = formValue['email'];
    const passcode = formValue['pwd'];
    if (users[email] == passcode) {
      console.log('set Session Storage as authenticated')
      sessionStorage.setItem( 'isVerified', 1 );
      setStatus(1);
    } 
  }

  return (
    <>
     <Router>
      <div className="App"> 
      <Routes>
            <Route path="/" element={<Login verifyFn={verify} />}/>
            <Route path="/Home" element={isVerified == 1 ? <Home />:<Login verifyFn={verify} />}/>
            <Route path="/Repo" element={isVerified == 1 ? <RepoHome />:<Login verifyFn={verify} />}/>
            <Route path="/UsersList" element={<UsersList/>}/>
      </Routes>
      </div>
      </Router>
    </>
  );
}

export default App;
