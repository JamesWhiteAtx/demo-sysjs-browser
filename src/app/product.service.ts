import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { Profile, ProfileService } from './profile.service';

export interface Product {
  id: string;
	price: number;
  descr1: string;
  descr2: string;
  img: string; 
}

export interface Group {
  urn: string;
  display: string;
  products: Product[];
}

class ProdData {
  preferences: Group[];
  general: Group[];
  products: Product[];

  constructor(raw: any) {
    this.preferences = raw.preferences;
    this.general = raw.general;

    this.products = [];
    this.addGroupProds(this.preferences);
    this.addGroupProds(this.general);
  }

  private addGroupProds(groups: Group[]) {
    groups.forEach(group => {
      group.products.forEach(product => {
        product.price = +product.price;
        this.products.push(product);
      });
    });
  }
}

@Injectable()
export class ProductService {

  private _data: BehaviorSubject<ProdData> = new BehaviorSubject<ProdData>(null);
  public data$: Observable<ProdData> = this._data.asObservable();

  private _groups: BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([]);
  public groups$: Observable<Group[]> = this._groups.asObservable();

  constructor(
    private http: Http, 
    private profileService: ProfileService) {

    this.http.get('config/products.json')
      .map<ProdData>(response => {
        return new ProdData(response.json());
      })
      .subscribe(data => {
        this._data.next(data);
      });

    this.data$
      .combineLatest(this.profileService.profile$,  (data: ProdData, profile: Profile) => {
        var groups: Group[];
        if (data) {
          if (profile) {
            groups = this.prefGroups(data.preferences, profile.preferences);
          } else {
            groups = data.general;
          }
        }
        return groups;
      })
      .subscribe(groups => {
        this._groups.next(groups);
      });
      
  }

  getById(id: string): Observable<Product> {
    return this.data$
      .map(data => {
        var product: Product;
        if (data) {
          product = data.products.filter(prod => prod.id == id)[0];
        }
        return product;
      })
      .filter(product => !!product) ;
  }

  private prefGroups(allGroups: Group[], prefs: any[]): Group[] {
    var groups: Group[] = [];
    var found: any;
    
    if ( allGroups && allGroups.length) {
      allGroups.forEach(group => {
        found = prefs.filter(pref => pref.id === group.urn)[0];
        if (found) {
          found.display = group.display;
          groups.push(group);
        }        
      });
    }
    
    return groups;
  }

}
