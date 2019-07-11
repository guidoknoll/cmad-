import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LogEntry } from '../model/logEntry';
import { environment } from 'src/environments/environment';
import { ModeService } from './mode.service';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  private readonly prefix = '%c[CMAD-]';
  private readonly prefixStyle = 'color: #FABB00; font-weight: bolder;';

  constructor(private api: ApiService,
              private modeService: ModeService) { }

  public log(message: string, cause: string, data?: any) {
    const log = new LogEntry();
    log.message = message;
    log.mode = this.modeService.mode;
    log.cause = cause;
    log.timestamp = Math.floor(Date.now() / 1000);
    console.log(this.prefix, this.prefixStyle, cause + ' - ' + message);
    if (data) {
      log.data = data;
      console.log(data);
    }
    this.api.saveLog(log).subscribe();
  }
}
