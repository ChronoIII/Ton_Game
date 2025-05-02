export default class StateManager 
{
    #scene

    GameStates = Object.freeze({
        GAME_BEGIN: 'game-begin',
        ROUND_START: 'round-start',
        GAME_PAUSED: 'game-paused',
        ROUND_END: 'round-end',
        GAME_OVER: 'game-over',
    })

    #currentGameState = null

    #playerState = {
        coin: 0,
        upgrades: [],
        commands: [
            'RZR',
            'B-STRK'
        ],
    }

    #enemyState = {
        entry: 0,
        maxEntry: 20,
        spawnPerTick: 5,
        spawnInterval: 5000,
    }

    #roundState = {
        remainingSec: 5000,
        interval: 5000,
        wave: 1,
    }

    constructor(scene) {
        this.#scene = scene

        this.#currentGameState = this.GameStates.GAME_BEGIN

        scene.events.on('change-game-state', (state) => {
            if (!Object.values(this.GameStates).includes(x => x === state)) return

            this.#currentGameState = this.GameStates[state]
        })
    }

    playerState() {
        return this.#playerState
    }

    updatePlayerState(data) {
        Object.keys(this.#playerState).forEach((keyState) => {
            if (data[keyState]) {
                this.#playerState[keyState] = data[keyState]
            }
        })

        this.#scene.events.emit('[stateManager]game-status_player-update', this.#playerState)
    }

    enemyState() {
        return this.#enemyState
    }

    updateEnemyState(data) {
        Object.keys(this.#enemyState).forEach((keyState) => {
            if (data[keyState]) {
                this.#enemyState[keyState] = data[keyState]
            }
        })

        this.#scene.events.emit('[stateManager]game-enemy-update', this.#playerState)
    }

    currentGameState() {
        return this.#currentGameState
    }

    setGameState(gameState) {
        this.#currentGameState = gameState

        this.#scene.events.emit('[stateManager]game-status_game-update', this.#currentGameState)
    }

    roundState() {
        return this.#roundState
    }

    setRoundState(data) {
        Object.keys(this.#roundState).forEach((keyState) => {
            if (data[keyState]) {
                this.#roundState[keyState] = data[keyState]
            }
        })

        this.#scene.events.emit('[stateManager]game-status_round-update', this.#roundState)
    }
}