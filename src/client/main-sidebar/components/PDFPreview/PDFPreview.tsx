import { clsx } from 'clsx';
import { ComponentProps } from 'react';
import PdfViewer from '@duallab/verapdf-js-viewer';

import styles from './PDFPreview.module.css';

export const PDFPreview = ({
  className,
  ...restProps
}: ComponentProps<typeof PdfViewer>) => {
  return <PdfViewer className={clsx(styles.root, className)} {...restProps} />;
};
