import { ReactNode } from 'react';

export type TModalUIProps = {
  title: string;
  titleStyle: string;
  onClose: () => void;
  children?: ReactNode;
};
