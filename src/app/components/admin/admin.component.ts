import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { ApiService } from 'src/app/services/api.service';
import { LogEntry, LogExport } from 'src/app/model/logEntry';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModeService } from 'src/app/services/mode.service';
import { MatRadioChange } from '@angular/material/radio';

declare var require: any;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public probandId: string;
  public deleteClicked = false;

  public export: LogExport = new LogExport();
  public logs: LogEntry[];

  constructor(private api: ApiService,
              private snackBar: MatSnackBar,
              private modeService: ModeService) {
  }

  ngOnInit() {
    this.refreshLogs();
  }

  public get mode(): string {
    return this.modeService.mode;
  }

  public set mode(mode: string) {
    this.modeService.mode = mode;
  }

  public changeMode(event: MatRadioChange) {
    this.mode = event.value;
  }

  public refreshLogs() {
    this.api.getLogs().subscribe(logs => this.logs = logs);
  }

  public clickOnDelete() {
    this.deleteClicked = true;
    setTimeout(() => {
      this.deleteClicked = false;
    }, 4000);
  }

  public deleteLogs() {
    this.saveLogs(() => {
      this.delete(0);
    });
  }

  private delete(n: number) {
    n += 1;
    this.api.getLogs().subscribe((logs: LogEntry[]) => {
      console.log('Logs:');
      console.log(logs);
      logs.forEach((log: LogEntry, i) => {
        this.api.deleteLog(log.id).subscribe();

        if (i === logs.length - 1) {
          this.snackBar.open(i + 1 + ' Logs erfolgreich gelöscht.', '', { duration: 2000 });

          setTimeout(() => {
            this.api.getLogs().subscribe(ls => {
              if (ls.length > 0 && n < 3) {
                this.delete(n);
              }
            });
          }, 1500);
        }
      });
    });
  }

  public saveLogs(callback?: () => void) {
    const FileSaver = require('file-saver');
    const date = new Date();
    this.api.getLogs().subscribe((logs: LogEntry[]) => {
      this.export.proband = this.probandId;
      this.export.systemType = this.mode;
      this.export.timestamp = Math.floor(Date.now() / 1000);
      this.export.time = date.toString();
      this.export.logs = logs;
      this.api.getProjects().subscribe(projects => {
        this.export.finalState = projects;
        console.log('Export:');
        console.log(this.export);
        const blob = new Blob([JSON.stringify(this.export)], {type: 'application/json;charset=utf-8'});
        const filename = this.probandId + '-' + this.mode + '-logs-' + 
                        date.getDate() + '_' + date.getMonth() + '-' + date.toLocaleTimeString() + '.json';
        FileSaver.saveAs(blob, filename);
        if (callback) { callback(); }
      });
    });
  }

}
