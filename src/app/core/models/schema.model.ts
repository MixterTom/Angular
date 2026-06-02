export interface NodeProperties {
  [key: string]: any;
}

export interface NodeStyles {
  [key: string]: any;
}

export interface NodeEvent {
  type: 'EXECUTE_JS' | 'CALL_API' | 'NAVIGATE';
  code?: string; // Dành riêng cho EXECUTE_JS (chuỗi mã Javascript)
  url?: string;  // Dành riêng cho API hoặc Navigate
  [key: string]: any;
}

export interface ComponentNode {
  id: string;
  type: string;
  properties?: NodeProperties;
  styles?: NodeStyles;
  events?: Record<string, NodeEvent[]>; // Ví dụ: { "onClick": [...] }
  children?: ComponentNode[];
}
