import { Type } from '@angular/core';
import { UiButtonComponent } from '../../shared/ui/button/button.component';
import { TextInputComponent } from '../../shared/ui/text-input/text-input.component';
import { ContainerComponent } from '../../shared/ui/container/container.component';

export function getComponentRegistry(): Record<string, Type<any>> {
  return {
    'Button': UiButtonComponent,
    'TextInput': TextInputComponent,
    'Container': ContainerComponent
  };
}
