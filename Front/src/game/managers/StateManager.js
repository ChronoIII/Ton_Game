export default class StateManager 
{
    GameStates = Object.freeze({
        GAME_BEGIN: 'game-begin',
        ROUND_START: 'round-start',
        ROUND_END: 'round-end',
        GAME_OVER: 'game-over',
    })

    #waveLevel = 1

    #currentGameState = null

    #enemyState = {
        entry: 0,
        maxEntry: 20,
        spawnPerTick: 5,
        spawnInterval: 5000,
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
}