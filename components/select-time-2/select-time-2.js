
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //天数
    day: {
      type: Number
    },
    // 取车对象
    /**
     * 对象属性
     * show: false,
      value: [0, 0],
      year: [],
      time: []
     */
    pickUpConfig: {
      type: Object
    },
    //用车需求
    useCarConfig: {
      type: Object
    },
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
    pickUpClick: function () {
      this.triggerEvent("pickUpClick");
    },
    useCarClick: function () {
      this.triggerEvent("useCarClick")
    },
    pickUpChange: function (e) {
      console.log("组件内", e);
      var myEventDetail = e.detail;
      this.triggerEvent("pickUpChange", myEventDetail);
    },
    useCarChange: function (e) {
      var myEventDetail = e.detail;
      this.triggerEvent("useCarChange", myEventDetail);
    },
    pickUpOk: function () {
      this.triggerEvent("pickUpOk");
    },
    useCarOk: function () {
      this.triggerEvent("useCarOk");
    },
    pickUpCancel: function () {
      this.triggerEvent("pickUpCancel")
    },
    useCarCancel: function () {
      this.triggerEvent("useCarCancel")
    }
  },
  options: {
    addGlobalClass: true,
  }
})
