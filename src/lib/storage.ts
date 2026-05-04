import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadAudio(
  chatId: string,
  messageId: string,
  uri: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `audio/chats/${chatId}/${messageId}.ogg`);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, blob, { contentType: 'audio/ogg' });
    task.on(
      'state_changed',
      (snap) => {
        onProgress?.((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function uploadDocument(
  patientId: string,
  fileName: string,
  uri: string,
  mimeType: string
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `documents/${patientId}/${fileName}`);

  const snap = await uploadBytesResumable(storageRef, blob, { contentType: mimeType }).then(
    (t) => t
  );
  return getDownloadURL(storageRef);
}
