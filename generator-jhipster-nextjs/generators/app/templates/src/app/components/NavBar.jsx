'use client';

import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { BiChevronDown } from 'react-icons/bi';
<%_ if(oauth2) { _%>
  import { useSession,signIn, signOut } from "next-auth/react";
<%_ } _%>


export const NavBar = () => {

  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  <%_  if( servicesWithDB.length > 0 ) { _%>
    const [isSubMenuOpenForNotes, setIsSubMenuOpenForNotes] = useState(false);
  <%_ } _%> 
  <%_ if(oauth2) { _%>
    const [isLoggedIn,setIsLoggedIn] = useState(false);
  <%_ } _%>


  <%_ if (oauth2) { _%>
    const authData = useSession();
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

  <%_ if (oauth2) { _%>

    useEffect(()=>{
      if (authData.status==='loading') {
        return <></>;
      }
      else if(authData.status==='unauthenticated'){
        setIsLoggedIn(false);
      }
      else if (authData.status==='authenticated') {
        setIsLoggedIn(true);
      }
    },[authData]);
    
  <%_ } _%> 

  const toggleMenu = () => {
    console.log("Toggle menu swagger clicked");
    setIsSubMenuOpen(!isSubMenuOpen);
  }
  
  <%_  if( servicesWithDB.length > 0 ) { _%>
    const toggleNotesMenu = () => {
      console.log("Toggle menu notes clicked");
      setIsSubMenuOpenForNotes(!isSubMenuOpenForNotes);
  
    }
  <%_ } _%> 


  const onUpdateActiveLink = (value) => {
    console.log("Update active link clicked");
    setActiveLink(value);
  }

  



  return (
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


      
<%_  if( servicesWithDB.length > 0 ) { _%>
              <Nav.Link
                className={
                  activeLink === "notes" ? "active navbar-link" : "navbar-link"
                }
                onClick={() => {
                  toggleNotesMenu();
                  onUpdateActiveLink("notes")
                }}
              >
                Notes <BiChevronDown />
            </Nav.Link>
            <%_ } _%> 

    

              <Nav.Link href="/docs" 
                className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>
                  Docs
              </Nav.Link>
            </Nav>
       
            <%_  if (apiServers.length > 0) { _%>
            <div className={isSubMenuOpen ? "sub-menu-wrap open-menu" : "sub-menu-wrap"} id="subMenu">
              <div className="sub-menu">
              <%_  if (apiServers.length == 1) { _%>
                <a href="/swagger/<%= apiServers[0].baseName.toLowerCase() %>" className="sub-menu-link">
                  <img src=""></img>
                  <h5><%= apiServers[0].baseName.toLowerCase() %></h5>
                  <span>&gt;</span>
                </a>
                <hr></hr>
                <span></span>
              <%_ } else {_%> 
                <%_ for (let i = 0; i < apiServers.length - 1; i++) { _%>
                  <a href="/swagger/<%= apiServers[i].baseName.toLowerCase() %>" className="sub-menu-link">
                    <img src=""></img>
                    <h5><%= apiServers[i].baseName.toLowerCase() %></h5>
                    <span>&gt;</span>
                  </a>
                  <hr></hr>
                  <span></span>
                  <%_ } _%>
                <a href="/swagger/<%= apiServers[apiServers.length - 1].baseName.toLowerCase() %>" className="sub-menu-link">
                  <img src=""></img>
                  <h5><%= apiServers[apiServers.length - 1].baseName.toLowerCase() %></h5>
                  <span>&gt;</span>
                </a>
              <%_ } _%> 
              </div>
            </div>
          <%_ } _%> 

          <%_  if( servicesWithDB.length > 0 ) { _%>
            <div
                className={
                  isSubMenuOpenForNotes ? "sub-menu-wrap open-menu" : "sub-menu-wrap"
                }
                id="subMenu"
            >
              <div className="sub-menu">
                <%_  if (servicesWithDB.length == 1) { _%>
                <a href="/notes/<%= servicesWithDB[0].toLowerCase() %>" className="sub-menu-link">
                  <img src=""></img>
                  <h5><%= servicesWithDB[0].toLowerCase() %></h5>
                  <span>&gt;</span>
                </a>
                <hr></hr>
                <span></span>
                <%_ } else {_%> 
                  <%_ for (let i = 0; i < servicesWithDB.length - 1; i++) { _%>
                  <a href="/notes/<%= servicesWithDB[i].toLowerCase() %>" className="sub-menu-link">
                  <img src=""></img>
                  <h5><%= servicesWithDB[i].toLowerCase() %></h5>
                  <span>&gt;</span>
                  </a>
                  <hr></hr>
                  <span></span>
                  <%_ } _%> 
                  <a href="/notes/<%= servicesWithDB[servicesWithDB.length - 1].toLowerCase() %>" className="sub-menu-link">
                  <img src=""></img>
                  <h5><%= servicesWithDB[servicesWithDB.length - 1].toLowerCase() %></h5>
                  <span>&gt;</span>
                </a>
              <%_ } _%> 
              </div>
            </div>
          <%_ } _%>  

            <span className="navbar-text">
              <div className="social-icon">
                <a href={process.env.WEDAA_GITHUB}><img src="/assets/img/nav-icon2.svg" alt="" /></a>
              </div>
            <%_ if (oauth2) { _%>
              {isLoggedIn ? (
                <a target="_blank" rel="noopener noreferrer">
                  <button className="vvd" onClick={() => {
                    signOut()
                  }
                  }>
                    <span>Sign Out</span>
                  </button>
                </a>
              ) :
                <a target="_blank" rel="noopener noreferrer">
                  <button className="vvd" onClick={() => {signIn(['keycloak'])}}>
                    <span>Sign In</span>
                  </button>
                </a>
              }
            <%_ } _%> 
            </span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}