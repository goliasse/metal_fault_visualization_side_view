import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Fault } from './models/fault.model';
import { FaultShapeComponent } from './components/fault-shape.component';
import { SideViewComponent } from './components/side-view.component';

@Component({
  selector: 'app-fault-visualizer',
  standalone: true,
  imports: [CommonModule, FaultShapeComponent, SideViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="visualizer-container">
      <app-side-view
        [faults]="faults"
        [hoveredFault]="hoveredFault"
        [surfaceWidth]="surfaceWidth"
        (faultHover)="onSideViewFaultHover($event)"
        (faultLeave)="onFaultLeave()"
        (addFault)="addFault($event.shape, $event.category)"
        (clearFaults)="clearFaults()">
      </app-side-view>

      <div class="surface-container">
        <svg:svg #svgElement
             [attr.width]="surfaceWidth" 
             [attr.height]="surfaceHeight" 
             class="metal-surface"
             (mousemove)="onMouseMove($event)">
          <!-- Base metal surface -->
          <svg:rect width="100%" height="100%" fill="#e0e0e0" stroke="#999" />

          <!-- Render all faults sorted by zIndex -->
          <ng-container *ngFor="let fault of sortedFaults">
            <g app-fault-shape 
               [fault]="fault"
               [isHovered]="fault === hoveredFault"
               (mouseenter)="onFaultHover(fault, $event)"
               (mouseleave)="onFaultLeave()"></g>
          </ng-container>

          <!-- Enhanced Tooltip -->
          <svg:g *ngIf="hoveredFault" 
             [attr.transform]="'translate(' + tooltipX + ',' + tooltipY + ')'"
             class="tooltip">
            <svg:rect 
              x="0" 
              y="-25" 
              [attr.width]="getTooltipWidth()"
              [attr.height]="getTooltipHeight()"
              fill="white" 
              stroke="black" 
              rx="4">
            </svg:rect>
            <svg:text x="10" y="-5">
              <tspan x="10">Category {{hoveredFault.category}} Fault</tspan>
              <ng-container *ngFor="let hidden of getHiddenFaults(); let i = index">
                <tspan x="10" [attr.y]="15 + i * 20">
                  Hiding: Cat {{hidden.category}} {{hidden.shape}}
                </tspan>
              </ng-container>
            </svg:text>
          </svg:g>
        </svg:svg>
      </div>
    </div>
  `,
  styles: [`
    .visualizer-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: stretch;
    }

    .surface-container {
      border: 2px solid #666;
      display: inline-block;
      position: relative;
    }

    .metal-surface {
      display: block;
    }

    .tooltip {
      pointer-events: none;
    }

    .tooltip rect {
      opacity: 0.9;
    }

    .tooltip text {
      font-size: 12px;
      font-family: Arial, sans-serif;
    }
  `]
})
export class FaultVisualizerComponent {
  @ViewChild('svgElement') svgElement!: ElementRef;
  
  surfaceWidth = 800;
  surfaceHeight = 600;
  faults: Fault[] = [];
  hoveredFault: Fault | null = null;
  tooltipX = 0;
  tooltipY = 0;

  get sortedFaults(): Fault[] {
    return [...this.faults].sort((a, b) => {
      if (a === this.hoveredFault) return 1;
      if (b === this.hoveredFault) return -1;
      return b.category - a.category;
    });
  }

  private getCategoryColor(category: number): string {
    switch (category) {
      case 1: return '#ff4444';
      case 2: return '#ffaa00';
      case 3: return '#44ff44';
      default: return '#888888';
    }
  }

  private isPointInFault(x: number, y: number, fault: Fault): boolean {
    if (fault.shape === 'rectangle') {
      return x >= fault.x && 
             x <= fault.x + (fault.width || 0) && 
             y >= fault.y && 
             y <= fault.y + (fault.height || 0);
    } else {
      const dx = x - fault.x;
      const dy = y - fault.y;
      return Math.sqrt(dx * dx + dy * dy) <= (fault.radius || 0);
    }
  }

  getHiddenFaults(): Fault[] {
    if (!this.hoveredFault) return [];
    
    const mouseX = this.tooltipX;
    const mouseY = this.tooltipY;
    
    return this.faults.filter(fault => 
      fault !== this.hoveredFault && 
      this.isPointInFault(mouseX, mouseY, fault)
    ).sort((a, b) => a.category - b.category);
  }

  getTooltipWidth(): number {
    return 200;
  }

  getTooltipHeight(): number {
    const hiddenCount = this.getHiddenFaults().length;
    return 30 + (hiddenCount * 20);
  }

  addFault(shape: 'rectangle' | 'circle', category: 1 | 2 | 3) {
    const fault: Fault = {
      id: Date.now(),
      category,
      shape,
      x: Math.random() * (this.surfaceWidth - 100) + 50,
      y: Math.random() * (this.surfaceHeight - 100) + 50,
      color: this.getCategoryColor(category)
    };

    if (shape === 'rectangle') {
      fault.width = Math.random() * 150 + 50;
      fault.height = Math.random() * 150 + 50;
      fault.x -= fault.width / 2;
      fault.y -= fault.height / 2;
    } else {
      fault.radius = Math.random() * 50 + 25;
    }

    this.faults = [...this.faults, fault];
  }

  clearFaults() {
    this.faults = [];
    this.hoveredFault = null;
  }

  onFaultHover(fault: Fault, event: MouseEvent) {
    this.hoveredFault = fault;
    this.updateTooltipPosition(event);
  }

  onSideViewFaultHover(data: {fault: Fault, event: MouseEvent}) {
    this.hoveredFault = data.fault;
    this.updateTooltipPosition(data.event);
  }

  onFaultLeave() {
    this.hoveredFault = null;
  }

  onMouseMove(event: MouseEvent) {
    if (this.hoveredFault) {
      this.updateTooltipPosition(event);
    }
  }

  private updateTooltipPosition(event: MouseEvent) {
    const svgRect = this.svgElement.nativeElement.getBoundingClientRect();
    this.tooltipX = event.clientX - svgRect.left;
    this.tooltipY = event.clientY - svgRect.top;
  }
}