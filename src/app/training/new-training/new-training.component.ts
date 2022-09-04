import { Component, EventEmitter, OnInit, Output } from '@angular/core';

interface Excercise {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  trainings: Excercise[] = [
    {value: 'crunches-0', viewValue: 'Crunches'},
    {value: 'touchtoes-1', viewValue: 'Touch Toes'},
    {value: 'sidelunges-2', viewValue: 'Side Lunges'},
  ];

  @Output() trainingStart =  new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onStartTraining() {
    this.trainingStart.emit();
  }

}
