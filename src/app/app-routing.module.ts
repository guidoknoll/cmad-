import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { ExperimentComponent } from './experiment/experiment.component';
import { ExperimentsResolver } from './services/experiments-resolver.service';
import { ProjectResolver } from './services/project-resolver.service';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    resolve: {
      experiments: ExperimentsResolver
    }
  },
  {
    path: 'projects/:project/experiment',
    component: ExperimentComponent,
    resolve: {
      project: ProjectResolver
    }
  },
  {
    path: 'admin',
    component: AdminComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
