import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Project } from '../model/project';
import { ActivatedRoute, Router } from '@angular/router';
import { Experiment } from '../model/experiment';
import { LoggingService } from '../services/logging.service';
import { environment } from 'src/environments/environment';
import { ModeService } from '../services/mode.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  public projects: Project[];
  public experiments: Experiment[];

  constructor(private api: ApiService,
              private route: ActivatedRoute,
              private router: Router,
              private logger: LoggingService,
              private modeService: ModeService) {
  }

  public get isDe(): boolean {
    return environment.lang === 'de';
  }

  public get isEn(): boolean {
    return environment.lang === 'en';
  }

  ngOnInit() {
    this.api.getProjects().subscribe(projects => {
      this.projects = projects;
    });
    this.route.data.subscribe((data: { experiments: Experiment[] }) => {
      this.experiments = data.experiments;
    });
  }

  public noExperimentSelected(): boolean {
    return this.route.snapshot &&
           this.route.snapshot.children.length === 0;
  }

  public createProject() {
    const project: Project = {} as Project;
    project.name = '';
    project.creator = 'Testina';
    project.creationDate = new Date();
    project.productionExperimentId = 1;
    project.testingExperimentId = 2;
    project.type = this.modeService.mode;
    this.api.newProject(project).subscribe((newProject: Project) => {
      this.logger.log('Neues Projekt erstellt. ID: ' + newProject.id, 'create');
      this.router.navigateByUrl('/projects/' + newProject.id + '/experiment');
    });
  }

}
