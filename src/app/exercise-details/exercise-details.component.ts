import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ExerciseService } from '../services/exercise.service';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-exercise-details',
  standalone: true,
  imports: [AsyncPipe,CommonModule],
  templateUrl: './exercise-details.component.html',
  styleUrl: './exercise-details.component.css'
})
export class ExerciseDetailsComponent {

  exerciseId: string | null = null;
  exercise$! :Observable<any>;

  constructor(private route: ActivatedRoute, private exerciseService:ExerciseService, private router: Router) {}

  ngOnInit() {
    this.exerciseId = this.route.snapshot.paramMap.get('id');
    console.log('Exercise ID:', this.exerciseId);
    if(this.exerciseId){
    this.exercise$=this.exerciseService.getExerciseById(+this.exerciseId)}
  }
  goBack(){
    this.router.navigate(['/exercises']);
  }
 
}
