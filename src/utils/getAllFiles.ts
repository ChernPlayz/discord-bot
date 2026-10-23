import fs from "fs";
import path from "path";

export default (directory: string, foldersOnly: boolean = false): string[] => {
  const fileNames: string[] = [];

  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directory, file.name);

    if (foldersOnly) {
      // Look for folders only inside the directory
      if (file.isDirectory()) {
        fileNames.push(filePath);
      }
    } else {
      // Look for files only inside the directory
      if (file.isFile()) {
        fileNames.push(filePath);
      }
    }
  }

  return fileNames;
}