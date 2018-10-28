// components/set-address/set-address.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    addresses:{
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    setAddress:function(e){
      var dataset=e.currentTarget.dataset;
      this.triggerEvent("setAddress", dataset);
    }
  },
  options: {
    addGlobalClass: true,
  }
})
