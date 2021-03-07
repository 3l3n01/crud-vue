<template>
	<v-row justify="center">
		<v-dialog v-model="isOpen" persistent max-width="600px">
			<v-card>
				<v-card-title class="headline blue">
					<span class="headline title">{{ title }}</span>
				</v-card-title>
				<v-card-text>
					<v-form ref="form" v-model="valid">
						<v-container>
							<v-row>
								<v-col cols="12" sm="12" md="12">
									<v-text-field
										v-model="contact.name"
										label="Nombre*"
										:rules="rules.name"
										required
									></v-text-field>
								</v-col>
								<v-col cols="12" sm="6" md="6">
									<v-text-field
										v-model="contact.email"
										:rules="rules.email"
										label="Correo*"
										required
									></v-text-field>
								</v-col>
								<v-col cols="12" sm="6" md="6">
									<v-text-field
										v-model="contact.phone"
										label="Telefono*"
										:rules="rules.phone"
										required
									></v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-form>
					<small>*Campo requerido</small>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="warning darken-1"
						text
						@click.prevent="$emit('closed', !isOpen)"
					>
						Cancelar
					</v-btn>
					<v-btn
						color="blue darken-1"
						text
						@click="save"
						:disabled="!valid"
					>
						{{ btn }}
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
		isOpen: Boolean,
		value: {
			required: false,
		},
	},
	data() {
		return {
			snackbar: false,
			text: false,
			disabledBtn: false,
			valid: false,
			reg: this.value,
			contact: {
				name: "",
				email: "",
				phone: "",
			},
			rules: {
				email: [
					(v) => !!v || "El correo es requerido",
					(v) => /.+@.+/.test(v) || "El correo no es correcto.",
				],
				name: [
					(v) => !!v || "El nombre es requerido",
					(v) =>
						v.length > 2 ||
						"El nombre debe tener una longitud minima de 3",
				],
				phone: [
					(v) => !!v || "El campo es requerido"
				]
			},
		};
	},
	watch: {
		isOpen: function(newVal) {
			// Reset
			if (!newVal) {
				this.$refs.form.resetValidation();
				this.contact = {
					name: "",
					email: "",
					phone: "",
				};
			}
		},
		value(newValue) {
			this.reg = newValue;
			if (this.reg) {
				this.contact = {
					id: this.reg.id || null,
					name: this.reg.name || "",
					email: this.reg.email || "",
					phone: this.reg.phone || "",
				};
			}
		},
	},
	computed: {
		title: function() {
			if (this.reg) {
				return "Editar datos del contacto";
			}
			return "Registro de contacto";
		},
		btn: function() {
			if (this.reg) {
				return "Actualizar";
			}
			return "Guardar";
		},
	},
	methods: {
		message: function (mess) {
			this.snackbar = true;
			this.text = mess;
		},
		save: function() {
			// Desabilitar los botones
			this.disabledBtn = true;
			// Validar si es registro nuevo o actualizacion de datos

			if (this.reg) {
				
				this.$axios.put(`${this.$config.get('api')}/${this.value.id}`, this.contact).then( () => {
					// Actualizacion
					this.message('Se actualizo de forma correcta el contacto');
				}).catch(() => {
					this.message('Ocurrio un error, no fue posible actualizar los datos');
				}).finally( () => {
					this.$emit("closed", !this.isOpen);
				});
			} else {
				this.$axios.post(this.$config.get('api'), {
				name: this.contact.name,
				email: this.contact.email,
				phone: this.contact.phone
			}).then( () => {
					this.message('Se registro de forma correcta el contacto');
				}).catch(() => {
					this.message('Ocurrio un problema durante el registro del contacto');
				}).finally( () => {
					this.$emit("closed", !this.isOpen);
				});
			}
		},
	},
};
</script>

<style scoped>
.v-card__title {
	color: #fff !important;
}
</style>
