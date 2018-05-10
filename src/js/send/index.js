/*
 * @Desc:  寄件交互js
 *
 * @Author: zhangliang
 * @E-Mail: 1471299010@qq.com
 * @Date: 2018-05-07 15:12:01
 * @Last Modified by: zhangliang
 * @Last Modified time: 2018-05-10 19:17:41
 */

$(function () {

  // 起运地
  var data1 = [
    {
      text: '澳洲',
      value: 1
    },
    {
      text: '美洲',
      value: 2
    }
  ]
  // var sendEl = $('#js_sender_address');
  // var sendPick = new Picker({
  //   title:'选择起运地',
  //   data: [data1]
  // })
  // sendPick.on('picker.select', function (selectedVal, selectedIndex){
  //   console.log(data1[selectedIndex[0]].text)
  //   sendEl.find('.text')[0].innerText = data1[selectedIndex[0]].text;
  // });

  // sendPick.on('picker.change', function (index, selectedIndex){
  //   console.log(index);
  // })

  // sendPick.on('picker.valuechange', function (selectedVal, selectedIndex) {
  //   console.log(selectedVal);
  // })

  // sendEl[0].addEventListener('click', function(){
  //   sendPick.show();
  // })

  // 元素
  var $sendLayer = $('#js_send_layer'),
      $recevingLayer = $('#js_receving_layer'),
      $iosMask = $('#layerMask'),
      $actionsheet = $('.weui_actionsheet'),
      $send = $('#js_sender_address'),
      $receving =  $('#js_receiving_address'),
      $prdService = $('#js_ztd_service'),
      $prdServiceLayer = $('#js_prd_service_layer'),
      $ztdAddress = $('#js_ztd_address'),
      $ztdLayer = $('#js_ztd_layer');

  var opt = { //我要寄件
    init: function (){
      // 选择起运地
      opt.sendAddress()
      // 选择目的地
      opt.recevingAddress()
      // 关闭actionsheet
      opt.closeActionSheet()

      opt.ztdAddress();

      // 提交
      opt.submit()

    },
    prams:{ // 参数
      id:'',
      send:'0', //起运地
      receving:'0', //目的地
    },
    hideActionSheet: function(Elm){  // 传递元素  隐藏actionsheet
      Elm.removeClass('weui_actionsheet_toggle');
      $iosMask.removeClass('weui_mask_visible');
    },
    showActionSheet: function(Elm){ // 传递元素  展示actionsheet
      Elm.addClass('weui_actionsheet_toggle');
      $iosMask.addClass('weui_mask_visible');
    },
    closeActionSheet:function(){ // 关闭actionSheet
      $iosMask.on('click',function(){
        opt.hideActionSheet($actionsheet)
      });

      $('.actionClose').on('click', function(){
        var El = $(this).closest('.weui_actionsheet');
        opt.hideActionSheet(El)
      });
    },
    updateAddress: function(Elm){ // 传递元素 当更新起运地和目的地的时候给出的提示框
      $.modal({
        title: "提示",
        text: "<p style='text-align:left'>修改起运地和<a href='' style='color:red'>目的地</a>后，需要重新选择产品服务？</p>",
        buttons: [
          { text: "确认更改", className: "blue", onClick: function(){
            opt.prdServiceEmpty() // 清空产品服务
            opt.showActionSheet(Elm);
          }},
          { text: "不更改", className: "default"},
        ]
      });
    },
    sendAddress: function(){ //选择起运地
      // 起运地
      $send.on("click", function () {
        var text = $(this).data('val');
        if(text != '0'){
          opt.updateAddress($sendLayer)
        } else{
          opt.showActionSheet($sendLayer);
        }
      });
      // 选择起运地地址
      $sendLayer.on('click', '.send_layer_item', function () {
        var Text = $(this).text();
        var val = $(this).data('val');
        $send.removeClass('no_data').find('.text').text(Text);
        $send.data('val',val);
        opt.prams.send = val;
        if(val == 1){ // 请求产品服务  模拟如果是
          opt.prdServiceAjax(1)
        }else{
          opt.prdServiceAjax(0)
        }
        // 关闭弹层
        opt.hideActionSheet($(this).closest('.weui_actionsheet'));
      })
    },
    recevingAddress: function(){ // 选择目的地
       // 目的地
       $receving.on('click',function(){
        var text = $(this).data('val');
        if(text != '0' ){
          opt.updateAddress($recevingLayer)
        }else{
          opt.showActionSheet($recevingLayer);
        }
      });
       // 选择目的地址
       $recevingLayer.on('click','.send_layer_item', function () {
        var Text = $(this).text();
        var val = $(this).data('val');
        $receving.removeClass('no_data').find('.text').text(Text);
        $receving.data('val',val);
        opt.prams.receving = val;
        // 关闭弹层
        opt.hideActionSheet($(this).closest('.weui_actionsheet'));
      });
    },
    prdServiceEmpty:function(){ //清空产品服务的数据
      $prdService.addClass('no_data').find('.text').text('请选择起运地，目的地后再选择产品服务');
      $prdService.data('val',0);
    },
    prdServiceAjax:function(data){ //产品服务数据加载
      var serviceData;
      if(data){
        serviceData= [{
          name:'经济服务经济',
          value:1
        },{
          name:'快速服务',
          value:2
        },{
          name:'USPS标准服务',
          value:3
        },{
          name:'红酒专线',
          value:4
        },{
          name:'四方专线',
          value:5
        }]
      }else{
        serviceData = [];
      }
      var tmpLi = '';
      $('#js_prd_service_ul').empty();
      if(serviceData && serviceData.length > 0){
        for(var i = 0; i<serviceData.length; i++){
          tmpLi +='<li class="prd_service_li" data-val="'+ serviceData[i].value +'">'+ serviceData[i].name +'</li>'
        }

      }else{
        tmpLi = '<li class="prd_service_li_nodata">暂未开通产品服务！</li>'
      }
      $('#js_prd_service_ul').append(tmpLi);

      // 产品服务
      opt.prdService()

    },
    prdService: function(){ // 选择产品服务
      var prdLi =  $('#js_prd_service_ul .prd_service_li');
      var selectData = '',selectDataText = ''; // 选择的数据

      $prdService.on('click',function(){
        if(opt.prams.send !=0 && opt.prams.receving != 0){ // 判断起运地和目的地始发已经填写好 如果没有填写好 给提示
          selectData = $(this).data('val');
          selectDataText = $(this).find('.text').text();
          if(selectData != '0'){ // 选中过的
            isSelelctData(selectData);
          }

          opt.ztdAddress(); // 自提点弹层业务逻辑
          opt.showActionSheet($prdServiceLayer);
        }else{
          $.modal({
            title: "提示",
            text: '<p style="text-align:left">请选择起运地，目的地后再选择产品服务</p>',
            buttons: [
              { text: "我知道了", className: "blue"},
            ]
          });
        }
      })
      function isSelelctData(selectData){ // 设置选中的样式
        var tempData = '';
        for(var i = 0; i<prdLi.length; i++){
          tempData = prdLi.eq(i).data('val');
          if(selectData == tempData){
            prdLi.removeClass('selected');
            prdLi.eq(i).addClass('selected');
          }
        }
      }

      prdLi.on('click',function(){
        selectData = '';
        selectDataText = '';
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        $(this).data('val')
        selectData = $(this).data('val');
        selectDataText =  $(this).text();
        if(selectData == '3'){
          $('#js_ztd').show();
        }else{
          $('#js_ztd').hide();
        }
      });

      $('#js_prd_service_btn').on('click',function(){

        $prdService.data('val',selectData);
        $prdService.removeClass('no_data').find('.text').text(selectDataText);

        // 关闭弹层
        opt.hideActionSheet($($prdServiceLayer).closest('.weui_actionsheet'));
      })
    },
    ztdAddress:function(){
      $ztdAddress.on('click',function(){
        opt.showActionSheet($ztdLayer);
        tabFn();
      })
      var selectData,selectDataText;

      function tabFn(){

        var $actionSheetTab = $('#js_ztd_menu .weui_action_tab .tab_item');
        var $ztd_wrapper = $('#js_ztd_menu .weui_action_wrapper');
        // 正在加载 dom
        var loadingTmp = '<div class="weui_loading_wrapper"><span class="weui-loading"></span>正在加载中...</div>';
        // 暂无数据 dom
        var noDataTmp = '<div class="weui_loadmore weui_loadmore_line"><span class="weui_loadmore_tips">暂无数据</span></div>';

        $actionSheetTab.on('click', function () {
          var $this = $(this)
          itemIndex = $this.index();
          $this.addClass('current').siblings('.tab_item').removeClass('current');
          $('#js_ztd_menu .weui_action_wrapper').eq(itemIndex).show().siblings('.weui_action_wrapper').hide();
          var isData = false // 无数据
          // loading 和暂无数据
          if (itemIndex) {
            fnLoading(itemIndex, isData);
          }
          selectData = selectedFn();
          console.log(selectData)
        })

        function fnLoading(itemIndex, isData) {  // 必填 参数 itemIndex 切换索引， 是否有加载到数据 isData 布尔值
          var $loadMore = $('#js_ztd_menu .weui_action_wrapper').eq(itemIndex).find('.weui_loadmore').length
          // 切换之前 先删除 loding dom 和 暂无数据dom
          $('#js_ztd_menu .weui_action_wrapper').eq(itemIndex).find('.weui_loading_wrapper').remove();
          $('.weui_action_wrapper').eq(itemIndex).find('.weui_loadmore').remove();
          // 添加加载动画 loading
          $('#js_ztd_menu .weui_action_wrapper').eq(itemIndex).append(loadingTmp);
          // 3s 之后 如果数据还没用加载完 移除loading 添加 暂无数据dom
          var Time = setInterval(function () {
            $('#js_ztd_menu .weui_action_wrapper').eq(itemIndex).find('.weui_loading_wrapper').remove();
            // 删除暂无数据dom
            if (!isData) {
              $('#js_ztd_menu .weui_action_wrapper').eq(itemIndex).find('.weui_loadmore').remove();
              $('#js_ztd_menu .weui_action_wrapper').eq(itemIndex).append(noDataTmp)
            }
            clearInterval(Time)
          }, 3000)
        }

      }


       // 选择地址
       $('.js_actionsheetItem').on('click', function () {
        $(this).siblings().removeClass('active');
        selectData = '';
        selectDataText = $(this).find('.name').text()
        selectData = $(this).data('id')
        $(this).addClass('active');
        // 关闭弹层
        // opt.hideActionSheet($ztdLayer)
      })

      // 确定

      $('#js_ztd_btn').click(function(){
        $ztdAddress.removeClass('no_data').find('.text').text(selectDataText)
        $ztdAddress.data('val',selectData)
        console.log(selectData)
        opt.hideActionSheet($ztdLayer)
      })


    },
    submit:function(){
      $('#js_send_btn').on('click',function(){

        console.log(opt.prams)
      })
    }

  }

  // 初始化
  opt.init();

})
