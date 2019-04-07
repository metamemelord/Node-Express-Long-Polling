var map = L.map("map");
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var target = L.latLng("28.7041", "77.1025");
map.setView(target, 14);

var theMarker = {};

theMarker = L.marker([28.7041, 77.1025]).addTo(map);

new Vue({
  el: "#app",
  data: {
    ping_frequency: null,
    interval_id: -1,
    messages: [],
    coords: [28.7041, 77.1025]
  },
  methods: {
    startPolling() {
      let ping_frequency = Math.abs(this.ping_frequency * 1000);
      if (ping_frequency == 0) {
        this.ping_frequency = 2;
        ping_frequency = 2000;
      } else if (ping_frequency < 1000) {
        this.ping_frequency = 1;
        ping_frequency = 1000;
      } else {
        this.ping_frequency = ping_frequency / 1000;
      }

      this.interval_id = setInterval(() => {
        const start = Date.now();
        fetch("poll")
          .then(res => {
            if (res.status === 200) {
              return res.json();
            } else {
              return Promise.resolve("No changes!");
            }
          })
          .then(data => {
            if (typeof data === "object") {
              map.removeLayer(theMarker);
              if (Math.floor(2 * Math.random())) {
                this.coords[0] += data.delta.lat;
                this.coords[1] += data.delta.lon;
              } else {
                this.coords[0] -= data.delta.lat;
                this.coords[1] -= data.delta.lon;
              }
              theMarker = L.marker(this.coords).addTo(map);
            }
            const current_time = new Date();
            const message = {
              time_taken: current_time.getTime() - start,
              data,
              ts: moment(current_time).format("hh:mm:ss A")
            };
            this.messages.push(message);
          })
          .catch(error => {
            console.log(error);
            const current_time = new Date();
            this.messages.push({
              time_taken: current_time.getTime() - start,
              data: "Error: Could not reach the server! :(",
              ts: moment(current_time).format("hh:mm:ss A")
            });
          });
      }, ping_frequency);
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
