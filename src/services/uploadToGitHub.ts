import axios from "axios";

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN;
const OWNER = process.env.EXPO_PUBLIC_OWNER;
const REPO = process.env.EXPO_PUBLIC_REPO;

console.log(GITHUB_TOKEN)

export const uploadImageToGitHub = async (
  transactionId: string,
  imageUri: string,
  imageName: string
) => {
  try {
    const imageBase64 = await fetch(imageUri)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

    const content = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await axios.put(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/transaction/${transactionId}/${imageName}.jpg`,
      {
        message: `Upload payment proof for transaction ${transactionId}`,
        content: content,
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
