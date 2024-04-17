<template>
    <v-card>
      <v-card-title>
        Nuevo Producto
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
  
      <v-card-text>
        <v-text-field label="Nombre del Producto" v-model="product.name" :rules="[rules.required]"></v-text-field>
        <v-autocomplete
          label="Tipo"
          v-model="product.typeId"
          :items="typeNames"
          item-text="type"
          item-value="type"
          :rules="[rules.required]"
          return-object
        ></v-autocomplete>
        <v-autocomplete
          label="Contenedor"
          v-model="product.containerId"
          :items="contenedorName"
          item-text="type"
          item-value="type"
          :rules="[rules.required]"
          return-object
        ></v-autocomplete>
        <v-text-field type="number" label="Unidades" v-model="product.units" :rules="[rules.required, rules.counter]"></v-text-field>
        <v-btn color="primary" @click="addProduct">Agregar</v-btn>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import { db } from '../firebase'; // Asegúrate de que la ruta es correcta
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

  export default {
    name: 'ProductForm',
   
    data: () => ({
        types:[],
        typeNames:[],
        contenedorName:[],
      product: {
        name: '',
        typeId: null,
        containerId: null,
        units: 0
      },
      rules: {
        required: value => !!value || 'Requerido.',
        counter: value => value > 0 || 'Debe ser mayor a cero.'
      }
    }),
    async created() {
     await this.fetchTypes();
    await this.fetchContenedores();
  },
    methods: {
        async fetchTypes() {
      const querySnapshot = await getDocs(collection(db, "types"));
      this.types = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Crear una lista solo con los nombres de los tipos
      this.typeNames = this.types.map(type => type.name);
      console.log("Types loaded:", this.types);
    },
    async fetchContenedores() {
      const querySnapshot = await getDocs(collection(db, "contenedores"));
      this.contenedores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Contenedores loaded:", this.contenedores);
      this.contenedorName = this.contenedores.map(type => type.name);
    },
      addProduct() {
        console.log("Adding product:", this.product);
        this.$emit('add-product', this.product);
        this.resetProductForm();
      },
      resetProductForm() {
        this.product = { name: '', typeId: null, containerId: null, units: 0 };
      }
    }
  };
  </script>
  