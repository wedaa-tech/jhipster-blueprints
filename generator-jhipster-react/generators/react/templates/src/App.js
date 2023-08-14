import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import DocsPage from './components/Docs';
<%_  if (apiServers.length > 0) { _%>
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
<%_ } _%> 
<%_ if (oauth2) { _%>
import PrivateRoute from './config/auth/privateRoute';
<%_ } _%> 

function App() {
  return (
    <div className="App">
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<Banner />} />
          <Route path="/docs" element={
          <%_ if (oauth2) { _%>
            <PrivateRoute>
          <%_ } _%> 
              <div className='container'>
                <DocsPage />
              </div>
          <%_ if (oauth2) { _%>
            </PrivateRoute>
          <%_ } _%>           
          } />
        <%_ apiServers.forEach((appServer) =>  { _%>
          <Route path="/swagger/<%= appServer.baseName.toLowerCase() %>" element={
            <%_ if (oauth2) { _%>
            <PrivateRoute>
            <%_ } _%> 
              <div className="swagger">
                <SwaggerUI url={process.env.REACT_APP_MICROSERVICE_<%= appServer.baseName.toUpperCase() %>.concat("/v3/api-docs")} />
              </div>
            <%_ if (oauth2) { _%>
            </PrivateRoute>
            <%_ } _%> 
          } />
          <%_ }) _%>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
