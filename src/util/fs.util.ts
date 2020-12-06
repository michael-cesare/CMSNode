import fs from 'fs';

export const readfile = async (fetchUrl: string, onSuccess: any, onError: any): Promise<void> => {
  const action = async () => {
    try {
      fs.readFile(fetchUrl, (err: any, json: any) => {
        if (err) {
          onError(err);
        } else {
          const data = JSON.parse(json);
          onSuccess(data);
        }
      });
    } catch (e) {
      onError(e);
    }
  }

  return await action();
}
