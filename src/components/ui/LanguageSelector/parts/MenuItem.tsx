import { type ComponentProps, forwardRef } from 'react';

export type LanguageSelectorMenuItemProps = ComponentProps<'a'> & {
  isCurrent?: boolean;
  isCondensed?: boolean;
};

export const LanguageSelectorMenuItem = forwardRef<
  HTMLAnchorElement,
  LanguageSelectorMenuItemProps
>((props, ref) => {
  const { children, className, isCurrent, isCondensed, ...rest } = props;

  return (
    <li>
      <a
        aria-current={isCurrent}
        className={`
          group/menu-item relative flex min-h-11 items-center gap-x-2 text-nowrap px-4 py-2.5 text-dns-16N-130 text-solid-gray-800
          hover:bg-solid-gray-50 hover:underline hover:underline-offset-[calc(3/16*1rem)]
          focus-visible:bg-yellow-300 focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-black focus-visible:ring-[calc(6/16*1rem)] focus-visible:ring-inset focus-visible:ring-yellow-300
          data-[condensed]:min-h-9 data-[current]:bg-blue-100 data-[condensed]:py-1.5 data-[condensed]:text-dns-16N-120 data-[current]:font-bold data-[current]:text-blue-1000 data-[current]:hover:bg-blue-50 data-[current]:hover:text-blue-900
          ${className ?? ''}
        `}
        data-current={isCurrent || undefined}
        data-condensed={isCondensed || undefined}
        ref={ref}
        {...rest}
      >
        {children}
      </a>
    </li>
  );
});

LanguageSelectorMenuItem.displayName = 'LanguageSelectorMenuItem';
