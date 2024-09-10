import { Injectable,inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot,UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';

@Injectable ({providedIn:'root'})

export class adminGuard {

  constructor(
    private _adminService:AdminService,
    private _router:Router
  ){

  }
  
  canActivate(): any {
    if(!this._adminService.isAuthenticated(['admin'])){
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }
}


