import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import HomeComponent from './home/home.component';
import NavbarComponent from './layouts/navbar/navbar.component';
<%_ if(oauth2)  { _%>
import { AuthConfigModule } from './auth/auth-config.module';
<%_ } _%>  
<%_  if ( servicesWithOutDB.length > 0 ) { _%> 
import { PingComponent } from './ping/ping.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
<%_ } _%> 

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    <%_  if ( servicesWithOutDB.length > 0 ) { _%> 
      PingComponent
    <%_ } _%> 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    <%_ if(oauth2)  { _%>
    AuthConfigModule,
    <%_ } _%> 
    <%_  if ( servicesWithOutDB.length > 0 ) { _%> 
    HttpClientModule,
    FormsModule
    <%_ } _%> 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
