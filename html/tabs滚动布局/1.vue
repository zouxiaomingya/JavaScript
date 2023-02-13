<template>
  <div class="create">
    <ul class="ulStyle">
      <li
        v-for="item in tabs"
        :id="flag == item.id ? 'liWidth' : ''"
        :class="{ liObj: flag == item.id }"
        class="lis"
        @click="clickLI(item.id)"
      >
        {{ item.title }}
      </li>
      <li
        class="liStyle li2"
        :style="`width:${width}px;transform:translateX(${offsetW}px);`"
      ></li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: "",
      offsetW: "",
      flag: 0,
      tabs: [
        {
          id: 0,
          title: "tab1",
        },
        {
          id: 1,
          title: "tab2",
        },
        {
          id: 2,
          title: "tab31",
        },
        {
          id: 3,
          title: "tab4",
        },
        {
          id: 4,
          title: "tab5",
        },
        {
          id: 5,
          title: "tab6",
        },
        {
          id: 6,
          title: "tab71",
        },
        {
          id: 7,
          title: "tab71",
        },

        {
          id: 8,
          title: "tab71",
        },
        {
          id: 9,
          title: "tab71",
        },
        {
          id: 10,
          title: "tab71",
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.width = document.getElementById("liWidth").offsetWidth;
      this.offsetW = document.getElementById("liWidth").offsetLeft;
    });
  },
  methods: {
    clickLI(id) {
      this.flag = id;
      this.$nextTick(() => {
        this.width = document.getElementById("liWidth").offsetWidth;
        this.offsetW = document.getElementById("liWidth").offsetLeft;
      });
      // this.$forceUpdate()
    },
  },
};
</script>

<style lang="less" scoped>
.create {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.ulStyle::-webkit-scrollbar {
  width: 0 !important;
  display: none;
}

.ulStyle {
  display: flex;
  overflow-x: auto;
  // 苹果弹性滚动
  overflow-y: hidden;
  height: 50px;
  background: rgb(216, 211, 211);
  position: relative;

  .lis {
    flex-shrink: 0;
    list-style: none;
    line-height: 50px;
    height: 50px;
    padding: 0 10px;
    margin: 0 5px;
    font-size: 14px;
    color: #000;
    cursor: pointer;
  }

  .liStyle {
    -webkit-overflow-scrolling: touch;
    list-style: none;
    height: 3px;
    background: orangered;
    position: absolute;
    bottom: 0;
  }
  .li2 {
    transition-duration: 0.1s;
  }
  .liObj {
    color: orangered;
  }
}
</style>
