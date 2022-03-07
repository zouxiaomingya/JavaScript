<template>
  <div class="create">
    <ul class="ulStyle" ref="ul_wrap">
      <li
        v-for="item in tabs"
        :id="flag == item.id ? 'liWidth' : ''"
        :class="{ liObj: flag == item.id }"
        class="lis"
        @click="clickLI(item.id, $event)"
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
    clickLI(id, e) {
      const target = e.target;
      const parentDom = this.$refs.ul_wrap;
      // 包裹的宽度
      // const parentWidth = this.$refs.ul_wrap.getBoundingClientRect().width;
      const windowWidth = window.innerWidth;
      // 中间值
      const diffWidth = (windowWidth - target.offsetWidth) / 2;
      // 需要滚动到的值
      const targetOffset = target.offsetLeft - diffWidth;
      this.moveSlow(parentDom.scrollLeft, targetOffset);

      this.flag = id;
      this.$nextTick(() => {
        this.width = document.getElementById("liWidth").offsetWidth;
        this.offsetW = document.getElementById("liWidth").offsetLeft;
        // 目的位置 = 点击tab的offsetLeft + 包裹子tab项的宽度/2 - tab栏的offsetLeft - tab栏宽度/2 - 包裹子tab的容器内右边距/2
      });
      // this.$forceUpdate()
    },

    moveSlow(distance, targetValue, step = 2) {
      // 防止抖动，移动到小于 step 就可以了, 这样就不会移动过头之后 又移回来
      if (Math.abs(distance - targetValue) < step) return;
      // 正向滚动
      if (distance < targetValue) {
        // 每隔1毫秒移动一小段距离，直到移动至目标至为止，反之亦然
        if (distance < targetValue) {
          distance += step;
          this.$refs.ul_wrap.scrollLeft = distance;
          setTimeout(() => {
            this.moveSlow(distance, targetValue, step);
          }, 1);
        } else {
          this.$refs.ul_wrap.scrollLeft = targetValue;
        }
      } else if (distance > targetValue) {
        // 反向滚动
        if (distance > targetValue) {
          distance -= step;
          this.$refs.ul_wrap.scrollLeft = distance;
          setTimeout(() => {
            this.moveSlow(distance, targetValue, step);
          }, 1);
        } else {
          this.$refs.ul_wrap.scrollLeft = targetValue;
        }
      }
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
    transition-duration: 0.3s;
  }
  .liObj {
    color: orangered;
  }
}
</style>
