import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import HomeComponent from './home/home.component';
import NavbarComponent from './layouts/navbar/navbar.component';
<%_ if(oauth2)  { _%>
import { AuthConfigModule } from './auth/auth-config.module';
<%_ } _%>  
<%_  if ( servicesWithOutDB.length > 0 ) { _%> 
import { PingComponent } from './ping/ping.component';
import { FormsModule } from '@angular/forms';
<%_ } _%> 
<%_  if (apiServers.length > 0) { _%>
import { SwaggerComponent } from './swagger/swagger.component';
import { SwaggerService } from './swagger/swagger.service';
import {SwaggerDropdownComponent} from './layouts/navbar/swagger-dropdown.component';
<%_ } _%> 


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    <%_  if ( servicesWithOutDB.length > 0 ) { _%> 
      PingComponent,
    <%_ } _%> 
    <%_  if ( apiServers.length > 0 ) { _%> 
      SwaggerComponent,
      SwaggerDropdownComponent,
    <%_ } _%> 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    <%_ if(oauth2)  { _%>
    AuthConfigModule,
    <%_ } _%> 
    <%_  if ( servicesWithOutDB.length > 0 ) { _%> 
    FormsModule
    <%_ } _%> 
  ],
  providers: [
    <%_  if ( apiServers.length > 0 ) { _%> 
      SwaggerService,
    <%_ } _%> 
  ],
  bootstrap: [AppComponent,
    <%_  if ( apiServers.length > 0 ) { _%> 
      SwaggerComponent,
    <%_ } _%> 
  ]
})
export class AppModule { }
