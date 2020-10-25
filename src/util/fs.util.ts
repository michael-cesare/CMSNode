import fs from 'fs';

export const readfile = async (fetchUrl: string, onSuccess: any, onError: any): Promise<void> => {
  const action = async () => fs.readFile(fetchUrl, (err: any, json: any) => {
    if (err) {
      onError(err);
    }

    const data = JSON.parse(json);
    onSuccess(data);
  });

  return await action();
}
