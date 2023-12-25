import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
<%_  if ( servicesWithOutDB.length > 0 ) { _%> 
  import { PingComponent } from './ping/ping.component';
<%_ } _%> 
import HomeComponent from './home/home.component';
<%_  if ( apiServers.length > 0 ) { _%> 
import { SwaggerComponent } from './swagger/swagger.component';
<%_ } _%> 
<%_ if(oauth2)  { _%>
import { AuthGuard } from './auth/auth-gaurd.module';
<%_ } _%> 

const routes: Routes = [
  { path: '', component: HomeComponent },
  <%_  if ( servicesWithOutDB.length > 0 ) { _%> 
  { path: 'ping', component: PingComponent,
  <%_ if(oauth2)  { _%>
    canActivate: [AuthGuard]
    <%_ } _%> 
 },
  <%_ } _%> 
  <%_ apiServers.forEach((appServer) =>  { _%>
    { path: 'swagger/<%= appServer.baseName.toLowerCase() %>', component: SwaggerComponent,  data: { service: '<%= appServer.baseName.toLowerCase() %>' },
    <%_ if(oauth2)  { _%>
    canActivate: [AuthGuard]
    <%_ } _%> 
  },
  <%_ }) _%>
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
