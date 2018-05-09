/*
 * @Desc:  寄件交互js
 *
 * @Author: zhangliang
 * @E-Mail: 1471299010@qq.com
 * @Date: 2018-05-07 15:12:01
 * @Last Modified by: zhangliang
 * @Last Modified time: 2018-05-09 18:05:02
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
      $prdServiceLayer = $('#js_prd_service_layer');

  var opt = { //我要寄件
    init: function (){
      // 选择起运地
      opt.sendAddress()
      // 选择目的地
      opt.recevingAddress()
      // 关闭actionsheet
      opt.closeActionSheet()

      // 产品服务
      opt.prdService()

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
    submit:function(){
      $('#js_send_btn').on('click',function(){
        console.log(opt.prams)
      })
    }

  }

  // 初始化
  opt.init();

})
