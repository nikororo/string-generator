import Vue from "vue";
import Vuex from "vuex";
import api from "../api/IndexedDB";

import { maxDisplayedStrings } from "../api/IndexedDB";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    stringList: [],
    endPercent: 0,
    searchString: "",
    isSearch: false,
    searchTimer: null,
  },

  mutations: {
    setStringList(state, stringList) {
      state.stringList = stringList;
    },
    setEndPercent(state, endPercent) {
      state.endPercent = endPercent;
    },
    setSearchString(state, searchString) {
      state.searchString = searchString;
    },
    clearList: (state) => {
      state.stringList = [];
      state.endPercent = 0;
    },
  },

  actions: {
    searchStrings: async ({ state, commit, dispatch }) => {
      if (state.isSearch) {
        clearTimeout(state.searchTimer);
        state.searchTimer = setTimeout(() => {
          dispatch("searchStrings");
        }, 500);
        return;
      }

      const filteredStringList = state.stringList;
      state.isSearch = true;
      while (
        filteredStringList.length < maxDisplayedStrings &&
        state.endPercent < 100
      ) {
        const startPercent = Number((state.endPercent + 0.1).toFixed(1));
        const stringListData = await api.getStringList(startPercent);

        if (!stringListData) return;

        commit("setEndPercent", Number(stringListData.endPercent));

        const list = stringListData.stringList.filter((str) =>
          str.includes(state.searchString)
        );
        filteredStringList.push(...list);
        commit("setStringList", filteredStringList);
      }
      state.isSearch = false;
    },
  },
});

export default store;
