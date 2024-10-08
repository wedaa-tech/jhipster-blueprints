import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SwaggerService } from './swagger.service';
import { SwaggerUIBundle, SwaggerRequest } from 'swagger-ui-dist';
import { ActivatedRoute } from '@angular/router';
<%_ if(oauth2)  { _%>
  import { OidcSecurityService } from 'angular-auth-oidc-client';
<%_ } _%> 

@Component({
  selector: 'app-swagger',
  templateUrl: './swagger.component.html',
  styleUrls: ['./swagger.component.css'],
  encapsulation: ViewEncapsulation.None, // Use ViewEncapsulation.None to disable style encapsulation
})
export class SwaggerComponent implements OnInit {
  service: string = '';
  constructor(private route: ActivatedRoute, private swaggerService: SwaggerService,
    <%_ if(oauth2)  { _%>
      private authService: OidcSecurityService,
      <%_ } _%> 
  ) {}

  ngOnInit(): void {
    this.service = this.route.snapshot.data['service'];
    this.swaggerService.getSwaggerJson(this.service).subscribe((swaggerJson: any) => {
      
      <%_ if(oauth2)  { _%>
        const ui = SwaggerUIBundle({
          spec: swaggerJson,
          dom_id: '#swagger-ui',
          requestInterceptor:(request:SwaggerRequest)=>{
            const authTokenObservable = this.authService.getAccessToken();
            authTokenObservable.subscribe((token:String)=>{
              if(token){
                request['headers']['Authorization'] = `Bearer ${token}`;
              }
            })
            return request;
          }
        });
      <%_ } _%> 

      <%_ if(!oauth2) { _%>
        const ui = SwaggerUIBundle({
          spec: swaggerJson,
          dom_id: '#swagger-ui',
        });
      <%_ } _%>
      
    });
  }
}
