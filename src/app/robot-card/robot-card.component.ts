import { Component, Input, ViewChild } from '@angular/core';
import { Robot } from '../services/robot.service';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-robot-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="card" [class.estopped]="robot.status === 'estopped'" [class.error]="robot.status === 'error'">
      <div class="header">
        <h3>{{ robot.name }}</h3>
        <span class="status" [class]="robot.status">
          {{ 'STATUS.' + robot.status | translate }}
        </span>
      </div>

      <div class="joints">
        <div *ngFor="let joint of jointArray; let i = index" class="joint">
          <small>J{{i+1}}</small>
          <strong>{{ robot.joints[joint] | number:'1.0-0' }}°</strong>
        </div>
      </div>

      <canvas #canvas width="300" height="200"></canvas>

      <small class="heartbeat">
        {{ 'HEARTBEAT' | translate }}: {{ robot.heartbeat | date:'HH:mm:ss' }}
      </small>
    </div>
  `,
  styles: [`
    .card { background: #1e293b; border-radius: 16px; padding: 1.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
    .estopped { border: 3px solid #dc2626; animation: pulse 1s infinite; }
    .error { border: 2px solid #f59e0b; }
    canvas { width: 100%; height: 180px; background: #0f172a; border-radius: 12px; margin: 1rem 0; }
    .joints { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin: 1rem 0; }
    .joint { text-align: center; background: #334155; padding: 0.5rem; border-radius: 8px; }
  `]
})
export class RobotCardComponent {
  @Input() robot!: Robot;
  jointArray = ['j1','j2','j3','j4','j5','j6'] as const;

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.drawArm();
    this.robotService.robots.subscribe(() => this.drawArm());
  }

  private drawArm() {
    const ctx = this.ctx;
    const { j1, j2, j3, j4, j5, j6 } = this.robot.joints;
    ctx.clearRect(0, 0, 300, 200);

    // Simple 2D arm visualization (they LOVE this)
    const centerX = 150, centerY = 160;
    let x = centerX, y = centerY;
    const lengths = [40, 35, 30, 25, 20, 15];

    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);

    const angles = [j1, j2, j3, j4, j5, j6];
    angles.forEach((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      x += lengths[i] * Math.sin(rad);
      y -= lengths[i] * Math.cos(rad);
      ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
}
