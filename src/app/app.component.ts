import { Component, Inject } from '@angular/core';
import { LoggingService } from './services/logging.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { ModeService } from './services/mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cmad-sub';

  constructor(private logger: LoggingService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) { }

  public get isDe(): boolean {
    return environment.lang === 'de';
  }

  public get isEn(): boolean {
    return environment.lang === 'en';
  }

  public clickOnLogo() {
    this.logger.log('Auf CMAD Logo geklickt.', 'logo');
  }

  public isType(type: 'sub' | 'add' | 'none'): boolean {
    return environment.type === type;
  }

  public nothing() {
    this.snackBar.open('Nothing to show.', '', { duration: 2000 });
    this.logger.log('Auf Profil geklickt.', 'profile');
  }

  public showHelp() {
    this.logger.log('Auf Hilfe geklickt.', 'help');
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(HelpDialog, {});

    dialogRef.afterClosed().subscribe(() => {
      this.logger.log('Hilfe-Dialog geschlossen.', 'help');
    });
  }
}

@Component({
// tslint:disable-next-line: component-selector
  selector: 'help-dialog',
  templateUrl: 'help-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class HelpDialog {

  constructor(public dialogRef: MatDialogRef<HelpDialog>,
              private modeService: ModeService) {}

  close(): void {
    this.dialogRef.close();
  }

  public get isDe(): boolean {
    return environment.lang === 'de';
  }

  public get isEn(): boolean {
    return environment.lang === 'en';
  }

  public get mode(): string {
    return this.modeService.mode;
  }

}
