import fs from 'fs'

export const readfile = async (fetchUrl: string): Promise<any> => {
  return await new Promise((resolve: any, reject: any) => {
    fs.readFile(fetchUrl, (err: any, json: any) => {
      if (err) {
        reject(err)
      } else {
        const data = JSON.parse(json)
        resolve(data)
      }
    })
  })
}
