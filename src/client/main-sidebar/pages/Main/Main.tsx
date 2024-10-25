import { z } from 'zod';
import { JSX } from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { pdfToSlidesPostSchema } from 'functions/src/routes/pdfToSlides/schema';
import LoadingButton from '@mui/lab/LoadingButton';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

import { FileInput, PDFPreview } from '../../components';

import { useMainModel } from './model';

import styles from './Main.module.css';

export const Main = (): JSX.Element => {
  const model = useMainModel();

  const form = useForm<
    z.infer<typeof pdfToSlidesPostSchema>,
    ReturnType<typeof zodValidator>
  >({
    onSubmit: ({ value }) => model.process(value),
    defaultValues: model.formValues,
    validatorAdapter: zodValidator(),
  });

  return (
    <Container maxWidth="sm">
      <Box>
        <Typography className={styles.header} variant="h4" component="h1">
          PDF to Slides
        </Typography>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            form.handleSubmit();
          }}
          onChange={() => {
            model.formValues = form.state.values;
          }}
        >
          <form.Field
            name="file"
            validators={{
              onChangeAsync: pdfToSlidesPostSchema.shape.file,
            }}
          >
            {(field) => {
              const hasErrors = Boolean(field.state.meta.errors.length);
              const hasValidPreview = Boolean(
                !hasErrors &&
                  (!field.state.meta.isValidating ||
                    field.form.state.isSubmitting) &&
                  field.state.value.size
              );
              const needUpload = !hasErrors && !hasValidPreview;

              return (
                <FileInput
                  accept={['pdf']}
                  color={hasErrors ? 'error' : 'primary'}
                  startIcon={needUpload && <FileUploadOutlinedIcon />}
                  outline={needUpload}
                  disabled={field.form.state.isSubmitting}
                  onChange={([file]) => {
                    if (!file) {
                      return;
                    }

                    field.handleChange(file);
                  }}
                >
                  {String(field.state.meta.errors) ||
                    (hasValidPreview && (
                      <>
                        <PDFPreview
                          page={1}
                          width={60}
                          height={60}
                          loading={<CircularProgress size="1em" />}
                          bboxes={[
                            {
                              page: 1,
                              location: '',
                            },
                          ]}
                          file={field.state.value}
                          isTreeBboxesVisible={false}
                          onSelectBbox={() => {}}
                        />
                        {field.state.value?.name}
                      </>
                    )) ||
                    'Upload PDF'}
                </FileInput>
              );
            }}
          </form.Field>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <LoadingButton
                type="submit"
                classes={{
                  root: styles.generateButton,
                }}
                startIcon={<AutoAwesomeIcon />}
                variant="contained"
                disabled={!canSubmit}
                loading={isSubmitting}
                loadingPosition="start"
                fullWidth
              >
                {isSubmitting ? 'Generating' : 'Generate Slide Deck'}
              </LoadingButton>
            )}
          </form.Subscribe>
        </form>
      </Box>
    </Container>
  );
};

export * from './model';
