import { Component, Input, OnInit, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ComponentNode } from '../models/schema.model';
import { COMPONENT_REGISTRY } from './registry';

@Component({
  selector: 'app-node-renderer',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `
    @if (componentClass) {
      <ng-container *ngComponentOutlet="componentClass; inputs: componentInputs"></ng-container>
    } @else {
      <div class="p-4 border-2 border-red-500 border-dashed text-red-500 font-bold rounded-xl bg-red-50">
        Khối [{{ node.type }}] chưa được đăng ký!
      </div>
    }
  `
})
export class NodeRendererComponent implements OnInit {
  @Input({ required: true }) node!: ComponentNode;
  
  componentClass: Type<any> | null = null;
  componentInputs: Record<string, unknown> = {};

  ngOnInit() {
    this.componentClass = COMPONENT_REGISTRY[this.node.type] || null;
    
    // Gom tất cả properties và styles thành Inputs cho Component
    this.componentInputs = {
      ...(this.node.properties || {}),
      ...(this.node.styles || {}),
      childrenNodes: this.node.children || [] // Dành riêng cho Container
    };
  }
}
