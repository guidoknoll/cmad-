import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Project } from '../model/project';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Experiment } from '../model/experiment';
import { StepModel } from '../model/step';
import { LogEntry } from '../model/logEntry';
import { Mode } from '../model/mode';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly API_URL: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.API_URL + '/projects');
  }

  public getProject(projectId: number): Observable<Project> {
    return this.http.get<Project>(this.API_URL + '/projects/' + projectId);
  }

  public saveProject(project: Project): Observable<any> {
    return this.http.patch<Experiment>(this.API_URL + '/projects/' + project.id, project);
  }

  public newProject(project: Project): Observable<any> {
    return this.http.post<Experiment>(this.API_URL + '/projects/', project);
  }

// tslint:disable-next-line: ban-types
  public deleteProject(projectId: number): Observable<Object> {
    const httpParams = new HttpParams().set('Content-Type', 'application/json');
    const options = { params: httpParams };
    return this.http.delete(this.API_URL + '/projects/' + projectId, options);
  }


  public getExperiments(): Observable<Experiment[]> {
    return this.http.get<Experiment[]>(this.API_URL + '/experiments/');
  }

  public getExperiment(experimentId: number): Observable<Experiment> {
    return this.http.get<Experiment>(this.API_URL + '/experiments/' + experimentId);
  }


  public getStep(stepId: number): Observable<StepModel> {
    return this.http.get<StepModel>(this.API_URL + '/steps/' + stepId);
  }


  public saveLog(log: LogEntry): Observable<any> {
    return this.http.post<LogEntry>(this.API_URL + '/logs/', log);
  }

  public getLogs(): Observable<LogEntry[]> {
    return this.http.get<LogEntry[]>(this.API_URL + '/logs/');
  }

  // tslint:disable-next-line: ban-types
  public deleteLog(id: number): Observable<Object> {
    const httpParams = new HttpParams().set('Content-Type', 'application/json');
    const options = { params: httpParams };
    return this.http.delete(this.API_URL + '/logs/' + id, options);
  }


  public getMode(): Observable<Mode> {
    return this.http.get<Mode>(this.API_URL + '/mode/');
  }

  public setMode(mode: string): Observable<any> {
// tslint:disable-next-line: prefer-const
    let m: Mode = new Mode();
    m.mode = mode;
    return this.http.patch<Mode>(this.API_URL + '/mode/', m);
  }
}
