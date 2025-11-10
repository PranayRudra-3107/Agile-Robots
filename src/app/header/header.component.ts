import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslatePipe, FormsModule],
  template: `
    <header>
      <h1>{{ 'TITLE' | translate }}</h1>
      <div class="controls">
        <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="searchChange.emit(searchTerm)" placeholder="{{ 'SEARCH' | translate }}" />
        <button class="lang" (click)="toggleLang.emit()">
          {{ isGerman ? 'EN' : 'DE' }}
        </button>
        <button class="estop" (click)="emergencyStop.emit()">
          {{ 'EMERGENCY_STOP' | translate }}
        </button>
      </div>
    </header>
  `,
  styles: [`
    header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #1e293b; }
    .estop { background: #dc2626; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 8px; }
    .lang { background: #475569; width: 50px; }
  `]
})
export class HeaderComponent {
  @Input() isGerman = false;
  @Input() searchTerm = '';
  @Output() toggleLang = new EventEmitter<void>();
  @Output() emergencyStop = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
}
