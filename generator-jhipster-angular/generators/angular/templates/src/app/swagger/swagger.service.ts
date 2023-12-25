import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class SwaggerService {
  constructor(private http: HttpClient) {}

  getSwaggerJson(service: string) {
    // logic to get the respective Swagger url
    let selectedServiceEnv = 'microservice' + service.charAt(0).toUpperCase() + service.slice(1);
    let apiUrl: string | undefined;
    const environmentKeyAndValuePairs: { key: string; value: string }[] = Object.keys(environment).map(key => ({
      key,
      value: environment[key as keyof typeof environment], // Type assertion here
    }));
    const foundEnv = environmentKeyAndValuePairs.find(pair => pair.key.toLowerCase() === selectedServiceEnv.toLowerCase());
    if (foundEnv) {
      apiUrl = foundEnv.value;
    }
    return this.http.get(apiUrl + '/v3/api-docs');
  }
}
