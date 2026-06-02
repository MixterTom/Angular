export interface NodeProperties {
  [key: string]: any;
}

export interface NodeStyles {
  [key: string]: any;
}

export interface NodeEvent {
  action: string;
  [key: string]: any;
}

export interface ComponentNode {
  id: string;
  type: string;
  properties?: NodeProperties;
  styles?: NodeStyles;
  events?: Record<string, NodeEvent[]>;
  children?: ComponentNode[];
}
