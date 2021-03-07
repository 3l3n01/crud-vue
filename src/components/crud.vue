<template>
	<v-card flat class="full-h">
		<v-toolbar color="primary" dark extended flat></v-toolbar>

		<v-card class="mx-auto" max-width="850" style="margin-top: -64px;">
			<v-img height="250" src="/agenda.jpeg" class="banner"></v-img>
			<v-card-text
				style="min-height: 200px;"
				v-if="data.length < 1"
			></v-card-text>
			<v-data-table
				dense
				:headers="headers"
				:items="data"
				:items-per-page="5"
				:loading="loadingData"
				loading-text="Cargando... Espere un momento"
			>
				<template v-slot:item.actions="{ item }">
					<v-icon small class="mr-2" @click="editContact(item)">
						mdi-pencil
					</v-icon>
					<v-icon small @click="deleteContact(item)">
						mdi-delete
					</v-icon>
				</template>
			</v-data-table>
		</v-card>
		<v-fab-transition>
			<v-tooltip left>
				<template v-slot:activator="{ on, attrs }">
					<v-btn
						color="pink"
						dark
						absolute
						bottom
						right
						fab
						v-bind="attrs"
						v-on="on"
						@click.prevent="openForm"
					>
						<v-icon>mdi-plus</v-icon>
					</v-btn>
				</template>
				<span>Agregar Contacto</span>
			</v-tooltip>
		</v-fab-transition>

		<!-- Dialogo de registro/actualizacion -->
		<my-dialog
			:isOpen.sync="openDialog"
			@closed="closedDialog"
			v-model="contactEdit"
		></my-dialog>
		<!-- Dialogo de eliminacion --->
		<my-dialog-delete
			:open.sync="deleteContactOpen"
			@closed="closedDialog"
			v-model="idContactDelete"
		/>
	</v-card>
</template>

<script>
const MyDialog = () => import(/* webpackChunkName: "dialog" */ "./dialog.vue");
const MyDialogDelete = () =>
	import(/* webpackChunkName: "dialog" */ "./dialogDelete.vue");

export default {
	components: { MyDialog, MyDialogDelete },
	data() {
		return {
			loadingData: true,
			openDialog: false,
			deleteContactOpen: false,
			contactEdit: null,
			idContactDelete: null,
			headers: [
				{
					text: "ID",
					align: "start",
					sortable: false,
					value: "id",
				},
				{ text: "Nombre", value: "name" },
				{ text: "Correo", value: "email" },
				{ text: "Telefono", value: "phone" },
				{ text: "Acciones", value: "actions", sortable: false },
			],
			data: [],
		};
	},
	methods: {
		openForm: function() {
			this.openDialog = true;
		},
		closedDialog: function() {
			this.openDialog = false;
			this.deleteContactOpen = false;
			this.contactEdit = null;
			this.idContactDelete = null;
			// Recargar los datos
			// Ya que es un ejemplo se hace de esa manera, si no, se usara algo diferente para no 
			// afectar la carga de los registros solo por un cambio, incluido el paginar resultados.
			this.loadData();
		},
		editContact: function(contact) {
			this.contactEdit = contact;
			this.openDialog = true;
		},
		deleteContact: function(item) {
			this.idContactDelete = item.id || null;
			this.deleteContactOpen = true;
		},
		loadData: function() {
			this.loadingData = true;
			this.$axios
				.get(this.$config.get('api'))
				.then((resp) => {
					setTimeout(() => {
						this.loadingData = false;
						this.data = resp.data.data;
					}, 500);
				})
				.catch(() => {
					this.loadingData = false;
				});
		},
	},
	mounted: function() {
		this.loadData();
	},
};
</script>

<style scoped>
.full-h {
	height: calc(100vh - 50px);
}

.banner {
	margin-bottom: 20px;
}
</style>
