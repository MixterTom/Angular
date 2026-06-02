import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-text-input',
  standalone: true,
  template: `
    <div class="flex flex-col mb-4 w-full">
      @if (label()) {
        <label class="mb-2 text-sm font-bold text-gray-700">{{ label() }}</label>
      }
      <input
        [type]="inputType()"
        [placeholder]="placeholder()"
        [value]="value()"
        [disabled]="disabled()"
        [required]="required()"
        (input)="onInput($event)"
        [class]="'neu-pressed px-4 py-3 outline-none text-gray-800 transition-all focus:ring-2 focus:ring-primary-color w-full ' + customClass()"
      />
    </div>
  `
})
export class TextInputComponent {
  label = input<string>('');
  inputType = input<string>('text');
  placeholder = input<string>('Nhập dữ liệu...');
  value = input<string>('');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  customClass = input<string>('');

  onChange = output<string>();

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onChange.emit(target.value);
  }
}
