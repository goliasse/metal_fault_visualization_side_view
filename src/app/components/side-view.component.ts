import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Fault } from '../models/fault.model';

@Component({
  selector: 'app-side-view',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="side-view-wrapper">
      <div class="side-view-container">
        <svg:svg 
          [attr.width]="surfaceWidth" 
          [attr.height]="height"
          class="side-view">
          <!-- Metal surface line -->
          <svg:line
            x1="0"
            y1="30"
            [attr.x2]="surfaceWidth"
            y2="30"
            stroke="#666"
            stroke-width="4"
            class="metal-surface-line" />
          
          <!-- Surface label -->
          <svg:text
            x="10"
            y="20"
            fill="#666"
            font-size="12">
            Metal Surface (Side View)
          </svg:text>

          <!-- Fault lines -->
          <ng-container *ngFor="let fault of sortedFaults; let i = index">
            <svg:line
              [attr.x1]="getFaultStart(fault)"
              [attr.y1]="getFaultY(i)"
              [attr.x2]="getFaultEnd(fault)"
              [attr.y2]="getFaultY(i)"
              [attr.stroke]="fault.color"
              [attr.stroke-width]="fault === hoveredFault ? 3 : 2"
              [attr.opacity]="fault === hoveredFault ? 1 : 0.7"
              (mouseenter)="onFaultHover(fault, $event)"
              (mouseleave)="onFaultLeave()"
              class="fault-line" />
            
            <!-- Category label -->
            <svg:text
              [attr.x]="surfaceWidth - 5"
              [attr.y]="getFaultY(i)"
              text-anchor="end"
              alignment-baseline="middle"
              [attr.fill]="fault.color"
              font-size="12">
              Cat {{fault.category}}
            </svg:text>
          </ng-container>
        </svg:svg>
      </div>

      <div class="controls">
        <div class="control-group">
          <h3>Category 1</h3>
          <button (click)="addFault.emit({shape: 'rectangle', category: 1})">Add Rectangle</button>
          <button (click)="addFault.emit({shape: 'circle', category: 1})">Add Circle</button>
        </div>
        <div class="control-group">
          <h3>Category 2</h3>
          <button (click)="addFault.emit({shape: 'rectangle', category: 2})">Add Rectangle</button>
          <button (click)="addFault.emit({shape: 'circle', category: 2})">Add Circle</button>
        </div>
        <div class="control-group">
          <h3>Category 3</h3>
          <button (click)="addFault.emit({shape: 'rectangle', category: 3})">Add Rectangle</button>
          <button (click)="addFault.emit({shape: 'circle', category: 3})">Add Circle</button>
        </div>
        <div class="control-group">
          <button class="clear-button" (click)="clearFaults.emit()">Clear All</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .side-view-wrapper {
      display: flex;
      gap: 20px;
      align-items: start;
    }

    .side-view-container {
      flex: 1;
      border: 2px solid #666;
      padding: 5px;
      background: white;
      margin-bottom: 10px;
    }

    .side-view {
      display: block;
    }

    .metal-surface-line {
      stroke-linecap: round;
    }

    .fault-line {
      cursor: pointer;
      transition: stroke-width 0.2s, opacity 0.2s;
      stroke-linecap: round;
    }

    .fault-line:hover {
      opacity: 1;
    }

    .controls {
      width: 200px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .control-group h3 {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    button {
      padding: 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: background-color 0.2s;
    }

    .control-group:nth-child(1) button {
      background-color: #ffdddd;
    }

    .control-group:nth-child(1) button:hover {
      background-color: #ffcccc;
    }

    .control-group:nth-child(2) button {
      background-color: #fff3dd;
    }

    .control-group:nth-child(2) button:hover {
      background-color: #ffe5bb;
    }

    .control-group:nth-child(3) button {
      background-color: #ddffdd;
    }

    .control-group:nth-child(3) button:hover {
      background-color: #ccffcc;
    }

    .clear-button {
      background-color: #f0f0f0;
      border: 1px solid #ccc;
    }

    .clear-button:hover {
      background-color: #e0e0e0;
    }
  `]
})
export class SideViewComponent {
  @Input() faults: Fault[] = [];
  @Input() hoveredFault: Fault | null = null;
  @Input() surfaceWidth = 800;
  @Output() faultHover = new EventEmitter<{fault: Fault, event: MouseEvent}>();
  @Output() faultLeave = new EventEmitter<void>();
  @Output() addFault = new EventEmitter<{shape: 'rectangle' | 'circle', category: 1 | 2 | 3}>();
  @Output() clearFaults = new EventEmitter<void>();

  height = 150;

  get sortedFaults(): Fault[] {
    return [...this.faults].sort((a, b) => {
      if (a === this.hoveredFault) return 1;
      if (b === this.hoveredFault) return -1;
      return a.category - b.category;
    });
  }

  getFaultY(index: number): number {
    const startY = 50;
    const spacing = 20;
    return startY + (index * spacing);
  }

  getFaultStart(fault: Fault): number {
    if (fault.shape === 'rectangle') {
      return fault.x;
    } else {
      return fault.x - (fault.radius || 0);
    }
  }

  getFaultEnd(fault: Fault): number {
    if (fault.shape === 'rectangle') {
      return fault.x + (fault.width || 0);
    } else {
      return fault.x + (fault.radius || 0);
    }
  }

  onFaultHover(fault: Fault, event: MouseEvent) {
    this.faultHover.emit({ fault, event });
  }

  onFaultLeave() {
    this.faultLeave.emit();
  }
}