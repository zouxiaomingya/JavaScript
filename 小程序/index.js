import { Toast } from 'live/common/toast';

Component({
  data: {
    
  },

  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },

  properties: {
    show: Boolean,
    shareIcon: {
      type: Boolean,
      value: true,
    },
    posterIcon: {
      type: Boolean,
      value: true,
    },
  },

  methods: {
    onHide() {
      if (this.data.posterLoading) Toast.clear();
      this.triggerEvent('close');
    },
    resetPoster() {
      this.setData({ posterUrl: '' });
    },
    noop() {},
  },

  observers: {
    show(showable) {
      
    },
  },
});
