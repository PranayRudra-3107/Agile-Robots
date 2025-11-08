// src/app/app.component.ts
import { Component, signal, inject, OnInit, PLATFORM_ID,HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // ← ADD THIS
import { RobotCardComponent } from './robot-card/robot-card.component';
import { HeaderComponent } from './header/header.component';
import { RobotService } from './services/robot.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RobotCardComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private robotService: RobotService = inject(RobotService);
  private translate: TranslateService = inject(TranslateService);
  private platformId = inject(PLATFORM_ID); // ← ADD THIS

  robots = this.robotService.robots;
  isGerman = signal(false);

  ngOnInit() {
    // In ngOnInit or constructor
    this.translate.use('en').subscribe({
      next: () => console.log('Translations loaded'),
      error: (err) => {
        console.error('Translation error:', err);
        this.translate.setTranslation('en', {
          /* Paste static en.json content here as fallback */
        });
      },
    });
    if (isPlatformBrowser(this.platformId)) {
      // ← GUARD: Browser only
      this.robotService.startSimulation();
    }
  }

  toggleLanguage() {
    const lang = this.isGerman() ? 'en' : 'de';
    this.isGerman.set(!this.isGerman());
    this.translate.use(lang);
  }

  trackByRobotId(index: number, robot: any): string {
  return robot.id;  // Uses unique ID like 'D7-001'—all 6 stay & update dynamically
}

  emergencyStopAll() {
    this.robotService.emergencyStop();
  }

  private konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
private konamiIndex = 0;

@HostListener('document:keydown', ['$event'])
handleKeydown(event: KeyboardEvent) {
  if (event.key === this.konamiCode[this.konamiIndex]) {
    this.konamiIndex++;
    if (this.konamiIndex === this.konamiCode.length) {
      console.log('Konami activated—robots dance!');
      this.robotService.robots.update(robots => robots.map(r => ({ ...r, status: 'running' })));  // Or custom dance animation
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-victory-1064.mp3');
      audio.play();
      this.konamiIndex = 0;
    }
  } else {
    this.konamiIndex = 0;
  }


}
}
