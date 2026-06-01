import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button 
      (click)="onClick.emit()"
      [disabled]="disabled"
      class="inline-flex items-center justify-center px-4 py-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
      [class.bg-indigo-600]="color === 'primary'"
      [class.text-white]="color === 'primary'"
      [class.hover:bg-indigo-700]="color === 'primary' && !disabled"
      [class.focus:ring-indigo-500]="color === 'primary'"
      
      [class.bg-white]="color === 'secondary'"
      [class.text-gray-700]="color === 'secondary'"
      [class.border]="color === 'secondary'"
      [class.border-gray-300]="color === 'secondary'"
      [class.hover:bg-gray-50]="color === 'secondary' && !disabled"
      [class.focus:ring-gray-200]="color === 'secondary'"
      
      [class.opacity-50]="disabled"
      [class.cursor-not-allowed]="disabled">
      
      <!-- Icon slot -->
      <ng-content select="[icon]"></ng-content>
      
      <!-- Text slot -->
      <span class="mx-1">
        <ng-content></ng-content>
      </span>
      
    </button>
  `
})
export class ButtonComponent {
  @Input() color: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<void>();
}
