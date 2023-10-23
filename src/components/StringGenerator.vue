<script>
import api from "../api/IndexedDB";

export default {
  name: "StringGenerator",
  data: () => ({
    percent: 0,
    addPercent: 0.1, // (this.numGeneratedStrings / this.maxGeneratedStrings) * 100%;
    isGenerate: false,
    numGeneratedStrings: 10000,
    maxGeneratedStrings: 10000000,
    partStrings: [],
  }),
  mounted() {
    const localPercent = Number(localStorage.getItem("percent"));

    if (localPercent !== null) this.percent = localPercent;

    if (localPercent > 0 && localPercent < 100) this.generateStrings();
  },
  methods: {
    generateStrings: function () {
      this.isGenerate = true;

      if (this.percent >= 100) {
        this.percent = 0;
        localStorage.setItem("percent", 0);
        api.deleteStringList();
        this.$store.commit("clearList");
      }

      setTimeout(
        function generatePartStrings() {
          for (let i = 0; i < this.numGeneratedStrings; i++) {
            let newRandomString = "";
            for (let j = 0; j < 100; j++) {
              newRandomString += String.fromCharCode(
                Math.floor(33 + Math.random() * (126 + 1 - 33))
              );
            }
            this.partStrings.push(newRandomString);
          }

          this.percent = Number((this.percent + this.addPercent).toFixed(1));
          localStorage.setItem("percent", this.percent);
          api.addStrings(this.percent, this.partStrings);
          this.partStrings = [];
          if (this.percent === 0.1 || this.percent % 5 === 0) {
            this.$store.dispatch("searchStrings");
          }

          if (this.percent < 100) {
            setTimeout(generatePartStrings.bind(this));
          } else {
            this.isGenerate = false;
          }
        }.bind(this)
      );
    },
  },
};
</script>

<template>
  <div class="section-generator">
    <a-progress
      class="progress-generate"
      :stroke-color="{
        '0%': '#108ee9',
        '100%': '#87d068',
      }"
      :percent="percent"
    />
    <a-button @click="generateStrings" :loading="isGenerate">
      Сгенерировать
    </a-button>
  </div>
</template>

<style scoped>
.section-generator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 800px;
  margin-top: 50px;
}
.progress-generate {
  width: 78%;
}
</style>
