import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import navIcon2 from '../assets/img/nav-icon2.svg';
import { BiChevronDown } from 'react-icons/bi';
<%_ if (oauth2) { _%>
import { useAuth } from "react-oidc-context";
<%_ } _%> 
import {
  BrowserRouter as Router
} from "react-router-dom";

export const NavBar = () => {

  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
<%_ if (oauth2) { _%>
  const auth = useAuth();
<%_ } _%> 

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const toggleMenu = () => {
    console.log("Toggle menu clicked");
    setIsSubMenuOpen(!isSubMenuOpen);
  }

  const onUpdateActiveLink = (value) => {
    console.log("Update active link clicked");
    setActiveLink(value);
  }
<%_ if (oauth2) { _%>
  if (auth.isLoading) {
    return <></>;
  }

  let isloggedIn;
  if (auth.isAuthenticated) {
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    )
    isloggedIn = auth.isAuthenticated;
  }
<%_ } _%> 


  return (
    <Router>
      <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
        <Container>
          <Navbar.Brand href="/">

          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/" 
                className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>
                  Home
              </Nav.Link>
            <%_  if(apiServers.length > 0) { _%>
              <Nav.Link
                className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'}
                onClick={() => {
                  toggleMenu();
                  onUpdateActiveLink('skills');
                }}>
                  Swagger <BiChevronDown />
              </Nav.Link>  
            <%_ } _%>  
            <%_  if( servicesWithOutDB.length > 0 ) { _%>
              <Nav.Link
                href="/ping"
                className={activeLink === 'ping' ? 'active navbar-link' : 'navbar-link'}
                onClick={() => onUpdateActiveLink('ping')}
              >
                Ping
              </Nav.Link>
            <%_ } _%>  
              <Nav.Link href="/docs" 
                className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>
                  Docs
              </Nav.Link>
            </Nav>
          <%_  if (apiServers.length > 0) { _%>
            <div className={isSubMenuOpen ? "sub-menu-wrap open-menu" : "sub-menu-wrap"} id="subMenu">
              <div class="sub-menu">
              <%_  if (apiServers.length == 1) { _%>
                <a href="/swagger/<%= apiServers[0].baseName.toLowerCase() %>" class="sub-menu-link">
                  <img src=""></img>
                  <h5><%= apiServers[0].baseName.toLowerCase() %></h5>
                  <span>&gt;</span>
                </a>
                <hr></hr>
                <span></span>
              <%_ } else {_%> 
                <%_ for (let i = 0; i < apiServers.length - 1; i++) { _%>
                  <a href="/swagger/<%= apiServers[i].baseName.toLowerCase() %>" class="sub-menu-link">
                    <img src=""></img>
                    <h5><%= apiServers[i].baseName.toLowerCase() %></h5>
                    <span>&gt;</span>
                  </a>
                  <hr></hr>
                  <span></span>
                  <%_ } _%>
                <a href="/swagger/<%= apiServers[apiServers.length - 1].baseName.toLowerCase() %>" class="sub-menu-link">
                  <img src=""></img>
                  <h5><%= apiServers[apiServers.length - 1].baseName.toLowerCase() %></h5>
                  <span>&gt;</span>
                </a>
              <%_ } _%> 
              </div>
            </div>
          <%_ } _%> 
            <span className="navbar-text">
              <div className="social-icon">
                <a onClick={() => window.open(process.env.REACT_APP_WEDAA_GITHUB, '_blank')}><img src={navIcon2} alt="" /></a>
              </div>
            <%_ if (oauth2) { _%>
              {isloggedIn ? (
                <a target="_blank" rel="noopener noreferrer">
                  <button className="vvd" onClick={() => auth.signoutRedirect({
                    post_logout_redirect_uri: process.env.REACT_APP_PROJECT_URL,
                  }
                  )}>
                    <span>Sign Out</span>
                  </button>
                </a>
              ) :
                <a target="_blank" rel="noopener noreferrer">
                  <button className="vvd" onClick={() => auth.signinRedirect()}>
                    <span>Sign In</span>
                  </button>
                </a>
              }
            <%_ } _%> 
            </span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Router>
  )
}
