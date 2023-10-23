<script>
export default {
  name: "SearchForm",
  data: () => ({
    searchString: "",
    timer: null,
  }),
  methods: {
    onChange: function () {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$store.commit("clearList");
        this.$store.commit("setSearchString", this.searchString);
        this.$store.dispatch("searchStrings");
      }, 500);
    },
  },
};
</script>

<template>
  <div class="section-search">
    <a-input
      v-model="searchString"
      @change="this.onChange"
      placeholder="search text"
      :maxLength="100"
    >
      <a-icon slot="prefix" type="search" />
    </a-input>
    <a-spin class="search-spin" :spinning="this.$store.state.isSearch" />
  </div>
</template>

<style scoped>
.section-search {
  width: 800px;
  margin-top: 30px;
}
.search-spin {
  position: absolute;
  margin-left: -30px;
  margin-top: 5px;
}
</style>
