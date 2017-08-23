import { ImagesApi, dialog } from '../../utils';

export const deleteImage = (context, id, name, tag, isList = true) => {
  dialog.showQuestionDialog(
    `Do you want to delete the image <strong>${name}:${tag}</strong>?`,
    async () => {
      await context.props.deleteImage(id);
      if (isList) {
        context.setState({ activeRow: null });
      } else {
        context.goBack();
      }
    },
  );
};

export const pullImage = (context, id, name, tag, isList = true) => {
  dialog.showConfirmedAsyncDialog(
    `Do you want to pull the image <strong>${name}:${tag}</strong>?`,
    `The image <strong>${name}:${tag}</strong> was pulled.`,
    async () => {
      try {
        const pullResp = await ImagesApi.pullImage(id);
        if (pullResp.success && !isList) {
          const infoResp = await ImagesApi.getInfo(id);
          if (infoResp.messages.length !== 0) {
            console.log('ERROR_PULL_IMAGE_GET_INFO', infoResp.messages);
          } else {
            context.info = infoResp.info;
            context.forceUpdate();
          }
        }
      } catch (e) {
        console.log('ERROR_PULL_IMAGE', e); 
      }
    },
  );
};
