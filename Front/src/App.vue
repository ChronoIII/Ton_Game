<script setup>
import { ref } from 'vue';
import PhaserGame from './game/PhaserGame.vue';

// The sprite can only be moved in the MainMenu Scene
const canMoveSprite = ref();

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();

//  This event is emitted from the PhaserGame component:
const currentScene = (scene) => {

    canMoveSprite.value = (scene.scene.key !== 'MainMenu');

}
</script>

<template>
    <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
</template>
