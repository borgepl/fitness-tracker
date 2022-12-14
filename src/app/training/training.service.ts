import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Subject, map, Subscription } from "rxjs";
import { Exercise } from "./excercise.model";
import { Firestore, collectionData, docData, addDoc } from '@angular/fire/firestore';
import {
  CollectionReference,
  DocumentData,
  collection,
} from '@firebase/firestore';
import { UIService } from "../shared/ui.service";

@Injectable()
export class TrainingService {

  exerciseChanged = new Subject<Exercise>();
  exercisesChanged =  new Subject<Exercise[]>();
  finishedExercisesChanged =  new Subject<Exercise[]>();
  private fbSubs : Subscription[]= [];

  private availableExercises : Exercise[] = [
    // { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    // { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    // { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    // { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];

  private runningExercise: Exercise;
  private exercises: Exercise[] = [];
  private exerciseFbCollection: CollectionReference<DocumentData>;
  private completedExCollection : CollectionReference<Exercise>;

  constructor( private db: AngularFirestore, private readonly firestore: Firestore,
               private uiService: UIService
              ) {}

  fetchCollection() {
    this.exerciseFbCollection = collection(this.firestore, 'availableExercises');
    this.fbSubs.push(
    collectionData(this.exerciseFbCollection, { idField: 'id', }).subscribe(
      (exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      }, error => {
        this.uiService.showSnackbar("fetching Exercises failed. Please try again later.", null, 3000, "end", "bottom");
      })
    );
  }

  fetchAvailableExercises() {
    this.fbSubs.push(
    this.db.collection('availableExercises').snapshotChanges()
    .pipe(
      map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...<any>doc.payload.doc.data()
          }
        })
      })
    )
    .subscribe(
      (exercises: Exercise[]) => {
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises])
      }, error => {
        this.uiService.showSnackbar(error.message, null, 3000, "end", "bottom");
      })
    );
  }

  getAvailableExcercises() {
    return this.availableExercises.slice();
  }

  startExcercise(selectedId: string) {
    this.db.doc('availableExercises/' + selectedId).update({ lastSelected: new Date() });
    const selectedExercise = this.availableExercises.find(ex => ex.id == selectedId);
    this.runningExercise = selectedExercise;
    this.exerciseChanged.next({ ...selectedExercise});
  }

  completeExercise() {

    //this.exercises.push({ ...this.runningExercise, date: new Date(), state: 'completed' });

    this.addDataToFireStore({ ...this.runningExercise, date: new Date(), state: 'completed' });

    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress:  number) {

    /* this.exercises.push({
      ...this.runningExercise,
      duration:this.runningExercise.duration * (progress/100),
      calories: this.runningExercise.calories * (progress/100),
      date: new Date(),
      state: 'cancelled' }); */

    this.addDataToFireStore({
        ...this.runningExercise,
        duration:this.runningExercise.duration * (progress/100),
        calories: this.runningExercise.calories * (progress/100),
        date: new Date(),
        state: 'cancelled' });

    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise}
  }

  _fetchCompletedorCancelledExercises() {
    this.fbSubs.push(
    this.db.collection('finishedExercises').valueChanges().subscribe(
      (exercises: Exercise[]) => {
        this.exercises = exercises;
        this.finishedExercisesChanged.next(exercises)
      }
    ))
  }

  fetchCompletedorCancelledExercises() {
    this.completedExCollection = collection(this.firestore, 'finishedExercises') as CollectionReference<Exercise> ;
    this.fbSubs.push(
    collectionData(this.completedExCollection).subscribe(
      (exercises: Exercise[]) => {
        this.exercises = exercises;
        this.finishedExercisesChanged.next(exercises)
      }
    ))
  }

  getCompletedorCancelledExercises() {
    return this.exercises.slice();
  }

  private _addDataToFireStore(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  private addDataToFireStore(exercise: Exercise) {
    this.completedExCollection = collection(this.firestore, 'finishedExercises') as CollectionReference<Exercise> ;
    addDoc(this.completedExCollection,exercise);
  }


 cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

}
