import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Experiment } from '../model/experiment';
import { FormBuilder, FormGroup, FormArray, Validators, Form, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { StepModel, StepView } from '../model/step';
import { Project } from '../model/project';
import { FieldModel, FieldView } from '../model/field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAccordion } from '@angular/material/expansion';
import { CdkDragEnter, CdkDragMove, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { LoggingService } from '../services/logging.service';
import { MatTooltip } from '@angular/material/tooltip';
import { environment } from 'src/environments/environment';
import { ModeService } from '../services/mode.service';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss']
})
export class ExperimentComponent implements OnInit {

  public productionExperiment: Experiment;
  public testingExperiment: Experiment;
  public project: Project;
  public form: FormGroup;
  public openStep = 0;
  public navIsFixed: boolean;
  public toggleStepSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public editMode = false;
  public moveMode = true;
  public deleteClicked = false;

  @ViewChild('accordion1') accordion1: MatAccordion;
  @ViewChild('accordion2') accordion2: MatAccordion;
  @ViewChild('tooltip') tooltip: MatTooltip;

  @HostListener('window:scroll', ['$event']) private fn(event) {
    this.navIsFixed = window.pageYOffset > 60;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private api: ApiService,
              private snackBar: MatSnackBar,
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
    this.navIsFixed = window.pageYOffset > 60;
    this.route.data.subscribe((data: { project: Project }) => {
      this.logger.log('Projekt ' + data.project.name + ' geladen.', 'load');
      this.project = data.project;
      this.editMode = !this.project.name;
      this.api.getExperiment(this.project.productionExperimentId).subscribe(prodExperiment => {
        this.productionExperiment = prodExperiment;
        this.api.getExperiment(this.project.testingExperimentId).subscribe(testExperiment => {
          this.testingExperiment = testExperiment;
          this.createExperimentForm();
        });
      });
    });
  }

  public onFocus(field: any) {
    this.logger.log('Attribut "' + field.value.label + '" fokussiert.', 'focus');
  }

  public onFocusOut(field: any) {
    this.logger.log('Attribut "' + field.value.label + '" fokus verlassen. Aktueller Wert: ' + field.value.value, 
                    'data',
                    field.value.value);
  }

  public isType(type: 'sub' | 'add' | 'none'): boolean {
    return this.modeService.mode === type;
  }

  public anyAttributeEmpty(step: FormGroup): boolean {
    return (step.get('fields') as FormArray).controls.reduce((sum, next) =>
      sum && (next.value.value || !next.value.active),
    true);
  }

