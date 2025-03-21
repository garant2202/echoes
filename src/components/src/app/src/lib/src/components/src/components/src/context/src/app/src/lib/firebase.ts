// Додайте ці функції до файлу firebase.ts

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Функція для завантаження зображення до Firebase Storage
export async function uploadImage(file: File, userId: string): Promise<string> {
  // Створюємо унікальний шлях для файлу
  const imagePath = `users/${userId}/memories/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, imagePath);
  
  // Завантажуємо файл
  await uploadBytes(storageRef, file);
  
  // Отримуємо URL для доступу до файлу
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}
