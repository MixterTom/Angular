import { Component, inject, signal, computed } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { BuilderStateService } from '../../core/state/builder.state';

@Component({
  selector: 'app-property-panel',
  standalone: true,
  imports: [UpperCasePipe],
  template: `
    <div class="h-full flex flex-col bg-white border-l border-gray-200">
      
      <!-- Panel Header -->
      <div class="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
          Inspect
          @if (selectedNode() && selectedNode()!.id !== 'root_page') {
            <button (click)="deleteSelectedNode()" class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors" title="Xoá Component này">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          }
        </h2>
        @if (selectedNode()) {
          <span class="text-[10px] font-bold text-primary-color bg-teal-50 px-2 py-1 rounded border border-teal-100">
            {{ selectedNode()!.type }}
          </span>
        }
      </div>

      @if (selectedNode()) {
        <!-- Tabs -->
        <div class="flex border-b border-gray-200 text-xs font-semibold bg-gray-50">
          <button class="flex-1 py-3 transition-colors border-b-2"
                  [class.border-primary-color]="activeTab() === 'properties'"
                  [class.text-primary-color]="activeTab() === 'properties'"
                  [class.border-transparent]="activeTab() !== 'properties'"
                  [class.text-gray-500]="activeTab() !== 'properties'"
                  (click)="activeTab.set('properties')">
            Properties
          </button>
          <button class="flex-1 py-3 transition-colors border-b-2"
                  [class.border-primary-color]="activeTab() === 'styles'"
                  [class.text-primary-color]="activeTab() === 'styles'"
                  [class.border-transparent]="activeTab() !== 'styles'"
                  [class.text-gray-500]="activeTab() !== 'styles'"
                  (click)="activeTab.set('styles')">
            Styles
          </button>
          <button class="flex-1 py-3 transition-colors border-b-2"
                  [class.border-primary-color]="activeTab() === 'events'"
                  [class.text-primary-color]="activeTab() === 'events'"
                  [class.border-transparent]="activeTab() !== 'events'"
                  [class.text-gray-500]="activeTab() !== 'events'"
                  (click)="activeTab.set('events')">
            Logic (JS/API)
          </button>
        </div>

        <!-- Node ID Information -->
        <div class="p-4 border-b border-gray-100 bg-gray-50/50">
          <div class="flex flex-col">
            <label class="text-[10px] font-bold text-gray-400 uppercase mb-1">Node ID</label>
            <input type="text" readonly [value]="selectedNode()!.id" 
                   class="bg-transparent text-xs font-mono text-gray-700 outline-none w-full">
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-4" (click)="pickerState.set(null)">
          
          <!-- Properties Tab -->
          @if (activeTab() === 'properties') {
            @for (field of getPropertiesSchema(); track field.key) {
              <div class="flex flex-col mb-4">
                <div class="flex items-center justify-between mb-1.5">
                  <label class="text-xs font-semibold text-gray-700">{{ field.label }}</label>
                  
                  @if (field.supportsBinding) {
                    <span class="text-[9px] font-bold text-orange-500 bg-orange-50 px-1 rounded cursor-help" title="Hỗ trợ viết JS bằng ngoặc kép {{'{{ }}'}}">
                      {{'{{ JS }}'}}
                    </span>
                  }
                </div>
                
                <!-- Hiển thị Checkbox -->
                @if (field.type === 'boolean') {
                  <label class="flex items-center cursor-pointer mt-1">
                    <input type="checkbox" 
                           [checked]="getValue('properties', field.key) || false"
                           (change)="updateValue('properties', field.key, $any($event.target).checked)"
                           class="w-4 h-4 text-primary-color bg-gray-100 border-gray-300 rounded focus:ring-primary-color">
                    <span class="ml-2 text-xs font-medium text-gray-600">Bật tính năng này</span>
                  </label>
                } 
                <!-- Hiển thị Dropdown (Select) -->
                @else if (field.type === 'select') {
                  <select 
                         [value]="getValue('properties', field.key) || field.options[0]"
                         (change)="updateValue('properties', field.key, $any($event.target).value)"
                         class="w-full text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color outline-none transition-all cursor-pointer">
                    @for (opt of field.options; track opt) {
                      <option [value]="opt">{{ opt | uppercase }}</option>
                    }
                  </select>
                } 
                <!-- Hiển thị Textarea có hỗ trợ Variable Picker -->
                @else {
                  <div class="relative group mt-1">
                    <textarea 
                           [value]="getValue('properties', field.key) || ''"
                           (input)="updateValue('properties', field.key, $any($event.target).value)"
                           rows="2"
                           class="w-full text-xs font-mono text-gray-800 bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color outline-none transition-all resize-y min-h-[50px]"></textarea>
                    
                    @if (field.supportsBinding) {
                      <!-- Nút chèn biến -->
                      <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button (click)="$event.stopPropagation(); togglePicker(field.key)" 
                                class="text-[10px] bg-white border border-gray-300 text-gray-600 px-2 py-1 rounded shadow-sm hover:bg-gray-100 flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                          Chèn Biến Động
                        </button>
                      </div>

                      <!-- Dropdown Picker -->
                      @if (pickerState() === field.key) {
                        <div class="absolute bottom-full right-0 mb-1 bg-white border border-gray-200 shadow-xl rounded-md w-48 z-50 py-1 max-h-48 overflow-y-auto custom-scrollbar">
                          <div class="px-3 py-1.5 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase bg-gray-50">Dữ liệu hệ thống</div>
                          @for (v of availableVariables(); track v) {
                            <button (click)="insertVariable(field.key, v)" 
                                    class="w-full text-left px-3 py-1.5 text-xs font-mono hover:bg-teal-50 hover:text-primary-color transition-colors border-b border-gray-50 last:border-0 truncate"
                                    [title]="v">
                              {{ v }}
                            </button>
                          }
                        </div>
                      }
                    }
                  </div>
                }
              </div>
            }
            @if (getPropertiesSchema().length === 0) {
              <p class="text-xs text-gray-400 italic text-center py-4">Không có Properties nào để cấu hình.</p>
            }
          }

          <!-- Styles Tab -->
          @if (activeTab() === 'styles') {
            @for (style of getKeys('styles'); track style) {
              <div class="flex flex-col">
                <label class="text-xs font-semibold text-gray-700 mb-1.5 capitalize">{{ style }}</label>
                <input type="text" 
                       [value]="getValue('styles', style)"
                       (input)="updateValue('styles', style, $any($event.target).value)"
                       class="w-full text-xs font-mono text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color outline-none transition-all">
              </div>
            }
            @if (getKeys('styles').length === 0) {
              <p class="text-xs text-gray-400 italic text-center py-4">Không có cấu hình Styles.</p>
            }
          }

          <!-- Events Tab (Logic/API) -->
          @if (activeTab() === 'events') {
            <div class="flex flex-col">
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-gray-800">Sự kiện: onClick</label>
                <span class="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  EXECUTE_JS
                </span>
              </div>
              <p class="text-[10px] text-gray-500 mb-2 leading-relaxed">
                Viết Javascript hoặc gọi Fetch API. Mã này chạy khi Component bị click. Bạn có thể gọi <code>fetch('https://api...')</code> hoặc <code>alert()</code>.
              </p>
              
              <textarea 
                     [value]="getEventCode('onClick')"
                     (input)="updateEventCode('onClick', $any($event.target).value)"
                     rows="8"
                     placeholder="Ví dụ:&#10;alert('Nút đã được bấm!');&#10;fetch('https://jsonplaceholder.typicode.com/todos/1').then(res => res.json()).then(data => console.log(data));"
                     class="w-full text-xs font-mono text-blue-900 bg-[#f8faff] border border-blue-200 rounded-md p-3 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-y shadow-inner"></textarea>
            </div>
          }

        </div>
      } @else {
        <!-- Trạng thái trống (Empty State) -->
        <div class="flex flex-col items-center justify-center flex-1 p-6 text-center opacity-70">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
          </div>
          <h3 class="text-sm font-bold text-gray-800 mb-1">Chưa chọn UI nào</h3>
          <p class="text-xs text-gray-500">Bấm vào một khối bên Canvas để xem và chỉnh sửa thuộc tính.</p>
        </div>
      }
    </div>
  `
})
export class PropertyPanelComponent {
  private builderState = inject(BuilderStateService);
  
