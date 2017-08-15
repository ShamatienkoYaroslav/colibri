import { dialog } from '../../utils';

export const deleteContainer = (context, id, name, isList = true) => {
  dialog.showQuestionDialog(
    `Do you want to delete the container <strong>${name}</strong>?`,
    async () => {
      await context.props.deleteContainer(id);
      if (isList) {
        context.setState({ activeRow: null });
      } else {
        context.goBack();
      }
    },
  );
};

export const startContainer = (context, id, name) => {
  dialog.showConfirmedAsyncDialog(
    `Do you want to start the container <strong>${name}</strong>?`,
    `The container <strong>${name}</strong> was started.`,
    async () => {
      await context.props.startContainer(id);
    },
  );
};

export const stopContainer = (context, id, name) => {
  dialog.showConfirmedAsyncDialog(
    `Do you want to stop the container <strong>${name}</strong>?`,
    `The container <strong>${name}</strong> was stopped.`,
    async () => {
      await context.props.stopContainer(id);
    },
  );
};