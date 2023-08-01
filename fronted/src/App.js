
import React from 'react';
import './App.css';
import Header from './component/layout/Header/Header';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home1';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import WebFont from 'webfontloader'


function App() {
  React.useEffect(() => {
    WebFont.load({
      google:{
        families:["Roboto", "Droid Sans", "Chilanka"],
      }
    })
    },[])
  return (
  <Router>
    <Header/>
    {/* <Route exact path="/" component={Home} /> */}
    
    <Footer/>

  </Router>
  );
}

export default App;