  public productionDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray((this.form.get('productionSteps') as FormArray).controls, event.previousIndex, event.currentIndex);
    moveItemInArray(this.form.value.productionSteps, event.previousIndex, event.currentIndex);
    this.form.markAsDirty();
    this.logger.log('Schiebe Step ' + (this.form.get('productionSteps') as FormArray).controls[event.currentIndex].value.name +
      ' von Position ' + event.previousIndex + ' nach ' + event.currentIndex + '.', 'order');
    (this.form.get('productionSteps') as FormArray).controls.forEach((step, i) => {
      step.patchValue({position: i});
      step.value.position = i;
      this.form.value.productionSteps[i].position = i;
    });
  }

  public testingDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray((this.form.get('testingSteps') as FormArray).controls, event.previousIndex, event.currentIndex);
    moveItemInArray(this.form.value.testingSteps, event.previousIndex, event.currentIndex);
    this.form.markAsDirty();
    this.logger.log('Schiebe Step ' + (this.form.get('testingSteps') as FormArray).controls[event.currentIndex].value.name +
      ' von Position ' + event.previousIndex + ' nach ' + event.currentIndex + '.', 'order');
    (this.form.get('testingSteps') as FormArray).controls.forEach((step, i) => {
      step.patchValue({position: i});
      step.value.position = i;
      this.form.value.testingSteps[i].position = i;
    });
  }

  public clickOnBackButton() {
    this.logger.log('Zurück zur Projektübersicht navigiert.', 'navigation');
  }

  public toggleMoveMode() {
    this.moveMode = !this.moveMode;
    this.logger.log('Step bewegungs Modus auf ' + this.moveMode + ' gesetzt.', 'moveMode');
    this.moveMode ? this.accordion1.closeAll() : this.accordion1.openAll();
    this.moveMode ? this.accordion2.closeAll() : this.accordion2.openAll();
  }

  public disableMoveMode() {
    this.moveMode = false;
  }


  public enableMoveMode() {
    if (document.getElementsByClassName('mat-expanded').length === 0 && this.editMode) {
      this.moveMode = true;
    }
  }

  public save() {
    if (this.form.valid) {
      const project: any = Object.assign({}, this.form.value);
      project.productionSteps = this.sortById(project.productionSteps);
      project.productionSteps = project.productionSteps.map(step => {
        step.fields = this.sortById(step.fields);
        return { id: step.id,
                active: step.active,
                position: step.position,
                fields: step.fields.map(field => {
                  return { id: field.id,
                          value: field.value,
                          secondValue: field.secondValue,
                          checked: field.checked,
                          active: field.active,
                          position: field.position };
                })
        };
      });
      project.testingSteps = project.testingSteps.map(step => {
        step.fields = this.sortById(step.fields);
        return { id: step.id,
                active: step.active,
                position: step.position,
                fields: step.fields.map(field => {
                  return { id: field.id,
                          value: field.value,
                          secondValue: field.secondValue,
                          checked: field.checked,
                          active: field.active,
                          position: field.position };
                })
        };
      });
      this.logger.log('Projekt ' + project.name + ' speichern.', 'save');
      this.api.saveProject(project).subscribe(() => {
        this.form.markAsPristine();
        this.logger.log('Projekt ' + project.name + ' gespeichert. JSON:', 'saveData', this.form.value);
        this.snackBar.open('Projekt erfolgreich gespeichert.', '', { duration: 2000 });
      });
      // setTimeout(() => {
      //   this.api.getProject(this.project.id).subscribe(p => {
      //     this.project = p;
      //     this.createExperimentForm();
      //     // this.editMode = false;
      //   });
      // }, 200);
    }
  }

  public switchEditMode() {
    this.editMode = !this.editMode;
    this.logger.log('Setze bearbeitungs Modus auf ' + this.editMode + '.', 'viewMode');

    if (!this.editMode) {
      this.accordion1.openAll();
      this.accordion2.openAll();
      this.moveMode = false;
    }
  }

  public deleteProject() {
    this.api.deleteProject(this.project.id).subscribe(() => {
      this.snackBar.open('Projekt erfolgreich gelöscht.', '', { duration: 2000 });
      this.logger.log('Projekt ' + this.project.name + ' gelöscht.', 'delete');
      this.router.navigateByUrl('/');
    });
  }

  public get deactivatedProductionSteps() {
    return (this.form.get('productionSteps') as FormArray).controls.filter(c => !c.value.active);
  }

  public get deactivatedTestingSteps() {
    return (this.form.get('testingSteps') as FormArray).controls.filter(c => !c.value.active);
  }

  public toggleStep(step: FormGroup) {
    step.patchValue({
      active: !step.value.active
    });
    this.form.markAsDirty();
    if (step.value.active === false) {
      this.logger.log('Step ' + step.value.name + ' ausblenden.', 'visibility');
    } else {
      this.logger.log('Step ' + step.value.name + ' einblenden.', 'visibility');
    }
  }

  public clickOnDelete() {
    this.logger.log('Auf Löschen geklickt.', 'clickDelete');
    this.deleteClicked = true; 
    this.tooltip.show();
    setTimeout(() => {
      this.deleteClicked = false;
      this.tooltip.hide();
    }, 4000);
  }

  private createExperimentForm() {
    this.form = this.fb.group({
      id: this.project.id,
      name: [this.project.name],
      experimentName: [this.productionExperiment.name, Validators.required],
      creator: [this.project.creator, Validators.required],
      creationDate: this.project.creationDate,
      startDate: this.project.startDate,
      endDate: this.project.endDate,
      productionSteps: this.fb.array([]),
      testingSteps: this.fb.array([]),
    });
    this.createProductionSteps();
    this.createTestingSteps();
  }

  private createProductionSteps() {
    let group: FormGroup[] = [];
    this.productionExperiment.steps.forEach((stepId: number, i) => {

      let stepView: StepView;
      if (this.project.productionSteps) {
        stepView = this.project.productionSteps.filter(s => s.id === stepId)[0];
      } else {
        stepView = { id: null, position: null, active: !this.isType('add'), fields: null };
      }

      if (stepView) {

        this.api.getStep(stepId).subscribe((step: StepModel) => {
          group.push(this.fb.group({
            id: step.id,
            name: step.name,
            position: stepView.position,
            fields: this.createFields(step.fields, stepView.fields),
            active: stepView.active
          }));
  
          if (i === this.productionExperiment.steps.length - 1) {
            setTimeout(() => {
              group = this.sortByPosition(group);
              group.forEach((g: FormGroup) => {
                (this.form.get('productionSteps') as FormArray).push(g);
              });
            }, 500);
          }
        });

      }

    });

  }

  private createTestingSteps() {
    let group: FormGroup[] = [];
    this.testingExperiment.steps.forEach((stepId: number, i) => {

      let stepView: StepView;
      if (this.project.testingSteps) {
        stepView = this.project.testingSteps.filter(s => s.id === stepId)[0];
      } else {
        stepView = { id: null, position: null, active: !this.isType('add'), fields: null };
      }

      if (stepView) {

        this.api.getStep(stepId).subscribe((step: StepModel) => {
          group.push(this.fb.group({
            id: step.id,
            name: step.name,
            position: stepView.position,
            fields: this.createFields(step.fields, stepView.fields),
            active: stepView.active
          }));
  
          if (i === this.testingExperiment.steps.length - 1) {
            setTimeout(() => {
              group = this.sortByPosition(group);
              group.forEach((g: FormGroup) => {
                (this.form.get('testingSteps') as FormArray).push(g);
              });
            }, 500);
          }
        });

      }

    });

  }

  private createFields(fields: FieldModel[], fieldView: FieldView[]): FormArray {
    return this.fb.array(
      this.sortByPosition(fields.map((f, i) =>
        this.fb.group(
          this.transformObject(
            fieldView ? this.applyProperties(f as FieldModel & FieldView,
                                              fieldView[i].value,
                                              fieldView[i].secondValue,
                                              fieldView[i].active,
                                              fieldView[i].checked,
                                              fieldView[i].position) :
                       this.applyProperties(f as FieldModel & FieldView, '', '', !this.isType('add'), false, i)
          )
        ))
      )
    );
  }

  private sortByPosition(fields: FormGroup[]): FormGroup[] {
    return fields.sort((a, b) => a.value.position - b.value.position);
  }

  private sortById(steps: any[]): any[] {
    return steps.sort((a, b) => a.id - b.id);
  }

  private applyProperties(field: FieldModel & FieldView,
                          value: any,
                          secondValue: any,
                          active: boolean,
                          checked: boolean,
                          position: number): FieldModel & FieldView {
    field.type === 'checkbox' ? field.value = 'check' : field.value = value;
    field.secondValue = secondValue;
    field.active = active;
    field.checked = checked;
    field.position = position;
    return field;
  }

  private transformObject(object: object): object {
    const obj = {...object};
    Object.keys(obj).forEach(k => {
      if (Array.isArray(obj[k])) {
        obj[k] = { value: object[k], disabled: false };
      }
    });
    return obj;
  }

}
