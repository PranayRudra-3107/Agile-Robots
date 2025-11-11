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
    header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;  // Increased padding for airier feel
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);  // Subtle gradient for depth
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);  // Soft shadow for elevation
  border-bottom: 1px solid #334155;  // Subtle separator
}

h1 {
  font-size: 1.8rem;  // Slightly larger for prominence
  margin: 0;
  color: #e2e8f0;
  letter-spacing: 0.5px;  // Better readability
}

.controls {
  display: flex;
  align-items: center;
  gap: 1.25rem;  // Proper spacing between elements (increased from 1rem)
}

input {
  padding: 0.85rem 1.25rem;  // More comfortable input padding
  border: 1px solid #475569;  // Subtle border
  border-radius: 8px;
  background: #334155;  // Darker input bg for contrast
  color: #e2e8f0;
  width: 220px;  // Fixed width for consistency
  transition: border-color 0.3s ease;  // Smooth focus effect
}

input:focus {
  border-color: #60a5fa;  // Highlight on focus
  outline: none;
}

.lang {
  background: #475569;
  color: #e2e8f0;
  font-weight: bold;
  padding: 0.85rem 1.25rem;  // Consistent padding with input
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  min-width: 60px;  // Better than fixed width for centering
  text-align: center;
}

.lang:hover {
  background: #64748b;  // Hover effect
}

.estop {
  background: #dc2626;
  color: white;
  font-weight: bold;
  padding: 0.85rem 1.75rem;  // Slightly wider for emphasis
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.1s ease;
}

.estop:hover {
  background: #ef4444;  // Brighter hover
  transform: scale(1.05);  // Subtle zoom for interactivity
}

.estop:active {
  transform: scale(0.98);  // Click feedback
}
  `]
})
export class HeaderComponent {
  @Input() isGerman = false;
  @Input() searchTerm = '';
  @Output() toggleLang = new EventEmitter<void>();
  @Output() emergencyStop = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
}
