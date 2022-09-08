import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Excercise } from '../excercise.model';
import { TrainingService } from '../training.service';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, Subscription } from 'rxjs';

interface ExcerciseInterface {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  subs: Subscription[]= [];
  myExercises: Excercise[] = [];

  trainings: ExcerciseInterface[] = [
    {value: 'crunches-0', viewValue: 'Crunches'},
    {value: 'touchtoes-1', viewValue: 'Touch Toes'},
    {value: 'sidelunges-2', viewValue: 'Side Lunges'},
  ];

  item$: Observable<Excercise[]>;
  exercises : Excercise[];

  @Output() trainingStart =  new EventEmitter<void>();

  constructor( private trainingService: TrainingService,
               private db: AngularFirestore,
               firestore: Firestore
              ) {

               }


  ngOnInit(): void {

    this.subs.push (
      this.trainingService.exercisesChanged.subscribe(exercises => (this.exercises = exercises ))
                    );
    this.trainingService.fetchAvailableExercises();

    //this.myExercises = this.trainingService.getAvailableExcercises();
    //this.exercises = this.db.collection('availableExercises').valueChanges();

   /*  this.exercises =
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
    ) */
   /*  .subscribe(result => {
      console.log(result);
    }) */

  }

  onStartTraining(form : NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExcercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    if (this.subs.length > 0) {
      this.subs.forEach(subscription => subscription.unsubscribe());
    }
  }

}
