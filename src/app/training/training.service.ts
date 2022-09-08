import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Subject, map } from "rxjs";
import { Excercise } from "./excercise.model";

@Injectable()
export class TrainingService {

  exerciseChanged = new Subject<Excercise>();
  exercisesChanged =  new Subject<Excercise[]>();
  finishedExercisesChanged =  new Subject<Excercise[]>();

  private availableExercises : Excercise[] = [
    // { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    // { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    // { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    // { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];

  private runningExercise: Excercise;
  private exercises: Excercise[] = [];

  constructor( private db: AngularFirestore) {}

  fetchAvailableExercises() {

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
    .subscribe((exercises: Excercise[]) => {
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises]);
    })
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

  fetchCompletedorCancelledExercises() {
    this.db.collection('finishedExercises').valueChanges().subscribe(
      (exercises: Excercise[]) => {
        this.exercises = exercises;
        this.finishedExercisesChanged.next(exercises)
      }
    )
  }

  getCompletedorCancelledExercises() {
    return this.exercises.slice();
  }

  private addDataToFireStore(exercise: Excercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

}
