import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';

import {CoreModule} from './core/core.module';
import {AuthInterceptorService} from '../app/core/interceptors/auth-interceptor.service';
import {ErrorInterceptorService} from '../app/core/interceptors/error-interceptor.service';
import {FormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {JwtHelperService, JwtModule} from '@auth0/angular-jwt';
import { NgZorroAntdModule, NZ_ICONS } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])
export function tokenGetter() {
  return localStorage.getItem('token');
}
registerLocaleData(en);
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
      }
    }),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    },    { provide: NZ_ICONS, useValue: icons }
    ,],
  bootstrap: [AppComponent]
})
export class AppModule {}
