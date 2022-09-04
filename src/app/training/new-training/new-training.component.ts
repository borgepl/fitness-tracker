import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Excercise } from '../excercise.model';
import { TrainingService } from '../training.service';

interface ExcerciseInterface {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  myExercises: Excercise[] = [];

  trainings: ExcerciseInterface[] = [
    {value: 'crunches-0', viewValue: 'Crunches'},
    {value: 'touchtoes-1', viewValue: 'Touch Toes'},
    {value: 'sidelunges-2', viewValue: 'Side Lunges'},
  ];

  @Output() trainingStart =  new EventEmitter<void>();

  constructor( private trainingService: TrainingService) { }

  ngOnInit(): void {

    this.myExercises = this.trainingService.getAvailableExcercises();
  }

  onStartTraining(form : NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExcercise(form.value.exercise);
  }

}
