export const environment = {
  projectName: '<%= baseName %>',
  projectUrl: 'http://localhost:<%= serverPort %>',
  
  wedaaDocs: 'https://www.wedaa.tech/docs/introduction/what-is-wedaa',
  wedaaGithub: 'https://github.com/wedaa-tech',
  
<%_ if(oauth2)  { _%>
  angularOidcAuthority: 'http://localhost:9080/realms/jhipster',
  angularOidcClientId: 'web_app',
<%_ } _%> 

<%_ apiServers.forEach((appServer) =>  { _%>
  microservice<%= appServer.baseName.charAt(0).toUpperCase() + appServer.baseName.slice(1, -1).toLowerCase() + appServer.baseName.slice(-1).toUpperCase() %>: 'http://localhost:<%= appServer.serverPort %>',
<%_ }) _%>

};
  
