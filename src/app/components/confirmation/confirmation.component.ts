import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ConfirmationComponent {

  constructor(

    private dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      title: string,
      message: string

    }
  ) {
  }



  delete() {

    this.dialogRef.close({ status: 'deleted' });
  }

  close() {
    this.dialogRef.close();
  }
  logout() {
    this.dialogRef.close({ status: 'logout' });

  }
}
