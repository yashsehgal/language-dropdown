import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

const updateLanguageList = async (data: LanguageItemDataType) => {
  // Do nothing if languageItems list is empty.
  if (!data) return;

  try {
    const docRef = await addDoc(collection(db, 'user-languages'), {
      ...data,
    });
    console.info(
      'Document written on firebase > firestore, with ID',
      docRef.id,
    );
  } catch (err) {
    console.error('Error adding document on firebase', err);
  }
};

const fetchLanguageList = async () => {
  let languageListFromFirebase: LanguageItemDataType[] = [];

  await getDocs(collection(db, 'user-languages')).then((querySnapshot) => {
    languageListFromFirebase = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as any;

    // Sorting the languageList according the particular "positions"
    languageListFromFirebase.sort((a: any, b: any) => a.position - b.position);
  });

  return languageListFromFirebase;
};

const updateLanguageItemRemovalOnFirebase = async (documentID: string) => {
  await deleteDoc(doc(db, 'user-languages', documentID));
};

const updateLanguageItemReorderOnFirebase = async (
  data: LanguageItemDataType,
  documentId: string,
) => {
  await updateDoc(doc(db, 'user-languages', documentId), data);
};

export {
  updateLanguageList,
  fetchLanguageList,
  updateLanguageItemRemovalOnFirebase,
  updateLanguageItemReorderOnFirebase,
};
