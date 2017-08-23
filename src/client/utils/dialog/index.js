import swal from 'sweetalert2';

import constants from '../../constants';

export const showError = (table, redirect = null) => {
  const e = table.e;
  if (e) {
    for (let i = 0; i < e.length; i += 1) {
      swal({
        title: 'Opps...',
        text: e[i].toString(),
        type: 'error',
        confirmButtonColor: constants.BRAND_COLOR,
        preConfirm: () => (
          new Promise((resolve) => {
            if (redirect) {
              redirect();
            }
            resolve();
          })
        ),
      });
    }
    return e.length !== 0;
  }
  return false;
};

export const showQuestionDialog = (html, fn) => {
  swal({
    html,
    type: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    confirmButtonColor: constants.BRAND_COLOR,
    showLoaderOnConfirm: true,
    useRejections: false,
    preConfirm: () => (
      new Promise((resolve) => {
        fn();
        resolve();
      })
    ),
  });
};

export const showOnCloseDialog = (fn) => {
  showQuestionDialog(
    'The data was modified. Drop the changes and close?',
    fn,
  );
};

export const showConfirmedAsyncDialog = (firstStepHtml, secondStepHtml, fn) => {
  let confirmed = false;
  swal({
    html: firstStepHtml,
    type: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    confirmButtonColor: constants.BRAND_COLOR,
    showLoaderOnConfirm: true,
    useRejections: false,
    preConfirm: () => (
      new Promise(async (resolve) => {
        await fn();
        confirmed = true;
        resolve();
      })
    ),
  })
  .then(() => {
    if (confirmed) {
      swal({
        html: secondStepHtml,
        type: 'success',
        confirmButtonColor: constants.BRAND_COLOR,
      });
    }
  });
};
