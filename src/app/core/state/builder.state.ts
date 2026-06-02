import { Injectable, signal, computed } from '@angular/core';
import { ComponentNode } from '../models/schema.model';

@Injectable({
  providedIn: 'root'
})
export class BuilderStateService {
  // Toàn bộ cấu hình giao diện
  readonly schema = signal<ComponentNode | null>(null);
  
  // Lưu trữ ID của node đang được chọn trên màn hình
  readonly selectedNodeId = signal<string | null>(null);

  // Chế độ xem trước (Preview Mode)
  readonly previewMode = signal<boolean>(false);

  // Bộ nhớ RAM toàn cục (Global Context) - lưu trữ dữ liệu từ API, User...
  readonly globalContext = signal<Record<string, any>>({
    user: { name: 'Admin Tối Cao', role: 'Developer' },
    apiData: { totalUsers: 999, status: 'Active' }
  });

  // Tính toán Node đang được chọn bằng cách duyệt tìm từ schema
  readonly selectedNode = computed(() => {
    const id = this.selectedNodeId();
    const root = this.schema();
    if (!id || !root) return null;
    return this.findNodeById(root, id);
  });

  setSchema(newSchema: ComponentNode) {
    this.schema.set(newSchema);
  }

  selectNode(id: string) {
    this.selectedNodeId.set(id);
  }

  // Cập nhật cấu hình của một node (Properties, Styles, Events)
  updateNodeData(nodeId: string, section: 'properties' | 'styles' | 'events', key: string, value: any) {
    const root = this.schema();
    if (!root) return;
    
    const newSchema = JSON.parse(JSON.stringify(root)); 
    const targetNode = this.findNodeById(newSchema, nodeId);
    
    if (targetNode) {
      if (!targetNode[section]) targetNode[section] = {};
      targetNode[section]![key] = value;
      this.schema.set(newSchema); 
    }
  }

  // Hàm cũ giữ lại để tương thích ngược tạm thời
  updateNodeProperty(nodeId: string, key: string, value: any) {
    this.updateNodeData(nodeId, 'properties', key, value);
  }

  // Hàm đệ quy tìm Node theo ID
  private findNodeById(node: ComponentNode, id: string): ComponentNode | null {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = this.findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  // THÊM COMPONENT MỚI VÀO CÂY
  addComponentNode(type: string, parentId?: string) {
    const root = this.schema();
    if (!root) return;

    const newSchema = JSON.parse(JSON.stringify(root));
    const targetParent = parentId ? this.findNodeById(newSchema, parentId) : newSchema;

    if (!targetParent) return;

    // Khởi tạo Component mặc định dựa trên loại (Type)
    const newNode: ComponentNode = {
      id: `${type.toLowerCase()}_${Date.now()}`,
      type: type,
      properties: {},
      styles: {}
    };

    // Đổ dữ liệu mặc định để người dùng dễ nhìn
    if (type === 'Button') {
      newNode.properties = { label: 'Nút mới' };
      newNode.styles = { customClass: 'bg-gray-200 px-4 py-2 rounded' };
    } else if (type === 'TextInput') {
      newNode.properties = { label: 'Nhãn mới', placeholder: 'Nhập nội dung...' };
    } else if (type === 'Container') {
      newNode.children = [];
      newNode.styles = { direction: 'column', customClass: 'border-2 border-dashed border-gray-300 min-h-[100px] p-4' };
    }

    if (!targetParent.children) targetParent.children = [];
    targetParent.children.push(newNode);

    this.schema.set(newSchema);
    
    // Tự động focus vào Component vừa tạo
    this.selectNode(newNode.id);
  }

  // --- PREVIEW MODE ---
  togglePreviewMode() {
    this.previewMode.set(!this.previewMode());
    if (this.previewMode()) {
      this.selectNode(''); // Tắt chọn khi vào chế độ Preview
    }
  }

  // --- XOÁ NODE ---
  deleteNode(nodeId: string) {
    if (nodeId === 'root_page') return; // Không cho phép xoá gốc
    
    const root = this.schema();
    if (!root) return;

    const newSchema = JSON.parse(JSON.stringify(root));
    const parent = this.findParentOfNode(newSchema, nodeId);
    
    if (parent && parent.children) {
      parent.children = parent.children.filter(c => c.id !== nodeId);
      this.schema.set(newSchema);
      this.selectNode('');
    }
  }

  private findParentOfNode(node: ComponentNode, childId: string): ComponentNode | null {
    if (!node.children) return null;
    for (const child of node.children) {
      if (child.id === childId) return node;
      const found = this.findParentOfNode(child, childId);
      if (found) return found;
    }
    return null;
  }
}