  selectedNode = this.builderState.selectedNode;
  activeTab = signal<'properties' | 'styles' | 'events'>('properties');
  
  // Quản lý trạng thái Dropdown chọn biến (lưu tên property đang mở picker)
  pickerState = signal<string | null>(null);

  // Schema định nghĩa các Field có thể chỉnh sửa cho từng Component
  readonly componentDefinitions: Record<string, any[]> = {
    'Button': [
      { key: 'label', label: 'Nhãn (Label)', type: 'text', supportsBinding: true },
      { key: 'buttonType', label: 'Loại Nút', type: 'select', options: ['button', 'submit', 'reset'] },
      { key: 'icon', label: 'Icon (Emoji/Text)', type: 'text', supportsBinding: true },
      { key: 'disabled', label: 'Vô hiệu hoá (Disabled)', type: 'boolean' }
    ],
    'TextInput': [
      { key: 'label', label: 'Tiêu đề (Label)', type: 'text', supportsBinding: true },
      { key: 'placeholder', label: 'Placeholder', type: 'text', supportsBinding: true },
      { key: 'required', label: 'Bắt buộc (Required)', type: 'boolean' }
    ],
    'Container': []
  };

  getPropertiesSchema() {
    const node = this.selectedNode();
    if (!node) return [];
    return this.componentDefinitions[node.type] || [];
  }

