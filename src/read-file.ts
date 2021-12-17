
import { readFile as fsReadFile } from 'fs';


/**
 * For some reason util.promisify is not working
 * properly with TypeScript, therefore this function.
 */
export function readFile(path: string): Promise<string> {

  return new Promise((resolve, reject) => {

    fsReadFile(path, 'utf-8', (error, result) => {
      if (error) {
        reject(error);

      } else {
        resolve(result);

      }
    });

  });

}
