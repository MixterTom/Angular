import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  template: `
    <button 
      [class]="'neu-button px-6 py-3 transition-all ' + customClass()"
      [disabled]="disabled()"
      (click)="onClick.emit($event)">
      
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
  icon = input<string>('');
  disabled = input<boolean>(false);
  customClass = input<string>(''); // Dùng để truyền màu sắc, padding...

  // Sự kiện (Events) để Engine bắt và thực thi logic (như chuyển trang, gọi API)
  onClick = output<MouseEvent>();
}
