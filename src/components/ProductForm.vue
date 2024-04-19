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
      <v-autocomplete label="Tipo" v-model="product.typeId" :items="typeNames" item-text="type" item-value="type"
        :rules="[rules.required]" return-object></v-autocomplete>
      <v-autocomplete label="Contenedor" v-model="product.containerId" :items="contenedorName" item-text="type"
        item-value="type" :rules="[rules.required]" return-object></v-autocomplete>
      <v-text-field type="number" label="Unidades" v-model="product.units"
        :rules="[rules.required, rules.counter]"></v-text-field>
      <v-btn color="primary" @click="addProducto">Agregar</v-btn>
    </v-card-text>
  </v-card>

  <v-card>
    <v-card-title>
      Lista de Productos
      <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
    </v-card-title>
    <v-card-text style="height: 300px; overflow-y: auto;">
      <v-list>
        <v-list-item-group>
          <v-list-item v-for="(item, index) in filteredProducts" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.type }} - {{ item.contenedor }} - Unidades: {{ item.unidades
                }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="openEdit(item)">
                <v-icon color="blue">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteProducto(item.id)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
  <v-dialog v-model="editDialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        Editar Producto
        <v-spacer></v-spacer>
        <v-btn icon @click="closeEdit()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form>
            <v-text-field label="Nombre del Producto" v-model="editProduct.name"
              :rules="[rules.required]"></v-text-field>
            <v-autocomplete label="Tipo" v-model="editProduct.typeId" :items="typeNames" item-text="type"
              item-value="type" :rules="[rules.required]"></v-autocomplete>
            <v-autocomplete label="Contenedor" v-model="editProduct.containerId" :items="contenedorName"
              item-text="type" item-value="type" :rules="[rules.required]"></v-autocomplete>
            <v-text-field type="number" label="Unidades" v-model="editProduct.units"
              :rules="[rules.required, rules.counter]"></v-text-field>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="updateProducto()">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>
import { db } from '../firebase'; // Asegúrate de que la ruta es correcta
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';

export default {
  name: 'ProductForm',

  data: () => ({
    types: [],
    products: [],
    editDialog: false,
    editProduct: {
      id: '',
      name: '',
      typeId: null,
      containerId: null,
      units: 0
    },
    search: '',
    typeNames: [],
    contenedorName: [],
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
    await this.fetchProducts();
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => product.name.toLowerCase().includes(this.search.toLowerCase()));
    }
  },
  methods: {
    async fetchProducts() {
      const querySnapshot = await getDocs(collection(db, "productos"));
      this.products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
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
    //productos
    async addProducto() {
      if (!this.product.name || !this.product.typeId || !this.product.containerId || this.product.units <= 0) {
        alert('Todos los campos son requeridos y las unidades deben ser mayores a cero.');
        return;
      }

      try {
        // Agregar producto a Firestore
        const docRef = await addDoc(collection(db, "productos"), {
          name: this.product.name,
          type: this.product.typeId,
          contenedor: this.product.containerId,
          unidades: this.product.units
        });

        // Agregar el nuevo producto al estado local para actualización inmediata de la UI
        this.products.push({
          id: docRef.id,
          name: this.product.name,
          typeId: this.product.typeId,
          containerId: this.product.containerId,
          units: this.product.units
        });

        this.resetNewProducto(); // Reinicia el formulario
        console.log('Producto agregado con éxito');
      } catch (error) {
        console.error("Error al agregar producto:", error);
      }
    },

    resetNewProducto() {
      this.product = { name: '', typeId: null, containerId: null, units: 0 };
      this.showProductoModal = false; // Si estás utilizando un modal para el formulario
    },
    openEdit(product) {
      this.editProduct = { ...product };
      this.editDialog = true;
    },
    closeEdit() {
      this.editDialog = false;
    },
    async updateProducto() {
      if (!this.editProduct.name) {
        alert('El nombre es requerido.');
        return;
      }
      // Actualizar el producto en Firestore
      const productRef = doc(db, "productos", this.editProduct.id);
      await updateDoc(productRef, {
        name: this.editProduct.name,
        type: this.editProduct.typeId,
        contenedor: this.editProduct.containerId,
        unidades: this.editProduct.units
      });
      this.closeEdit();
      await this.fetchProducts(); // Recargar los productos
      alert('Producto actualizado con éxito.');
    },
    async deleteProducto(productId) {
      await deleteDoc(doc(db, "productos", productId));
      await this.fetchProducts(); // Recargar la lista después de borrar
      console.log('Producto eliminado');
    },
  }
};
</script>