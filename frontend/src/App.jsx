import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import RepoHome from './pages/RepoHome';
import UsersList from './pages/UsersList';
import FilePage from './pages/FilesPage.jsx'
import Issues from './pages/Issues.jsx';
import IssuePage from './pages/IssuePage.jsx';
import NewComment from './pages/NewComment.jsx';
import NewIssue from './pages/NewIssue.jsx';
import UpdateComment from './pages/UpdateComment.jsx'
import './App.css';
import TesterPage from "./pages/SQLTester.jsx";
import {userLogin, userSignup} from "./controller/controller.jsx"

function App() {
  const [isVerified, setStatus] = useState(sessionStorage.getItem('isVerified') || 0);

  //GET REQUEST
  // useEffect(() => {
  //   const res1 = fetch('http://localhost:59000/api')
  //   .then(response => response.json())
  //   .then(data => console.log( data));
  // }, []);


  async function verify(formValue){
    console.log('verify called');
    const username = formValue['username'];
    const passcode = formValue['pwd'];

    try {
      const auth =  await userLogin(username,passcode);
      if (auth) {
        console.log('set Session Storage as authenticated');
        sessionStorage.setItem( 'isVerified', formValue['username']);
        sessionStorage.setItem('password', formValue['pwd']);
        setStatus(1);
      } else {
        alert("wrong username and password");
      }
    } catch (e) {
        console.log(e);
    }
  }

   async function signup (formValue) {
    console.log('signup');
    console.log(formValue);
    const username = formValue['username'];
    const passcode = formValue['pwd'];
    const email = formValue['email'];

    try {
      const auth =  await userSignup(username,passcode, email);
      if (auth) {
        console.log('set Session Storage as authenticated');
        sessionStorage.setItem( 'isVerified', formValue['username']);
        sessionStorage.setItem('password', formValue['pwd']);
        sessionStorage.setItem('email', formValue['email']);
        setStatus(1);
      }  else {
        alert("username or email already taken");
      }
    } catch (e) {
        console.log(e);
    }
    
  }

  return (
    <>
     <Router>
      <div className="App"> 
      <Routes>
            <Route path="/" element={isVerified != 0 ? <Home />:<Login verifyFn={verify} signupFn = {signup} />}/>
            <Route path="/UsersList" element={<UsersList/>}/>
            <Route path="/:User/:Repo" element={isVerified != 0 ? <RepoHome />:<Login verifyFn={verify} signupFn = {signup} />}/>
            <Route path = "/:User/:Repo/:FileID" element = {isVerified != 0 ? <FilePage/>: <Login verifyFn={verify} signupFn = {signup} />}> </Route>
            <Route path = "/testSQL" element = {<TesterPage></TesterPage>}> </Route>
            <Route path = "/:User/:Repo/Issues" element = {isVerified != 0 ? <Issues/>: <Login verifyFn={verify}/>}> </Route>
            <Route path = "/:User/:Repo/Issues/:Issues" element = {isVerified != 0 ? <IssuePage/>: <Login verifyFn={verify}/>}> </Route>
            <Route path = "/:User/:Repo/Issues/:Issues/New" element = {isVerified != 0 ? <NewComment/>: <Login verifyFn={verify}/>}> </Route>
            <Route path = "/:User/:Repo/Issues/:Issues/:Comments" element = {isVerified != 0 ? <UpdateComment/>: <Login verifyFn={verify}/>}> </Route>
            <Route path = "/:User/:Repo/Issues/New" element = {isVerified != 0 ? <NewIssue/>: <Login verifyFn={verify}/>}> </Route>
      </Routes>
      </div>
      </Router>
    </>
  );
}

export default App;
