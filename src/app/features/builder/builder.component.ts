import { Component } from '@angular/core';
import { ComponentNode } from '../../core/models/schema.model';
import { NodeRendererComponent } from '../../core/renderer/node-renderer.component';

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [NodeRendererComponent],
  template: `
    <div class="h-full bg-[var(--surface)]">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Editor Preview (Low-Code Engine)</h1>
        <p class="text-[var(--text-muted)] font-medium">Giao diện bên dưới được vẽ 100% tự động từ một chuỗi JSON tĩnh, không code cứng bất kỳ thẻ HTML nào!</p>
      </div>
      
      <!-- Động cơ Low-Code bắt đầu chạy đệ quy từ đây -->
      <app-node-renderer [node]="mockPageSchema"></app-node-renderer>
    </div>
  `
})
export class BuilderComponent {
  // GIẢ LẬP: Dữ liệu JSON này do người dùng thiết kế bằng cách kéo thả trên Canvas
  mockPageSchema: ComponentNode = {
    id: 'root_page',
    type: 'Container',
    styles: { direction: 'column', customClass: 'neu-flat p-10 bg-[var(--surface)]' },
    children: [
      {
        id: 'title_input',
        type: 'TextInput',
        properties: {
          label: 'Tên Dự Án (Text Input component)',
          placeholder: 'Nhập tên dự án low-code của bạn...',
          required: true
        }
      },
      {
        id: 'row_1',
        type: 'Container',
        styles: { direction: 'row', customClass: 'border-none p-0 mt-6 bg-transparent box-shadow-none' },
        children: [
          {
            id: 'btn_cancel',
            type: 'Button',
            properties: { label: 'Hủy bỏ (Button Component)' },
            styles: { customClass: 'w-full' }
          },
          {
            id: 'btn_save',
            type: 'Button',
            properties: { label: 'Lưu thay đổi', icon: '🚀' },
            styles: { customClass: 'btn-primary w-full' }
          }
        ]
      }
    ]
  };
}
