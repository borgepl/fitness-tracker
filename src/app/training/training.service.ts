import { Subject } from "rxjs";
import { Excercise } from "./excercise.model";

export class TrainingService {

  exerciseChanged = new Subject<Excercise>();
  private availableExercises : Excercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];

  private runningExercise: Excercise;
  private exercises: Excercise[] = [];

  getAvailableExcercises() {
    return this.availableExercises.slice();
  }

  startExcercise(selectedId: string) {
    const selectedExercise = this.availableExercises.find(ex => ex.id == selectedId);
    this.runningExercise = selectedExercise;
    this.exerciseChanged.next({ ...selectedExercise});
  }

  completeExercise() {

    this.exercises.push({ ...this.runningExercise, date: new Date(), state: 'completed' });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress:  number) {

    this.exercises.push({
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

}
