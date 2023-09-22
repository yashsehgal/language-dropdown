import { ReactNode } from 'react';

declare interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'Solid' | 'Outline';
  leadingIcon?: ReactNode;
}
