import { defineStore } from 'pinia';
import { db } from '../firebase'; // Asegúrate de haber configurado Firebase correctamente
import { collection, getDocs } from 'firebase/firestore';

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    datos: []
  }),
  actions: {
    async fetchData() {
      const querySnapshot = await getDocs(collection(db, "types"));
      this.datos = querySnapshot.docs.map(doc => doc.data());
    }
  }
});