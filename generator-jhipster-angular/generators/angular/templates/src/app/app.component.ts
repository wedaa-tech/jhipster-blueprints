
import { Component, OnInit } from '@angular/core';
<%_ if(oauth2)  { _%>
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
<%_ } _%>  
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  <%_ if(oauth2)  { _%>
  constructor(public oidcSecurityService: OidcSecurityService) {}
  <%_ } _%> 

  ngOnInit() {
    <%_ if(oauth2)  { _%>
    this.oidcSecurityService
      .checkAuth()
      .subscribe((loginResponse: LoginResponse) => {
        const { isAuthenticated, userData, accessToken, idToken, configId } =
          loginResponse;
      });
    <%_ } _%>  
  }

  <%_ if(oauth2)  { _%>
  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
  }
  <%_ } _%>  
}