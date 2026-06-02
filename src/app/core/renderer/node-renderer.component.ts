import { Component, Input, OnInit, OnChanges, SimpleChanges, Type, inject } from '@angular/core';
import { NgComponentOutlet, NgClass } from '@angular/common';
import { ComponentNode } from '../models/schema.model';
import { getComponentRegistry } from './registry';
import { BuilderStateService } from '../state/builder.state';

@Component({
  selector: 'app-node-renderer',
  standalone: true,
  imports: [NgComponentOutlet, NgClass],
  template: `
    <div 
      class="relative group transition-all rounded-xl"
      [ngClass]="{
        'ring-2 ring-primary-color ring-offset-2': isSelected() && !builderState.previewMode()
      }"
      (click)="selectNode($event)">
      
      <!-- Lớp highlight xanh mờ khi Hover chuột vào Component (Ẩn khi Preview) -->
      @if (!builderState.previewMode()) {
        <div class="absolute inset-0 border-2 border-transparent group-hover:border-primary-color group-hover:border-dashed rounded-xl pointer-events-none z-10 opacity-50 transition-all"></div>
      }
      
      @if (componentClass) {
        <ng-container *ngComponentOutlet="componentClass; inputs: componentInputs"></ng-container>
      } @else {
        <div class="p-4 border-2 border-red-500 border-dashed text-red-500 font-bold rounded-xl bg-red-50">
          Khối [{{ node.type }}] chưa được đăng ký!
        </div>
      }
    </div>
  `
})
export class NodeRendererComponent implements OnInit, OnChanges {
  @Input({ required: true }) node!: ComponentNode;
  
  public builderState = inject(BuilderStateService);
  
  componentClass: Type<any> | null = null;
  componentInputs: Record<string, unknown> = {};

  isSelected(): boolean {
    return this.builderState.selectedNodeId() === this.node.id;
  }

  selectNode(event: Event) {
    if ((this.builderState as any).previewMode()) return;
    event.stopPropagation(); // Ngăn sự kiện click nổi bọt lên thằng cha
    this.builderState.selectNode(this.node.id);
  }

  ngOnInit() {
    this.setupNode();
  }

  // Khi Store State (JSON) được cập nhật (ví dụ gõ phím đổi chữ), Angular sẽ tự động gọi OnChanges
  ngOnChanges(changes: SimpleChanges) {
    if (changes['node']) {
      this.setupNode();
    }
  }

  private setupNode() {
    if (!this.node) return;
    
    const registry = getComponentRegistry();
    this.componentClass = registry[this.node.type] || null;
    
    // 1. Lấy Context hiện tại từ State
    const context = this.builderState.globalContext();

    // 2. Nội suy (Interpolate) Properties
    const interpolatedProperties = this.interpolateObject(this.node.properties || {}, context);
    
    // Gom tất cả properties đã biên dịch và styles thành Inputs cho Component con
    this.componentInputs = {
      ...interpolatedProperties,
      ...(this.node.styles || {}),
      childrenNodes: this.node.children || [], // Dành riêng cho Container
      onEvent: (eventName: string, payload: any) => this.handleEvent(eventName, payload)
    };
  }

  // --- CORE ENGINE: BỘ NỘI SUY DỮ LIỆU ---
  private interpolateObject(obj: Record<string, any>, context: any): Record<string, any> {
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        result[key] = this.evaluateString(obj[key], context);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Nếu là mảng hoặc object con thì đệ quy
        result[key] = Array.isArray(obj[key]) 
          ? obj[key].map((item: any) => typeof item === 'string' ? this.evaluateString(item, context) : item)
          : this.interpolateObject(obj[key], context);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }

  private evaluateString(str: string, context: any): string {
    const keys = Object.keys(context);
    const values = Object.values(context);
    
    // Tìm và thay thế tất cả các chuỗi có dạng {{ variable }}
    return str.replace(/\{\{(.*?)\}\}/g, (match, expression) => {
      try {
        // Khởi tạo hàm với tham số linh động từ Context (vd: user, apiData)
        const func = new Function(...keys, `return ${expression};`);
        const val = func(...values);
        return val !== undefined && val !== null ? String(val) : '';
      } catch (e) {
        console.warn(`[Low-Code] Lỗi phân giải biến '${expression}':`, e);
        return match; // Trả về nguyên gốc nếu lỗi
      }
    });
  }

  // Đây là nơi phép màu Low-Code xảy ra: Nhận sự kiện và chạy Javascript động
  handleEvent(eventName: string, payload: any) {
    if (!this.node.events || !this.node.events[eventName]) return;

    const actions = this.node.events[eventName];
    
    for (const action of actions) {
      if (action.type === 'EXECUTE_JS' && action.code) {
        try {
          // Khởi tạo một hàm Javascript từ chuỗi cấu hình JSON
          // Truyền state và payload vào để người dùng có thể can thiệp dữ liệu
          const executeFunc = new Function('node', 'payload', 'state', action.code);
          executeFunc(this.node, payload, this.builderState);
        } catch (error) {
          console.error(`[Low-Code Engine] Lỗi khi thực thi mã JS ở khối ${this.node.id}:`, error);
        }
      } else if (action.type === 'NAVIGATE' && action.url) {
        console.log(`[Low-Code Engine] Điều hướng tới: ${action.url}`);
        // Xử lý chuyển trang ở đây
      }
    }
  }
}
