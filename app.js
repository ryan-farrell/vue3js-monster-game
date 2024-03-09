function getRandomValue(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
	data() {
		return {
			playerHealth: 100,
			monsterHealth: 100,
			currentRounds: 0,
            winner: null,
            result: '',
            logMessages: [],
		};
	},
	methods: {
		attackMonster() {
			this.currentRounds++;
			const attackValue = getRandomValue(5, 12);
			this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
		},
		attackPlayer() {
			const attackValue = getRandomValue(8, 15);
            this.playerHealth -= attackValue;
            this.addLogMessage('monster', 'attack', attackValue);
		},
		specialAttackMonster() {
			this.currentRounds++;
			const attackValue = getRandomValue(10, 25);
			this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'SP attack', attackValue);
            this.attackPlayer();
		},
		healPlayer() {
			this.currentRounds++;
			const healValue = getRandomValue(8, 20);
			if (this.playerHealth + healValue > 100) {
				this.playerHealth = 100;
			} else {
				this.playerHealth += healValue;
			}
            this.addLogMessage('player', 'heals', healValue);
            this.attackPlayer();
        },
        startNewGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRounds = 0;
            this.winner = null;
            this.result = '';
            this.logMessages = [];
        },
        surrender() {
            this.winner = 'monster';
        },
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value,
            });
        },
	},
	computed: {
        updatePlayerStyles() {
            if (this.playerHealth < 0) {
                return { width: '0%' , backgroundColor: 'red'};
            }
			return { width: this.playerHealth + '%' };
		},
        updateMonsterStyles() {
            if (this.monsterHealth < 0) {
                return { width: '0%', backgroundColor: 'red' };
            }
			return { width: this.monsterHealth + '%' };
		},
		isSpecialAttackAvailable() {
			if (this.currentRounds === 0) {
				return true;
			}
			return this.currentRounds % 3 !== 0;
		},
	},
	watch: {
		playerHealth(value) {
			if (value <= 0 && this.monsterHealth <= 0) {
				this.winner = 'draw';
			} else if (value <= 0) {
				this.winner = 'monster';
			}
		},
		monsterHealth(value) {
			if (value <= 0 && this.playerHealth <= 0) {
				this.winner = 'draw';
			} else if (value <= 0) {
                this.winner = 'player';
			}
        },
        winner(value) {
            if (value === 'draw') {
                return this.result = 'It\'s a draw!';
            } else if (value === 'player') {
                return (this.result = 'Player wins!');
            } else if (value === 'monster') {
                return (this.result = 'Monster wins!');
            }
        }
	},
});

app.mount('#game');
