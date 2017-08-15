import swal from 'sweetalert2';

export const showQuestionDialog = (html, fn) => {
  swal({
    html,
    type: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    confirmButtonColor: '#EA5455',
    showLoaderOnConfirm: true,
    useRejections: false,
    preConfirm: () => (
      new Promise((resolve) => {
        fn();
        resolve();
      })
    ),
  });
}

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
    confirmButtonColor: '#EA5455',
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
        confirmButtonColor: '#EA5455',
      });
    }
  });
}