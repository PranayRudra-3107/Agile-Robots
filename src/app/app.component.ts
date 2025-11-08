// src/app/app.component.ts
import { Component, signal, inject, OnInit } from '@angular/core';
import { RobotCardComponent } from './robot-card/robot-card.component';
import { HeaderComponent } from './header/header.component';
import { RobotService } from './services/robot.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RobotCardComponent, HeaderComponent],  // Removed TranslateModule (not needed with TranslatePipe)
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private robotService: RobotService = inject(RobotService);     // ← FIXED: inject + type (before usage)
  private translate: TranslateService = inject(TranslateService); // ← Same for translate

  robots = this.robotService.robots;                             // ← Now safe (after robotService)
  isGerman = signal(false);

  ngOnInit() {
    this.robotService.startSimulation();
  }

  toggleLanguage() {
    const lang = this.isGerman() ? 'en' : 'de';
    this.isGerman.set(!this.isGerman());
    this.translate.use(lang);
  }

  emergencyStopAll() {
    this.robotService.emergencyStop();
  }
}
