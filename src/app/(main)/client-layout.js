// src/app/(main)/client-layout.js
'use client';
import ReduxProvider from '@/components/ReduxProvider';

export default function ClientLayout({ children }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