  // Tính toán danh sách các biến có sẵn từ Global Context
  availableVariables = computed(() => {
    const ctx = this.builderState.globalContext();
    return this.flattenKeys(ctx);
  });

  // Đệ quy lấy danh sách key dạng dot-notation (vd: user.name, apiData.totalUsers)
  private flattenKeys(obj: any, prefix = ''): string[] {
    let keys: string[] = [];
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys = keys.concat(this.flattenKeys(obj[key], prefix + key + '.'));
      } else {
        keys.push(prefix + key);
      }
    }
    return keys;
  }

  togglePicker(prop: string) {
    this.pickerState.update(current => current === prop ? null : prop);
  }

  insertVariable(prop: string, variablePath: string) {
    const currentValue = this.getValue('properties', prop) || '';
    const syntax = `{{ ${variablePath} }}`;
    const newValue = currentValue + ' ' + syntax;
    
    this.updateValue('properties', prop, newValue);
    this.pickerState.set(null); // Đóng picker
  }

  getKeys(section: 'properties' | 'styles'): string[] {
    const node = this.selectedNode();
    if (!node || !node[section]) return [];
    return Object.keys(node[section]!);
  }

  getValue(section: 'properties' | 'styles', key: string): any {
    const node = this.selectedNode();
    if (!node || !node[section]) return '';
    return (node[section] as any)[key];
  }

  isBoolean(val: any): boolean {
    return typeof val === 'boolean';
  }

  updateValue(section: 'properties' | 'styles', key: string, value: any) {
    const nodeId = this.selectedNode()?.id;
    if (nodeId) {
      this.builderState.updateNodeData(nodeId, section, key, value);
    }
  }

  // --- EVENTS HANDLERS ---
  getEventCode(eventName: string): string {
    const node = this.selectedNode();
    if (!node || !node.events || !node.events[eventName]) return '';
    // Lấy thẳng action đầu tiên cho demo đơn giản
    return node.events[eventName][0]?.code || '';
  }

  updateEventCode(eventName: string, code: string) {
    const nodeId = this.selectedNode()?.id;
    if (!nodeId) return;
    
    // Ghi đè sự kiện bằng Action thực thi JS
    const eventObj = [
      { type: 'EXECUTE_JS', code: code }
    ];
    
    this.builderState.updateNodeData(nodeId, 'events', eventName, eventObj);
  }

  deleteSelectedNode() {
    const nodeId = this.selectedNode()?.id;
    if (nodeId) {
      this.builderState.deleteNode(nodeId);
    }
  }
}
