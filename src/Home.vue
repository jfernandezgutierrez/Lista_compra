<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Título de la App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="showCompraModal = true">Compra</v-btn>
      <v-btn color="primary" @click="showModal = true">Tipos</v-btn>
      <v-btn color="secondary" @click="showContenedorModal = true">Contenedores</v-btn>
      <v-btn color="success" @click="showProductoModal = true">Productos</v-btn>

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
    <v-dialog v-model="showContenedorModal" persistent max-width="600px">
      <v-card>
        <v-card-title>
          Nuevo Contenedor
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
          <v-list-item 
            v-for="producto in productosConCeroUnidades" 
            :key="producto.id"
            @click="openEditUnitsModal(producto)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ producto.name }}</v-list-item-title>
              <v-list-item-subtitle>Tipo: {{ producto.type }}, Unidades: {{ producto.unidades }}</v-list-item-subtitle>
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

  },
};
</script>