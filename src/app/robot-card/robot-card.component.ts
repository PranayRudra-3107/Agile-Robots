import { AfterViewInit, Component, ElementRef, Input, ViewChild, effect, inject, Injector } from '@angular/core';
import { runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Robot, RobotService } from '../services/robot.service';
import * as THREE from 'three';

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

      <div #threeContainer style="width: 100%; height: 200px; background: #0f172a; border-radius: 12px; margin: 1rem 0;"></div>

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
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `]
})
export class RobotCardComponent implements AfterViewInit {
  @Input() robot!: Robot;
  jointArray = ['j1','j2','j3','j4','j5','j6'] as const;

  @ViewChild('threeContainer') threeContainer!: ElementRef<HTMLDivElement>;  // CHANGE to div

  private robotService = inject(RobotService);
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private armGroup!: THREE.Group;

  ngAfterViewInit() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 300 / 200, 0.1, 1000);
    this.camera.position.z = 5;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(300, 200);
    this.threeContainer.nativeElement.appendChild(this.renderer.domElement);

    this.armGroup = new THREE.Group();
    this.scene.add(this.armGroup);
    const lengths = [1, 1, 1, 1, 1, 1];  // Scaled for 3D
    const angles = [this.robot.joints.j1, this.robot.joints.j2, this.robot.joints.j3, this.robot.joints.j4, this.robot.joints.j5, this.robot.joints.j6];
    let currentPosition = new THREE.Vector3(0, 0, 0);

    angles.forEach((angle, i) => {
      const rad = THREE.MathUtils.degToRad(angle);
      const joint = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, lengths[i], 32), new THREE.MeshPhongMaterial({ color: 0x60a5fa }));
      joint.position.set(0, lengths[i] / 2, 0);
      joint.rotation.z = rad;  // Simple rotation for "insane" 3D effect
      this.armGroup.add(joint);
      joint.position.add(currentPosition);
      currentPosition = new THREE.Vector3(0, lengths[i], 0).applyEuler(new THREE.Euler(0, 0, rad));
    });

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0x404040));

    this.animate();  // Start animation loop for insane spinning

    effect(() => {
      this.robotService.robots();
      this.updateArm();  // Rebuild arm on signal change
    });
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.armGroup.rotation.y += 0.01;  // Insane rotation effect
    this.renderer.render(this.scene, this.camera);
  }

  private updateArm() {
    // Rebuild arm group on updates (simple - clear and add new joints)
    this.armGroup.clear();
    const lengths = [1, 1, 1, 1, 1, 1];
    const angles = [this.robot.joints.j1, this.robot.joints.j2, this.robot.joints.j3, this.robot.joints.j4, this.robot.joints.j5, this.robot.joints.j6];
    let currentPosition = new THREE.Vector3(0, 0, 0);

    angles.forEach((angle, i) => {
      const rad = THREE.MathUtils.degToRad(angle);
      const joint = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, lengths[i], 32), new THREE.MeshPhongMaterial({ color: 0x60a5fa }));
      joint.position.set(0, lengths[i] / 2, 0);
      joint.rotation.z = rad;
      this.armGroup.add(joint);
      joint.position.add(currentPosition);
      currentPosition = new THREE.Vector3(0, lengths[i], 0).applyEuler(new THREE.Euler(0, 0, rad));
    });
  }
}
