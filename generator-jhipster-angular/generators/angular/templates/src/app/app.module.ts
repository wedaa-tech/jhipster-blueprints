import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import HomeComponent from './home/home.component';
import NavbarComponent from './layouts/navbar/navbar.component';
<%_ if(oauth2)  { _%>
import { AuthConfigModule } from './auth/auth-config.module';
<%_ } _%>  

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    <%_ if(oauth2)  { _%>
    AuthConfigModule
    <%_ } _%> 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
