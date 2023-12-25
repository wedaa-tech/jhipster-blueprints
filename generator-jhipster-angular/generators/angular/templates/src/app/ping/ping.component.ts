import { Component, OnInit } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment';
<%_ if(oauth2)  { _%>
import { OidcSecurityService } from 'angular-auth-oidc-client';
<%_ } _%> 

@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.css']
})
export class PingComponent implements OnInit {
  
  selectedService: string = '';
  responseData: any = null;
  
  constructor(private http: HttpClient,
    <%_ if(oauth2)  { _%>
    private authService: OidcSecurityService,
    <%_ } _%> 
    ) {
    console.log('PingComponent initialized');
  }

  ngOnInit(): void {
    console.log('PingComponent ngOnInit');
  }

  handleDropdownChange(value: string): void {
    this.selectedService = value;
  }

  handlePing(): void {
    if (this.selectedService) {
      let selectedServiceEnv = "microservice" + this.selectedService.charAt(0).toUpperCase() + this.selectedService.slice(1);
      let apiUrl: string | undefined;
      const environmentKeyAndValuePairs: { key: string; value: string }[] = Object.keys(environment).map((key) => ({
        key,
        value: environment[key as keyof typeof environment], // Type assertion here
      }));
      const foundEnv = environmentKeyAndValuePairs.find((pair) => pair.key.toLowerCase() === selectedServiceEnv.toLowerCase());
      if (foundEnv) {
        apiUrl = foundEnv.value;
      }
      <%_ if(oauth2)  { _%>
      const authTokenObservable = this.authService.getAccessToken();
      authTokenObservable.subscribe((token: string) => {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      <%_ } _%> 
      // Make the API call using Angular HttpClient
      this.http.get<any>(apiUrl + `/api/services/${this.selectedService}`,
      <%_ if(oauth2)  { _%> 
      { headers }
       <%_ } _%> 
       ).subscribe(
        data => {
          // Set the response data in component property
          this.responseData = data.server;
        },
        error => {
          // Handle errors
          console.error('API Error:', error);
        }
      );
      <%_ if(oauth2)  { _%>
    });
    <%_ } _%> 
    } else {
      console.error('Please select a service before pinging.');
      this.responseData = '';
    }
  }
}
