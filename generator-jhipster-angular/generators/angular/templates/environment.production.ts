export const environment = {
  projectName: '<%= baseName %>',
  projectUrl: 'http://localhost:4200',
  
  wedaaDocs: 'https://www.wedaa.tech/docs/',
  wedaaGithub: 'https://github.com/wedaa-tech',
  
<%_ if(oauth2)  { _%>
  angularOidcAuthority: 'http://localhost:9080/realms/jhipster',
  angularOidcClientId: 'web_app',
<%_ } _%>     
};