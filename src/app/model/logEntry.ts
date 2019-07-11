export class LogEntry {
    id: number;
    message: string;
    timestamp: number;
    mode: string;
    cause: string;
    data?: any;
}

export class LogExport {
    proband: string;
    systemType: string;
    timestamp: number;
    time: string;
    finalState: any;
    logs: LogEntry[];
}