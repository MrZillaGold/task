import { clsx } from 'clsx';
import { JSX, ReactNode } from 'react';
import { Button, ButtonProps, Typography } from '@mui/material';

import { theme } from '../theme';
import { useFileInput, UseFileInputOptions } from '../../hooks';

import styles from './FileInput.module.css';

export interface FileInputProps
  extends UseFileInputOptions,
    Pick<ButtonProps, 'color' | 'startIcon'> {
  children?: ReactNode;
  outline?: boolean;
}

export const FileInput = ({
  color,
  startIcon,
  outline,
  children,
  ...restProps
}: FileInputProps): JSX.Element => {
  const { disabled } = restProps;
  const { fileInputId, fileInputRef } = useFileInput(restProps);

  return (
    <Button
      color={color}
      sx={{
        color: !color ? theme.palette.text.primary : undefined,
      }}
      classes={{
        root: clsx(styles.root, outline && styles.rootOutline),
      }}
      component="label"
      data-for={fileInputId}
      htmlFor={fileInputId}
      variant="outlined"
      startIcon={
        startIcon && (
          <Typography
            classes={{
              root: styles.icon,
            }}
            variant="h6"
            component="h6"
          >
            {startIcon}
          </Typography>
        )
      }
      disabled={disabled}
      fullWidth
    >
      <Typography
        classes={{
          root: styles.text,
        }}
        variant="h6"
        component="h6"
      >
        {children}
        <input
          ref={fileInputRef}
          className={styles.input}
          tabIndex={-1}
          aria-hidden
        />
      </Typography>
    </Button>
  );
};
