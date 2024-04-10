<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Título de la App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="showModal = true">Tipos</v-btn>
      <v-btn color="secondary" @click="showContenedorModal = true">Contenedores</v-btn>
      <v-btn color="success" @click="showProductoModal = true">Productos</v-btn>

    </v-app-bar>

    <v-main>
      <v-container>
        <p>Este es el contenido de la página con el menú arriba.</p>
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="(contenedor, index) in contenedores" :key="index">
            <v-card>
              <v-card-title>{{ contenedor.name }}</v-card-title>
              <v-card-text>{{ contenedor.description }}</v-card-text>
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
      <v-card>
        <v-card-title>
          Nuevo Producto
          <v-spacer></v-spacer>
          <v-btn icon @click="showProductoModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          
            <v-text-field label="Nombre del Producto" v-model="newProducto.name" :rules="[rules.required]">
            </v-text-field>
            <v-select :items="typesS" item-text="name" item-value="id" label="Seleccionar Tipo" v-model="newProducto.typeId">
              
            </v-select>
            <v-select :items="contenedores" item-text="name" item-value="id" label="Seleccionar Contenedor"
              v-model="newProducto.contenedorId">
            </v-select>
            <v-text-field type="number" label="Unidades" v-model="newProducto.unidades"
              :rules="[rules.required, rules.counter]">
            </v-text-field>
            <v-btn color="primary" @click="addProducto">Agregar</v-btn>
          
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
    showContenedorModal: false,
    showProductoModal: false,
    newType: '',
    //typeId:'',
    types: [],
    typesS: [],
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
   // await this.fetchTypes();
    await this.fetchContenedores();
  },
  beforeMount() {
    this.fetchTypes();
    this.fetchContenedores();
  },
  computed: {

  },
  methods: {
    async fetchTypes() {
      const querySnapshot = await getDocs(collection(db, "types"));
      debugger
      this.types = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // this.types.forEach(el=>{
      //   this.typesS.push({
      //     id:el.id,
      //     name:el.name
      //   })
      // });
      this.typesS.push({ id: 'DfSsynIO3eARDRpHrYN7', name: 'Patatas con queso' });
      console.log(this.typesS);
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
    //productos
    async addProducto() {
      if (this.newProducto.name && this.newProducto.typeId && this.newProducto.contenedorId && this.newProducto.unidades > 0) {
        // Asegúrate de incluir el nombre en el objeto que envías a Firestore
        await addDoc(collection(db, "productos"), {
          name: this.newProducto.name,
          typeId: this.newProducto.typeId,
          contenedorId: this.newProducto.contenedorId,
          unidades: this.newProducto.unidades
        });
        this.resetNewProducto(); // Reinicia el formulario y cierra el modal
      }
    },
    resetNewProducto() {
      // Reinicia newProducto a su estado inicial
      this.newProducto = { name: '', typeId: '', contenedorId: '', unidades: 0 };
      this.showProductoModal = false; // Opcional: Cierra el modal
    },
  },
};
</script>