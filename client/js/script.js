new Vue({
  el: "#app",
  data: {
    ping_frequency: 2000,
    interval_id: -1,
    messages: []
  },
  methods: {
    startPolling() {
      this.interval_id = setInterval(() => {
        const start = Date.now();
        fetch("http://localhost:4000/poll")
          .then(res => {
            if (res.status === 200) {
              return res.json();
            } else {
              return Promise.resolve("No data received!");
            }
            return response;
          })
          .then(data => {
            const current_time = new Date();
            const message = {
              time_taken: current_time.getTime() - start,
              data,
              ts: moment(current_time).format("hh:mm:ss A")
            };
            this.messages.push(message);
          })
          .catch(error => {
            const current_time = new Date();
            this.messages.push({
              time_taken: current_time.getTime() - start,
              data: "Error: Could not reach the server! :(",
              ts: moment(current_time).format("hh:mm:ss A")
            });
          });
      }, this.ping_frequency);
    },
    stopPolling() {
      clearInterval(this.interval_id);
      this.interval_id = -1;
    },
    clearMessages() {
      this.messages = [];
    }
  }
});
