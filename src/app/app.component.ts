import { OnInit, Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { NavComponent } from './nav.component'
import { ConfigService } from './config.service';
import { Branding } from './branding.service';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';
import { ProfileService } from './profile.service';
import { CartService } from './cart.service';

@Component({
  selector: 'demo-app',
  template: `
    <demo-nav></demo-nav> 
    <router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES, NavComponent],
  providers: [ConfigService, Branding, AuthService, ProductService, ProfileService, CartService]
})
export class AppComponent implements OnInit { 
  
  //public constructor() { }
  ngOnInit() { }

}
