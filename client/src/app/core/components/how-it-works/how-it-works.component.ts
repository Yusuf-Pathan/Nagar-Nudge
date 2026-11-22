import { Component } from '@angular/core';
import { HOW_IT_WORKS_STEPS } from '../../../core/constants/app.constants';
import { StepItem } from '../../../core/models/index';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent {
  readonly steps: StepItem[] = HOW_IT_WORKS_STEPS;
}
