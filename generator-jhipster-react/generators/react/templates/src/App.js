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
<%_  if( servicesWithOutDB.length > 0 ) { _%>
import Ping from './components/Ping';
<%_ } _%> 
<%_ if (oauth2) { _%>
import PrivateRoute from './config/auth/privateRoute';
<%_ } _%> 
<%_  if( servicesWithDB.length > 0 ) { _%>
import NotesList from './components/notes/NotesList';
<%_ } _%> 
<%_  if( servicesWithDB.length > 0 ) { _%>
  import { useAuth } from 'react-oidc-context';
  <%_ } _%> 

function App() {

  <%_  if( servicesWithDB.length > 0 ) { _%>
    const auth = useAuth();
  <%_ } _%> 

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
                <%_ if (oauth2) { _%>
                    <SwaggerUI requestInterceptor={(request)=>{
                      request.headers.Authorization = `Bearer ${auth.user.access_token}`
                      return request;
                    }} url={process.env.REACT_APP_MICROSERVICE_<%= appServer.baseName.toUpperCase() %>.concat("/v3/api-docs")} />
                 <%_ } else { _%>
                  <SwaggerUI url={process.env.REACT_APP_MICROSERVICE_<%= appServer.baseName.toUpperCase() %>.concat("/v3/api-docs")} />
                  <%_ } _%>
              </div>
            <%_ if (oauth2) { _%>
            </PrivateRoute>
            <%_ } _%> 
          } />
          <%_ }) _%>
        <%_ servicesWithDB.forEach((service) =>  { _%>
          <Route
            path="/notes/<%= service.toLowerCase() %>"
            element={
              <%_ if (oauth2) { _%>
                <PrivateRoute>
              <%_ } _%> 
              <div className="component">
                <NotesList notesApp={"<%= service.toLowerCase() %>"} />
              </div>
               <%_ if (oauth2) { _%>
                </PrivateRoute>
              <%_ } _%> 
            }
          />
          <%_ }) _%>

        <%_  if ( servicesWithOutDB.length > 0 ) { _%> 
          <Route
            path="/ping"
            element={
              <%_ if (oauth2) { _%>
                <PrivateRoute>
              <%_ } _%> 
              <div className="component">
              <Ping />
              </div>
               <%_ if (oauth2) { _%>
                </PrivateRoute>
              <%_ } _%> 
            }
          />
        <%_ } _%> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
