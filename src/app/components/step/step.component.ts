import { Component, OnInit, Input, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { expand } from 'rxjs/operators';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { FileDetector } from 'selenium-webdriver/remote';
import { Subject, Observable } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { LoggingService } from 'src/app/services/logging.service';
import { environment } from 'src/environments/environment';
import { ModeService } from 'src/app/services/mode.service';
import { FieldView, FieldModel } from 'src/app/model/field';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent {

  private expanded: boolean;

  @Input() step: FormArray;
  @Input() toggleEvent?: Observable<number>;
  @Input() index: number;
  @Input() isFirst?: boolean;
  @Input() isLast?: boolean;
  @Input() title?: string;
  @Input() form: FormGroup;
  @Input() groupName: string;
  @Input() editMode: boolean;
  @Input() moveMode: boolean;
  @Input() prefix: number;

  @Output() openPanel: EventEmitter<void> = new EventEmitter();
  @Output() closePanel: EventEmitter<void> = new EventEmitter();

  constructor(private logger: LoggingService,
              private modeService: ModeService) { }

  public get isDe(): boolean {
    return environment.lang === 'de';
  }

  public get isEn(): boolean {
    return environment.lang === 'en';
  }

  public isType(type: 'sub' | 'add' | 'none'): boolean {
    return this.modeService.mode === type;
  }

  public onFocus(field: any) {
    this.logger.log('Attribut "' + field.value.label + '" fokussiert.', 'focus');
  }

  public onFocusOut(field: any) {
    this.logger.log('Attribut "' + field.value.label + '" fokus verlassen. Aktueller Wert: ' + field.value.value, 
                    'data',
                    field.value.value);
  }

  public onSelectionChange(field: any, event: MatSelectChange) {
    this.logger.log('Selektion des Attributes "' + field.value.label + '" auf "' + event.value + '" geändert.', 
                    'data',
                    event.value);
  }

  public onCheckboxChange(field: any, event: MatCheckboxChange) {
    this.logger.log('Check des Attributes "' + field.value.label + '" auf "' + event.checked + '" geändert.', 
                    'data',
                    event.checked);
  }

  public toggleField(event: Event, field: FormGroup) {
    event.stopPropagation();
    field.patchValue({
      active: !field.value.active,
      value: null,
      secondValue: null
    });
    this.form.markAsDirty();
    if (field.value.active === false) {
      this.logger.log('Feld ' + field.value.label + ' ausblenden.', 'visibility');
    } else {
      this.logger.log('Feld ' + field.value.label + ' einblenden.', 'visibility');
    }
  }

  public toggleStep(event: Event, step: FormGroup) {
    event.stopPropagation();
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

  public get activeFields() {
    return (this.step.get('fields') as FormArray).controls.filter(c => c.value.active);
  }

  public get fields() {
    return (this.step.get('fields') as FormArray).controls;
  }

  public get filledAndActiveFields() {
    return (this.step.get('fields') as FormArray).controls.filter(c => c.value.active && c.value.value);
  }

  public get deactivatedFields() {
    return (this.step.get('fields') as FormArray).controls.filter(c => !c.value.active);
  }

  public get emptyFields() {
    return (this.step.get('fields') as FormArray).controls.filter(c => !c.value.value && c.value.active);
  }

  public isStepActive(): boolean {
    return (this.step.get('fields') as FormArray).controls.some(c => c.value.active);
  }

  public onPanelOpen() {
    this.openPanel.next();
    setTimeout(() => {
      if (this.editMode) {
        this.logger.log('Schritt "' + this.step.value.name + '" geöffnet.', 'openStep');
      }
    }, 100);
  }

  public onPanelClose() {
    this.closePanel.next();
  }

  public stepIsEmpty(step: FormArray): boolean {
    return (step.get('fields') as FormArray).controls.some(f => f.value.active && f.value.value);
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray((this.step.get('fields') as FormArray).controls, event.previousIndex, event.currentIndex);
    this.form.markAsDirty();
    this.logger.log('Schiebe Feld ' + (this.step.get('fields') as FormArray).controls[event.currentIndex].value.label + ' von Position ' +
      event.previousIndex + ' nach ' + event.currentIndex + '.', 'order');
    (this.step.get('fields') as FormArray).controls.forEach((field, i) => {
      field.value.position = i;
    });
  }

}
