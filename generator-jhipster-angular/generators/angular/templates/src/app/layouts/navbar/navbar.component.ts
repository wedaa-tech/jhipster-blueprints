import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from '../../../../environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export default class NavbarComponent implements OnInit {
  isNavbarCollapsed = true;
  isAuthenticated: boolean = false;
  private isAuthenticatedSubscription!: Subscription;

  constructor(private router: Router, public oidcSecurityService: OidcSecurityService) {
    this.isAuthenticated = false; // Initialize as false initially
  }

  ngOnInit(): void {
    this.isAuthenticatedSubscription = this.oidcSecurityService.isAuthenticated$.subscribe({
      next: result => {
        this.isAuthenticated = result.isAuthenticated;
      },
    });
    window.addEventListener('scroll', this.onScroll);
  }

  openDocs(): void {
    window.open(environment.wedaaDocs, '_blank');
  }

  openGit(): void {
    window.open(environment.wedaaGithub, '_blank');
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
  public activeLink = 'home';
  public scrolled = false;
  public isSubMenuOpen = false;
  public isloggedIn = false;

  ngOnDestroy(): void {
    this.isAuthenticatedSubscription.unsubscribe();

    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    this.scrolled = window.scrollY > 50;
  };

  updateActiveLink(link: string): void {
    this.activeLink = link;
  }

  openLink(link: string): void {
    window.open(link, '_blank');
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
    window.location.href = environment.projectUrl; 
  }
}
