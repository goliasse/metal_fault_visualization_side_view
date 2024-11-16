import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FaultVisualizerComponent } from './app/fault-visualizer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FaultVisualizerComponent],
  template: `
    <div class="container">
      <h1>Metal Surface Fault Visualizer</h1>
      <app-fault-visualizer></app-fault-visualizer>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
    }
  `]
})
export class App {
}

bootstrapApplication(App);