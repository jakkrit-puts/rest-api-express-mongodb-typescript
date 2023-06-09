import fs from "fs";
import path from "path";
import { promisify } from "util";
import dayjs from "dayjs";

const writeFileAsync = promisify(fs.writeFile);

// path, image
const uploadImageBase64 = async (baseImage: string, pathImg: string) => {
  const projectPath = path.resolve("./src/");
  const uploadPath = `${projectPath}/public/upload/images/${pathImg}/`;
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );
  const day = dayjs().format("YYYYMMDDHHmmss");

  let filename = "";
  if (ext === "svg+xml") {
    filename = `${day}.svg`;
  } else {
    filename = `${day}.${ext}`;
  }

  let image = decodeBase64Image(baseImage);

  await writeFileAsync(uploadPath + filename, image.data, "base64");

  return filename;
};

const decodeBase64Image = (base64Str: string) => {
  interface Image {
    type: string;
    data: string;
  }

  let matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let image: Image = {
    type: "",
    data: "",
  };

  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
};

export default uploadImageBase64;
