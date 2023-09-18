import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';
import { environment } from '../../../environment';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: environment.angularOidcAuthority,
        authWellknownEndpointUrl: environment.angularOidcAuthority,
        redirectUrl: environment.projectUrl,
        clientId: environment.angularOidcClientId,
        scope: 'openid profile email',
        responseType: 'code',
        silentRenew: true,
        maxIdTokenIatOffsetAllowedInSeconds: 600,
        issValidationOff: false,
        autoUserInfo: false,
        silentRenewUrl: window.location.origin + '/silent-renew.html',
        customParamsAuthRequest: {
          prompt: 'login',
        },
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
