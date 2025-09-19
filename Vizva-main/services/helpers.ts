import { ethers } from "ethers";
import { string } from "zod";

// Fetch url from ipfs TokenURI and return image url
export async function getImageUrlFromTokenURI(url: string) {
  try {
    let response = await fetch(url);
    let responseJson = await response.json();
    return responseJson.image;
  } catch (error) {
    console.error(error);
  }
}

// Check if the string passed is valid URL. Returns true if it is valid
export function isUrl(string: string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export const stringToTime = (stringTime: string) => {
  try {
    const timeArray = stringTime.split(" ");
    var newDate = new Date();
    if (timeArray[1] == "days") {
      newDate.setDate(newDate.getDate() + parseInt(timeArray[0]));
      return newDate;
    } else if (timeArray[1] == "week") {
      newDate.setDate(newDate.getDate() + parseInt(timeArray[0]) * 7);
      return newDate;
    } else if (timeArray[1] == "month") {
      newDate.setMonth(newDate.getMonth() + parseInt(timeArray[0]));
      return newDate;
    } else if (timeArray[1] == "year") {
      newDate.setFullYear(newDate.getFullYear() + parseInt(timeArray[0]));
      return newDate;
    } else {
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const sizeToObject = (sizeString: string) => {
  try {
    const sizeArray = sizeString.split(" x ");
    return {
      width: parseInt(sizeArray[0]),
      height: parseInt(sizeArray[1]),
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const validateEmail = (email: string) => {
  return string().email().safeParse(email).success;
  // return String(email)
  //     .toLowerCase()
  //     .match(
  //         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  //     );
};

export const validateAddress = (address: string) => {
  return ethers.utils.isAddress(address);
};

export const validateInviteCode = (code: string) => {
  return String(code).match(/^[A-Za-z0-9_-]*$/);
};

type uploadProps = {
  file: File;
  folder: "nft" | "avatar" | "cover";
  media: "image" | "video";
};

export async function uploadToCloudinary({ file, folder, media }: uploadProps) {
  const signature = await fetch(`/api/sign?folder=${folder}`, { method: "GET" })
    .then((res) => res.json())
    .catch((err) => console.log(err));

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", process.env.CLOUDINARY_KEY as string);
  formData.append("timestamp", signature.timestamp);
  formData.append("signature", signature.signature);
  formData.append("eager", "c_pad,h_300,w_400|c_crop,h_200,w_260");
  signature.folder && formData.append("folder", signature.folder);

  const res: string = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/${media}/upload`,
    {
      method: "POST",
      body: formData,
    }
  )
    .then((res) => res.json())
    .then((res) => res);
  return res;
}
