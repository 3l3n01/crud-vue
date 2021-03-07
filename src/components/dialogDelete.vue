<template>
	<v-row justify="center">
		<v-dialog v-model="open" persistent max-width="490">
			<v-card>
				<v-card-title class="headline title">
					Esta seguro de eliminar el contacto ?
				</v-card-title>
				<v-card-text
					>Una vez que se elimine el contacto, ya no estara disponible
					y tampoco podra recuperarlo.</v-card-text
				>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green darken-1" text @click="closed">
						Cancelar
					</v-btn>
					<v-btn color="warning darken-1" text @click="deleted">
						Eliminar
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Componentes -->

		<v-snackbar v-model="snackbar">
			{{ text }}

			<template v-slot:action="{ attrs }">
				<v-btn
					color="pink"
					text
					v-bind="attrs"
					@click="snackbar = false"
				>
					Cerrar
				</v-btn>
			</template>
		</v-snackbar>
	</v-row>
</template>

<script>
export default {
	props: {
		open: Boolean,
		value: {
			required: true,
		},
	},
	data() {
		return {
			snackbar: false,
			id: false,
			text: '',
		};
	},
	methods: {
		deleted: function() {
			this.axios.delete(`${this.$config.get('api')}/${this.value}`)
				.then(() => {
					this.text = 'Se elimino de forma correcta el registro.';
				})
				.catch(() => {
					this.text = 'Ocurrio un error al eliminar el registro';
				})
				.finally(() => {
					this.snackbar = true;
					this.$emit("closed", !this.isOpen);
				});
		},
		closed: function() {
			this.$emit("closed", !this.open);
		},
	},
};
</script>
