import type { Meta, StoryObj } from '@storybook/angular';
import { LoadingService } from '../../services/loading.service';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgLoadingOverlayComponent } from './ng-loading-overlay.component';

const meta: Meta<NgLoadingOverlayComponent> = {
  title: 'Feedback/Loading Overlay',
  component: NgLoadingOverlayComponent,
  tags: ['autodocs'],
  decorators: [
    (story) => {
      const loadingService = new LoadingService();
      loadingService.show({
        key: 'storybook',
        label: 'Fetching dashboard data',
        variant: 'dots',
        color: 'success',
        size: 'lg',
        overlay: true,
      });

      return {
        ...story(),
        applicationConfig: {
          providers: [{ provide: LoadingService, useValue: loadingService }],
        },
        moduleMetadata: {
          imports: [SharedControlsModule],
        },
      };
    },
  ],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    spinnerKey: 'storybook',
    fullscreen: true,
  },
};

export default meta;

type Story = StoryObj<NgLoadingOverlayComponent>;

export const Default: Story = {};
