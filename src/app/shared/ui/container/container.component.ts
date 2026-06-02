import { Component, input } from '@angular/core';
import { ComponentNode } from '../../../core/models/schema.model';
import { NodeRendererComponent } from '../../../core/renderer/node-renderer.component';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [NodeRendererComponent],
  template: `
    <div [class]="'flex gap-6 p-6 min-h-[150px] w-full rounded-2xl border-2 border-dashed border-gray-300 ' + customClass()"
         [style.flex-direction]="direction()">
         
      @for (child of childrenNodes(); track child.id) {
        <app-node-renderer [node]="child"></app-node-renderer>
      }
      
      @if (childrenNodes().length === 0) {
        <div class="w-full h-full flex flex-col items-center justify-center text-[var(--text-muted)] font-bold opacity-60 m-auto">
          <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Kéo thả khối vào Container này...
        </div>
      }
      
    </div>
  `
})
export class ContainerComponent {
  // Dữ liệu mảng các Component con nằm trong Container
  childrenNodes = input<ComponentNode[]>([]);
  
  // Style properties
  direction = input<'row' | 'column'>('column');
  customClass = input<string>('');
}
