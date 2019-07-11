import { StepView } from './step';

export interface Project {
    id: number;
    name: string;
    creator: string;
    creationDate: Date;
    type: string;
    startDate: Date;
    endDate: Date;
    productionExperimentId: number;
    testingExperimentId: number;
    productionSteps: StepView[];
    testingSteps: StepView[];
}
