import axios from "axios";

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN;
const OWNER = process.env.EXPO_PUBLIC_OWNER;
const REPO = process.env.EXPO_PUBLIC_REPO;

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

export const getImagesFromGithub = async (transactionId: string) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/transaction/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );

    const images = response.data
      .filter(
        (file: any) =>
          file.name.toLowerCase().endsWith(".jpg") ||
          file.name.toLowerCase().endsWith(".jpeg") ||
          file.name.toLowerCase().endsWith(".png")
      )
      .map((file: any) => ({
        name: file.name,
        downloadUrl: file.download_url,
        size: file.size,
        sha: file.sha,
      }));

    return images;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    console.error("Error fetching images:", error);
    throw error;
  }
};
