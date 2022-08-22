import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {Params} from '@angular/router';
import {Users} from './heroes.model';

@Injectable()
export class HeroesService {

  constructor(private httpClient: HttpClient) {
  }

  getAllUsers(): Observable<Users[]> {
    return this.httpClient.get<Users[]>('https://mockend.com/aaaalrashd/heroes/users').pipe(shareReplay(1));
  }

  getUsersByName(name: Params) {
    return this.httpClient.get<Users[]>('https://mockend.com/aaaalrashd/heroes/users', { params: name }).pipe(shareReplay(1));
  }

  getUsersByFilter(name: Params): Observable<Users[]> {
    return this.httpClient.get<Users[]>('https://mockend.com/aaaalrashd/heroes/users', {params: name});
  }

  getCountries() {
    return this.httpClient.get<any>('https://restcountries.com/v3.1/all');
  }

  getByCode(code: string) {
    return this.httpClient.get<any>(`https://restcountries.com/v3.1/alpha/${code}`);
  }


}
