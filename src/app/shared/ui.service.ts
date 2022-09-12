import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { Subject } from "rxjs";

@Injectable()
export class UIService {

  loadingStateChanged =  new Subject<boolean>();

   // options for snackbar
   horizontalPosition: MatSnackBarHorizontalPosition = 'end';
   verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor( private snackbar: MatSnackBar) {}

  showSnackbar(message, action, duration, horizontalPosition, verticalPosition) {
    this.snackbar.open(message, action, {
      duration: duration,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition }
    );
  }

}
