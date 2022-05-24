new Vue({
  el: '#app',
  data: {
    name: '',
    text: '',
    messages: [],
    socket: null,
    joined: false,
    tip: '',
  },
  created() {
    this.socket = io('/chat', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb2xsb3dlcnMiOlsxLDIsMyw1XSwicmVjb3JkcyI6W10sIm5vdGUiOiIiLCJpZCI6MSwiY3JlYXRlZF9hdCI6IjIwMjItMDUtMTBUMTQ6Mzk6MjMuMzQ2WiIsInVwZGF0ZWRfYXQiOiIyMDIyLTA1LTEwVDE0Oj',
          },
        },
      },
    });
    this.socket.on('message', (message) => {
      this.onReceive(message);
    });
    this.socket.on('system', (message) => {
      this.onReceive({ from: '系统', text: message, isSystem: true });
    });
    this.socket.on('statistic', (count) => {
      this.tip = count ? `当前在线人数：${count}` : '';
    });
    this.socket.on('exception', (exception) => {
      console.warn(exception);
    });
  },
  methods: {
    onSend() {
      const { name, text } = this;
      if (name && text) {
        this.socket.emit('message', { from: name, text });
        this.joined = true;
        this.text = '';
      }
    },
    async onReceive(message) {
      this.messages.push(message);
      await this.$nextTick();
      const msgs = this.$refs.msgs;
      const { scrollHeight, offsetHeight } = msgs;
      msgs.scrollTo(0, scrollHeight - offsetHeight);
    },
  },
});
