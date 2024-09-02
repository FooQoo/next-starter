import React, { memo } from 'react';
import twemoji from 'twemoji';

const Twemoji = ({ emoji }: { emoji: string }) => (
  <span
    dangerouslySetInnerHTML={{
      __html: twemoji.parse(emoji, {
        folder: 'svg',
        ext: '.svg',
        base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/',
      }),
    }}
  />
);

export default memo(Twemoji);
