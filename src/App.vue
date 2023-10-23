<script setup>
import StringGenerator from "./components/StringGenerator.vue";
import SearchForm from "./components/SearchForm.vue";
import StringList from "./components/StringList.vue";
</script>

<template>
  <div id="app">
    <main>
      <div class="container">
        <StringGenerator />
        <SearchForm />
        <StringList />
      </div>
    </main>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
