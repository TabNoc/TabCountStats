<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { storageDemo } from '~/logic/storage/storage';
</script>

<template>
  <div>
    <img src="/assets/icon.svg" class="icon-btn mx-2 text-2xl" alt="extension icon">
    <div>Options</div>
    <SharedSubtitle />

    <input v-model="storageDemo" class="border border-gray-400 rounded px-2 py-1 mt-2">

    <div class="mt-4">
      Powered by Vite
      <pixelarticons-zap class="align-middle inline-block" />
    </div>
  </div>

  <div>
    <h5>Other</h5>
    <div class="flexbox">
      <ul>
        <li>
          <RouterLink class="btn mt-1" to="Chart">
            Switch to Chart
          </RouterLink>
        </li>

        <li>
          <RouterLink class="btn mt-1" to="AdditionalTabs">
            Switch to AdditionalTabs
          </RouterLink>
        </li>

        <li>
          <RouterLink class="btn mt-1" to="AdditionalWindows">
            Switch to AdditionalWindows
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>

  <div class="text-slate-400">
    <h4>Used Software:</h4>
    <div class="underline decoration-sky-500">
      <ul>
        <li>
          <a href="https://www.flaticon.com/free-icons/tabs" title="tabs icons">Tabs icons created by Pixel perfect - Flaticon</a>
        </li>
        <li>
          <a href="https://www.flaticon.com/free-icons/new-tab" title="new tab icons">New tab icons created by Pixel perfect - Flaticon</a>
        </li>
        <li>
          <a href="https://icons8.com/icon/83244/hilfe">Hilfe</a> icon by <a href="https://icons8.com">Icons8</a>
        </li>
        <li>
          <a href="https://icons8.com/icon/82736/speichern">Speichern</a> icon by <a href="https://icons8.com">Icons8</a>
        </li>
      </ul>
    </div>
  </div>
</template>
