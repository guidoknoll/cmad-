export class FieldModel {
    id: number;
    label: string;
    type: 'text' | 'select' | 'double-text' | 'checkbox';
    options: string[];
    unit: string;
}

export class FieldView {
    id: number;
    value: string;
    active: boolean;
    secondValue: string;
    checked: boolean;
    position: number;
}
