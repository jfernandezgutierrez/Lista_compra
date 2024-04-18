<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Lista de compra</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <!-- Menu Desplegable -->
      <v-menu>
  <template #activator="{ props }">
    <v-btn v-bind="props" color="primary" dark>
      Menú
    </v-btn>
  </template>
  <v-list>
    <v-list-item @click="showCompraModal = true">
            <v-list-item-title>Compra</v-list-item-title>
          </v-list-item>
          <v-list-item @click="showModal = true">
            <v-list-item-title>Tipos</v-list-item-title>
          </v-list-item>
          <v-list-item @click="showContenedorModal = true">
            <v-list-item-title>Contenedores</v-list-item-title>
          </v-list-item>
          <v-list-item @click="showProductoModal = true">
            <v-list-item-title>Productos</v-list-item-title>
          </v-list-item>
  </v-list>
</v-menu>

    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="(contenedor, index) in contenedores" :key="index">
            <v-card>
              <v-card-title>{{ contenedor.name }}</v-card-title>
              <v-card-text>
                {{ contenedor.description }}
                <v-list dense>
                  <v-list-item
                    v-for="(producto, idx) in productos.filter(p => p.contenedor === contenedor.name && p.unidades > 0)"
                    :key="idx" @click="openEditUnitsModal(producto)">
                    <v-list-item-content>
                      {{ producto.name }} - Unidades: {{ producto.unidades }}
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

        </v-row>
      </v-container>
    </v-main>

    <!-- Dialog/Modal para "Tipos" -->
    <v-dialog v-model="showModal" persistent max-width="600px">
      <v-card>
        <v-card-title>
          Gestionar Tipos
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
          <!-- Lista de tipos existentes -->
          <v-list dense>
            <v-list-item v-for="(tipo, index) in types" :key="tipo.id" @click="selectType(tipo, index)">
              <v-list-item-content>
                <v-text-field v-if="editedIndex === index" v-model="editedTipo.name" label="Editar nombre"
                  :rules="[rules.required]"></v-text-field>
                <span v-else>
                  {{ tipo.name }}
                </span>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon v-if="editedIndex !== index" @click="startEdit(index)">
                  <v-icon color="blue">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon v-if="editedIndex === index" @click="confirmEditT(index)">
                  <v-icon color="green">mdi-check</v-icon>
                </v-btn>
                <v-btn icon @click="deleteType(tipo.id)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showContenedorModal" persistent max-width="600px">
      <v-card>
        <v-card-title>
          Gestionar Contenedores
          <v-spacer></v-spacer>
          <v-btn icon @click="showContenedorModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Nombre del Contenedor" v-model="newContenedor.name"
            :rules="[rules.required]"></v-text-field>
          <v-text-field label="Descripción" v-model="newContenedor.description"
            :rules="[rules.required]"></v-text-field>
          <v-btn color="primary" @click="addContenedor">Agregar</v-btn>

          <!-- Lista de contenedores existentes -->
          <v-list dense>
            <v-list-item v-for="(contenedor, index) in contenedores" :key="contenedor.id"
              @click="selectContenedor(contenedor, index)">
              <v-list-item-content>
                <v-text-field v-if="editedIndex === index" v-model="editedContenedor.name" label="Editar nombre"
                  :rules="[rules.required]"></v-text-field>
                <v-text-field v-if="editedIndex === index" v-model="editedContenedor.description"
                  label="Editar descripción" :rules="[rules.required]"></v-text-field>
                <span v-else>
                  {{ contenedor.name }} - {{ contenedor.description }}
                </span>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon v-if="editedIndex !== index" @click="startEdit(index)">
                  <v-icon color="blue">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon v-if="editedIndex === index" @click="confirmEdit(index)">
                  <v-icon color="green">mdi-check</v-icon>
                </v-btn>
                <v-btn icon @click="deleteContenedor(contenedor.id)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showProductoModal" persistent max-width="600px">
      <product-form :types="types" :containers="containers" @close="showProductoModal = false"></product-form>
    </v-dialog>
    <v-dialog v-model="editUnitsDialog" persistent max-width="300px">
      <v-card>
        <v-card-title>
          Editar Unidades
          <v-spacer></v-spacer>
          <v-btn icon @click="editUnitsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field type="number" label="Unidades" v-model="editProduct.unidades"
              :rules="[rules.counter]"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updateProductUnits()">Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showCompraModal" persistent max-width="800px">
      <v-card>
        <v-card-title>
          Compra de Productos
          <v-spacer></v-spacer>
          <v-btn icon @click="showCompraModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item-group>
              <v-list-item v-for="producto in productosConCeroUnidades" :key="producto.id"
                @click="openEditUnitsModal(producto)">
                <v-list-item-content>
                  <v-list-item-title>{{ producto.name }}</v-list-item-title>
                  <v-list-item-subtitle>Tipo: {{ producto.type }}, Unidades: {{ producto.unidades
                    }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
import { db } from './firebase'; // Asegúrate de que la ruta es correcta
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { query, where, writeBatch } from 'firebase/firestore';

import ProductForm from './components/ProductForm.vue';
export default {
  components: {
    ProductForm
  },
  name: 'Home',
  data: () => ({
    showCompraModal: false,
    editUnitsDialog: false,
    editProduct: {},
    productos: [],
    showModal: false,
    showContenedorModal: false,
    showProductoModal: false,
    originalContenedorName: "",
    originalTipoName: "",
    newType: '',
    //typeId:'',
    types: [],
    typeNames: [],
    newContenedor: { name: '', description: '' },
    newProducto: {
      name: '',
      typeId: "",
      contenedorId: "",
      unidades: 0,
    },
    contenedores: [],
    editedIndex: -1,
    editedItem: '',
    rules: {
      required: value => !!value || 'Requerido.',
    },

  }),

  async created() {
    await this.fetchTypes();
    await this.fetchContenedores();
    await this.fetchProductos();
  },

  computed: {
    productosConCeroUnidades() {
      console.log("Productos antes del filtro:", this.productos);
      const filteredProducts = this.productos.filter(p => Number(p.unidades) === 0);
      console.log("Productos después del filtro:", filteredProducts);

      // Filtrar productos con cero unidades y ordenar por tipo
      return filteredProducts// Asumiendo que typeId es un string descriptivo
    }
  },
  methods: {
    async fetchProductos() {
      const querySnapshot = await getDocs(collection(db, "productos"));
      this.productos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(this.productos);
    },
    async fetchTypes() {
      const querySnapshot = await getDocs(collection(db, "types"));
      this.types = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Crear una lista solo con los nombres de los tipos
      this.typeNames = this.types.map(type => type.name);
      console.log("Types loaded:", this.types);
    },
    addType() {
      if (this.newType) {
        const typeToAdd = { name: this.newType };
        addDoc(collection(db, "types"), typeToAdd).then(() => {
          this.newType = '';
          this.fetchTypes(); // Recargar los tipos después de agregar uno nuevo
        });
      }
    },
    async startEdit(index) {
      this.editedIndex = index;
      this.editedItem = this.types[index].name;
    },
    async confirmEditT(index) {
      if (this.editedTipo.name) {
        const typeRef = doc(db, "types", this.types[index].id);
        await updateDoc(typeRef, { name: this.editedTipo.name });
       // this.updateAssociatedProducts(this.originalTipoName, this.editedTipo.name);
       const querySnapshot = await getDocs(query(collection(db, "productos"), where("type", "==", this.originalTipoName)));
        const batch = writeBatch(db); // Usa un batch para actualizar múltiples documentos

        querySnapshot.forEach((documentSnapshot) => {
          const productRef = doc(db, "productos", documentSnapshot.id);
          batch.update(productRef, { type: this.editedTipo.name });
        });

        await batch.commit();
       this.editedIndex = -1;
        this.fetchTypes(); // Recargar los tipos
        await this.fetchProductos();
      }
    },
    async deleteType(id) {
      await deleteDoc(doc(db, "types", id));
      this.fetchTypes(); // Recargar los tipos después de eliminar
    },
    //contenedores
    async fetchContenedores() {
      const querySnapshot = await getDocs(collection(db, "contenedores"));
      this.contenedores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Contenedores loaded:", this.contenedores);
    },
    async addContenedor() {
      if (this.newContenedor.name && this.newContenedor.description) {
        await addDoc(collection(db, "contenedores"), {
          name: this.newContenedor.name,
          description: this.newContenedor.description
        });
        this.newContenedor = { name: '', description: '' }; // Reiniciar el formulario
        this.showContenedorModal = false;
        await this.fetchContenedores(); // Recarga los contenedores desde Firestore
        this.fetchContenedores();
      }
    },
    openEditUnitsModal(producto) {
      this.editProduct = { ...producto };
      this.editUnitsDialog = true;
    },
    async updateProductUnits() {
      const productRef = doc(db, "productos", this.editProduct.id);
      await updateDoc(productRef, { unidades: this.editProduct.unidades });
      this.editUnitsDialog = false;
      await this.fetchProductos(); // Actualizar lista de productos
    },
    startEdit(index) {
      this.editedIndex = index;
      this.editedContenedor = { ...this.contenedores[index] };
      this.originalContenedorName = this.contenedores[index].name;  // Guardar el nombre original antes de la edición
      this.editedTipo = { ...this.types[index] };
      this.originalTipoName = this.types[index].name;
    },
    async confirmEdit(index) {
      if (this.editedContenedor.name && this.editedContenedor.description) {
        const contenedorRef = doc(db, "contenedores", this.contenedores[index].id);
        await updateDoc(contenedorRef, {
          name: this.editedContenedor.name,
          description: this.editedContenedor.description
        });
        // Actualizar todos los productos asociados
        console.log(this.originalContenedorName);
        const querySnapshot = await getDocs(query(collection(db, "productos"), where("contenedor", "==", this.originalContenedorName)));
        const batch = writeBatch(db); // Usa un batch para actualizar múltiples documentos

        querySnapshot.forEach((documentSnapshot) => {
          const productRef = doc(db, "productos", documentSnapshot.id);
          batch.update(productRef, { contenedor: this.editedContenedor.name });
        });

        await batch.commit();
        this.editedIndex = -1;
        await this.fetchContenedores();  // Recargar la lista de contenedores
        await this.fetchProductos();
      }
    },
    async deleteContenedor(id) {
      await deleteDoc(doc(db, "contenedores", id));
      this.fetchContenedores();  // Recargar la lista de contenedores
    },
    selectContenedor(contenedor, index) {
      // Prevenir que el clic en el ítem abra la edición directamente
      event.stopPropagation();
    },
    selectType(type, index) {
      // Prevenir que el clic en el ítem abra la edición directamente
      event.stopPropagation();
    },
    updateAssociatedProducts(oldName, newName) {
      const querySnapshot = getDocs(query(collection(db, "productos"), where("tipo", "==", oldName)));
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        const productRef = doc(db, "productos", doc.id);
        batch.update(productRef, { tipo: newName });
      });
      batch.commit();
    },

  },
};
</script>