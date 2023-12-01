import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
<%_  if ( servicesWithOutDB.length > 0 ) { _%> 
  import { PingComponent } from './ping/ping.component';
<%_ } _%> 
import HomeComponent from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  <%_  if ( servicesWithOutDB.length > 0 ) { _%> 
  { path: 'ping', component: PingComponent },
  <%_ } _%> 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
