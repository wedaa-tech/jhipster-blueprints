import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.css']
})
export class PingComponent implements OnInit {
  
  selectedService: string = '';
  responseData: any = null;
  
  constructor(private http: HttpClient) {
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
      // Make the API call using Angular HttpClient
      this.http.get<any>(apiUrl +`/api/services/${this.selectedService}`)
        .subscribe(
          data => {
            // Set the response data in component property
            this.responseData = data.server;
          },
          error => {
            // Handle errors
            console.error('API Error:', error);
          }
        );
    } else {
      console.error('Please select a service before pinging.');
      this.responseData = '';
    }
  }
}
