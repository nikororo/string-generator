<script>
import api from "../api/IndexedDB";

export default {
  name: "StringList",
  data: () => ({
    pagination: {
      pageSize: 100,
      position: "both",
    },
  }),
  async created() {
    const stringListData = await api.getStringList();
    this.$store.commit("setStringList", stringListData.stringList || []);
    this.$store.commit("setEndPercent", stringListData.endPercent || 0);
    this.pagination.onChange = this.changePage;
  },
  methods: {
    changePage: async function (page) {
      const { stringList, endPercent } = this.$store.state;
      const isLastPage =
        stringList.length / (this.pagination.pageSize * page) === 1;
      if (isLastPage) {
        const stringListData = await api.getStringList(endPercent);
        this.$store.commit("setStringList", [
          ...stringList,
          ...stringListData.stringList,
        ]);
        this.$store.commit("setEndPercent", stringListData.endPercent);
      }
    },
  },
};
</script>

<template>
  <div class="section-list">
    <a-list
      item-layout="vertical"
      size="large"
      :pagination="pagination"
      :data-source="this.$store.state.stringList"
    >
      <a-list-item slot="renderItem" key="item.title" slot-scope="item">
        {{ item }}
      </a-list-item>
    </a-list>
  </div>
</template>

<style scoped>
.section-list {
  width: 800px;
  margin-bottom: 50px;
}
</style>
