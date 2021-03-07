<template>
  <v-app dense flat>
    <v-main>
      <crud/>
    </v-main>
  </v-app>
</template>

<script>
import Crud from './components/crud';

export default {
  name: 'App',

  components: {
    Crud,
  },

  data: () => ({
    //
  }),
};
</script>
