<template>
    <v-app>
      <v-app-bar app>
        <v-toolbar-title>Título de la App</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="showModal = true">Tipos</v-btn>
      </v-app-bar>
  
      <v-main>
        <v-container>
          <p>Este es el contenido de la página con el menú arriba.</p>
        </v-container>
      </v-main>
  
      <!-- Dialog/Modal para "Tipos" -->
      <v-dialog v-model="showModal" persistent max-width="600px">
        <v-card>
          <v-card-title>
            Tipos
            <v-spacer></v-spacer>
            <v-btn icon @click="showModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
  
          <v-card-text>
            <v-form @submit.prevent="addType">
              <v-text-field label="Nuevo Tipo" v-model="newType" :rules="[rules.required]"></v-text-field>
              <v-btn color="primary" @click="addType">Agregar</v-btn>
            </v-form>
            <v-list dense>
              <v-list-item v-for="(type, index) in types" :key="index">
                <v-list-item-content class="align-center">
                  <v-text-field v-if="editedIndex === index" v-model="editedItem" outlined dense size="small" />
                  <span v-else>{{ type.name }}</span>
                </v-list-item-content>
                <v-list-item-action class="d-flex justify-end">
                  <v-btn icon v-if="editedIndex !== index" @click="startEdit(index)">
                    <v-icon color="blue">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon v-if="editedIndex === index" @click="confirmEdit(index)">
                    <v-icon color="green">mdi-check</v-icon>
                  </v-btn>
                  <v-btn icon @click="deleteType(index)">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-app>
  </template>
  
  <script>
  import { db } from './firebase'; // Asegúrate de que la ruta es correcta
  import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
  
  export default {
    name: 'Home',
    data: () => ({
      showModal: false,
      newType: '',
      types: [],
      editedIndex: -1,
      editedItem: '',
      rules: {
        required: value => !!value || 'Requerido.',
      },
    }),
    async created() {
      await this.fetchTypes();
    },
    methods: {
      async fetchTypes() {
        const querySnapshot = await getDocs(collection(db, "types"));
        this.types = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      },
      async addType() {
        if (this.newType) {
          await addDoc(collection(db, "types"), {
            name: this.newType
          });
          this.newType = '';
         // this.showModal = false;
          await this.fetchTypes(); // Recarga la lista de tipos
        }
      },
      async startEdit(index) {
        this.editedIndex = index;
        this.editedItem = this.types[index].name;
      },
      async confirmEdit(index) {
        if (this.editedItem.trim() !== '') {
          const type = this.types[index];
          const typeRef = doc(db, "types", type.id);
          await updateDoc(typeRef, { name: this.editedItem });
          this.editedIndex = -1;
          this.editedItem = '';
          await this.fetchTypes(); // Recarga la lista de tipos
        }
      },
      async deleteType(index) {
        if (confirm('¿Estás seguro de querer borrar este tipo?')) {
          const type = this.types[index];
          await deleteDoc(doc(db, "types", type.id));
          await this.fetchTypes(); // Recarga la lista de tipos
        }
      },
    },
  };
  </script>
  
  