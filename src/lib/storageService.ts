import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from './firebase';

const storage = getStorage(app);

export const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};