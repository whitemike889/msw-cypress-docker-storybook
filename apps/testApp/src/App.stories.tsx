import {bannerMobile} from '@aislinn/assets';
import type {Meta, StoryObj} from '@storybook/react';
import {http, HttpResponse} from 'msw';

import {App} from './App';

type Story = StoryObj<typeof App>;

const meta: Meta<typeof App> = {
  component: App,
};

export default meta;

export const AppWithMockedImage: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/mockThisUrl', async () => {
          const image = await fetch(bannerMobile).then(res => res.arrayBuffer());
          return HttpResponse.arrayBuffer(image, {
            headers: {
              'Content-Type': 'image/jpeg',
              'Content-Length': image.byteLength.toString(),
            },
          });
        }),
      ],
    },
  },
};
