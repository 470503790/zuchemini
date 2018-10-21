// components/select-time/select-time.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //天数
    day:{
      type:Number
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
      type:Object
    },
    //还车对象
    returnConfig: {
      type:Object
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
    pickUpClick:function(){
      this.triggerEvent("pickUpClick");
    },
    returnClick:function(){
      this.triggerEvent("returnClick")
    },
    pickUpChange:function(e){
      console.log("组件内",e);
      var myEventDetail =e.detail;
      this.triggerEvent("pickUpChange",myEventDetail);
    },
    returnChange:function(e){
      var myEventDetail =e.detail;
      this.triggerEvent("returnChange",myEventDetail);
    },
    pickUpOk:function(){
      this.triggerEvent("pickUpOk");
    },
    returnOk:function(){
      this.triggerEvent("returnOk");
    },
    pickUpCancel:function(){
      this.triggerEvent("pickUpCancel")
    },
    returnCancel:function(){
      this.triggerEvent("returnCancel")
    }
  },
  options: {
    addGlobalClass: true,
  }
})
