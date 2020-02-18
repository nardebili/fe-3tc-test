<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img :src="require('../assets/logo.svg')" class="my-3" contain height="200" />
      </v-col>

      <v-col class="mb-5" cols="12">
        <v-btn @click="sendNumber()">Click here</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MainView",

  data: () => ({
    client: null
  }),
  methods: {
    sendNumber() {
      if (this.client.readyState === this.client.OPEN) {
        var number = Math.round(Math.random() * 0xffffff);
        this.client.send(number.toString());
      }
    }
  },
  mounted() {
    this.client = new WebSocket("ws://localhost:8080/");
    console.log(`Client: ${this.client}`);

    this.client.onerror = error => {
      console.log("Connect Error: " + error.toString());
    };

    this.client.onopen = () => {
      console.log("Opened connection ");

      // send data to the server
      var json = JSON.stringify({ message: "Hello " });
      this.client.send(json);
    };

    this.client.onclose = (code, reason) => {
      console.log(code, reason);
    };

    this.client.onmessage = function(event) {
      console.log(event.data);
    };
  },
  beforeDestroy () {
    this.client.close()
  }
};
</script>
