export default class StateManager 
{
    #gameStates = Object.freeze({
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
        this.#currentGameState = this.#gameStates.GAME_BEGIN

        scene.events.on('change-game-state', (state) => {
            if (!Object.values(this.#gameStates).includes(x => x === state)) return

            this.#currentGameState = this.#gameStates
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

    gameState() {
        let enumGameState = this.#gameStates

        return enumGameState.GAME_BEGIN
    }

    setGameState() {
        
    }
}