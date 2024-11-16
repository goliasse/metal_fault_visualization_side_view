import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Fault } from '../models/fault.model';

@Component({
  selector: '[app-fault-shape]',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <svg:g [attr.class]="'fault-shape category-' + fault.category"
       (mouseenter)="onMouseEnter($event)"
       (mouseleave)="onMouseLeave($event)">
      <!-- Rectangle fault -->
      <svg:rect *ngIf="fault.shape === 'rectangle'"
            [attr.x]="fault.x"
            [attr.y]="fault.y"
            [attr.width]="fault.width"
            [attr.height]="fault.height"
            [attr.fill]="fault.color"
            stroke="black"
            [attr.stroke-width]="isHovered ? 2 : 1"
            [attr.opacity]="isHovered ? 0.9 : 0.7">
      </svg:rect>

      <!-- Circle fault -->
      <svg:circle *ngIf="fault.shape === 'circle'"
             [attr.cx]="fault.x"
             [attr.cy]="fault.y"
             [attr.r]="fault.radius"
             [attr.fill]="fault.color"
             stroke="black"
             [attr.stroke-width]="isHovered ? 2 : 1"
             [attr.opacity]="isHovered ? 0.9 : 0.7">
      </svg:circle>
    </svg:g>
  `,
  styles: [`
    .fault-shape {
      transition: opacity 0.2s, stroke-width 0.2s;
    }
    .fault-shape:hover {
      cursor: pointer;
    }
  `]
})
export class FaultShapeComponent {
  @Input() fault!: Fault;
  @Input() isHovered: boolean = false;
  @Output() mouseenter = new EventEmitter<MouseEvent>();
  @Output() mouseleave = new EventEmitter<MouseEvent>();

  onMouseEnter(event: MouseEvent) {
    this.mouseenter.emit(event);
  }

  onMouseLeave(event: MouseEvent) {
    this.mouseleave.emit(event);
  }
}