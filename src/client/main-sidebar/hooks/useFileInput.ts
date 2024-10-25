import { RefObject, useEffect, useId, useRef } from 'react';

export interface UseFileInputOptions
  extends Omit<
    Partial<HTMLInputElement>,
    'id' | 'accept' | 'onchange' | 'children'
  > {
  /**
   * Accepted file extensions to choose
   */
  accept?: string[] | string;
  /**
   * File selection change handler
   */
  onChange?: (files: File[]) => void;
  /**
   * Handler for the presence of files that satisfy the `accept` condition
   */
  onAcceptReject?: (notAcceptedFiles: File[]) => unknown;
}

export interface UseFileInput {
  fileInputId: string;
  fileInputRef: RefObject<HTMLInputElement>;
}

export const useFileInput = ({
  onChange,
  onAcceptReject,
  ...options
}: UseFileInputOptions): UseFileInput => {
  const { accept } = options;

  const fileInputId = useId();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearInput = (): void => {
    const input = fileInputRef.current;

    if (!input) {
      return;
    }

    input.value = '';
  };

  const filterFiles = (files: FileList): File[] => {
    if (!accept) {
      return [...files];
    }

    return [...files].filter((file) => {
      const [, extension] = file.type.split('/');

      return accept.includes(extension);
    });
  };

  const changeHandler = (event: Event): void => {
    event.preventDefault();

    const currentTarget = event.currentTarget as HTMLInputElement;
    const files =
      currentTarget.files || (event as DragEvent).dataTransfer?.files;

    if (!files) {
      return;
    }

    const filteredFiles = filterFiles(files);

    if (files.length !== filteredFiles.length) {
      const initialFiles = [...files];
      const notAcceptedFiles = initialFiles.filter(
        (file) => !filteredFiles.includes(file)
      );
      onAcceptReject?.(notAcceptedFiles);
    }

    clearInput();

    onChange?.(filteredFiles);
  };

  useEffect(() => {
    const input = fileInputRef.current;

    if (!input) {
      return;
    }

    const acceptSerialized = Array.isArray(accept)
      ? accept.map((type) => `.${type}`).join(', ')
      : accept;

    Object.assign(input, {
      id: fileInputId,
      ...options,
    });

    input.type = 'file';
    input.onchange = changeHandler;

    if (acceptSerialized) {
      input.accept = acceptSerialized;
    }
  }, [fileInputId, options]);

  return {
    fileInputId,
    fileInputRef,
  };
};
