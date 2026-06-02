import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  template: `
    <button 
      [type]="buttonType()"
      [class]="'neu-button px-6 py-3 transition-all ' + customClass()"
      [disabled]="disabled()"
      (click)="handleClick($event)">
      
      @if(icon()) { 
        <span class="mr-2">{{ icon() }}</span> 
      }
      {{ label() }}
      
    </button>
  `
})
export class UiButtonComponent {
  /**
   * TRONG LOW-CODE: 
   * Component KHÔNG tự gọi API, KHÔNG chứa logic nghiệp vụ.
   * Nó là một "Dumb Component" (Thành phần ngốc nghếch).
   * Mọi thứ đều được truyền vào từ bên ngoài (thông qua JSON properties).
   */
  
  // Các thuộc tính (Properties) mà Property Panel sẽ chỉnh sửa
  label = input<string>('Nút mặc định');
  buttonType = input<string>('button'); // e.g., 'button', 'submit', 'reset'
  icon = input<string>('');
  disabled = input<boolean>(false);
  customClass = input<string>(''); // Dùng để truyền màu sắc, padding...

  // Sự kiện (Events) để Engine bắt và thực thi logic (được truyền từ NodeRenderer)
  onEvent = input<(eventName: string, payload?: any) => void>();

  handleClick(event: MouseEvent) {
    // Nếu Engine có truyền hàm xử lý sự kiện vào, thì gọi nó và báo là 'onClick'
    if (this.onEvent()) {
      this.onEvent()!('onClick', event);
    }
  }
}
