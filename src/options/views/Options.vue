<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { storageDemo } from '~/logic/storage/storage'; </script>

<template>
  <div>
    <img src="/assets/icon.svg" class="icon-btn mx-2 text-2xl" alt="extension icon">
    <div>Options</div>
    <p class="mt-2 opacity-50">
      This is the options page
    </p>

    <input v-model="storageDemo" class="border border-gray-400 rounded px-2 py-1 mt-2">

    <div class="mt-4">
      Powered by Vite
      <pixelarticons-zap class="align-middle" />
    </div>
  </div>

  <div>
    <h5>Other</h5>
    <div class="flexbox">
      <ul>
        <li>
          <router-link class="btn mt-1" to="Chart">
            Switch to Chart
          </router-link>
        </li>

        <li>
          <router-link class="btn mt-1" to="AdditionalTabs">
            Switch to AdditionalTabs
          </router-link>
        </li>

        <li>
          <router-link class="btn mt-1" to="AdditionalWindows">
            Switch to AdditionalWindows
          </router-link>
        </li>
      </ul>
    </div>
  </div>

  <div class="text-slate-400">
    <h4>Used Software:</h4>
    <div class="underline decoration-sky-500">
      <a href="https://www.flaticon.com/free-icons/tab" title="tab icons">Tab icons created by Freepik - Flaticon</a>
    </div>
  </div>
</template>
