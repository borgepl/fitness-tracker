import { NgModule } from "@angular/core";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { provideFirestore, getFirestore, connectFirestoreEmulator } from "@angular/fire/firestore";
import { environment } from "src/environments/environment";
import { SharedModule } from "../shared/shared.module";
import { CurrentTrainingComponent } from "./current-training/current-training.component";
import { StopTrainingComponent } from "./current-training/stop-training.component";
import { NewTrainingComponent } from "./new-training/new-training.component";
import { PastTrainingsComponent } from "./past-trainings/past-trainings.component";
import { TrainingComponent } from "./training.component";

@NgModule({
  declarations: [
    TrainingComponent,
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingsComponent,
    StopTrainingComponent
  ],
  imports: [
    SharedModule,
    AngularFirestoreModule,
    provideFirestore(() => {
      const fireStore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(fireStore, 'localhost', 8080);
      }
      return fireStore;
    }),
  ],
  exports: []
})
export class TrainingModule {}
