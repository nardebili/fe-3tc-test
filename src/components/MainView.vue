<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap align-center>
      <v-flex xs12>
        <v-card>
          <v-toolbar color="cyan" dark>
            <v-toolbar-title>Messages</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-list two-line style="height: 300px" class="overflow-y-auto" id="scroll-target">
            <div id="scrolled-content">
              <template v-for="(message, index) in messagesReceived">
                <v-list-item :key="index">
                  <v-list-item-content>
                    <v-list-item-subtitle v-html="message"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </div>
          </v-list>
        </v-card>
      </v-flex>
        <v-flex xs12>
          <v-text-field
            label="Solo"
            placeholder="Enter message"
            solo
            append-outer-icon="done"
            v-model="inputMessage"
            @click:append-outer="sendMessage"
          ></v-text-field>
        </v-flex>
       <v-spacer></v-spacer>
        <v-flex >
           <v-btn flat small color="error" @click="clearAll">Clear All</v-btn>
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "MainView",

  data() {
    return {
      client: null,
      messagesReceived: ["Hello"],
      inputMessage: "",
      container: null,
      elem: null,
      scrollTop: 400
    };
  },
  methods: {
    handleMessage(event) {
      const data = JSON.parse(event.data);
      this.messagesReceived = [];
      for (const msgObj of data.messages) {
        this.messagesReceived.push(JSON.parse(msgObj).message);
      }
    },
    sendMessage() {
      if (!this.inputMessage.length) return;
      if (this.client.readyState === this.client.OPEN) {
        this.client.send(JSON.stringify({ message: this.inputMessage }));
      }
      this.inputMessage = "";
    },
    clearAll() {
      if (this.client.readyState === this.client.OPEN) {
        this.client.send(JSON.stringify({ action: 'clearAll' }));
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

    this.client.onmessage = this.handleMessage;

    // remember dom reference for container
    this.container = document.getElementById("scroll-target");
  },
  updated() {
    // scroll to bottom on update
    this.container.scrollTop = this.container.scrollHeight;
  },
  beforeDestroy() {
    this.client.close();
  }
};
</script>
