import { FieldModel, FieldView } from './field';

export interface StepModel {
    id: number;
    name: string;
    fields: FieldModel[];
}

export interface StepView {
    id: number;
    position: number;
    active: boolean;
    fields: FieldView[];
}