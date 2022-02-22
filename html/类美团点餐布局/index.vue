<template>
  <div class="serve uflex">
    <div class="menu" ref="menuWrapper">
      <div class="menu-list" v-for="(item, index) in menu" :key="index">
        <div
          class="menu-item"
          :class="{ select: +activeKey === +item.key }"
          @click="handleMenuItem(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="right" ref="rightWrapper">
      <div class="list list-hook" v-for="item in arr">
        <div class="title-wrap">
          <div class="title uflex uCenterY">
            <img class="icon" :src="item.icon" alt="" />
            <span class="text">{{ item.title }}</span>
          </div>
        </div>
        <div
          class="banner-bg"
          :style="{ 'background-image': 'url(' + item.bg + ')' }"
        >
          {{ item.title }} 服务到这里
        </div>
        <div
          v-for="item in item.list"
          :key="item.id"
          class="uBet item uCenterY"
        >
          <div class="item-name">{{ item.tabName }}</div>
          <div><van-icon name="arrow" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const arr = [
  {
    title: "工商",
    icon: require("assets/serve/0.png"),
    bg: require("assets/serve/0-bg.png"),
    list: [
      { id: "0", tabName: "工商注册" },
      { id: "1", tabName: "公司名称变更" },
      { id: "2", tabName: "公司经营范围变更" },
      { id: "3", tabName: "公司股权变更" },
      { id: "4", tabName: "公司法人变更" },
      { id: "5", tabName: "公司地址变更（同区）" },
      { id: "6", tabName: "公司增资（认缴）" },
      { id: "7", tabName: "公司减资（认缴）" },
      { id: "8", tabName: "公司地址变更（跨区）" },
      { id: "9", tabName: "公司迁移" },
      { id: "10", tabName: "工商异常处理" },
      { id: "11", tabName: "小规模公司注销" },
      { id: "12", tabName: "企业工商年报" },
      { id: "13", tabName: "银行开户" },
      { id: "14", tabName: "刻章" },
      { id: "15", tabName: "税控托管＋领票＋开票" },
    ],
  },
  {
    title: "法律服务",
    icon: require("assets/serve/1.png"),
    bg: require("assets/serve/1-bg.png"),
    list: [
      {
        id: "0",
        tabName:
          "不涉及财产关系，按件计收，每件10000元至50000元，重大、疑难，复杂的，双方可以另行协商。",
      },
      {
        id: "1",

        tabName: "代理申诉和控告（立案阶段）、申请取保侯审，每件收取10000元。",
      },
      {
        id: "2",
        tabName:
          "代理侦查阶段（含检察院自侦）、审查起诉阶段、审判一审阶段整个过程的，按件收取，每件收取30000-100000元，重大、疑难，复杂的，双方可以协商收取。",
      },
      {
        id: "3",
        tabName:
          "分阶段代理的，按阶段收取，每阶段收取10000-50000元，重大、疑难，复杂的，双方可以协商收取。",
      },
      {
        id: "4",
        tabName:
          "代理自诉和被害人案件（不涉及财产关系）,按件收取，每件收取10000-50000元，重大、疑难，复杂的，双方可以协商收取。涉及财产关系及附带民事诉讼，按民事案件收费标准收取。",
      },
      {
        id: "5",
        tabName:
          "办理各类诉讼案件的申诉，按件计收，每件10000—50000元，进入再审程序后，按各类诉讼案件的收费标准计收，已代理过一审或二审并收取费用的，本阶段减收50%，重大、疑难，复杂的，双方可以协商。",
      },
      {
        id: "6",
        tabName:
          "执行案件，按申请标的额2-10%协商收取，风险代理的案件还可以按最终执行标的额的10-30%协商收取。",
      },
    ],
  },
  {
    title: "财税服务",
    icon: require("assets/serve/2.png"),
    bg: require("assets/serve/2-bg.png"),
    list: [
      { id: "0", tabName: "小规模初创期套餐" },
      { id: "1", tabName: "小规模成长期套餐" },
      { id: "2", tabName: "小规模成熟期套餐" },
      { id: "3", tabName: "小规模稳定期套餐" },
      {
        id: "4",
        tabName: "一般纳税人初创期套餐一般纳税人成长期套餐",
      },
      { id: "5", tabName: "一般纳税人腾飞期套餐" },
      { id: "6", tabName: "一般纳税人成熟期套餐" },
      { id: "7", tabName: "一般纳税人稳定期套餐" },
      { id: "8", tabName: "一般纳税人裂变期套餐" },
    ],
  },
  {
    title: "资质申报",
    icon: require("assets/serve/3.png"),
    bg: require("assets/serve/3-bg.png"),
    list: [
      { id: "0", tabName: "高新技术企业" },
      { id: "1", tabName: "软件著作权" },
      { id: "2", tabName: "国家AAA级信用企业认定证书" },
      {
        id: "3",
        tabName: "ISO14001-环境管理体系认证证书（环境认证）",
      },
      {
        id: "4",
        tabName: "OHSAS 18001:2007职业健康安全管理认证",
      },
      {
        id: "5",
        tabName: "ISO/IEC20000:2011--IT服务管理体系认证（服务认证）",
      },
      {
        id: "6",
        tabName: "ISO/IEC27001:2013--信息安全管理体系认证",
      },
      {
        id: "7",
        tabName: "ITSS信息技术服务运行维护标准符合性证书",
      },
      {
        id: "8",
        tabName: "GB/T29490-2013知识产权管理体系认证",
      },
      { id: "9", tabName: "知识产权惯标认证书" },
      { id: "10", tabName: "江西省服务业龙头企业" },
    ],
  },
];
export default {
  data() {
    return {
      menu: [
        { key: 0, text: "工商" },
        { key: 1, text: "法律服务" },
        { key: 2, text: "财税服务" },
        { key: 3, text: "资质申报" },
      ],
      activeKey: 0,
      arr,
      listHeight: [],
      scrollTop: 0,
    };
  },
  watch: {
    currentIndex(value) {
      this.activeKey = value;
    },
  },
  computed: {
    currentIndex: {
      get: function () {
        for (var i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (
            !height2 ||
            (this.scrollTop >= height1 && this.scrollTop < height2)
          ) {
            return i;
          }
        }
        return 0;
      },
    },
  },
  components: {},

  mounted() {
    this.initScroll();
    this.calculateHeight();
  },

  beforeDestroy() {
    this.removeScroll();
  },

  methods: {
    initScroll() {
      this.$refs.rightWrapper.addEventListener("scroll", this.contentDomScroll);
    },
    removeScroll() {
      this.$refs.rightWrapper.removeEventListener(
        "scroll",
        this.contentDomScroll
      );
    },

    contentDomScroll() {
      const rightWrapperDom = this.$refs.rightWrapper;
      this.scrollTop = Math.abs(rightWrapperDom.scrollTop);
    },

    calculateHeight() {
      let contentList =
        this.$refs.rightWrapper.getElementsByClassName("list-hook");
      let height = 0;
      this.listHeight.push(height);
      for (var i = 0; i < contentList.length; i++) {
        let item = contentList[i];
        // 元素内容及其边框所占据的空间大小
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    handleMenuItem(key) {
      this.activeKey = key;
      this.$toast.success(key);
      let contentList =
        this.$refs.rightWrapper.getElementsByClassName("list-hook");
      let el = contentList[key];

      // 移除在创建，是 安卓 会出现 menu 点击的高亮出现异常，问题不详
      this.removeScroll();
      el.scrollIntoView();
      setTimeout(() => {
        this.initScroll();
      });
    },
  },
};
</script>
<style lang="less" scoped>
.serve {
  height: calc(100vh - 50px);
  overflow: hidden;
  position: relative;

  .menu {
    flex-shrink: 0;
    background: #f7f8fa;

    .menu-item {
      position: relative;
      box-sizing: border-box;
      padding: 20px 12px;
      overflow: hidden;
      color: #323233;
      font-size: 14px;
      background-color: #f7f8fa;
      cursor: pointer;
      -webkit-user-select: none;
      user-select: none;
    }
    .select {
      background-color: #fff;

      &::before {
        position: absolute;
        top: 50%;
        left: 0;
        width: 0.10667rem;
        height: 0.42667rem;
        background-color: #517fff;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        content: "";
      }
    }
  }
  .right {
    padding: 0 18px;
    flex: 1 1 auto;
    overflow-y: auto;
    .title-wrap {
      background: #fff;
      position: sticky;
      z-index: 2;
      top: 0;
    }
    .title {
      height: 34px;
      line-height: 34px;
    }
    .icon {
      width: 14px;
      height: 14px;
    }
    .text {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #000000;
      padding-left: 6px;
    }
    .banner-bg {
      height: 42px;
      background-size: 100%;
      line-height: 42px;
      padding-left: 13px;
      font-size: 13px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
    }

    .item {
      padding: 9px 14px;
      border-bottom: 1px #f8f8f8 solid;
      line-height: 22px;

      .item-name {
        padding-right: 8px;
      }
    }
  }
}
</style>
