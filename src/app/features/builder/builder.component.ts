import { Component, OnInit, inject } from '@angular/core';
import { ComponentNode } from '../../core/models/schema.model';
import { NodeRendererComponent } from '../../core/renderer/node-renderer.component';
import { BuilderStateService } from '../../core/state/builder.state';
import { PropertyPanelComponent } from './property-panel.component';

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [NodeRendererComponent, PropertyPanelComponent],
  template: `
    <div class="h-full flex flex-col bg-[var(--surface)]">
      
      <!-- Top Header Bar cho chức năng Preview -->
      <div class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-30 relative">
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 bg-teal-100 text-teal-700 flex items-center justify-center rounded font-bold">N</span>
          <h1 class="font-bold text-gray-800 text-sm tracking-wide">NEXUS BUILDER</h1>
        </div>
        <div class="flex items-center gap-4">
          <button class="text-xs font-bold px-4 py-2 rounded-lg transition-all"
                  [class.bg-gray-100]="!builderState.previewMode()" [class.text-gray-500]="!builderState.previewMode()"
                  [class.bg-teal-500]="builderState.previewMode()" [class.text-white]="builderState.previewMode()"
                  (click)="builderState.togglePreviewMode()">
            {{ builderState.previewMode() ? '👁️ Đang Xem Trực Tiếp' : '✏️ Chế Độ Chỉnh Sửa' }}
          </button>
        </div>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <!-- Component Library (Thanh Công Cụ Bên Trái) - Chỉ hiện khi Edit -->
        @if (!builderState.previewMode()) {
          <div class="w-64 h-full bg-white border-r border-gray-200 flex flex-col z-10 shadow-sm transition-all">
            <div class="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wider">Components</h2>
            </div>
            <div class="p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Cơ Bản</p>
              @for (widget of availableWidgets; track widget.type) {
                <button (click)="addWidget(widget.type)" 
                        class="flex items-center gap-3 p-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-primary-color hover:text-primary-color hover:shadow-md transition-all text-left">
                  <span class="text-xl" [innerHTML]="widget.icon"></span> {{ widget.label }}
                </button>
              }
            </div>
          </div>
        }

        <!-- Canvas Editor (Nơi hiển thị giao diện chính) -->
        <div class="flex-1 p-8 overflow-auto custom-scrollbar flex flex-col" (click)="clearSelection($event)">
          @if (!builderState.previewMode()) {
            <div class="mb-6 flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold mb-1 text-gray-800">Trang: Dashboard</h1>
                <p class="text-sm text-[var(--text-muted)] font-medium">Bấm vào thanh công cụ bên trái để thêm khối UI vào Canvas.</p>
              </div>
              <button class="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors" (click)="resetCanvas()">
                Xoá Sạch Canvas
              </button>
            </div>
          }
          
          @if (builderState.schema()) {
            <div class="neu-flat p-4 flex-1 bg-white transition-all" 
                 [class.shadow-none]="builderState.previewMode()"
                 [class.p-0]="builderState.previewMode()"
                 [class.border-none]="builderState.previewMode()"
                 (click)="$event.stopPropagation()">
              <app-node-renderer [node]="builderState.schema()!"></app-node-renderer>
            </div>
          }
        </div>

        <!-- Property Panel (Bảng chỉnh sửa bên phải) - Chỉ hiện khi Edit -->
        @if (!builderState.previewMode()) {
          <div class="w-[340px] h-full border-l-2 border-[var(--shadow-dark)] shadow-[-10px_0_20px_rgba(0,0,0,0.03)] z-20">
            <app-property-panel></app-property-panel>
          </div>
        }
      </div>

    </div>
  `
})
export class BuilderComponent implements OnInit {
  builderState = inject(BuilderStateService);

  // Danh sách các Widgets (có thể mở rộng vô hạn sau này, ví dụ Table, Chart, Form...)
  availableWidgets = [
    { type: 'Container', icon: '📦', label: 'Container (Khối Bọc)' },
    { type: 'TextInput', icon: '🔤', label: 'Text Input (Ô Nhập)' },
    { type: 'Button', icon: '🔘', label: 'Button (Nút Bấm)' }
  ];

  ngOnInit() {
    this.resetCanvas();
  }

  // Khởi tạo Canvas trống trơn chỉ có 1 Container gốc
  resetCanvas() {
    this.builderState.setSchema({
      id: 'root_page',
      type: 'Container',
      styles: { direction: 'column', customClass: 'bg-transparent border-none min-h-[400px]' },
      children: []
    });
  }

  // Thêm Widget mới vào gốc của trang
  addWidget(type: string) {
    // Nếu đang chọn một Container, thì thêm vào Container đó
    // Nếu không chọn gì, thêm thẳng vào Root
    const selectedId = this.builderState.selectedNodeId();
    const selectedNode = this.builderState.selectedNode();
    
    if (selectedId && selectedNode?.type === 'Container') {
      this.builderState.addComponentNode(type, selectedId);
    } else {
      this.builderState.addComponentNode(type, 'root_page');
    }
  }

  clearSelection(event: MouseEvent) {
    this.builderState.selectNode(''); // Bỏ chọn tất cả khi bấm ra ngoài Canvas
  }
}
