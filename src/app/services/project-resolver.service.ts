import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Experiment } from '../model/experiment';
import { Project } from '../model/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectResolver {

  constructor(private api: ApiService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Project> | Observable<never> {
    const id: number = route.params.project;

    return this.api.getProject(id).pipe(
      take(1),
      mergeMap(project => {
        if (project) {
          return of(project);
        } else {
          this.router.navigateByUrl('404');
          return EMPTY;
        }
      })
    );
  }
}
