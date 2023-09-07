export const environment = {
  projectName: '<%= baseName %>',
  projectUrl: 'http://localhost:4200',
  
  wedaaDocs: 'https://wedaa-tech.github.io',
  wedaaGithub: 'https://github.com/wedaa-tech',
  
  
  <%_ if(oauth2)  { _%>
    angularOidcAuthority: 'http://localhost:9080/realms/jhipster',
    angularOidcClientId: 'web_app',
    <%_ } _%>     
  };
  
  // <%=serverPort %>',
  // PORT=9000
  // GENERATE_SOURCEMAP=false
  // <%_ apiServers.forEach((appServer) =>  { _%>
  //   angularMicroservice_<%= appServer.baseName.toUpperCase() %>:'http://localhost:<%= appServer.serverPort %>',
  // <%_ }) _%>
