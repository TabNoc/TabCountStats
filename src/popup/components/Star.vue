<script setup lang="ts">

const props = defineProps<{
	priority?: number
}>();

const emit = defineEmits<{
	(e: 'setPriority', newPriority: number): void
	(e: 'removePriority'): void
}>();

function setNewPriority() {
	if (props.priority !== undefined) {
		emit('removePriority');
	}
	else {
		let newPriority = 1;
		try {
			newPriority = parseInt(
				// eslint-disable-next-line no-alert
				prompt(
					'Wich priority has this window? (higher number -> higher position)',
					'1',
				)!,
			);
			if (Number.isNaN(newPriority))
				return; // do not add if no valid input
		}
		catch (error) {
			console.warn(error);
		}
		emit('setPriority', newPriority);
	}
}
</script>
<template>
  <div class="starWrap">
    <span
      class="star"
      :class="{ 'active tooltip': props.priority !== undefined }"
      @click="setNewPriority()"
    >
      <span
        v-if="props.priority !== undefined"
        class="tooltiptext tooltip-bottom"
      >
        {{ props.priority }}</span>
    </span>
  </div>
</template>

<style scoped>
/*https://www.flaticon.com/de/kostenloses-icon/star_1828961*/
.star .starWrap {
	margin: 0;
	padding: 0;
}

.starWrap {
	border-radius: 50%;
	display: inline-block;
	height: 1.5em;
	width: 1.5em;
	box-sizing: unset;
	text-align: center;
}

.starWrap:hover {
	background-color: #e5e5e5;
}

.star::before {
	/*★*/
	/*https://estelle.github.io/CSS-JS-Entity-Calculator/*/
	content: '\2605';
}

.star {
	color: #ccd6dd;
	cursor: pointer;
	text-align: center;
}

.star:hover,
.star.active {
	color: #ffac33;
}

/* https://www.w3schools.com/howto/howto_css_tooltip.asp */
/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
	visibility: visible;
	opacity: 1;
}

/* Tooltip arrow */
.tooltip-bottom::after {
	content: "";
	position: absolute;
	bottom: 100%;
	left: 50%;
	margin-left: -5px;
	border-width: 5px;
	border-style: solid;
	border-color: transparent transparent #555 transparent;
}

.tooltip .tooltiptext {
	visibility: hidden;
	position: absolute;
	width: 20px;
	background-color: #555;
	color: #fff;
	text-align: center;
	padding: 5px 0;
	border-radius: 6px;
	z-index: 1;
	opacity: 0;
	transition: opacity 0.3s;
}

.tooltip-bottom {
	top: 135%;
	left: 50%;
	margin-left: -10px;
}

.tooltip {
	position: relative;
	display: inline-block;
	color: #006080;
}

</style>
