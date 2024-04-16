export const componentHTML = `
<!-- @NAME -->
`;
export const componentSCSS = `
`;
export const componentTS = `
import { Component } from '@angular/core';
import { CommonModule, FormsModule } from '@angular/common';

@Component({
  selector: '@PREFIX-@NAME',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './@NAME.component.html'
})
export class @NAME__CAPITALComponent {}
`;
/**
 * 组件文档
 * @type {string}
 */
export const componentStory = `import type { Meta, StoryObj } from '@storybook/angular';
import {@NAME__CAPITALComponent} from './@NAME.component';

const meta: Meta<@NAME__CAPITALComponent> = {
  component: @NAME__CAPITALComponent,
  title: '组件/@NAME',
  argTypes: {}
};
export default meta;
type Story = StoryObj<@NAME__CAPITALComponent>;

export const Primary: Story = {
  name: '',
  parameters: {},
  args: {}
};
`;
