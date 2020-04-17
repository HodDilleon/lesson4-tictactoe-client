// контейнер состояния
var sourceOfTruth = {
  authHeader: '',
  userName: '',
};

Vue.component('Cell', { 
  data: function() {
    return {
      sourceOfTruth
    }
  },
  props: [
    'item',
    'x',
    'y'
  ],
  
  methods: {
    makeMove: function(x, y) {
      axios.post('http://localhost:2000/move', {x, y}, {
        headers: {
          authorization: this.sourceOfTruth.authHeader
        }
      })
    }
  },

  template: `
    <div class="cell" v-on:click="makeMove(x+1, y+1)">
      <div v-if="item == 1">X</div>
      <div v-if="item == 2">0</div>
    </div>
  `
})

const app = new Vue({
  el: '#app',
  data: {
    field: [],
    message: 'Привет, Vue!',
    authLogin: '',
    authPassword: '',
    regLogin: '',
    regPassword: '',
    regStatusMsg: '',
    authHeader: '',
    games: [],
    sourceOfTruth,
  },

  methods: {
    clickButton: function() {
      this.message = 'Привет, Max';
    },

    login: function(login, password) {
      axios.post('http://localhost:2000/login', {login, password}).then((res) => {
        if (res.status === 200) {
          this.sourceOfTruth.authHeader = res.data;
          this.sourceOfTruth.userName = login;
        }
      });
    },

    register: function(login, password) {
      axios.post('http://localhost:2000/register', {login, password})
        .then((res) => {
          if (res.status === 200) {
            this.regStatusMsg = `Пользователь "${login}" зарегистрирован`;
            this.regLogin = '';
            this.regPassword = '';
          }
        })
        .catch((err) => {
          this.regStatusMsg = 'Во время регистрации произошла ошибка'
        })  
        .finally(() => {
          setTimeout(() => {
            this.regStatusMsg = '';
          }, 5000);
        });
    },

    createNewGame: function() {
      axios.post('http://localhost:2000/createNewGame', null, {
        headers: {
          authorization: this.sourceOfTruth.authHeader
        }
      }).then((res) => {
          if (res.status === 200) {
            setInterval(() => {
              axios.get('http://localhost:2000/getField', {
                headers: {
                  authorization: this.sourceOfTruth.authHeader
                }
              }).then((res) => {
                this.field = res.data;
              });
            }, 1000);
          }
        });
    },

    getExistingGames: function() {
      axios.get('http://localhost:2000/getExistingGames', {
        headers: {
          authorization: this.sourceOfTruth.authHeader
        }
      }).then((res) => {
        if (res.status === 200) {
          this.games = res.data;
        }
      })
    },

    joinGame: function(gameId) {
      axios.post('http://localhost:2000/joinGame', { gameId } , {
        headers: {
          authorization: this.sourceOfTruth.authHeader
        }
      }).then((res) => {
          if (res.status === 200) {
            setInterval(() => {
              axios.get('http://localhost:2000/getField', {
                headers: {
                  authorization: this.sourceOfTruth.authHeader
                }
              }).then((res) => {
                this.field = res.data;
              });
            }, 1000);
          }
        });
    },
  },

  mounted: function() {
    
  }
})