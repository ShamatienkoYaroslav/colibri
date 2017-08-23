import { Auth, dialog } from '../../utils';

export const deleteUser = (context, id, name, isList = true) => {
  dialog.showQuestionDialog(
    `Do you want to delete the user <strong>${name}</strong>?`,
    async () => {
      await context.props.deleteUser(id);
      if (isList) {
        context.setState({ activeRow: null });
      } else {
        context.goBack();
      }
    },
  );
};

export const getRoles = () => (Auth.getRoles());
