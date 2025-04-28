export default class StateManager 
{
    GameStates = Object.freeze({
        GAME_BEGIN: 'game-begin',
        ROUND_START: 'round-start',
        GAME_PAUSED: 'game-paused',
        ROUND_END: 'round-end',
        GAME_OVER: 'game-over',
    })

    #currentGameState = null

    #enemyState = {
        entry: 0,
        maxEntry: 20,
        spawnPerTick: 5,
        spawnInterval: 5000,
    }

    #roundState = {
        interval: 30000,
        wave: 1,
    }

    constructor(scene) {
        this.#currentGameState = this.GameStates.GAME_BEGIN

        scene.events.on('change-game-state', (state) => {
            if (!Object.values(this.GameStates).includes(x => x === state)) return

            this.#currentGameState = this.GameStates[state]
        })
    }

    enemyState() {
        return this.#enemyState
    }

    updateEnemyState(data) {
        if (!data instanceof 'object') return

        Object.keys(this.#enemyState).forEach((keyState) => {
            if (data[keyState]) {
                this.#enemyState[keyState] = data[keyState]
            }
        })
    }

    currentGameState() {
        return this.#currentGameState
    }

    setGameState(gameState) {
        this.#currentGameState = gameState
    }

    roundState() {
        return this.#roundState
    }

    setRoundState(data) {
        if (!data instanceof 'object') return

        Object.keys(this.#roundState).forEach((keyState) => {``
            if (data[keyState]) {
                this.#roundState[keyState] = data[keyState]
            }
        })
    }
}