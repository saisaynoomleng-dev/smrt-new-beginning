import localFont from 'next/font/local';

export const roboto = localFont({
  src: [
    {
      path: '../src/app/fonts/Roboto-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../src/app/fonts/Roboto-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../src/app/fonts/Roboto-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../src/app/fonts/Roboto-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../src/app/fonts/Roboto-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../src/app/fonts/Roboto-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../src/app/fonts/Roboto-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../src/app/fonts/Roboto-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../src/app/fonts/Roboto-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-roboto',
});
