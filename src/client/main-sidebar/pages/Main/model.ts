import { z } from 'zod';
import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';
import { enqueueSnackbar } from 'notistack';
import { pdfToSlidesPostSchema } from 'functions/src/routes/pdfToSlides/schema';

import { api } from '../../api';
import { serverFunctions } from '../../../utils';

export class MainModel {
  private static readonly DEFAULT_FORM_VALUES = {
    file: new File([], ''),
  };

  private static _formValues: z.infer<typeof pdfToSlidesPostSchema> =
    MainModel.DEFAULT_FORM_VALUES;

  constructor() {
    makeAutoObservable(this);
  }

  get formValues() {
    return MainModel._formValues;
  }

  set formValues(values) {
    MainModel._formValues = values;
  }

  resetFormValue() {
    MainModel._formValues = MainModel.DEFAULT_FORM_VALUES;
  }

  async process(form: z.infer<typeof pdfToSlidesPostSchema>) {
    const slides = await api.pdfToSlides
      .$post({
        form,
      })
      .then((response) => response.json())
      .then(({ slides }) => slides)
      .catch(() => null);

    if (!slides) {
      enqueueSnackbar({
        variant: 'error',
        message: 'An error occurred while processing the file',
      });

      return;
    }

    await serverFunctions.fillSlides(slides);

    enqueueSnackbar({
      variant: 'success',
      message: 'Slides generated',
    });
  }
}

const MainModelContext = createContext(new MainModel());
export const MainModelProvider = MainModelContext.Provider;

export const useMainModel = () => useContext(MainModelContext);
