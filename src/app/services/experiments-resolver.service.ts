import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Experiment } from '../model/experiment';

@Injectable({
  providedIn: 'root'
})
export class ExperimentsResolver {

  constructor(private api: ApiService, private router: Router) {}

  resolve(): Observable<Experiment[]> | Observable<never> {

    return this.api.getExperiments().pipe(
      take(1),
      mergeMap(experiments => {
        if (experiments) {
          return of(experiments);
        } else {
          this.router.navigateByUrl('404');
          return EMPTY;
        }
      })
    );
  }
}
