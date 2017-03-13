/**
 * 
 * 好应用H5前端js插件
 * 
 */
//各个主题对应的色调	
var themecolor = {
		"primary" : "#EEEEEE" ,
		"success" : "#5EB95E" ,
		"warning" : "#F37B1D" ,
		"danger" : "#DD514C" 
		
} ;
// 配置参数
var OA_Config = {} ;
//事件对象
var OA_Events = {}  ;
// 工具集
var OA_Untils = {} ;

/**
 * alert 弹框
 * class:oa-alert
 * 		最外层组件的class 为oa-alert
 * opts: 
 		null : 激活并打开alert
 		'close' : 关闭alert
 */
okayApp.fn.alert = function(opts){
	if(!$$(this).hasClass('oa-alert')) return ;
	if( opts && opts === 'close' ){
		$$(this).find('.oa-close:eq(0)').trigger('click') ;
	}

	else{
		// 激活alert
		$$(this).attr('oa-alert-active','true') ;
		$$(this).fadeIn() ;
	}
	
}
$$( document ).ready(function(){
	/**
	 * alert-----关闭按钮添加关闭事件
	 * 关闭alert时 触发两个事件既关闭前和关闭后事件,两个事件都绑定在document上
	 * close.alert.okayapp  closed.alert.okayapp
	 */
	$$('.oa-close').on('click' , function (){

		var $oa_alert = $$(this).closest('.oa-alert') ;
		if(!$oa_alert.hasClass('oa-alert')) return false ;

		var oa_alert_active = $oa_alert.attr('oa-alert-active');
		if(!oa_alert_active || oa_alert_active !== 'true') return false ;
		alert(oa_alert_active) ;
		$$(document).trigger('close.alert.okayapp') ;
		$$(this).closest('.oa-alert').fadeOut() ;
		setTimeout(function(){
			$$(document).trigger('closed.alert.okayapp') ;
		},600) ;
	}) ;
	/**
	 * 初始化alert组件
	 */
	$$('[data-oa-alert]').each(function(i,v){
		if($$(this).hasClass('oa-alert')){
			$$(this).alert() ;
		}
	}) ;
}) ;

/**
 * button
 * 按钮组件class oa-btn
 * 
 */
okayApp.fn.button = function( state ){

	var $btn = $$(this) ;

	if( !state || !$btn.hasClass('oa-btn') ) return ;
	
	var btn_html = '努力加载中...' ;
	
	var data_default_html = $btn.html();

	var opacity = 1 ;

	if( state === 'loading'){
		
		$btn.attr('data-default-html' , data_default_html ) ;
		var data_oa_loading = $btn.attr('data-oa-loading') ;
		if(data_oa_loading){
			data_oa_loading = OA_Untils.parseOptions(data_oa_loading) ;
			// data_oa_loading = $$.parseOptions(data_oa_loading) ;
			btn_html = data_oa_loading['loadingText'] ?  data_oa_loading['loadingText'] : btn_html ;
		}
		opacity = 0.4 ;
	}
	else if( state === 'reset'){
		
		btn_html = $btn.attr('data-default-html') ;
		var data_oa_loading = $btn.attr('data-oa-loading') ;
		if(data_oa_loading){
			data_oa_loading = OA_Untils.parseOptions(data_oa_loading) ;
			// data_oa_loading = $$.parseOptions(data_oa_loading) ;
			btn_html = data_oa_loading['resetText'] ?  data_oa_loading['resetText'] : btn_html ;
		}
	}
	$btn.html(btn_html) ;
	$btn.animate({
		'opacity' : opacity
	} , 500) ;
	
}

/**
 * collapse
 * 折叠面板class oa-panel-group oa-panel oa-panel-heald oa-panel-body-wrap oa-panel-body
   opts:
   		toggle 默认 true 交替执行展开/关闭操作
 * 
   对应事件
   		open.collapse.okayapp : 面板打开前触发
   		opened.collapse.okayapp : 面板打开后
   		close.collapse.okayapp : 面板关闭前
   		closed.collapse.okayapp : 面板关闭后 

    需要保存的参数
    	oa-collapse-state:当前点击的面板的状态 open close
    	oa-opts:初始化面板时传入的参数 ，此参数在绑定事件时需要使用  故绑定在目标组件上
 */
okayApp.fn.collapse = function( opts ){
	var toggle = true ;
	var $collapse = $$(this) ;
	opts = (opts && typeof opts == 'object') ? opts : {} ;
	toggle = ( opts['toggle']!=null &&  opts['toggle']!=undefined )? opts['toggle'] : toggle ;
	opts['toggle'] = toggle ;

	$collapse.each(function(i , v){
		$panel_group = $$(this);
		$panels = $panel_group.find('.oa-panel');
		$panels.each(function(i,v){
			$panel = $$(this) ;
			/*默认展开第一个面板*/
			if(i !=0){
				$panel.find('.oa-panel-body-wrap').slideUp(0) ;
				$panel.find('.oa-panel-title').attr('oa-collapse-state' ,'close') ;
			}
			else{
				$panel.find('.oa-panel-title').attr('oa-collapse-state' ,'open') ;
			}
		});
	});
	//保存参数
	$collapse.attr('oa-opts',JSON.stringify(opts));
}
$$(document).ready(function(){

	/*绑定面板的点击事件*/
	$$('.oa-panel-title').on('click' , function(){
		var $this = $$(this) ;
		var $oa_panel_group = $this.closest('.oa-panel-group') ;
		if(!$oa_panel_group.hasClass('oa-panel-group')) return ;


 		//获取面板的参数
		var opts = $oa_panel_group.attr('oa-opts') ;
		var toggle = true ;
		
		if(opts){
			opts = JSON.parse(opts)  ;
			toggle = (opts['toggle'] !=null && opts['toggle']!=undefined) ? opts['toggle'] : toggle ;
		}

		//获取当前点击title的状态
		var state = $this.attr('oa-collapse-state') ;
		//每次一个面板展开
		if( toggle ){
			
			$$('[oa-collapse-state=open]').closest('div').next('div').slideUp(100) ;
			$$('[oa-collapse-state=open]').attr('oa-collapse-state','close') ;
		}
		
		if(!state || state === 'open' ){
			// 面板关闭前事件
			$this.trigger('close.collapse.okayapp') ;

			$this.closest('div').next('div').slideUp(100) ;
			$this.attr('oa-collapse-state' , 'close') ;

			// 面板关闭后事件
			setTimeout(function(){
				$this.trigger('closed.collapse.okayapp') ;
			},100) ;
		}
		else if( state === 'close'  ){
			// 面板打开前事件
			$this.trigger('open.collapse.okayapp') ;

			$this.closest('div').next('div').slideDown(100) ;
			$this.attr('oa-collapse-state' , 'open') ;

			// 面板打开后事件
			setTimeout(function(){
				$this.trigger('opened.collapse.okayapp') ;
			},100);
		}
	}) ;
	
	/*初始化并激活面板*/
	$$('[data-oa-collapse]').each(function(i,v){
		if($$(this).hasClass('oa-panel-group')){
			$$(this).collapse() ;
		}
	}) ;

}) ;
/*
	dropdown
	下拉组件 oa-dropdown oa-dropdown-content oa-dropdown-header oa-active oa-disabled oa-dvider
	opts:
		{} : 初始化参数 暂时不提供参数
		'open' : 打开方法
		'close' : 关闭方法
		'toggle':交替打开 关闭
	对应事件
   		open.dropdown.oa : 调用显示下拉框方法时立即触发
   		opened.dropdown.oa : 下拉框显示完成时触发
   		close.dropdown.oa : 调用隐藏方法时触发
   		closed.dropdown.oa : 下拉框关闭完成时触发 

   		事件target:.oa-dropdown

	需要使用的参数
		oa-dropdown-state ： 下拉组件的打开 关闭状态 open  close
*/
OA_Events['dropdown'] = {
	'bindEvent':function(target){
		var $this = target ;
		var oa_dropdown_active = $this.data('oa-dropdown-active') ;
		if(!$this.hasClass('oa-dropdown') || oa_dropdown_active == 'true') return ;

		var $oa_dropdown_toggle = $this.find('.oa-dropdown-toggle') ;

		// 绑定事件
		$oa_dropdown_toggle.on('click',function(){
			var $this = $$(this) ;
			var $dropdown = $this.closest('.oa-dropdown');
			var $oa_dropdown_content = $dropdown.find('.oa-dropdown-content') ;
			var active = $dropdown.attr('oa-dropdown-active') ;

			if(!$dropdown.hasClass('oa-dropdown') || active !== 'true') return false ;
			var state = $dropdown.attr('oa-dropdown-state') ;
			
			if(state && state === 'close'){
				$dropdown.attr('oa-dropdown-state','open') ;
				$dropdown.trigger('open.dropdown.oa');
				$oa_dropdown_content.slideToggle(100) ;
				setTimeout(function(){
					$dropdown.trigger('opened.dropdown.oa') ;
				},110);
			}
			else{
				$dropdown.attr('oa-dropdown-state','close') ;
				$dropdown.trigger('close.dropdown.oa');
				$oa_dropdown_content.slideToggle(100) ;
				setTimeout(function(){
					$dropdown.trigger('closed.dropdown.oa') ;
				},110);
			}
		}) ;
	}
} ;

okayApp.fn.dropdown = function( opts ){

	var $this = $$(this) ;
	var $oa_dropdown_content = $this.find('.oa-dropdown-content') ;
	var state = $this.attr('oa-dropdown-state') ;
	var active =  $this.attr('oa-dropdown-active') ;

	//初始化或激活dropdown
	if(!opts || typeof opts == 'object'){
		// 事件绑定
		OA_Events['dropdown'].bindEvent($this) ;
		$this.attr('oa-dropdown-active' , 'true') ; 
		$this.attr('oa-dropdown-state' , 'close') ; 
	}
	//打开dropdown
	else if(opts && opts === 'open'){
		if(!active || active!=='true') return false ;
		if(!state || (state && state === 'close')){
			$this.trigger('open.dropdown.oa');
			$oa_dropdown_content.slideDown(100) ;
			$this.attr('oa-dropdown-state' , 'open') ;
			setTimeout(function(){
				$this.trigger('opened.dropdown.oa') ;
			},100);
		}
	}
	//关闭dropdown
	else if(opts && opts === 'close'){
		if(!active || active!=='true') return false ;
		if(!state || (state && state === 'open')){
			$this.trigger('close.dropdown.oa') ;
			$oa_dropdown_content.slideUp(100) ;
			$this.attr('oa-dropdown-state' , 'close') ;
			setTimeout(function(){
				$this.trigger('closed.dropdown.oa') ;
			},100) ;
		}
	}
	//交替关闭 打开
	else if(opts && opts === 'toggle'){
		if(!active || active!=='true') return false ;
		if(state && state === 'open'){
			$this.trigger('close.dropdown.oa') ;
			$oa_dropdown_content.slideUp(100) ;
			$this.attr('oa-dropdown-state' , 'close') ;
			setTimeout(function(){
				$this.trigger('closed.dropdown.oa') ;
			},100);
		}
		else if(state && state === 'close'){
			$this.trigger('open.dropdown.oa');
			$oa_dropdown_content.slideDown(100) ;
			$this.attr('oa-dropdown-state' , 'open') ;
			setTimeout(function(){
				$this.trigger('opened.dropdown.oa') ;
			},100);
		}
	}
}

$$(document).ready(function(){
	//初始化下拉组件
	$$('[data-oa-dropdown]').each(function(i,v){
		if($$(this).hasClass('oa-dropdown')){
			$$(this).dropdown() ;
		}
	}) ;
	//绑定事件
	// $$('.oa-dropdown-toggle').on('click',function(){

	// 	var $this = $$(this) ;
	// 	var $dropdown = $this.closest('.oa-dropdown');
	// 	var $oa_dropdown_content = $dropdown.find('.oa-dropdown-content') ;
	// 	var active = $dropdown.attr('oa-dropdown-active') ;

	// 	if(!$dropdown.hasClass('oa-dropdown') || active !== 'true') return false ;
	// 	var state = $dropdown.attr('oa-dropdown-state') ;
		
	// 	if(state && state === 'close'){
	// 		$dropdown.attr('oa-dropdown-state','open') ;
	// 		$dropdown.trigger('open.dropdown.oa');
	// 		$oa_dropdown_content.slideToggle(100) ;
	// 		setTimeout(function(){
	// 			$dropdown.trigger('opened.dropdown.oa') ;
	// 		},110);
	// 	}
	// 	else{
	// 		$dropdown.attr('oa-dropdown-state','close') ;
	// 		$dropdown.trigger('close.dropdown.oa');
	// 		$oa_dropdown_content.slideToggle(100) ;
	// 		setTimeout(function(){
	// 			$dropdown.trigger('closed.dropdown.oa') ;
	// 		},110);
	// 	}
	// }) ;
});

/*
	modal
	模态窗口 oa-modal oa-modal-no-btn oa-modal-dialog oa-modal-header oa-modal-body oa-modal-footer
		oa-modal-alert oa-modal-btn oa-modal-confirm oa-modal-prompt oa-modal-prompt-input oa-modal-loading oa-modal-actions
	opts: 初始化模态窗口 oa-modal-active = 'true'
		{} : 初始化参数 暂时不提供参数
			onConfirm:确认回调函数
			onConfirmParams:确认回调函数参数
			onCancel:取消回调函数
			onCancelParams:取消回调函数参数
			width:模态窗口宽
			height:模态窗口高 
		'open' : 打开方法
		'close' : 关闭方法
		'toggle':交替打开 关闭

	对应事件
   		open.modal.oa : 打开时触发事件
   		opened.modal.oa : 打开后触发事件
   		close.modal.oa : 关闭时触发事件
   		closed.modal.oa : 关闭后触发事件 

   		事件target:.oa-modal

	需要使用的参数
		oa-modal-state ：  模态框状态 open  close
		oa-modal-btn-type  : 不同按钮的类型 
			null : 普通按钮
			'cancel' ： 取消按钮
			'confirm' :　确认按钮

	不同按钮类型区分
		.oa-modal-btn : 普通确定按钮
		.oa-modal-btn [data-oa-modal-cancel] ：取消按钮
		.oa-modal-btn [data-oa-modal-confirm] : 确认按钮
*/

// 设置常用参数
OA_Config['modal'] = {
	// 动画间隔时间
	'interval' : 500 
} ;

// 模态窗口关闭、打开触发事件
OA_Events['modal'] = {

	// target : 目标组件
	'close' : function(target){
		if(!target || !target.hasClass('oa-modal')) return ;
		var $this = target ;
		var oa_modal_state = $this.data('oa-modal-state') ;
		if((oa_modal_state && oa_modal_state === 'close') || !oa_modal_state) return ;

		var interval = OA_Config['modal']['interval'] ;
		// 触发关闭前事件
		$this.trigger('close.modal.oa') ;

		$this.animate({
			'opacity':0
		} , interval ) ;
		$this.hide();
		$this.data('oa-modal-state','close') ;

		// 触发关闭后事件
		setTimeout(function(){
			$this.trigger('closed.modal.oa') ;
		},interval) ;

	} ,
	'open' : function(target){	
		if(!target || !target.hasClass('oa-modal')) return ;
		var $this = target ;
		var oa_modal_state = $this.data('oa-modal-state') ;
		if(oa_modal_state && oa_modal_state === 'open') return ;

		var interval = OA_Config['modal']['interval'] ;

		// 触发打开前事件
		$this.trigger('open.modal.oa') ;
		$this.show();
		$this.animate({
			'opacity':1
		},interval) ;
		$this.data('oa-modal-state','open') ;

		// 触发打开后事件
		setTimeout(function(){
			$this.trigger('opened.modal.oa') ;
		},interval) ;
	}
} ;

okayApp.fn.modal = function(opts){

	var $this = $$(this) ;
	//获取激活状态
	var oa_modal_active = $this.data('oa-modal-active') ;

	if(!$this.hasClass('oa-modal')) return false ;
	// 打开模态框
	if(opts && opts === 'open' && oa_modal_active && oa_modal_active === 'true'){
		// $this.show();
		// $this.animate({
		// 	'opacity':1
		// },500) ;
		// //使用data缓存数据 ，不在把数据绑定在组件的属性上
		// $this.data('oa-modal-state','open') ;
		OA_Events['modal'].open($this) ;

	}
	else if(opts && opts === 'close' && oa_modal_active && oa_modal_active === 'true'){
		// $this.animate({
		// 	'opacity':0
		// },500) ;
		// $this.hide();
		// $this.data('oa-modal-state','close') ;
		OA_Events['modal'].close($this) ;
	}
	else if(opts && opts === 'toggle' && oa_modal_active && oa_modal_active === 'true'){
		var state = $this.data('oa-modal-state') ;
		if(!state || state === 'close'){
			// $this.show();
			// $this.animate({
			// 	'opacity':1
			// },500) ;
			// $this.data('oa-modal-state','open') ;
			OA_Events['modal'].open($this) ;
		}
		else{
			// $this.animate({
			// 	'opacity':0
			// },500) ;
			// $this.hide();
			// $this.data('oa-modal-state','close') ;
			OA_Events['modal'].close($this) ;
		}
	}
	else if(!opts || typeof opts == 'object'){

		if(!opts) opts = {} ;
		$this.data('oa-modal-active','true') ;
		var onConfirm = opts['onConfirm'] ? opts['onConfirm'] : null ;
		var onCancel = opts['onCancel'] ? opts['onCancel'] : null ;
		var onConfirmParams = null ;
		var onCancelParams = null ;
		var width = null ;
		var height = null ;

		if(onConfirm){
			onConfirmParams = opts['onConfirmParams'] ? opts['onConfirmParams'] : null ;
			$this.data('onConfirm',onConfirm) ;
			$this.data('onConfirmParams',onConfirmParams) ;
		}
		if(onCancel){
			onCancelParams = opts['onCancelParams'] ? opts['onCancelParams'] : null ;
			$this.data('onCancel',onCancel) ;
			$this.data('onCancelParams',onCancelParams) ;
		}
		$this.data('width',width) ;
		$this.data('height',height);
	}
	
}

$$(document).ready(function(){
	// data方式初始化
	$$('[data-oa-modal]').each(function(i,v){
		if($$(this).hasClass('oa-modal')){
			$$(this).modal() ;
		}
	}) ;

	// 初始化按钮类型
	$$('[data-oa-modal-cancel]').each(function(i,v){
		var $this = $$(this) ;
		var oa_modal = $this.closest('.oa-modal') ;
		if(!oa_modal.hasClass('oa-modal')) return ;
		$this.data('oa-modal-btn-type','cancel') ;
	}) ;

	$$('[data-oa-modal-confirm]').each(function(i,v){
		var $this = $$(this) ;
		var oa_modal = $this.closest('.oa-modal') ;
		if(!oa_modal.hasClass('oa-modal')) return ;
		$this.data('oa-modal-btn-type','confirm') ;
	}) ;


	// 关闭按钮
	$$('.oa-close').on('click' , function(){
		var $this = $$(this) ;
		var oa_modal = $this.closest('.oa-modal') ;
		var oa_modal_active = oa_modal.data('oa-modal-active') ;
		if(!oa_modal.hasClass('oa-modal') || !oa_modal_active || oa_modal_active !='true') return ;

		var oa_modal_state = oa_modal.data('oa-modal-state') ;
		if(oa_modal_state && oa_modal_state==='close') return ;
		// oa_modal.animate({
		// 	'opacity':0
		// },500) ;
		// oa_modal.hide();
		// oa_modal.data('oa-modal-state','close') ;
		OA_Events['modal'].close() ;
	}) ;

	// 确定按钮
	$$('.oa-modal-btn').on('click' , function(e){
		var $this = $$(this) ;
		var oa_modal = $this.closest('.oa-modal') ;
		if(!oa_modal.hasClass('oa-modal')) return ;
		var oa_modal_btn_type = $this.data('oa-modal-btn-type') ;
		//普通按钮
		if(!oa_modal_btn_type){

			// oa_modal.animate({
			// 	'opacity':0
			// },500) ;
			// oa_modal.hide();
			// oa_modal.data('oa-modal-state','close') ;
			OA_Events['modal'].close(oa_modal) ;
		}
		// 取消按钮
		else if(oa_modal_btn_type && oa_modal_btn_type == 'cancel'){
			var onCancel= oa_modal.data('onCancel') ;
			var onCancelParams = oa_modal.data('onCancelParams') ;
			// oa_modal.animate({
			// 	'opacity':0
			// },500) ;
			// oa_modal.hide();
			// oa_modal.data('oa-modal-state','close') ;
			OA_Events['modal'].close(oa_modal) ;
			setTimeout(function(){
				if(onCancel && typeof onCancel == 'function'){
					onCancel.call($this,onCancelParams) ;
				}
			},OA_Config['modal']['interval']) ;
		}
		// 确认按钮
		else if(oa_modal_btn_type && oa_modal_btn_type == 'confirm'){
			var onConfirm = oa_modal.data('onConfirm') ;
			var onConfirmParams = oa_modal.data('onConfirmParams') ;
			// oa_modal.animate({
			// 	'opacity':0
			// },500) ;
			// oa_modal.hide();
			// oa_modal.data('oa-modal-state','close') ;
			OA_Events['modal'].close(oa_modal) ;
			setTimeout(function(){
				// 如果是prompt模态框 ,onConfirmParams 替换为输入的内容
				if(oa_modal.hasClass('oa-modal-prompt')){
					onConfirmParams = {} ;
					var oa_modal_prompt_input = oa_modal.find('.oa-modal-prompt-input') ;
					if(oa_modal_prompt_input){
						onConfirmParams['data'] = oa_modal_prompt_input.val();
					}
				}
				if(onConfirm && typeof onConfirm == 'function'){
					onConfirm.call($this,onConfirmParams) ;
				}
			},OA_Config['modal']['interval']) ;
		}	
	}) ;

}) ;

/*
	popover
	弹出框 oa-popover oa-popover-top oa-popover-bottom  oa-popover-left oa-popover-right oa-popover-inner a-popover-caret
	opts: 初始化弹出框 oa-modal-active = 'true'(激活)
		{} : 初始化参数
			content : popover显示的内容
			trigger : 交互方式

		'open' : 打开方法
		'close' : 关闭方法
		'toggle':交替打开 关闭

	对应事件
   		open.popover.oa : 打开时触发事件
   		close.popover.oa : 关闭是触发事件


	需要使用的参数
		data : oa-popover-state : 弹出框状态 open close 
		data : oa-popover-active : 目标组件是否被激活 被激活为 'true'
		data : popoverId : 保存生成弹出框的ID
		attr : [oa-popover-active] : 如果组件有该属性 ， 则该组件是触发弹出框显示的目标组件
	
*/
OA_Config['popover'] = { 
	//弹出框高度,单位px	
	'height':44 
} ;

OA_Events['popover'] = {
	'open' : function(target){

		var $this = target ;

		// 触发打开前事件
		$this.trigger('open.popover.oa') ;


		var ab_position = OA_Untils.getAbsolutePosition($this) ;
		var rl_position = OA_Untils.getRealitivePosition($this) ;

		var clientHeight = 0 ;
		var clientWidth = 0 ;
		var top = 0 ;
		var left = 0 ;

		// 弹出框位置
		var popover_position = 'top' ;

		//popover默认位置在top方向
		var oa_popover_position_class = 'oa-popover-top' ;


		if(document.compatMode == 'BackCompat'){
			clientHeight = document.body.clientHeight ;
			clientWidth = document.body.clientWidth ;
		}
		else{
			clientHeight = document.documentElement.clientHeight ;
			clientWidth = document.documentElement.clientWidth ;
		}


		var popoverId = $this.data('popoverId') ;
		var $popover = $$('#'+popoverId) ;
		var $caret = $popover.find('.oa-popover-caret');

		var popoverWidth = $popover[0].offsetWidth ;
		var popoverHeight= $popover[0].offsetHeight ;

		var caretWidth = $caret[0].offsetWidth ;
		var caretHeight = $caret[0].offsetHeight ;

		var caret_style_left = (popoverWidth - caretWidth) / 2 ;
		var caret_style_top = (popoverHeight - caretHeight) / 2 ;

		// 确定箭头的竖直位置,根据当前元素的位置确定箭头的方向
		// 首先确定竖直方向是否有足够的空间
		var needHeight =  popoverHeight + caretHeight ;
		var needWidth = popoverWidth + caretWidth ;

		top = rl_position['top'] - needHeight ;
		left = (rl_position['left'] + rl_position['right']) / 2 - (needWidth/2) ;

		// top位置不满足条件
		if(rl_position['top'] < needHeight){
			// top位置不满足条件，考虑底部位置
			if((clientHeight-rl_position['bottom']) >= needHeight ){
				oa_popover_position_class = 'oa-popover-bottom' ;
				top = rl_position['bottom'] + caretHeight ;
				popover_position = 'bottom' ;
			}
			// 竖直位置不满足条件 ， 考虑水平位置 ，首先right位置
			else{
				if((clientWidth-rl_position['right'])>=needWidth){
					oa_popover_position_class = 'oa-popover-right' ;
					top = (rl_position['top'] + rl_position['bottom']) / 2 - popoverHeight / 2 ;
					left =  rl_position['right'] + caretWidth;
					popover_position = 'right' ;
				}
				else if(rl_position['left']>=needWidth){
					oa_popover_position_class = 'oa-popover-left' ;
					top = (rl_position['top'] + rl_position['bottom']) / 2  - popoverHeight / 2;
					left = rl_position['left'] - needWidth ;
					popover_position = 'left' ;
				}
			}
		}

		if(left<0){
			left = 0 ;
		}


		$popover[0].style.top = top + 'px';
		$popover[0].style.left = left + 'px';

		$popover.addClass(oa_popover_position_class);

		if(popover_position=='top' || popover_position =='bottom'){
			$caret[0].style.left = caret_style_left +'px' ;
		}
		else if(popover_position=='left' || popover_position =='right'){
			$caret[0].style.top = caret_style_top +'px' ;
		}


		$popover.addClass('oa-active');
		$popover.data('oa-popover-state','open');

		

	},
	'close' : function(target){
		var $this = target ;

		var popoverId = $this.data('popoverId') ;

		// 触发关闭前事件
		$this.trigger('close.popover.oa') ;

		var $popover = $$('#'+popoverId) ;
		$popover[0].style.top = '-20000px' ;
		$popover[0].style.left = '-20000px' ;

		$popover.removeClass('oa-active');
		$popover.data('oa-popover-state','close');
	}
} ;

okayApp.fn.popover = function(opts){

	var $this = $$(this) ;
	var oa_popover_active = $this.data('oa-popover-active');
	if(!$this) return ;
	
	
	// 初始化弹出框
	if(!opts || typeof opts == 'object'){
		
		var popoverId = $this.data('popoverId');
		var oa_popover_active = $this.data('oa-popover-active') ;

		if(popoverId && oa_popover_active && oa_popover_active=='true') return ;

		var id = 'oa-popover-'+ OA_Untils.getRandomValue() ;
		var content = opts ? (opts['content'] ? opts['content'] : '') : '' ;
		var popover_html = '<div class="oa-popover" id="'+id+'" style="display: block; top:-200px; left:-200px;">'+
								'<div class="oa-popover-inner">'+content +
								'</div>'+
								'<div class="oa-popover-caret" style="">'+
								'</div>'+
							'</div>' ;
		$$('body').append(popover_html) ;
		$this.data('popoverId',id) ;
		$this.data('oa-popover-active','true') ;

		$this.attr('oa-popover-active','') ;
		//var ab_position = OA_Untils.getAbsolutePosition($this) ;
		//var rl_position = OA_Untils.getRealitivePosition($this) ;

	}
	// 显示弹出框
	else if(opts && opts === 'open'){
		var oa_popover_active = $this.data('oa-popover-active') ;
		var popoverId = $this.data('popoverId') ;

		if(!oa_popover_active || oa_popover_active != 'true' || !popoverId) return ; 
		OA_Events['popover'].open($this) ;
	}
	// 关闭弹出框
	else if(opts && opts === 'close'){
		var oa_popover_active = $this.data('oa-popover-active') ;
		var popoverId = $this.data('popoverId') ;
		if(!oa_popover_active || oa_popover_active != 'true' || !popoverId) return ; 

		OA_Events['popover'].close($this);

	}
	// toggle弹出框
	else if(opts && opts === 'toggle'){
		var oa_popover_active = $this.data('oa-popover-active') ;
		var popoverId = $this.data('popoverId') ;
		if(!oa_popover_active || oa_popover_active != 'true' || !popoverId) return ; 

		var $popover = $$('#'+popoverId) ;

		if($popover.hasClass('oa-active')){
			OA_Events['popover'].close($this);
		}
		else{
			OA_Events['popover'].open($this) ;
		}
	}

}

$$(document).ready(function(){
	$$('[data-oa-popover]').each(function(i,v){
		var data_oa_popover = $$(this).attr('data-oa-popover') ;
		if(!data_oa_popover) return ;

		var opts = OA_Untils.parseOptions(data_oa_popover) ;
		if(!opts || typeof opts !='object' || !opts['content']) return ;

		$$(this).popover(opts) ;
	}) ;

	$$('[oa-popover-active]').on('click',function(){
		$$(this).popover('toggle') ;
	}) ;
}) ;
/*
	progress
	进度条 oa-progress oa-progress-bar oa-progress-bar-striped  oa-progress-active oa-progress-bar-success  
			oa-progress-bar-info  oa-progress-bar-warning  oa-progress-bar-danger  
	opts: 初始化弹出框 oa-progress-active = 'true'(激活)
		{} : 初始化参数
			theme : progress主题
				primary
				success
				info
				warning
				danger
			style:progress风格
				normal:正常风格
				striped:条纹风格
			display:是否显示progress内容
				'true':显示
				'false':不显示
		
		'open' : 打开进度条
		 value : 设置进度条进度值(大于0小于1)
		'close' : 关闭方法
		
	对应事件
   		open.popover.oa : 打开时触发事件
   		close.popover.oa : 关闭是触发事件


	需要使用的参数
		data : oa-progress-state : 弹出框状态 open close 
		data : oa-progress-active : 目标组件是否被激活 被激活为 'true'
		data : oa-progress-display : 是否显示进度条的value值 'true' 'false'
*/

OA_Events['progress'] = {
	'open' : function(target){
		var $this = target ;
		$this[0].style.opacity = 1 ;
		$this[0].style.display = 'block' ;
		$this.data('oa-progress-state','open');
	} ,
	'close' : function(target){
		var $this = target ;
		$this[0].style.display = 'block' ;
		$this[0].style.opacity = 0 ;
		$this.data('oa-progress-state','close');
	}
} ;

okayApp.fn.progress = function(opts){

	var $this = $$(this) ; 

	if(!$this.hasClass('oa-progress')) return ;

	if(!opts || typeof opts == 'object'){

		var theme_class = '' ;
		var style_class = '' ;

		opts = opts ? opts : {} ;
		var theme = opts['theme'] ? opts['theme'] : 'primary' ;
		var style = opts['style'] ? opts['style'] : 'normal' ;
		var display = opts['display'] ? opts['display'] : 'false' ;

		switch(theme){
			case 'success' : 
				theme_class = 'oa-progress-bar-success' ;
				break ;
			case 'info' : 
				theme_class = 'oa-progress-bar-info' ;
				break ;
			case 'warning' : 
				theme_class = 'oa-progress-bar-warning' ;
				break ;	
			case 'danger' : 
				theme_class = 'oa-progress-bar-danger' ;
				break ;
			default : 
				theme_class = '' ;
		}

		if(style && style == 'striped'){
			style_class = 'oa-progress-bar-striped' ;
		}

		var $oa_progress_bar = $this.find('.oa-progress-bar') ;

		if(style_class){
			$oa_progress_bar.addClass(style_class) ;
		}

		if(theme_class){
			$oa_progress_bar.addClass(theme_class) ;
		}
		// 添加激活类
		$oa_progress_bar.addClass('oa-progress-active') ;


		$this.data('oa-progress-display',display) ;
		$this.data('oa-progress-active','true') ;

	}
	else if(opts && opts === 'open'){
		var oa_progress_active = $this.data('oa-progress-active') ;

		if(!oa_progress_active || oa_progress_active!='true') return ;

		OA_Events['progress'].open($this) ;


	}
	else if(opts && opts === 'close'){
		var oa_progress_active = $this.data('oa-progress-active') ;

		if(!oa_progress_active || oa_progress_active!='true') return ;

		OA_Events['progress'].close($this) ;

	}
	else if(opts && typeof opts == 'number'){

		var oa_progress_active = $this.data('oa-progress-active') ;

		if(!oa_progress_active || oa_progress_active!='true') return ;

		var oa_progress_bar = $this.find('.oa-progress-bar') ;
		var value = OA_Untils.getPercentage(opts)  ;
		var oa_progress_display = $this.data('oa-progress-display');
		oa_progress_bar[0].style.width = value ;

		if(oa_progress_display && oa_progress_display == 'true'){
			oa_progress_bar.html(value);
		}
	}
}

$$(document).ready(function(){

	$$('[data-oa-progress]').each(function(i,v){
		var $this = $$(this) ;
		if(!$this.hasClass('oa-progress')) return ;

		var data_oa_progress = $this.attr('data-oa-progress') ;

		data_oa_progress = ( data_oa_progress && data_oa_progress!='' && data_oa_progress !=undefined )
			?  OA_Untils.parseOptions(data_oa_progress) 
			: null ;

		$this.progress(data_oa_progress) ;
	}) ;
}) ;

/*
	carousel
	轮播图  oa-carousel  oa-carousel-list  oa-carousel-list-item  oa-carousel-buttons  oa-carousel-arrow  oa-carousel-arrow-prev  oa-carousel-arrow-next
	opts: 初始化轮播图 oa-carousel-active = 'true'(激活)
		{} : 初始化参数
			interval : 轮播间隔时间
			touch ： 是否支持触摸滑动 'true' :支持 'false':不支持，默认不支持
			showbutton : 是否显示底部按钮 'true' :显示 'false':不显示，默认不显示
			showarrow : 是否显示左右箭头  'true' :显示 'false':不显示，默认不显示
		
		'play' : 播放
		 pause : 暂停
		'next' : 下一个
		'prev' : 上一个
		number : 第number个
		


	需要使用的参数
		data : oa-carousel-opts : 初始化参数 
		data : oa-carousel-timer : 轮播定时器
		data : oa-carousel-state : 轮播图状态 play  stop:暂停

	说明:轮播图外层组件的宽度、高度需用户自行设置

*/

OA_Config['carousel'] = {
	'currButtton_class':'on',		//底部按钮激活类
	'animate_time':300,			//每次动画运行时间
	'animate_num' :50 			//动画运行次数
} ;

OA_Events['carousel'] = {
	// 初始化dom 组件
	initDom : function(target){
		// 外层组件
		var $oa_carousel = target ;
		// 包围img组件
		var $oa_carousel_list = $oa_carousel.find('.oa-carousel-list') ;
		// 图片列表组件
		var $oa_carousel_list_items = $oa_carousel_list.find('.oa-carousel-list-item');

		var len = $oa_carousel_list_items.length ;

		var oa_carousel_opts = $oa_carousel.data('oa-carousel-opts') ;
		var touch = oa_carousel_opts['touch'] ;
		oa_carousel_opts['oa_carousel_list_items_length'] =  len ;
		
		//获取外层组件宽度
		var carousel_Width  = $oa_carousel[0].offsetWidth ;
		var carousel_Height = $oa_carousel[0].offsetHeight ;
		var self = this ;

		oa_carousel_opts['carousel_Width'] = carousel_Width ;
		$oa_carousel.data('oa-carousel-opts',oa_carousel_opts) ;

		// 设置内层组件的位置
		$oa_carousel_list[0].style.width = len * carousel_Width + 'px' ;
		if(touch && touch == 'true'){
			self.setTransfrom($oa_carousel_list,-carousel_Width,0) ;
		}
		else{
			$oa_carousel_list[0].style.left = '-' + carousel_Width + 'px' ;
		}
		
		// 设置每个图片的宽度
		for( var i = 0 ; i < len ; i++){
			var img = $oa_carousel_list_items.get( i ) ;
			img.style.width = carousel_Width + 'px' ;
		}

		// 获取初始化参数
		var oa_carousel_opts = $oa_carousel.data('oa-carousel-opts');
		// 是否显示底部按钮
		var showbutton = oa_carousel_opts['showbutton'] ;
		// 是否显示左右箭头 
		var showarrow = oa_carousel_opts['showarrow'] ;

		if(showbutton && showbutton == 'true'){
			var button_html = '<div  class="oa-carousel-buttons">' ;
			for(var i = 0 ; i < len - 2 ; i++){
				if(i==0){
					button_html += '<span index="1" class="'+OA_Config['carousel']['currButtton_class']+'"></span>' ;
				}
				else{
					button_html += '<span index="'+(i+1)+'"></span>' ;
				}
			}
			button_html += '</div>' ;	
			$oa_carousel.append(button_html) ;	   

			// 底部按钮组件
			var $oa_carousel_buttons = $oa_carousel.find('.oa-carousel-buttons');
			// 设置底部按钮的位置和宽度
			var button_width = carousel_Width/2 ;
			var button_left = carousel_Width/4 ;
			var button_marginRight =  (carousel_Width/2 - 10*(len-2)) / (len-3) ;
			
			$oa_carousel_buttons[0].style.width = button_width + 'px';
			$oa_carousel_buttons[0].style.left = button_left + 'px' ;

			$oa_carousel_buttons.find('span').css({
				'width':'10px' ,
				'marginRight' : button_marginRight + 'px'
			}) ;
			$oa_carousel_buttons.find('span').eq(len-3).css('marginRight',0) ;    

		}
		if(showarrow && showarrow == 'true'){
			var arrow_html = '<a href="javascript:;"  class="oa-carousel-arrow oa-carousel-arrow-prev">&lt;</a>'+
	    					'<a href="javascript:;" class="oa-carousel-arrow oa-carousel-arrow-next">&gt;</a>' ;
	    	$oa_carousel.append(arrow_html) ;

	    	var $oa_carousel_arrow = $oa_carousel.find('.oa-carousel-arrow') ;
	    	var $oa_carousel_arrow_prev = $oa_carousel.find('.oa-carousel-arrow-prev') ;
	    	var $oa_carousel_arrow_next = $oa_carousel.find('.oa-carousel-arrow-next') ;


	    	// 设置箭头样式
	    	// 正所谓九头身才是最美的
	    	var arrow_width = arrow_height = ( carousel_Height / 9 ).toFixed(2) ;
	    	var arrow_font_size = ( arrow_width / 2 ).toFixed(2) ;
	    	var arrow_top = ( ( carousel_Height - arrow_height ) / 2 ).toFixed(2) ;
	    	var arrow_left = arrow_rigth = ( arrow_width * 2 / 3 ).toFixed(2) ;

	    	$oa_carousel_arrow.css({
	    		'width' : arrow_width + 'px' ,
	    		'height' : arrow_height +'px' ,
	    		'fontSize' : arrow_font_size + 'px' ,
	    		'lineHeight'  : arrow_height +'px',
	    		'borderRadius' : arrow_width + 'px' ,
	    		'top' : arrow_top + 'px'
	    	}) ;

	    	$oa_carousel_arrow_prev.css('left',arrow_left+'px') ;
	    	$oa_carousel_arrow_next.css('right',arrow_rigth+'px') ;
		}

		$oa_carousel.data('oa-carousel-active','true') ;

	} ,
	'play' : function(target){
		var $this = target ;
		var oa_carousel_active = $this.data('oa-carousel-active') ;
		if(!oa_carousel_active || oa_carousel_active != 'true') return ;
		
		var self = this ;

		var oa_carousel_opts = $this.data('oa-carousel-opts') ;
		var interval = oa_carousel_opts['interval'] ;

		var timer = setInterval( function(){
			 self.next($this) ;
		}, interval ) ;
		$this.data('oa-carousel-timer',timer) ;
		$this.data('oa-carousel-state','play') ;
	} ,
	'stop' : function(target){
		var $this = target ;
		var timer = $this.data('oa-carousel-timer') ;
		clearInterval(timer) ;
		$this.data('oa-carousel-state','stop') ;
	},
	'next' : function(target){
		var $this = target ;
		var self = this ;

		var oa_carousel_opts = $this.data('oa-carousel-opts') ;

		var index = oa_carousel_opts['index'] ,
			animating = oa_carousel_opts['animating'] ,
			len = oa_carousel_opts['oa_carousel_list_items_length'] ;
		if( animating && animating == 'true'){
			return ;
		}
		if( index >= ( len - 3) ){
			index = 0 ;
		}
		else{
			index = index + 1 ;
		}

		self.animate($this) ;
		oa_carousel_opts['index'] = index ;
		oa_carousel_opts['direction'] = -1 ,
		$this.data('oa-carousel-opts',oa_carousel_opts) ;

		if(oa_carousel_opts['showbutton'] && oa_carousel_opts['showbutton'] == 'true'){
			self.showButtons($this) ;
		}
	},
	'prev' : function(target){
		var $this = target ;
		var self = this ;

		var oa_carousel_opts = $this.data('oa-carousel-opts') ;

		var index = oa_carousel_opts['index'] ,
			animating = oa_carousel_opts['animating'] ,
			len = oa_carousel_opts['oa_carousel_list_items_length'] ;
		if( animating && animating == 'true'){
			return ;
		}
		if( index <=0 ){
			index = len - 3 ;
		}
		else {
			index = index - 1 ;
		}

		self.animate($this) ;
		oa_carousel_opts['index'] = index ;
		oa_carousel_opts['direction'] = 1 ,
		$this.data('oa-carousel-opts',oa_carousel_opts) ;
		

		if(oa_carousel_opts['showbutton'] && oa_carousel_opts['showbutton'] == 'true'){
			self.showButtons($this) ;
		}
	},
	goIndex : function(target,index){
		var $this = target ;
		var self = this ;

		if(index == null || typeof index != 'number' || isNaN(index)) return ;

		var oa_carousel_opts = $this.data('oa-carousel-opts') ;
		var curr_index =  oa_carousel_opts['index'] ;
		var len = oa_carousel_opts['oa_carousel_list_items_length'] ;
		var carousel_Width = oa_carousel_opts['carousel_Width'] ;
		var direction = oa_carousel_opts['direction'] ;
		var showbutton = oa_carousel_opts['showbutton'] ;

		if(index < 0){
			index = 0 ;
		}
		if(index > (len - 3)){
			index = len -3 ;
		}
		var offset = ( index - curr_index ) *  carousel_Width * direction ;
		self.animate($this,offset) ;

		oa_carousel_opts['index'] = index ;
		$this.data('oa-carousel-opts',oa_carousel_opts);

		if(showbutton && showbutton == 'true'){

			self.showButtons($this) ;
		}
	},
	animate : function(target,offset){

		var $this = target ;
		var self = this ;//carousel_Width
		var $oa_carousel_list = $this.find('.oa-carousel-list') ;

		var oa_carousel_opts = $this.data('oa-carousel-opts') ;
		var touch = oa_carousel_opts['touch'] ;
		var curr_index = oa_carousel_opts['index'] ;
		var carousel_Width = oa_carousel_opts['carousel_Width'] ;
		var offset = ( offset !=null && offset !=undefined )  ? offset :
			oa_carousel_opts['carousel_Width'] * oa_carousel_opts['direction'] ;
		var len =  oa_carousel_opts['oa_carousel_list_items_length'] ;

		if(touch && touch=='true'){
			var value = (-curr_index-1)*carousel_Width + offset ;
			var time = OA_Config['carousel']['animate_time'] / 1000 ;
			if(value<(len-2)*(-carousel_Width)){
				// 轮播到最后一个
				value = -carousel_Width ;
				// oa_carousel_opts['index'] = 0 ;
			}
			if(value>(-carousel_Width)){
				// 轮播到第一个
				value = (len-2)*(-carousel_Width) ;
				// oa_carousel_opts['index'] = len - 3 ;
			}
			$this.data('oa-carousel-opts',oa_carousel_opts) ;
			self.setTransfrom($oa_carousel_list,value,time) ;
		}
		else{
			var oa_carousel_list_left = parseFloat( window.getComputedStyle( $oa_carousel_list[0] )['left'] ) ,
				left = oa_carousel_list_left + offset ,
				time = OA_Config['carousel']['animate_time'] , 
				num = OA_Config['carousel']['animate_num'] ,	
				carousel_Width = oa_carousel_opts['carousel_Width'] ,
				speed = offset / ( time / num ) ;

			var go = function(){
				
				var oa_carousel_list_left =  parseFloat(window.getComputedStyle( $oa_carousel_list[0] )['left'] ) ;
				oa_carousel_opts['animating'] = 'true' ;
				if( ( speed < 0 && oa_carousel_list_left > left ) || ( speed > 0  && oa_carousel_list_left < left )  ){
					 $oa_carousel_list[0].style.left =  oa_carousel_list_left + speed +'px' ;
				}
				else{
					
					$oa_carousel_list[0].style.left = left + 'px' ;
					if( left > -200 ){
						$oa_carousel_list[0].style.left = ( len - 2 ) * carousel_Width * ( -1 ) +'px' ;
					}
					else if( left < ( len - 2 ) * carousel_Width * ( -1 )  ){
						$oa_carousel_list[0].style.left = -1 * carousel_Width + 'px' ;
					}
					oa_carousel_opts['animating'] = 'false' ;
					
					clearInterval( animate_timer ) ;
				}
			}
			var animate_timer = setInterval( go , num ) ;
		}
		
	} ,
	'showButtons' : function(target){
		var $this = target ;
		var oa_carousel_opts = $this.data('oa-carousel-opts') ;
		var $oa_carousel_buttons = $this.find('.oa-carousel-buttons') ;
		var buttons = $oa_carousel_buttons.find('span') ;
		var index = oa_carousel_opts['index'] ;
		var className = OA_Config['carousel']['currButtton_class'] ;

		for(var i = 0 ; i < buttons.length ; i++){
			var button = buttons.eq(i) 
			if( index == i ){
				button.addClass(className) ;
			}
			else{
				button.removeClass(className) ;
			}
		}
	},
	'bindEvent' : function(target){
		var $this = target ;
		var self = this ;
		var oa_carousel_opts = $this.data('oa-carousel-opts');
		var showbutton = oa_carousel_opts['showbutton'] ;
		var showarrow = oa_carousel_opts['showarrow'] ;
		var touch = oa_carousel_opts['touch'] ;

		if(showbutton && showbutton == 'true'){
			var $oa_carousel_buttons = $this.find('.oa-carousel-buttons');
			$oa_carousel_buttons.on('click','span',function(){
				var click_button = $$(this) ;
				var click_index = click_button.attr('index') ;
				var oa_carousel_opts = $this.data('oa-carousel-opts') ;
				var curr_index = oa_carousel_opts['index'] ;

				if((curr_index+1) == click_index) return ;

				self.goIndex($this,(click_index-1));
			}) ;
		}
		if(showarrow && showarrow == 'true'){
			var $oa_carousel_arrow = $this.find('.oa-carousel-arrow') ;
			$oa_carousel_arrow.on('click',function(evt){
				if($$(this).hasClass('oa-carousel-arrow-prev')){
					self.prev($this) ;
				}
				else if($$(this).hasClass('oa-carousel-arrow-next')){
					self.next($this) ;
				}
			}) ;
		}

		$this.on('mouseover',function(){
			self.stop($this) ;
		}) ;

		$this.on('mouseout',function(){
			self.play($this) ;
		}) ;

		// 触摸滑动
		if(touch && touch == 'true'){

			var touchStart = function(evt){

				var curr_target = evt.target ;
				if($$(curr_target).hasClass('oa-carousel-arrow') || $$(curr_target).is('span')) return ;

				var oa_carousel_opts = $this.data('oa-carousel-opts');
				var animating = oa_carousel_opts['animating'] ;
				if(animating && animating == 'true') return ;
				
				oa_carousel_opts['startTime'] = new Date() * 1 ;
				oa_carousel_opts['startX'] = evt.touches[0].pageX ;
				oa_carousel_opts['offsetX'] = 0 ;

				$this.data('oa-carousel-opts',oa_carousel_opts) ;
			}

			var touchMove = function(evt){
				var curr_target = evt.target ;
				if($$(curr_target).hasClass('oa-carousel-arrow') || $$(curr_target).is('span')) return ;

				var oa_carousel_opts = $this.data('oa-carousel-opts');
				var animating = oa_carousel_opts['animating'] ;
				if(animating && animating == 'true') return ;
				
				var curr_index = oa_carousel_opts['index'] ;
				var carousel_Width = oa_carousel_opts['carousel_Width'] ;
				var $oa_carousel_list = $this.find('.oa-carousel-list') ;


				evt.preventDefault() ;
				oa_carousel_opts['offsetX'] = evt.targetTouches[0].pageX - oa_carousel_opts['startX'] ;
				var value = (-curr_index-1)*carousel_Width + oa_carousel_opts['offsetX'] ;

				self.setTransfrom($oa_carousel_list,value,0) ;

				$this.data('oa-carousel-opts',oa_carousel_opts) ;
			}

			var touchEnd = function(evt){
				var curr_target = evt.target ;
				if($$(curr_target).hasClass('oa-carousel-arrow') || $$(curr_target).is('span')) return ;

				var oa_carousel_opts = $this.data('oa-carousel-opts');
				var animating = oa_carousel_opts['animating'] ;
				if(animating && animating == 'true') return ;
				evt.preventDefault();
				
				var carousel_Width = oa_carousel_opts['carousel_Width'] ;
				var boundary =  carousel_Width / 9 ;
				var startTime = oa_carousel_opts['startTime'] ;
				var endTime = new Date() * 1 ;
				var offsetX = oa_carousel_opts['offsetX'] ;
				var index = oa_carousel_opts['index'] ;
				var len = oa_carousel_opts['oa_carousel_list_items_length'] ;
				var $oa_carousel_list = $this.find('.oa-carousel-list') ;
				
				if((endTime - startTime)>200){
					if(offsetX >= boundary ){
						index = index * 1 + (-1) ;
						if(index<0){
							index = len - 3 ;
						}
					}else if(offsetX < 0 && offsetX < -boundary){
						index = index + 1 ;
						if(index>len-3){
							index = 0 ;
						}
					}
				}
				self.goIndex($this,index);
			}

			if( document.addEventListener ) {
				$this[0].addEventListener('touchstart', touchStart);
				$this[0].addEventListener('touchmove', touchMove);
				$this[0].addEventListener('touchend', touchEnd);
			}
			else if( document.attachEvent ){ //IE
				$this[0].attachEvent('ontouchstart', touchStart);
				$this[0].attachEvent('ontouchmove', touchMove);
				$this[0].attachEvent('ontouchend', touchEnd);
			}
		}
	},
	'setTransfrom' : function(target,value,time){
		var transition = 'transform '+time+'s ease-out' ,
			webkit_transition = '-webkit-transform '+time+'s ease-out' ,
			moz_transition = '-moz-transform '+time+'s ease-out' ,
			o_transition = '-o-transform '+time+'s ease-out' ,
			transform = 'translate3d('+ value +'px, 0, 0)' ;

		target[0].style.transition = transition ;
		target[0].style.webkitTransition = webkit_transition ;
		target[0].style.mozTransition = moz_transition;
		target[0].style.oTransition = o_transition;

		target[0].style.webkitTransform = transform ;
		target[0].style.mozTransform = transform ;
		target[0].style.oTransform = transform ;
		target[0].style.transform = transform ;
	}
} ;

okayApp.fn.carousel = function(opts){

	var $this = $$(this) ;
	if(!$this.hasClass('oa-carousel')) return ;

	if(!opts || typeof opts == 'object'){

		var oa_carousel_active = $this.data('oa-carousel-active') ;
		if(oa_carousel_active && oa_carousel_active == 'true') return ;

		opts = opts ? opts : {} ;

		opts['interval'] = opts['interval'] ? opts['interval'] : 2000 ;
		opts['touch'] = opts['touch'] ? opts['touch'] : 'false' ;
		opts['showbutton'] = opts['showbutton'] ? opts['showbutton'] : 'false' ;
		opts['showarrow'] = opts['showarrow'] ? opts['showarrow'] : 'false' ;
		opts['index'] = opts['index'] ? opts['index'] : 0 ;
		opts['animating'] = opts['animating'] ? opts['animating'] : 'false' ;
		opts['direction'] = opts['direction'] ? opts['direction'] : -1 ;

		// 绑定参数
		$this.data('oa-carousel-opts',opts);

		// 初始化dom组件
		OA_Events['carousel'].initDom($this);
		OA_Events['carousel'].bindEvent($this);
		OA_Events['carousel'].play($this);
	}
	else if(opts && opts == 'play'){
		var oa_carousel_state = $this.data('oa-carousel-state') ;
		if(oa_carousel_state && oa_carousel_state == 'play') return ;
		OA_Events['carousel'].play($this);
	}
	else if(opts && opts == 'pause'){
		var oa_carousel_state = $this.data('oa-carousel-state') ;
		if(oa_carousel_state && oa_carousel_state == 'stop') return ;
		OA_Events['carousel'].stop($this);
	}
	else if(opts && opts == 'next'){
		var oa_carousel_state = $this.data('oa-carousel-state') ;
		
		if(oa_carousel_state && oa_carousel_state == 'play'){
			OA_Events['carousel'].next($this);
		}
	}
	else if(opts && opts == 'prev'){
		var oa_carousel_state = $this.data('oa-carousel-state') ;
		if(oa_carousel_state && oa_carousel_state == 'play'){
			OA_Events['carousel'].prev($this);
		}
	}
	else if(opts!=null && !isNaN(opts)){

		var oa_carousel_state = $this.data('oa-carousel-state') ;
		if(oa_carousel_state && oa_carousel_state == 'play'){
			OA_Events['carousel'].goIndex($this,opts*1);
		}
	}
}

$$(document).ready(function(){
	$$('[data-oa-carousel]').each(function(i,v){
		var $this = $$(this) ;
		var oa_carousel_active = $this.data('oa-carousel-active') ;
		if(!$this.hasClass('oa-carousel') || (oa_carousel_active && oa_carousel_active=='true')){
			return ;
		} 

		var oa_carousel_opts = $this.attr('data-oa-carousel') ;
		if(oa_carousel_opts){
			oa_carousel_opts = OA_Untils.parseOptions(oa_carousel_opts) ;
		}
		$this.carousel(oa_carousel_opts);
	}) ;
});

/*
	offcanvas
	侧边栏  oa-offcanvas  oa-offcanvas-menus  oa-offcanvas-menu  oa-offcanvas-contents  oa-offcanvas-content  
		{} : 初始化参数 oa-offcanvas-active : 'true' : 激活侧边栏
			effect : offcanvas加载方式overlay:覆盖原页面	push:侧边栏和原页面都滑动 默认overlay
			touch ： 是否支持触摸滑动 'true' :支持 'false':不支持，默认不支持
			position : 显示侧边栏方位 left : 左边	right : 右边	默认left
		
		open : 打开
		close : 关闭
	需要使用的参数
		data : oa-offcanvas-opts : 初始化参数 
	说明:轮播图外层组件的宽度、高度需用户自行设置
*/

OA_Config['offcanvas'] = {
	// 动画持续时间
	'animate_time' : 200 ,
	// 滑动临界比例
	'boundary' :  1/6 
} ;

OA_Events['offcanvas'] = {
	// 初始化dom位置
	'initDom' : function(target){
		var $this = target ;
		var self = this ;
		var $oa_offcanvas_menus = $this.find('.oa-offcanvas-menus') ;
		var oa_offcanvas_opt = $this.data('oa-offcanvas-opts');
		var clientWidth = OA_Untils.getViewport()['width'] ;
		var position = oa_offcanvas_opt['position'] ;
		var menus_width = $oa_offcanvas_menus[0].offsetWidth ;
		var transform_width = -menus_width ;

		oa_offcanvas_opt['menus_width'] = menus_width ;
		oa_offcanvas_opt['client_width'] = clientWidth ;

		$this.data('oa-offcanvas-opts',oa_offcanvas_opt);

		if(position && position == 'right'){
			transform_width = clientWidth ;
		}

		self.setTransfrom($oa_offcanvas_menus,transform_width,0) ;
	},
	// 绑定触摸事件
	'bindEvent' : function(target){
		var $this = target ;
		var self = this ;
		var oa_offcanvas_opt = $this.data('oa-offcanvas-opts');
		var touch = oa_offcanvas_opt['touch'] ;
		var position = oa_offcanvas_opt['position'] ;


		// 支持触摸滑动
		if(touch && touch == 'true'){

			var $oa_offcanvas_menus = $this.find('.oa-offcanvas-menus');
			var $oa_offcanvas_contents = $this.find('.oa-offcanvas-contents');

			var touchstart = function(evt){

				var oa_offcanvas_opt = $this.data('oa-offcanvas-opts');

				oa_offcanvas_opt['startX'] = evt.touches[0].pageX ;
				oa_offcanvas_opt['menus_start_transform'] = self.getTransform($oa_offcanvas_menus) ;
				oa_offcanvas_opt['contents_start_transform'] = self.getTransform($oa_offcanvas_contents);

				$this.data('oa-offcanvas-opts',oa_offcanvas_opt);
			};

			var touchmove = function(evt){

				evt.preventDefault();
				var oa_offcanvas_opt = $this.data('oa-offcanvas-opts');
				var menus_width = oa_offcanvas_opt['menus_width'] ;
				var client_width = oa_offcanvas_opt['client_width'] ;
				var effect = oa_offcanvas_opt['effect'] ;
				var offsetX = evt.touches[0].pageX  - oa_offcanvas_opt['startX'] ;
				var menus_start_transform = oa_offcanvas_opt['menus_start_transform'] * 1 ;
				var contents_start_transform = oa_offcanvas_opt['contents_start_transform'] * 1 ;
				var menus_transform_value = menus_start_transform + offsetX ;
				var content_transform_value = contents_start_transform + offsetX ;


				if(position && position == 'right'){

					if(menus_transform_value>client_width){
						menus_transform_value = client_width ;
						content_transform_value = 0 ;
					}

					if(menus_transform_value<(client_width-menus_width)){
						menus_transform_value = (client_width-menus_width) ;
						content_transform_value = -menus_width ;
					}
				}
				else{
					if(menus_transform_value>0){
						menus_transform_value = 0 ;
						content_transform_value = menus_width ;
					}

					if(menus_transform_value<(-menus_width)){
						menus_transform_value = (-menus_width) ;
						content_transform_value = 0 ;
					}
				}


				if(offsetX!=0){

					if(effect == 'overlay'){
						self.setTransfrom($oa_offcanvas_menus,menus_transform_value,0) ;
					}
					else{
						self.setTransfrom($oa_offcanvas_menus,menus_transform_value,0) ;
						self.setTransfrom($oa_offcanvas_contents,content_transform_value,0) ;
					}
				}

				oa_offcanvas_opt['offsetX'] = offsetX ;
				
				$this.data('oa-offcanvas-opts',oa_offcanvas_opt);

			} ;

			var touchend = function(evt){
				evt.preventDefault();

				var oa_offcanvas_opt = $this.data('oa-offcanvas-opts') ;
				var offsetX = oa_offcanvas_opt['offsetX'] ;
				var menus_width = oa_offcanvas_opt['menus_width'] ;
				var client_width = oa_offcanvas_opt['client_width'] ;
				var effect = oa_offcanvas_opt['effect'] ;

				// 获取触摸结束时 侧边栏位移
				var menus_end_transform = self.getTransform($oa_offcanvas_menus); 
				var content_end_transform = self.getTransform($oa_offcanvas_contents) ;
				var menus_transform_value = 0 ,
					content_transform_value = 0 ;

				// 初始状态为侧边栏打开
				if(offsetX < 0 ){
					if((-offsetX) > OA_Config['offcanvas'].boundary * menus_width){
						menus_transform_value = ( position == 'right' ) ? (client_width - menus_width) : (-menus_width) ;
						content_transform_value = ( position == 'right' ) ? (-menus_width) : 0 ;
					}
					else{
						menus_transform_value = ( position == 'right' ) ? client_width : 0 ;
						content_transform_value =　( position == 'right' ) ? 0 : menus_width ;
					}
				}

				// 初始状态为侧边栏关闭
				if(offsetX > 0 ){
					if(offsetX > OA_Config['offcanvas'].boundary * menus_width){
						menus_transform_value = ( position == 'right' ) ? client_width : 0 ;
						content_transform_value = ( position == 'right' ) ? 0 : menus_width ;
					}
					else{
						menus_transform_value = ( position == 'right' ) ? (client_width-menus_width) : (-menus_width) ;
						content_transform_value = ( position == 'right' ) ? (-menus_width) : 0 ;
					}
				}

				if(menus_transform_value!=0 || content_transform_value!=0){
					if(effect && effect == 'overlay'){
						self.setTransfrom($oa_offcanvas_menus,menus_transform_value,OA_Config['offcanvas'].animate_time/1000) ;
					}
					else{	
						self.setTransfrom($oa_offcanvas_menus,menus_transform_value,OA_Config['offcanvas'].animate_time/1000) ;
						self.setTransfrom($oa_offcanvas_contents,content_transform_value,OA_Config['offcanvas'].animate_time/1000) ;
					}	
				}
			} 

			if( document.addEventListener ) {
				$this[0].addEventListener('touchstart', touchstart);
				$this[0].addEventListener('touchmove', touchmove);
				$this[0].addEventListener('touchend', touchend);
			}
			else if( document.attachEvent ){ //IE
				$this[0].attachEvent('ontouchstart', touchstart);
				$this[0].attachEvent('ontouchmove', touchmove);
				$this[0].attachEvent('ontouchend', touchend);
			}
		}
	},
	// 打开侧边栏
	'open' : function(target){
		var $this = target ;
		var self = this ;
		if(!$this.hasClass('oa-offcanvas')) return ;

		var $oa_offcanvas_menus = $this.find('.oa-offcanvas-menus') ;
		var $oa_offcanvas_contents = $this.find('.oa-offcanvas-contents');

		var oa_offcanvas_opt = $this.data('oa-offcanvas-opts');
		var menus_width = oa_offcanvas_opt['menus_width'] ;
		var client_width = oa_offcanvas_opt['client_width'] ;
		var menus_width = oa_offcanvas_opt['menus_width'] ;
		var position = oa_offcanvas_opt['position'] ;
		var effect = oa_offcanvas_opt['effect'] ;
		var menus_transform_value = 0 ;
		var content_transform_value = 0 ;

		if(position && position == 'right'){
			menus_transform_value = client_width - menus_width ;
			content_transform_value = -menus_width ;
		}	
		else{
			menus_transform_value = 0 ;
			content_transform_value = menus_width ;
		}

		if(effect && effect == 'overlay'){
			self.setTransfrom($oa_offcanvas_menus,menus_transform_value,OA_Config['offcanvas'].animate_time/1000) ;
		}
		else{	
			self.setTransfrom($oa_offcanvas_menus,menus_transform_value,OA_Config['offcanvas'].animate_time/1000) ;
			self.setTransfrom($oa_offcanvas_contents,content_transform_value,OA_Config['offcanvas'].animate_time/1000) ;
		}	
	} ,
	// 关闭侧边栏
	'close' : function(target){
		var $this = target ;
		var self = this ;

		if(!$this.hasClass('oa-offcanvas')) return ;
		var $oa_offcanvas_menus = $this.find('.oa-offcanvas-menus') ;
		var $oa_offcanvas_contents = $this.find('.oa-offcanvas-contents');

		var oa_offcanvas_opt = $this.data('oa-offcanvas-opts');
		var menus_width = oa_offcanvas_opt['menus_width'] ;
		var client_width = oa_offcanvas_opt['client_width'] ;
		var menus_width = oa_offcanvas_opt['menus_width'] ;
		var position = oa_offcanvas_opt['position'] ;
		var effect = oa_offcanvas_opt['effect'] ;
		var menus_transform_value = 0 ;
		var content_transform_value = 0 ;

		if(position && position == 'right'){
			menus_transform_value = client_width  ;
			content_transform_value = 0 ;
		}	
		else{
			menus_transform_value = -menus_width ;
			content_transform_value = 0 ;
		}

		if(effect && effect == 'overlay'){
			self.setTransfrom($oa_offcanvas_menus,menus_transform_value,OA_Config['offcanvas'].animate_time/1000) ;
		}
		else{	
			self.setTransfrom($oa_offcanvas_menus,menus_transform_value,OA_Config['offcanvas'].animate_time/1000) ;
			self.setTransfrom($oa_offcanvas_contents,content_transform_value,OA_Config['offcanvas'].animate_time/1000) ;
		}	

	},
	// 设置transform属性
	'setTransfrom' : function(target,value,time){
		var transition = 'transform '+time+'s ease-out' ,
			webkit_transition = '-webkit-transform '+time+'s ease-out' ,
			moz_transition = '-moz-transform '+time+'s ease-out' ,
			o_transition = '-o-transform '+time+'s ease-out' ,
			transform = 'translate3d('+ value +'px, 0, 0)' ;

		target[0].style.transition = transition ;
		target[0].style.webkitTransition = webkit_transition ;
		target[0].style.mozTransition = moz_transition;
		target[0].style.oTransition = o_transition;

		target[0].style.webkitTransform = transform ;
		target[0].style.mozTransform = transform ;
		target[0].style.oTransform = transform ;
		target[0].style.transform = transform ;
	},
	// 得到transform属性值
	'getTransform' : function(target){
		var reg = /^\w+\(((-*\d*\.*\d*)*,\s*)+(-*\d*\.*\d*)\)$/gi ;

		var transform = window.getComputedStyle(target[0])['transform'] 
						|| window.getComputedStyle(target[0])['-webkit-transform']
						|| window.getComputedStyle(target[0])['-moz-transform']
						|| window.getComputedStyle(target[0])['o-transform'] ;
		
		var ret =reg.exec(transform) ;
		return ( ret && ret[2] ) ? ret[2] : 0 ;
	}
} ;


okayApp.fn.offcanvas = function(opts){
	var $this = $$(this) ;
	if(!$this.hasClass('oa-offcanvas')) return ;

	// 初始化侧边栏
	if(!opts || typeof opts == 'object'){

		var oa_offcanvas_active = $this.data('oa-offcanvas-active') ;

		// 确保只能初始化一次
		if(oa_offcanvas_active && oa_offcanvas_active == 'true') return ;

		opts = opts ? opts : {} ;
		opts['effect'] = opts['effect'] ? opts['effect'] : 'overlay' ;
		opts['touch'] = opts['touch'] ? opts['touch'] : 'false' ;
		opts['position'] = opts['position'] ? opts['position'] : 'left' ;

		$this.data('oa-offcanvas-opts',opts) ;

		// 初始化逐渐位置
		OA_Events['offcanvas'].initDom($this) ;
		// 绑定事件
		OA_Events['offcanvas'].bindEvent($this);

		$this.data('oa-offcanvas-active','true') ;

	}
	else if(opts && opts == 'open'){
		var oa_offcanvas_active = $this.data('oa-offcanvas-active') ;
		if(!oa_offcanvas_active || oa_offcanvas_active !='true') return ;

		OA_Events['offcanvas'].open($this) ;
	}
	else if(opts && opts == 'close'){
		var oa_offcanvas_active = $this.data('oa-offcanvas-active') ;
		if(!oa_offcanvas_active || oa_offcanvas_active !='true') return ;

		OA_Events['offcanvas'].close($this) ;
	}
}
$$(document).ready(function(){

	// 初始化侧边栏
	$$('[data-oa-offcanvas]').each(function(i,v){
		var $this = $$(this) ;
		if(!$this.hasClass('oa-offcanvas')) return ;

		var data_oa_offcanvas = $this.attr('data-oa-offcanvas') ;
		if(data_oa_offcanvas){
			data_oa_offcanvas = OA_Untils.parseOptions(data_oa_offcanvas) ;
		}

		$this.offcanvas(data_oa_offcanvas) ;
	});

	// 屏蔽屏幕的默认的触摸事件
	$$(document)[0].addEventListener('touchmove',function(evt){
		evt.preventDefault() ;
	});
});

/*

	scrollspynav
	滚动侦测导航  oa-active oa-scrollspynav
		{} : 初始化参数 oa-scrollspynav-active : 'true' : 激活侧边栏
			active ：高亮导航条类名
			smooth : 点击锚点时平滑滚动 默认是'true'
		
	需要使用的参数
		data : oa-scrollspynav-opts : 初始化参数 

	说明:轮播图外层组件的宽度、高度需用户自行设置
*/
OA_Config['scrollspynav'] = {
	// 默认高亮导航条类名
	'active_class':'oa-active',
	// 动画时间
	'time':500
} ;

OA_Events['scrollspynav'] = {
	// 初始化滚动侦测导航并绑定事件
	'init' : function(target){

		var $this = target ;
		var self = this ;
		var oa_scrollspynav_opts = $this.data('oa-scrollspynav-opts') ;
		var active_class = oa_scrollspynav_opts['active'] ;
		var smooth = oa_scrollspynav_opts['smooth'] ;
 		var curr_ab_position = OA_Untils.getAbsolutePosition($this);
		// 组件距离文档顶部的距离
		var ab_top = curr_ab_position['top'] ;
		var anchors = [] ;

		$this.find('a').each(function(i,v){
			var href = $$(this).attr('href') ;
			anchors.push(href) ;
		}) ;
		oa_scrollspynav_opts['anchors'] = anchors ;
		$this.data('oa-scrollspynav-opts',oa_scrollspynav_opts) ;

		$$(window).on('scroll',function(){

			var curr_position = OA_Untils.getRealitivePosition($this) ;
			// 组件距离浏览器顶部的距离
			var top = curr_position['top'] ;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop ;
			scrollTop = scrollTop  ;

			if(scrollTop >= ab_top){
				$this[0].style.position = 'fixed' ;
				$this[0].style.top = '0px' ;
			}
			else{
				$this[0].style.position = 'absolute' ;
				$this[0].style.top = 'auto' ;
			}

			var sort_anchors = self.getAnchor($this) ;
			if(sort_anchors.length > 0 ){
				var first_anchor = sort_anchors[0]['anchor'] ;
				$this.find('.'+active_class).removeClass(active_class) ;
				$this.find('[href^='+first_anchor+']').addClass(active_class) ;
			}
			
		}) ;

		$this.find('ul').on('click','li>a',function(evt){
			evt.preventDefault() ;
			var tg = evt.target ;
			if($$(tg).is('a')){
				var id = $$(tg).attr('href') ;
				var rl_position = OA_Untils.getRealitivePosition($$(id)) ;
				var scrollTop = document.body.scrollTop || document.documentElement.scrollTop ;
				scrollTop = scrollTop + rl_position['top'] - $this[0].offsetHeight - 20 ;
				
				if(smooth && smooth == 'true'){
					$$(document.body).animate({'scrollTop':scrollTop},OA_Config['scrollspynav']['time']) ;
					$$(document.documentElement).animate({'scrollTop':scrollTop},OA_Config['scrollspynav']['time']) ;
				}
				else{
					$$(document.body).scrollTop(scrollTop) ;
					$$(document.documentElement).scrollTop(scrollTop) ;
				}
			}
		}) ;

	} ,
	'getAnchor' : function(target){
		var $this = target ;
		var oa_scrollspynav_opts = $this.data('oa-scrollspynav-opts') ;
		var anchors = oa_scrollspynav_opts['anchors'] ;
		var clientHeight = OA_Untils.getViewport()['height'] ;
		var ret = [] ;

		for(var i = 0 ; i < anchors.length ; i++ ){
			var anchor = anchors[i] ;
			var rl_position = OA_Untils.getRealitivePosition($$(anchor)) ;
			if(rl_position['top'] < 0 || (rl_position['bottom'] - clientHeight > 0)){
				continue ;
			}

			var ah = {} ;
			ah['anchor'] = anchor ;
			ah['top'] = rl_position['top'] ;
			ret.push(ah);
		}

		ret.sort(function(a1,a2){
			var t1 = a1['top'] ;
			var t2 = a2['top'] ;
			return t1 - t2 || -1 ;  
		}) ;
		
		return ret ;
	}
} ;

okayApp.fn.scrollspynav = function(opts){
	var $this = $$(this) ;
	if(!$this.hasClass('oa-scrollspynav')) return ;

	var oa_scrollspynav_active = $this.data('oa-scrollspynav-active') ;
	if(oa_scrollspynav_active && oa_scrollspynav_active == 'true') return ;

	if(!opts || typeof opts == 'object' ){
		opts = opts ? opts : {} ;
		opts['offsetTop'] = opts['offsetTop'] ? opts['offsetTop'] : 0 ;
		opts['active'] = opts['active'] ? opts['active'] : OA_Config['scrollspynav']['active_class'] ;
		opts['smooth'] = opts['smooth'] ? opts['smooth'] : 'true' ;

		$this.data('oa-scrollspynav-opts',opts) ;
		$this.data('oa-scrollspynav-active','true');

		OA_Events['scrollspynav'].init($this) ;
	}
}

$$(document).ready(function(){
	$$('[data-oa-scrollspy]').each(function(){
		var $this = $$(this) ;
		if(!$this.hasClass('oa-scrollspynav')) return ;

		var data_oa_scrollspy = $this.attr('data-oa-scrollspy');
		if(data_oa_scrollspy){
			data_oa_scrollspy = OA_Untils.parseOptions(data_oa_scrollspy) ;
		}
		$this.scrollspynav(data_oa_scrollspy) ;
	}) ;
}) ;

/*
	smoothscroll
	平滑滚动  oa-smoothscroll
		{} : 初始化参数 oa-smoothscroll-active : 'true' : 激活平滑滚动
			height ：滚动到顶部的距离
		
	需要使用的参数
		data : oa-smoothscroll-opts : 初始化参数 

*/
OA_Config['smoothscroll'] = {
	// 动画时间
	'time' : 500 
} ;

OA_Events['smoothscroll'] = {
	'goTop' : function(target){
		var $this = target ;
		if(!$this.hasClass('oa-smoothscroll')) return ;

		var oa_smoothscroll_opts = $this.data('oa-smoothscroll-opts') ;
		var height = oa_smoothscroll_opts['height'] ;
		var st = document.body.scrollTop || document.documentElement.scrollTop ;
		var scrollTop = height ;

		$$(document.body).animate({'scrollTop':scrollTop},OA_Config['smoothscroll']['time']) ;
		$$(document.documentElement).animate({'scrollTop':scrollTop},OA_Config['smoothscroll']['time']) ;
 	}
} ;

okayApp.fn.smoothscroll = function(opts){
	var $this = $$(this) ;
	if(!$this.hasClass('oa-smoothscroll')) return ;
	if(!opts|| typeof opts == 'object'){
		opts = opts ? opts : {} ;
		opts['height'] = opts['height'] ? opts['height'] : 0 ;
		$this.data('oa-smoothscroll-opts',opts) ;
		$this.data('oa-smoothscroll-active','true') ;
 	}
	else if(opts && opts == 'go'){
		var oa_smoothscroll_active = $this.data('oa-smoothscroll-active') ;
		if(!oa_smoothscroll_active || oa_smoothscroll_active!='true') return ;
		OA_Events['smoothscroll'].goTop($this) ;
	}
}

$$(document).ready(function(){
	$$('[data-oa-smoothscroll]').each(function(i,v){
		var $this = $$(this) ;

		if(!$this.hasClass('oa-smoothscroll')) return ;

		var data_oa_smoothscroll = $this.attr('data-oa-smoothscroll') ;

		if(data_oa_smoothscroll){
			data_oa_smoothscroll = OA_Untils.parseOptions(data_oa_smoothscroll) ;
		}

		$this.smoothscroll(data_oa_smoothscroll);
	}) ;
}) ;

/*
	sticky
	固定元素  oa-sticky
		{} : 初始化参数 oa-sticky-active : 'true' : 激活固定元素
			top : 离顶部的距离
		
	需要使用的参数
		data : oa-sticky-opts : 初始化参数 

*/

OA_Events['sticky'] = {
	'init' : function(target){
		var $this = target ;
		var oa_sticky_active = $this.data('oa-sticky-active') ;
		if(!$this.hasClass('oa-sticky') || !oa_sticky_active || oa_sticky_active!='true') return ;
		
		var oa_sticky_opts = $this.data('oa-sticky-opts');
		var top = oa_sticky_opts['top'] ;

		var curr_ab_position = OA_Untils.getAbsolutePosition($this) ;
		var ab_top = curr_ab_position['top'] ;

		var default_position = getComputedStyle($this[0])['position'] ? getComputedStyle($this[0])['position'] : 'static' ;
		var default_top = default_top = getComputedStyle($this[0])['top'] ? getComputedStyle($this[0])['top'] : '0px' ;

		$$(window).on('scroll',function(){

			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop ;
			scrollTop = scrollTop + top ;
			if(scrollTop >= ab_top){
				$this[0].style.position = 'fixed' ;
				$this[0].style.top = top + 'px';
			}
			else{
				$this[0].style.position = default_position ;
				$this[0].style.top = default_top ;
			}
		}) ;
	}
};

okayApp.fn.sticky = function(opts){
	var $this = $$(this) ;
	if(!$this.hasClass('oa-sticky')) return ;

	if(!opts || typeof opts == 'object'){
		opts = opts ? opts : {} ;
		opts['top'] = opts['top'] ? opts['top'] : 0 ;

		$this.data('oa-sticky-opts',opts) ;
		$this.data('oa-sticky-active','true') ;

		OA_Events['sticky'].init($this) ;

	}
}

$$(document).ready(function(){
	$$('[data-oa-sticky]').each(function(i,v){
		var $this = $$(this) ;
		if(!$this.hasClass('oa-sticky')) return ;

		var data_oa_sticky = $this.attr('data-oa-sticky');
		if(data_oa_sticky){
			data_oa_sticky = OA_Untils.parseOptions(data_oa_sticky); 
		}
		$this.sticky(data_oa_sticky) ;
	}) ;
});

/*

	tabs
	选项卡  oa-tabs oa-tabs-nav oa-nav oa-nav-tabs oa-active oa-tabs-bd oa-tab-panel
		{} : 初始化参数 oa-sticky-active : 'true' : 激活固定元素
			swipe : 是否支持触摸滑动

	需要使用的参数
		data : oa-tabs-opts : 初始化参数 

	事件：事件绑定在ul>li上
		open.tabs.oa : 打开tabs时立即触发
		opened.tabs.oa : 打开tabs后立即触发

*/
OA_Config['tabs'] = {
	// tab条激活类名
	'oa-tabs-active-class':'oa-active' ,
	// content激活类名
	'oa-tab-panel-active-class':'oa-active' ,
	// content外层容器类名
	'oa-tabs-contents-class' : 'oa-tabs-bd',
	// 滑动时间临界值
	'oa-tabs-swipe-time' : 100
};

OA_Events['tabs'] = {
	'init' : function(target){
		var $this = target ;
		var self = this ;
		if(!$this.hasClass('oa-tabs')) return ;

		var oa_tabs_opts = $this.data('oa-tabs-opts');
		var swipe = oa_tabs_opts['swipe'] ;

		// 绑定事件
		$this.find('ul.oa-nav-tabs').on('click','li>a',function(e){
			var tar = e.target ;
			var oa_tabs_active_class = OA_Config['tabs']['oa-tabs-active-class'] ;

			if($$(tar).is('a')){

				if($$(tar).hasClass(oa_tabs_active_class)) return ;

				var index = $$(tar).closest('li').index() ;

				self.goIndex($this,index);
			}
		}) ;

		// 绑定滑动事件
		if(swipe && swipe == 'true'){
			var oa_tabs_contents_class = OA_Config['tabs']['oa-tabs-contents-class'] ;
			var startX = 0 ;
			var offsetX = 0 ;
			var time = 0 ;

			var oa_tabs_contents = $this.find('.'+oa_tabs_contents_class) ;

			oa_tabs_contents[0].addEventListener('touchstart',function(evt){
				startX = evt.touches[0].pageX ;
				time = new Date() * 1 ;
			}) ;

			oa_tabs_contents[0].addEventListener('touchmove',function(evt){
				offsetX = evt.touches[0].pageX - startX ;
			}) ;

			oa_tabs_contents[0].addEventListener('touchend',function(evt){
				time = new Date() * 1 - time ;
				var target = evt.target ;
				var index = $$(target).index() ;
				var num = $$(this).find('div').size() ;
				if(time > OA_Config['tabs']['oa-tabs-swipe-time']){
					if(offsetX > 0){
						if(index==0) return ;
						index = index - 1;
					}
					else if(offsetX < 0){
						if(index==(num-1)) return ;
						index = index + 1 ;
					}
					self.goIndex($this,index) ;
				}
			}) ;
		}
	},
	'goIndex' : function(target,index){
		var $this = target ;
		if(!$this.hasClass('oa-tabs') || (index==null || index==undefined)) return ;

		var oa_tabs_active_class = OA_Config['tabs']['oa-tabs-active-class'] ;
		var oa_tab_panel_active_class = OA_Config['tabs']['oa-tab-panel-active-class'] ;
		var oa_tabs_contents_class = OA_Config['tabs']['oa-tabs-contents-class'] ;

		$this.find('.'+oa_tabs_active_class).removeClass(oa_tabs_active_class);
		$this.find('.'+oa_tab_panel_active_class).removeClass(oa_tab_panel_active_class) ;
		
		// 触发open.tabs.oa事件
		$this.find('ul>li').eq(index).trigger('open.tabs.oa') ;

		$this.find('ul>li').eq(index).addClass(oa_tabs_active_class) ;
		$this.find('.'+oa_tabs_contents_class).find('div').eq(index).addClass(oa_tab_panel_active_class) ;
		
		// 触发opened.tabs.oa事件
		$this.find('ul>li').eq(index).trigger('opened.tabs.oa') ;
	} 
} ;

okayApp.fn.tabs = function(opts){
	var $this = $$(this) ;
	var oa_tabs_active = $this.data('oa-tabs-active') ;
	if(!$this.hasClass('oa-tabs') || (oa_tabs_active && oa_tabs_active =='true')) return ;

	if(!opts || typeof opts == 'object'){
		opts = opts ? opts : {};
		opts['swipe'] = opts['swipe'] ? opts['swipe'] : 'true' ;

		$this.data('oa-tabs-opts',opts);
		$this.data('oa-tabs-active','true') ;

		OA_Events['tabs'].init($this) ;
	}
}

$$(document).ready(function(){
	$$('[data-oa-tabs]').each(function(i,v){
		var $this = $$(this) ;
		if(!$this.hasClass('oa-tabs')) return ;

		var data_oa_tabs = $this.attr('data-oa-tabs') ;
		if(data_oa_tabs){
			data_oa_tabs = OA_Untils.parseOptions(data_oa_tabs) ;
		}
		$this.tabs(data_oa_tabs) ;
	});
}) ;


/*
	datepicker
	日历组件  oa-datepicker oa-datepicker-dropdown oa-datepicker-caret oa-datepicker-days oa-datepicker-table 
		oa-datepicker-header oa-datepicker-prev oa-datepicker-prev-icon oa-datepicker-switch oa-datepicker-select 
		oa-datepicker-next oa-datepicker-next-icon oa-datepicker-dow oa-datepicker-day oa-datepicker-old oa-datepicker-new
	参数
		{} : 初始化参数 oa-datepicker-active : 'true' : 激活日历
			theme : 日历样式(success: 绿色 warning: 橙色 danger: 红色) 默认为default
			format : 日历格式化形式(年：yyyy 月:MM 日:dd) 默认为yyyy-MM-dd
			beforeDisable : 当前日期之前的日期是否禁用 	默认为false
			locale : 语言设置 zh_cn、en_us 默认为中文 
			autoClose : 选择日期后是否自动关闭日历	默认为true

		open : 打开日历
		close : 隐藏日历
		prev : 上一个月
		next : 下一个月
		setValue ：设置日历值 value : 设置的日期值
	需要使用的参数
		data : oa-datepicker-opts : 初始化参数 
		data : oa-datepicker-id : 日历组件Id 
		oa-datepicker-datetime : 当前日历的时间

	事件：
		changeDate.datepicker.oa : 选择日期后触发
*/

OA_Config['datepicker'] = {
	// 选中后的类名
	'selected_day_class':'oa-active'
} ;

OA_Events['datepicker'] = {
	/*
		初始化组件 渲染数据 绑定事件
	*/
	'init':function(target){
		var $this = target ;
		var self = this ;

		var oa_datepicker_active = $this.data('oa-datepicker-active') ;
		var oa_datepicker_id = $this.data('oa-datepicker-id');
		if(!oa_datepicker_active || oa_datepicker_active != 'true' || oa_datepicker_id!=null) return ;

		// 日历初始值为当前时间
		var datetime = new Date() ;

		/*
			生成日历组件
		*/
		var _oa_datepicker = document.createElement('div') ;
		var _oa_datepicker_caret = document.createElement('div') ;
		var _oa_datepicker_days = document.createElement('div');
		var _oa_datepicker_table = document.createElement('table') ;
		var _oa_datepicker_thead = document.createElement('thead') ;
		var _oa_datepicker_tbody = document.createElement('tbody') ;

		// 随机生成Id
		var uuid = 'oa-datepicker-'+OA_Untils.getRandomValue() ;
		// 将随机生成的日历Id和目标组件绑定
		$this.data('oa-datepicker-id',uuid) ;

		$$(_oa_datepicker_table).append(_oa_datepicker_thead) ;
		$$(_oa_datepicker_table).append(_oa_datepicker_tbody) ;
		$$(_oa_datepicker_table).addClass('oa-datepicker-table') ;

		$$(_oa_datepicker_days).append(_oa_datepicker_table) ;

		$$(_oa_datepicker).append(_oa_datepicker_caret) ;
		$$(_oa_datepicker).append(_oa_datepicker_days) ;

		$$(_oa_datepicker).addClass('oa-datepicker') ;
		$$(_oa_datepicker).addClass('oa-datepicker-dropdown') ;
		$$(_oa_datepicker).attr('id',uuid) ;
		$$(_oa_datepicker_caret).addClass('oa-datepicker-caret') ;
		$$(_oa_datepicker_days).addClass('oa-datepicker-days') ;
		$$(_oa_datepicker_days).addClass('oa-datepicker-days') ;

		$$('body').append(_oa_datepicker);
		/*
			设置日历的位置
		*/
		var rl_position = OA_Untils.getRealitivePosition($this) ;
		// console.info(rl_position) ;
		var bottom = rl_position['bottom'] ;
		var left = rl_position['left'] ;
		var margin_bottom = getComputedStyle($this[0])['marginBottom'] ;
		bottom = bottom - parseFloat(margin_bottom) ; 

		$$(_oa_datepicker).css({
			'top':bottom+'px',
			'left':left+'px'
		}) ;

		// 渲染数据
		self.render($this,datetime) ;

		// 目标组件事件绑定
		self.bindEvent($this) ;

	},
	// 绑定目标组件事件
	'bindEvent':function(target){
		var $this = target ;
		var self = this ;
		var oa_datepicker_active = $this.data('oa-datepicker-active') ;
		var oa_datepicker_id = $this.data('oa-datepicker-id') ;

		if(!oa_datepicker_active  || oa_datepicker_active != 'true') return ;

		$this.on('focus click',function(){
			self.open($this) ;
			return false ;
		});

		var oa_datepicker_opts = $this.data('oa-datepicker-opts') ;
		// 如果选中日期后不自动关闭
		var autoClose = oa_datepicker_opts['autoClose'] ;

		if(!autoClose || autoClose!='true'){
			$$(document).on('click',function(e){
				var tg = e.target ;
				var $oa_datepicker = $$('#'+oa_datepicker_id) ;
				if($oa_datepicker.is(':visible')){
					if(!$$.contains($oa_datepicker[0] ,tg) && !$this.is($$(tg))){
						self.close($this) ;
					}
				}

			}) ;
		}
	},

	/*
		渲染日历组件
		日历组件固定为6行7列，每列为星期日、一、二、三、四、五、六
	*/
	'render':function(target,datetime){
		var $this = target ;
		datetime = datetime ? datetime : new Date() ;
		var self = this ;
		var oa_datepicker_active = $this.data('oa-datepicker-active') ;
		if(!oa_datepicker_active || oa_datepicker_active != 'true' || typeof datetime != 'object') return ;

		// 将本日历时间保存
		$this.data('oa-datepicker-datetime',datetime);

		// 获取初始化参数
		var oa_datepicker_opts = $this.data('oa-datepicker-opts') ;
		var theme = oa_datepicker_opts['theme'] ;
		var locale = oa_datepicker_opts['locale'] ;
		var beforeDisable = oa_datepicker_opts['beforeDisable'] ;

		// 获取时间参数
		var oa_datepicker_days = [] ;
		var first_day = OA_Untils['dateUtil'].moveToFirstDayOfMonth(datetime) ;
		var prev_diff = first_day.getDay() ;
		var days = OA_Untils['dateUtil'].getDaysInMonth(datetime) ;
		var date = datetime.getDate() ;
		var full_year = datetime.getFullYear() ;
		var month = ("00"+ (datetime.getMonth() * 1 + 1)).substr(((datetime.getMonth() * 1 + 1)+"").length) ;

		// 获取日历组件
		var oa_datepicker_id = $this.data('oa-datepicker-id') ;
		var _oa_datepicker = $$('#'+ oa_datepicker_id) ;
		var _oa_datepicker_thead = _oa_datepicker.find('thead') ;
		var _oa_datepicker_tbody = _oa_datepicker.find('tbody') ;


		var _thead_html = '<tr class="oa-datepicker-header">'+
							'<th class="oa-datepicker-prev">'+
								'<i class="oa-datepicker-prev-icon"></i>'+
							'</th>'+
							'<th class="oa-datepicker-switch" colspan="5">'+
								'<div class="oa-datepicker-select">'+((locale=='zh_cn') ? (full_year+'年'+ month +'月'):(full_year+'/'+month)) +'</div>'+
							'</th>'+
							'<th class="oa-datepicker-next">'+
								'<i class="oa-datepicker-next-icon"></i>'+
							'</th>'+
						'</tr>'+
						'<tr>'+
							'<th class="oa-datepicker-dow">日</th>'+
							'<th class="oa-datepicker-dow">一</th>'+
							'<th class="oa-datepicker-dow">二</th>'+
							'<th class="oa-datepicker-dow">三</th>'+
							'<th class="oa-datepicker-dow">四</th>'+
							'<th class="oa-datepicker-dow">五</th>'+
							'<th class="oa-datepicker-dow">六</th>'+
						'</tr>' ;

		var _tbody_html = '' ;

		for(var i = 0 ; i < 6 ; i++){
			var arr = [] ;
			_tbody_html +='<tr>' 

			for(var j = 0 ; j < 7 ; j++){
				var index = i * 7 + j ;
				var diff_day = index - prev_diff ;
				var picker_d = OA_Untils['dateUtil'].addDays(first_day,diff_day) ;
				var picker_date = picker_d.getDate() ;

				var datetime =  OA_Untils['dateUtil'].format(picker_d,'yyyy-MM-dd') ;;
				var o = {
					'datetime' : datetime ,
					'picker_date':picker_date
				} ;
				arr.push(o) ;

				if(index < prev_diff){
					if(beforeDisable && beforeDisable == 'true'){
						_tbody_html +='<td class="oa-datepicker-day oa-datepicker-old oa-disabled" datetime='+datetime+'>'+picker_date+'</td>' ;
					}
					else{
						_tbody_html +='<td class="oa-datepicker-day oa-datepicker-old" datetime='+datetime+'>'+picker_date+'</td>' ;
					}
				}
				else if((index - prev_diff) == date-1){
					_tbody_html +='<td class="oa-datepicker-day oa-active" datetime='+datetime+'>'+picker_date+'</td>' ;
				}
				else if((index - days) >= prev_diff ){
					_tbody_html +='<td class="oa-datepicker-day oa-datepicker-new" datetime='+datetime+'>'+picker_date+'</td>' ;
				}
				else{
					_tbody_html +='<td class="oa-datepicker-day" datetime='+datetime+'>'+picker_date+'</td>' ;
				}
			}
			_tbody_html +='</tr>';
			oa_datepicker_days.push(arr) ;
		}

		$$(_oa_datepicker_thead).html(_thead_html);
		$$(_oa_datepicker_tbody).html(_tbody_html);

		// 绑定事件
		self.bindDateClickEvent($this) ;

	},
	// 绑定日历操作事件
	'bindDateClickEvent':function(target){
		var $this = target ;
		var self = this ;
		var oa_datepicker_active = $this.data('oa-datepicker-active') ;
		var oa_datepicker_id = $this.data('oa-datepicker-id') ; 

		if(!oa_datepicker_id || !oa_datepicker_active || oa_datepicker_active != 'true') return ;

		// 日历
		var $oa_datepicker = $$('#'+oa_datepicker_id) ;
		// 上一月
		var $oa_datepicker_prev = $oa_datepicker.find('.oa-datepicker-prev');
		// 下一月
		var $oa_datepicker_next = $oa_datepicker.find('.oa-datepicker-next');
		// 日历主体
		var $oa_datepicker_tbody = $oa_datepicker.find('tbody');

		var oa_datepicker_datetime = $this.data('oa-datepicker-datetime');

		/*
			事件绑定
		*/
		$oa_datepicker_prev.on('click',function(e){
			self.prev($this) ;
			return false ;
		}) ;

		$oa_datepicker_next.on('click',function(e){
			self.next($this) ;
			return false ;
		}) ;

		$oa_datepicker_tbody.find('tr').on('click','td',function(e){
			var $td = $$(e.target) ;
			if(!$td.is('td')) return ;

			var oa_datepicker_opts = $this.data('oa-datepicker-opts') ;
			var format = oa_datepicker_opts['format'] ;
			var autoClose = oa_datepicker_opts['autoClose'] ;

			var datetime = $td.attr('datetime') ;
			var datetime_arr = datetime.split('-') ;
			var o_datetime = new Date();
			o_datetime.setYear(datetime_arr[0]);
			o_datetime.setMonth(parseInt(datetime_arr[1])-1) ;
			o_datetime.setDate(parseInt(datetime_arr[2])) ;

			var format_datetime = OA_Untils['dateUtil'].format(o_datetime,format) ;
			// 有value属性组件
			if(typeof $this[0].value == 'string'){
				$this.val(format_datetime) ;
			}
			// 没有value属性组件
			else{
				$this.html(format_datetime) ;
			}
			if(autoClose && autoClose == 'true') self.close($this) ;

			$oa_datepicker_tbody.find('.oa-active').removeClass('oa-active') ;
			$td.addClass('oa-active') ;

			/*
				触发绑定事件
			*/
			$this.trigger('changeDate.datepicker.oa') ;

			return false ;
		}) ;
	},
	'prev':function(target){
		var $this = target ;
		var self = this ;
		var oa_datepicker_active = $this.data('oa-datepicker-active') ;
		var oa_datepicker_id = $this.data('oa-datepicker-id') ; 

		if(!oa_datepicker_id || !oa_datepicker_active || oa_datepicker_active != 'true') return ;

		var oa_datepicker_datetime = $this.data('oa-datepicker-datetime') ;
		var _prev_datetime = OA_Untils['dateUtil'].addMonths(oa_datepicker_datetime,-1) ;

		self.render($this,_prev_datetime);
	},
	'next':function(target){
		var $this = target ;
		var self = this ;
		var oa_datepicker_active = $this.data('oa-datepicker-active') ;
		var oa_datepicker_id = $this.data('oa-datepicker-id') ; 

		if(!oa_datepicker_id || !oa_datepicker_active || oa_datepicker_active != 'true') return ;

		var oa_datepicker_datetime = $this.data('oa-datepicker-datetime') ;
		var _prev_datetime = OA_Untils['dateUtil'].addMonths(oa_datepicker_datetime,1) ;

		self.render($this,_prev_datetime);
	},
	// 打开日历
	'open':function(target){
		var $this = target ;
		var self = this ;
		var oa_datepicker_id = $this.data('oa-datepicker-id') ;
		if(!oa_datepicker_id) return ;

		$$('#'+oa_datepicker_id).find('.oa-datepicker-days').show() ;
		$$('#'+oa_datepicker_id).show();
	},
	'close':function(target){
		var $this = target ;
		var self = this ;
		var oa_datepicker_id = $this.data('oa-datepicker-id') ;

		if(!oa_datepicker_id) return ;

		$$('#'+oa_datepicker_id).find('.oa-datepicker-days').hide() ;
		$$('#'+oa_datepicker_id).hide();
	}
} ;

okayApp.fn.datepicker = function(opts){

	var $this = $$(this) ;

	if(!opts || typeof opts == 'object'){
		opts = opts ? opts : {} ;
		
		opts['theme'] = opts['theme'] ? opts['theme']  : '' ;
		opts['format'] = opts['format'] ? opts['format']  : 'yyyy-MM-dd' ;
		opts['beforeDisable'] = opts['beforeDisable'] ? opts['beforeDisable']  : 'false' ;
		opts['autoClose'] = opts['autoClose'] ? opts['autoClose']  : 'true' ;
		opts['locale'] = opts['locale'] ? opts['locale']  : 'zh_cn' ;
		
		$this.data('oa-datepicker-opts',opts) ;
		$this.data('oa-datepicker-active','true') ;

		// 渲染日历组件
		OA_Events['datepicker'].init($this) ;
	
	}
	else if(opts && opts == 'open'){

		var oa_datepicker_active = $this.data('oa-datepicker-active') ;
		if(!oa_datepicker_active || oa_datepicker_active != 'true') return ;

		OA_Events['datepicker'].open($this);
	}
	else if(opts && opts == 'close'){
		var oa_datepicker_active = $this.data('oa-datepicker-active') ;
		if(!oa_datepicker_active || oa_datepicker_active != 'true') return ;

		OA_Events['datepicker'].close($this);
	}
	else if(opts && opts == 'prev'){
		OA_Events['datepicker'].prev($this);
	}
	else if(opts && opts == 'next'){
		OA_Events['datepicker'].next($this);
	}
	else if(opts && opts == 'setValue'){
		// 获取时间值
		var value = arguments[1] ;
		if(value && typeof value == 'object'){
			OA_Events['datepicker'].render($this,value) ;
		}
	}
}

$$(document).ready(function(){
	$$('[data-oa-datepicker]').each(function(i,v){
		var $this = $$(this) ;
		var data_oa_datepicker = $this.attr('data-oa-datepicker') ;
		if(data_oa_datepicker){
			data_oa_datepicker = OA_Untils.parseOptions(data_oa_datepicker) ;
		}
		console.info(data_oa_datepicker) ;
		$this.datepicker(data_oa_datepicker);
	}) ; 
}) ;

/*
	selected
	下拉选框  oa-selected oa-dropdown oa-selected-btn oa-btn oa-dropdown-toggle oa-btn-default
	oa-selected-status oa-fl oa-selected-icon oa-icon-caret-down oa-selected-content oa-dropdown-content
	oa-selected-header oa-icon-chevron-left oa-selected-list oa-selected-text oa-icon-check oa-checked 
	参数
		{} : 初始化参数 oa-selected-active : 'true' : 激活下拉选框
			btnWidth ：按钮宽度
			btnStyle ：按钮风格
			btnSize ： 按钮尺寸
			maxHeight ：最大高度
	需要使用的参数
		data : oa-selected-opts : 初始化参数 
		data : oa-selected-id : 下拉选框Id 

	事件：
		changed.selected.oa : 选择下拉菜单后触发
*/

OA_Events['selected'] = {
	'init':function(target){
		var $this = target ;
		var self = this ;
		var oa_selected_active = $this.data('oa-selected-active') ;
		var oa_selected_opts = $this.data('oa-selected-opts') ;
		if(!oa_selected_active || oa_selected_active != 'true') return ;

		// 是否支持多选
		var multiple = $this[0].multiple ;
		oa_selected_opts['multiple'] = multiple ;
		$this.data('oa-selected-opts',oa_selected_opts) ;

		// 随机生成Id
		var uuid = 'oa-selected-'+OA_Untils.getRandomValue() ;
		$this.data('oa-selected-id',uuid) ;

		/*
			生成下拉框组件
		*/
		var _oa_selected = document.createElement('div') ;

		var _oa_selected_btn = document.createElement('button');
		var _oa_selected_status = document.createElement('span') ;
		var _oa_selected_icon = document.createElement('i') ;

		var _oa_selected_content = document.createElement('div') ;
		var _oa_selected_header = document.createElement('h2');
		var _oa_icon_chevron_left = document.createElement('span') ;
		var _oa_selected_list = document.createElement('ul');
		var _oa_selected_hint = document.createElement('div');

		$$(_oa_selected_btn).append(_oa_selected_status);
		$$(_oa_selected_btn).append(_oa_selected_icon);
		$$(_oa_selected_header).append(_oa_icon_chevron_left) ;

		$$(_oa_selected_content).append(_oa_selected_header);
		$$(_oa_selected_content).append(_oa_selected_list);
		$$(_oa_selected_content).append(_oa_selected_hint);

		$$(_oa_selected).append(_oa_selected_btn);
		$$(_oa_selected).append(_oa_selected_content);


		var btnWidth = oa_selected_opts['btnWidth'] ;
		// btnStyle参数暂时不用
		var btnStyle = oa_selected_opts['btnStyle'] ;
		var maxHeight = oa_selected_opts['maxHeight'] ;

		// 按钮宽
		if(btnWidth){
			$$(_oa_selected_btn).css('width',btnWidth) ;
		}
		btnWidth = btnWidth ? btnWidth : '200' ;
		$$(_oa_selected_content).css('minWidth',btnWidth) ;
		// 下拉框最大高度
		if(maxHeight){
			$$(_oa_selected_list).css({'max-height':maxHeight,'overflow-y':'scroll'}) ;
		}

		$$(_oa_selected).addClass('oa-selected') ;	
		$$(_oa_selected).addClass('oa-dropdown') ;	

		$$(_oa_selected_btn).addClass('oa-selected-btn') ;
		$$(_oa_selected_btn).addClass('oa-btn') ;
		$$(_oa_selected_btn).addClass('oa-dropdown-toggle') ;
		$$(_oa_selected_btn).addClass('oa-btn-default') ;

		$$(_oa_selected_status).addClass('oa-selected-status') ;
		$$(_oa_selected_status).addClass('oa-fl') ;
		
		$$(_oa_selected_icon).addClass('oa-selected-icon');
		$$(_oa_selected_icon).addClass('oa-icon-caret-down');

		$$(_oa_selected_content).addClass('oa-selected-content') ;
		$$(_oa_selected_content).addClass('oa-dropdown-content') ;

		$$(_oa_selected_header).addClass('oa-selected-header') ;
		$$(_oa_selected_list).addClass('oa-selected-list') ;
		$$(_oa_selected_hint).addClass('oa-selected-hint') ;
		$$(_oa_icon_chevron_left).addClass('oa-icon-chevron-left') ;

		$this.hide() ;
		$$(_oa_selected).insertAfter($this) ;

		$$(_oa_selected).attr('id',uuid) ;
		$this.data('oa-selected-id',uuid) ;

		// 渲染数据
		self.render($this);
		// 事件绑定
		self.bindEvent($this) ;
	},
	'render':function(target){
		var $this = target ;
		var self = this ;
		var oa_selected_active = $this.data('oa-selected-active') ;
		// 关联下拉组件ID
		var oa_selected_id = $this.data('oa-selected-id');

		if(!oa_selected_active || oa_selected_active!='true' || !oa_selected_id) return ;

		var oa_selected_opts = $this.data('oa-selected-opts');
		//是否支持多选
		var multiple = oa_selected_opts['multiple'] ;
		var $options = $this.find('option') ;
		var _options_html = '' ;

		$options.each(function(i,v){
			var $op = $$(this) ;
			var _oa_checked_class = '' ;
			var _oa_disabled_class = '' ;
			if($op.is(':selected')){
				_oa_checked_class = 'oa-checked' ;
			}
			if($op.is(':disabled')){
				_oa_disabled_class = 'oa-disabled' ;
			}

			_options_html +='<li class="'+_oa_checked_class+' '+_oa_disabled_class+'" data-value="'+$op.val()+'" data-group="0" data-index="'+i+'">'+
							'	<span class="oa-selected-text">'+$op.html()+'</span>'+
							'	<i class="oa-icon-check"></i>'+
							'</li>' ;

		}) ;


		var $oa_selected_list = $$('#'+oa_selected_id).find('.oa-selected-list') ;
		$oa_selected_list.html(_options_html) ;
		self.selected($this) ;
		// 绑定事件
		$$('#'+oa_selected_id).dropdown() ;
	},
	'bindEvent':function(target){
		var $this = target ;
		var self = this ;
		var oa_selected_active = $this.data('oa-selected-active') ;
		if(!oa_selected_active || oa_selected_active != 'true') return ;

		var oa_selected_opts = $this.data('oa-selected-opts') ;
		var multiple = oa_selected_opts['multiple'] ;
		var $oa_selected = $$('#'+$this.data('oa-selected-id')) ;
		$oa_selected.find('.oa-selected-list').on('click','li',function(){
			var $option = $$(this) ;
			if($option.is('.oa-disabled')) return ;
			if(multiple){
				$option.toggleClass('oa-checked') ;
			}
			else{
				if($option.hasClass('oa-checked')) return ;
				$option.addClass('oa-checked').siblings('li').removeClass('oa-checked') ;
			}
			self.selected($this) ;
			// 触发选中事件
			$this.trigger('changeDate.selected.oa') ;
			return false ;
		}) ; 

		$$(document).on('click',function(e){
			var target = e.target ;
			// console.info($$.contains($oa_selected[0],target)) ;
			if($$.contains($oa_selected[0],target)) return ;
			if($oa_selected.attr('oa-dropdown-state') && $oa_selected.attr('oa-dropdown-state') == 'open'){
				$oa_selected.find('.oa-selected-btn').trigger('click') ;
			}
		}) ;

	},
	'selected':function(target){
		var $this = target ;
		var oa_selected_active = $this.data('oa-selected-active') ;
		// 关联下拉组件ID
		var oa_selected_id = $this.data('oa-selected-id');
		if(!oa_selected_active || oa_selected_active!='true' || !oa_selected_id) return ;

		var oa_selected_opts = $this.data('oa-selected-opts') ;
		var multiple = oa_selected_opts['multiple'] ;
		var $oa_selected = $$('#'+oa_selected_id) ;
		var $oa_selected_options = $oa_selected.find('ul>li.oa-checked') ;
		var _arr_values = [] ; 
		var _str_values = '' ; 
		if(multiple){
			$oa_selected_options.each(function(i,v){
				var _data_value = $$(this).attr('data-value') ;
				var _data_html = $$(this).find('span').html() ;
				_arr_values.push(_data_value) ;
				if(i == 0){
					_str_values += _data_html ;
				}
				else{
					_str_values += ',' + _data_html ;
				}
			}) ;
			$this.val(_arr_values) ;
			$oa_selected.find('button').find('.oa-selected-status').html(_str_values) ;
		}
		else{
			$oa_selected_options.each(function(i,v){
				if(i == 0){
					$this.val($$(this).attr('data-value')) ;
					$oa_selected.find('button').find('.oa-selected-status').html($$(this).find('span').html()) ;
				}
			}) ;
		}
	}
} ;

okayApp.fn.selected = function(opts){
	var $this = $$(this) ;
	if(!$this.is('select')) return ;
	if(!opts || typeof opts == 'object'){
		
		opts = opts ? opts : {} ;
		opts['btnWidth'] = opts['btnWidth']  ? opts['btnWidth']  : '200px' ;
		opts['btnStyle'] = opts['btnStyle']  ? opts['btnStyle']  : 'default' ;
		opts['btnSize'] = opts['btnSize']  ? opts['btnSize']  : '' ;
		opts['maxHeight'] = opts['maxHeight']  ? opts['maxHeight']  : '' ;

		$this.data('oa-selected-opts',opts) ;
		$this.data('oa-selected-active','true') ;

		// 初始化界面
		OA_Events['selected'].init($this) ;

	}
}

$$(document).ready(function(){
	$$('[data-oa-selected]').each(function(i,v){	
		var $this = $$(this) ;
		var oa_selected_active = $this.data('oa-selected-active') ;
		if(!$this.is('select') || (oa_selected_active && oa_selected_active == 'true')) return ;

		var data_oa_selected = $this.attr('data-oa-selected') ;
		if(data_oa_selected){
			data_oa_selected = OA_Untils.parseOptions(data_oa_selected) ;
		}
		$this.selected(data_oa_selected) ;
	}) ;
}) ;

/*
	validator
	表单验证  oa-form oa-form-group oa-form-field 
	参数
		{} : 初始化参数 oa-validator-active : 'true' : 激活表单验证
			locales : 语言环境 默认'zh_cn'
			H5validation : 使用原生h5验证 默认不使用
			
	需要使用的参数
		data : oa-validator-opts : 表单验证参数
		data : oa-validator-tooltip-id : 提示框Id

	事件：
*/
OA_Config['validator'] = {
	// 语言环境
	locales: 'zh_cn',
	// 使用原生h5验证
  	H5validation: false,
  	// 原生验证类型
  	H5inputType: ['email', 'url', 'number'],
  	activeClass: 'oa-active',
    inValidClass: 'oa-field-error',
    validClass: 'oa-field-valid',
    validateOnSubmit:true,
    allFields: ':input:visible:not(:button, :disabled, .oa-novalidate)',
    patterns:{
    	email: /^((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/,
      url: /^(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
      	// Number, including positive, negative, and floating decimal
     	number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
    },
    validationMessages:{
    	zh_cn: {
        	valueMissing: '请填写此字段',
            customError: {
              tooShort: '至少填写 %s 个字符',
              checkedOverflow: '至多选择 %s 项',
              checkedUnderflow: '至少选择 %s 项'
            },
            patternMismatch: '请按照要求的格式填写',
            rangeOverflow: '请填写小于等于 %s 的值',
            rangeUnderflow: '请填写大于等于 %s 的值',
            stepMismatch: '',
            tooLong: '至多填写 %s 个字符',
            typeMismatch: '请按照要求的类型填写'
        }
    }
} ;

OA_Events['validator'] = {
	// 初始化表单验证
	'init':function(target){
		var $this = target ;
		var self = this ;
		var oa_validator_active = $this.data('oa-validator-active') ;
		if(!oa_validator_active || oa_validator_active != 'true') return ;

		var oa_validator_opts = $this.data('oa-validator-opts') ;
		// self.validator($this) ;
		// 提交表单
		$this.on('submit',function(){
			self.validator($this) ;
			var inValidClass = oa_validator_opts['inValidClass'] ;
			var $all_inValid_fields = $this.find('.'+inValidClass) ;
			if($all_inValid_fields.size() == 0){
				return true ;
			}
			else{
				var $first_inValid = $all_inValid_fields.eq(0) ;
				$first_inValid.focus() ;
				// 获取位置信息
				var rl_position = OA_Untils.getRealitivePosition($first_inValid) ;
				var bottom = rl_position['bottom'] ;
				var clientHeight = OA_Untils.getViewport()['height'] ;

				if(bottom < 0 || bottom > clientHeight){
					var scrollTop = document.body.scrollTop || document.documentElement.scrollTop ;
					scrollTop = scrollTop - bottom ;
					document.body.scrollTop = scrollTop ;
					document.documentElement.scrollTop = scrollTop ;
				}
				var scrollTop = document.body.scrollTop || document.documentElement.scrollTop ;
				var position = OA_Untils.getRealitivePosition($first_inValid) ;
				var tooltip_id = $this.data('oa-validator-tooltip-id') ;
				var vld_tooltip = $$('#'+tooltip_id) ;
				vld_tooltip.css({
					'top':(position['bottom']*1 + 8 + scrollTop)+'px',
					'left':position['left']+'px'
				}) ;
				var vld_mes = $first_inValid.attr('vld-mes') ;
				vld_tooltip.html(vld_mes) ;
				vld_tooltip.show() ;
				return false ;
			}
		}) ;

		var allFields = oa_validator_opts['allFields'] ;
		$this.on('focusout change',allFields,function(){
			var tooltip_id = $this.data('oa-validator-tooltip-id') ;
			var vld_tooltip = $$('#'+tooltip_id) ;
			vld_tooltip.hide() ;
			self.validator($this) ;
		}) ;

		// 生成提示框
		var vld_tooltip = document.createElement('div') ;
		var uuid = 'oa-validator-tip-'+OA_Untils.getRandomValue() ;
		$$(vld_tooltip).attr('id',uuid) ;
		$$(vld_tooltip).addClass('vld-tooltip') ;
		$$(vld_tooltip).hide() ;
		$this.data('oa-validator-tooltip-id',uuid);
		$$(document.body).append(vld_tooltip) ;

	},
	'validator':function(target){
		var $this = target ;
		var self = this ;
		var oa_validator_active = $this.data('oa-validator-active') ;
		if(!oa_validator_active || oa_validator_active != 'true') return ;

		var oa_validator_opts = $this.data('oa-validator-opts');
		var validateOnSubmit = oa_validator_opts['validateOnSubmit'] ;
		var allFields = oa_validator_opts['allFields'] ;
		var $allFields = $this.find(allFields) ;
		// console.info($allFields) ;
		$allFields.each(function(i,v){
			var $field = $$(this) ;
			var _type = $field.attr('type');
			self.validatation($this,$field);
		}) ;
	},
	// 验证
	'validatation':function(target,field){
		var $this = target ;
		var $field = field ;
		var _type = $field.attr('type') ;
		// if(_type != 'email' && _type != 'url' && _type != 'number') return ;
		
		var oa_validator_opts = $this.data('oa-validator-opts') ;
		var _pattern = $field.attr('pattern') ;
		var pattern = _pattern ? new RegExp(_pattern) : oa_validator_opts['patterns'][_type] ;
		var _value = $field.val() ;

		// 非空验证
		if(!_value && (typeof $field.attr('required') == 'string')){
			$field.removeClass(oa_validator_opts['validClass']) ;
			$field.addClass(oa_validator_opts['inValidClass']) ;
			return ;
		}

		// 长度验证
		var minlength = $field.attr('minlength') ? $field.attr('minlength') * 1 : null ;
		var maxlength = $field.attr('maxlength') ? $field.attr('maxlength') * 1 : null ;

		if((minlength && minlength > _value.length) || (maxlength && maxlength < _value.length)){
			$field.removeClass(oa_validator_opts['validClass']) ;
			$field.addClass(oa_validator_opts['inValidClass']) ;
			return ;
		}
		else{
			$field.removeClass(oa_validator_opts['inValidClass']) ;
			$field.addClass(oa_validator_opts['validClass']) ;
		}

		if(_type == 'number'){
			var min = $field.attr('min') ? $field.attr('min') * 1 : null ; 
			var max = $field.attr('max') ? $field.attr('max') * 1 : null ; 
			if((min && min > _value) || (max && max < _value)){
				$field.removeClass(oa_validator_opts['validClass']) ;
				$field.addClass(oa_validator_opts['inValidClass']) ;
				return ;
			}
			else{
				$field.removeClass(oa_validator_opts['inValidClass']) ;
				$field.addClass(oa_validator_opts['validClass']) ;
			}
		} 
		// 正则验证
		if(pattern){
			if(!pattern.test(_value)){
				$field.removeClass(oa_validator_opts['validClass']) ;
				$field.addClass(oa_validator_opts['inValidClass']) ;
				return ;
			}
			else{
				$field.removeClass(oa_validator_opts['inValidClass']) ;
				$field.addClass(oa_validator_opts['validClass']) ;
			}
		}
	}
} ;

okayApp.fn.validator = function(opts){
	var $this = $$(this) ;
	var oa_validator_active = $this.data('oa-validator-active') ;
	if(!$this.is('form') || (oa_validator_active && oa_validator_active == 'true')) return ;

	if(!opts || typeof opts == 'object'){
		opts = opts ? opts : {} ;
		opts = $$.extend(true,{},opts,OA_Config['validator']) ;

		// 使用h5原生验证 且支持
		if(opts['H5validation'] && OA_Untils.formValidation()){
			return false ;
		}
		// 不适用h5表单验证
		$this.attr('novalidate','novalidate') ;

		$this.data('oa-validator-active','true') ;
		$this.data('oa-validator-opts',opts) ;

		// 事件绑定
		OA_Events['validator'].init($this);
	}
}

$$(document).ready(function(){
	$$('[data-oa-validator]').each(function(i,v){
		var $this = $$(this) ;
		var oa_validator_active = $this.data('oa-validator-active');
		if((oa_validator_active && oa_validator_active == 'true') || !$this.is('form')) return ;

		var data_oa_validator = $this.attr('data-oa-validator') ;
		if(data_oa_validator){
			data_oa_validator = OA_Untils.parseOptions(data_oa_validator) ;
		}
		$this.validator(data_oa_validator) ;
	}) ;
});

/*解析组件的属性*/
OA_Untils.parseOptions = function(string){
	if ($$.isPlainObject(string)) {
    	return string;
	}

	var start = (string ? string.indexOf('{') : -1);
	var options = {};

	if (start != -1) {
	    try {
	      	options = (new Function('',
	        	'var json = ' + string.substr(start) +
	        	'; return JSON.parse(JSON.stringify(json));'))();
	    } catch (e) {}
	}
	return options;
}

// 获取组件绝对位置
OA_Untils.getAbsolutePosition = function($elem){
	var elem = $elem[0] ;
	if(!elem) return null ;
	
	var position = {} ,
		ret = {} ;
		scrollLeft = 0 ,
		scrollTop = 0 ;

	position = elem.getBoundingClientRect() ;

	scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft ;
	scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

	for( var key in position ){
		ret[key] = position[key] ;
		if( key == 'left' || key == 'right'){
			ret[key] = ret[key] + scrollLeft ;
		}
		if( key == 'top' || key == 'bottom' ){
			ret[key] = ret[key] + scrollTop ;
		}
	}
	return ret ;
}

//获取组件相对窗口位置
OA_Untils.getRealitivePosition = function($elem){
	var elem = $elem[0] ;
	if(!elem) return null ;
	return elem.getBoundingClientRect();
}

//获取随机值length 随机值长度
OA_Untils.getRandomValue = function(length){
	length = length ? length : 8 ;
	var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var res = "";
    for(var i = 0; i < length ; i ++) {
		var id = Math.ceil(Math.random()*35);
        res += chars[id];
    }
    return res;
}

// 获取数字的百分比
OA_Untils.getPercentage = function(value){
	if(!value || typeof value != 'number' || isNaN(value)) return  ;

	var prec =  ( Math.round ( value * 10000 ) / 100 ).toFixed(2) + '%';
	
	return prec ;
}

// 获取窗口尺寸
OA_Untils.getViewport = function(){
	if( document.compatMode == 'BackCompat'){
		return {
			width : document.body.clientWidth ,
			height : document.body.clientHeight 
		} ;
	}
	else{
		return {
			width: document.documentElement.clientWidth ,
			height : document.documentElement.clientHeight 
		} ;
	}
}

// 获取页面尺寸
OA_Untils.getPagearea = function(){
	if(document.compatMode == 'BackCompat'){
		return {
			width : Math.max( document.body.clientWidth , 
							document.body.scrollWidth ) ,
			height : Math.max( document.body.clientHeight , 
							document.body.scrollHeight ) 
		} ;
	}
	else{
		return {
			width : Math.max( document.documentElement.clientWidth , 
							 document.documentElement.scrollWidth ) ,
			height : Math.max( document.documentElement.clientHeight ,
							 document.documentElement.scrollHeight ) 
		} ;
	}
}

// 日期工具
OA_Untils['dateUtil'] = {
	// 日期克隆
	'clone': function(datetime){
		if(!datetime || typeof datetime !='object') return ;

		return new Date(datetime.getTime());
	} ,
	// 是否是闰年
	'isLeapYear': function(datetime){
 		if(!datetime || typeof datetime !='object') return ;

 		var y=datetime.getFullYear();
 		return(((y%4===0)&&(y%100!==0))||(y%400===0));
	},
	// 获取每月的天数
	'getDaysInMonth': function(datetime){
		if(!datetime || typeof datetime !='object') return ;
		var self = this ;
		return [31,(self.isLeapYear(datetime)?29:28),31,30,31,30,31,31,30,31,30,31][datetime.getMonth()];
	},
	// 获取某一日期第一天的日期
	'moveToFirstDayOfMonth': function(datetime){

		if(!datetime || typeof datetime !='object') return ;
		
		var self = this ;
		var d = new Date(datetime.getTime()) ; 

		d.setDate(1) ;
		return d ;
	},
	// 获取某一日期最后一天的日期
	'moveToLastDayOfMonth': function(datetime){
		if(!datetime || typeof datetime !='object') return ;

		var self = this ;
		var d = new Date(datetime.getTime()) ;
		var days = self.getDaysInMonth(datetime) ;

		d.setDate(days) ;
		return d ;
	},
	// 获取添加毫秒后的日期
	'addMilliseconds': function(datetime,value){
		if(!datetime || typeof datetime !='object'  || typeof value != 'number') return ;

		var d = new Date(datetime.getTime()) ;
		d.setMilliseconds(d.getMilliseconds()+value) ;

		return d ;
	},
	// 获取添加天数后的日期
	'addDays': function(datetime,value){
		if(!datetime || typeof datetime !='object'  || typeof value != 'number') return ;
		
		var self = this ;
		return self.addMilliseconds(datetime,value*86400000) ;
	},
	//获取添加月数后的日期
	'addMonths': function(datetime,value){
		if(!datetime || typeof datetime !='object'  || typeof value != 'number') return ;

		var self = this ;	
		var d = self.clone(datetime);
		
		var n=d.getDate();
		d.setDate(1);
		d.setMonth(d.getMonth()+value);
		d.setDate(Math.min(n,self.getDaysInMonth(d)));
		return d;
	},
	// 清除日期的时间
	'clearTime': function(datetime){
		if(!datetime || typeof datetime !='object') return ;

		var d = new Date(datetime.getTime()) ;
		d.setHours(0);
		d.setMinutes(0);
		d.setSeconds(0);
		d.setMilliseconds(0);
		return d;
	},
	'format': function(datetime,format){
		if(!datetime || typeof datetime !='object'  || typeof format != 'string') return ;

		var d = new Date(datetime.getTime()) ;

		var o = { 
			"M+" : d.getMonth()+1, 						//month 
		 	"d+" : d.getDate(), 						//day 
		 	"h+" : d.getHours(), 						//hour 
		 	"m+" : d.getMinutes(), 						//minute 
		 	"s+" : d.getSeconds(), 						//second 
		 	"q+" : Math.floor((d.getMonth()+3)/3), 		//quarter 
		 	"S" : d.getMilliseconds() 					//millisecond
		} 

		if(/(y+)/.test(format)) { 
			format = format.replace(RegExp.$1, (d.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		} 
		 
		for(var k in o) { 
			if(new RegExp("("+ k +")").test(format)) { 
				format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
			} 
		} 
		 
		return format; 
	}
} ;
// 是否支持h5原生form表单验证
OA_Untils.formValidation = function(){
	return (typeof document.createElement('form').checkValidity ===
        'function');
}
// cookie操作
OA_Untils.cookie = {
	get : function(name){
		var cookieName = encodeURIComponent(name) + '=' ;
		var cookieValue = null ;
		var cookieStart = document.cookieindexOf(cookieName);
		var cookieEnd ;

		if(cookieStart > -1){
			cookieEnd = document.cookie.indexOf(';',cookieStart) ;
			if(cookieEnd <= -1){
				cookieEnd = document.cookie.length ;
			}
			cookieValue = decodeURIComponent(document.cookie.substring(
				cookieStart * 1 + cookieName.length , cookieEnd )) ;
		}
		return cookieValue ;
	} ,
	/*
		name:cookie名称
		value:cookie值
		expires:超时时间
		path:存放路径
		domain:存放域名
		secure:是否使用https
	*/
	set : function(name, value, expires, path, domain, secure){
		var cookieText = encodeURIComponent(name) + '=' +
			encodeURIComponent(value) ;

		if(expires instanceof Date){
			cookieText += '; expires=' + expires.toGMTString() ;
		}

		if(path){
			cookieText += '; path=' + path ;
		}

		if(domain){
			cookieText += '; domain=' + domian ;
		}

		if(secure){
			cookieText += '; secure' ;
		}

		document.cookie = cookieText ;
	},
	unset : function(name, path, domain, secure){
		this.set(name, '', new Date(0), path, domain, secure) ;
	}
} ;
// 全屏事件
OA_Untils.screenfull = {
	// 获取不同浏览器的全屏属性
	'screenkeys' : (function(){	
		var browser ;
		var len ;
		var  browsers = [
			[
              'requestFullscreen',
              'exitFullscreen',
              'fullscreenElement',
              'fullscreenEnabled',
              'fullscreenchange',
              'fullscreenerror'
            ],
            // new WebKit
            [
              'webkitRequestFullscreen',
              'webkitExitFullscreen',
              'webkitFullscreenElement',
              'webkitFullscreenEnabled',
              'webkitfullscreenchange',
              'webkitfullscreenerror'

            ],
            // old WebKit (Safari 5.1)
            [
              'webkitRequestFullScreen',
              'webkitCancelFullScreen',
              'webkitCurrentFullScreenElement',
              'webkitCancelFullScreen',
              'webkitfullscreenchange',
              'webkitfullscreenerror'

            ],
            [
              'mozRequestFullScreen',
              'mozCancelFullScreen',
              'mozFullScreenElement',
              'mozFullScreenEnabled',
              'mozfullscreenchange',
              'mozfullscreenerror'
            ],
            [
              'msRequestFullscreen',
              'msExitFullscreen',
              'msFullscreenElement',
              'msFullscreenEnabled',
              'MSFullscreenChange',
              'MSFullscreenError'
            ]
		] ;

	 	var i = 0;
      	var l = browsers.length;
      	var ret = {};

      	for (; i < l; i++) {
        	browser = browsers[i];
            if (browser && browser[1] in document) {
              	for (i = 0, len = browser.length; i < len; i++) {
                	ret[browsers[0][i]] = browser[i];
              	}
              	return ret;
            }
        }
        return false;
	})() ,
	// 请求打开全屏
	request : function(target){
		var elem = target || document.documentElement ;
		var screenkeys = this.screenkeys ;
		var request = screenkeys.requestFullscreen ;

		if(/5\.1[\.\d]* Safari/.test(navigator.userAgent)){
			elem[request]() ;
		}
		else{
			var keyboardAllowed = (typeof Element !== 'undefined' &&
        		'ALLOW_KEYBOARD_INPUT' in Element) ;
			elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
		}
	},
	// 关闭全屏
	exit : function(){
		var screenkeys = this.screenkeys ;
		document[screenkeys.exitFullscreen]() ;
	},
	toggle : function(target){
		var elem = target ;
		if(this.isFullscreen()){
			this.exit() ;
		}
		else{
			this.request(elem) ;
		}
	},
	isFullscreen : function(){
		var screenkeys = this.screenkeys ;
		return !!document[screenkeys.fullscreenElement];
	},
	element : function(){
		var screenkeys = this.screenkeys ;
		return document[screenkeys.fullscreenElement];
	},
	// 是否允许全屏模式
	enabled : function(){
		var screenkeys = this.screenkeys ;
		return !!document[screenkeys.fullscreenEnabled];
	}
} ;
// 本地存储
OA_Untils.store = {
	// 是否支持localStorage
	isLocalStorage : (function(){
		try {
        	return ('localStorage' in window && window['localStorage']);
        	// return true;
        } catch (err) {
            return false;
        }
	})() ,
	getStore : function(issession){
		return issession ? window.sessionStorage : 
			(this.isLocalStorage ? window.localStorage : null) ;
	} ,
	serialize : function(value){
		return JSON.stringify(value);
	} ,
	unserialize : function(value){
		if(typeof value !== 'string'){
			return undefined ;
		}

		try{
			return JSON.parse(value) ;
		}catch(e){
			return value || undefined ;
		}
	},
	/*
		key:存放名称
		val:存放内容
		useSession:是否存放在sessioStorage中
	*/
	set : function(key, val, issession){
		var store = this.getStore(issession) ;
		if(store){
			if(val === undefined){
				return this.remove(key, issession) ;
			}
			store.setItem(key, this.serialize(val)) ;
			return val ;
		}
	},
	get : function(key, issession){
		var store = this.getStore(issession) ;
		return this.unserialize(store.getItem(key)) ;
	},
	forEach : function(callback,issession){
		var store = this.getStore(issession) ;
		for(var i = 0 ; i < store.length ; i++){
			var key = store.key(i);
            callback(key, this.get(key,issession));
		}
	} ,
	getAll : function(issession){
		var ret = {} ;
		this.forEach(function(key, val){
			ret[key] = val ;
		},issession) ;
		return ret ;
	},
	remove : function(key, issession){
		var store = this.getStore(issession) ;
		
		if(store){
			store.removeItem(key) ;
		}
	},　
	clear : function(issession){
		var store = this.getStore(issession) ;
		store.clear() ;
	}
};

//数字货币模式
OA_Untils.formatCurrency = function(num){
	num = num.toString().replace(/\$|\,/g,'');  
    if(isNaN(num))  
        num = "0";  
    sign = (num == (num = Math.abs(num)));  
    num = Math.floor(num*100+0.50000000001);  
    cents = num%100;  
    num = Math.floor(num/100).toString();  
    if(cents<10)  
    cents = "0" + cents;  
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)  {
    	num = num.substring(0,num.length-(4*i+3))+','+  
    	num.substring(num.length-(4*i+3));  
    }
    	
    return (((sign)?'':'-') + num + '.' + cents);  
} ;

// 浏览器检测
OA_Untils.browser = (function(){

    var engine = {            
        ie: 0,
        gecko: 0,
        webkit: 0,
        khtml: 0,
        opera: 0,

        ver: null  
    };
    
    //browsers
    var browser = {
        
        //browsers
        ie: 0,
        firefox: 0,
        safari: 0,
        konq: 0,
        opera: 0,
        chrome: 0,

        ver: null
    };

    
    //platform/device/OS
    var system = {
        win: false,
        mac: false,
        x11: false,
        
        //mobile devices
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,
        
        //game systems
        wii: false,
        ps: false 
    };    

    //detect rendering engines/browsers
    var ua = navigator.userAgent;    
    if (window.opera){
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    } else if (/AppleWebKit\/(\S+)/.test(ua)){
        engine.ver = RegExp["$1"];
        engine.webkit = parseFloat(engine.ver);
        
        //figure out if it's Chrome or Safari
        if (/Chrome\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.chrome = parseFloat(browser.ver);
        } else if (/Version\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.safari = parseFloat(browser.ver);
        } else {
            //approximate version
            var safariVersion = 1;
            if (engine.webkit < 100){
                safariVersion = 1;
            } else if (engine.webkit < 312){
                safariVersion = 1.2;
            } else if (engine.webkit < 412){
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }   
            
            browser.safari = browser.ver = safariVersion;        
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){    
        engine.ver = RegExp["$1"];
        engine.gecko = parseFloat(engine.ver);
        
        //determine if it's Firefox
        if (/Firefox\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);
        }
    } else if (/MSIE ([^;]+)/.test(ua)){    
        engine.ver = browser.ver = RegExp["$1"];
        engine.ie = browser.ie = parseFloat(engine.ver);
    }
    
    //detect browsers
    browser.ie = engine.ie;
    browser.opera = engine.opera;
    

    //detect platform
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

    //detect windows operating systems
    if (system.win){
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
            if (RegExp["$1"] == "NT"){
                switch(RegExp["$2"]){
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "6.1":
                        system.win = "7";
                        break;
                    default:
                        system.win = "NT";
                        break;                
                }                            
            } else if (RegExp["$1"] == "9x"){
                system.win = "ME";
            } else {
                system.win = RegExp["$1"];
            }
        }
    }
    
    //mobile devices
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.ipad = ua.indexOf("iPad") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;
    
    //windows mobile
    if (system.win == "CE"){
        system.winMobile = system.win;
    } else if (system.win == "Ph"){
        if(/Windows Phone OS (\d+.\d+)/.test(ua)){;
            system.win = "Phone";
            system.winMobile = parseFloat(RegExp["$1"]);
        }
    }
    
    
    //determine iOS version
    if (system.mac && ua.indexOf("Mobile") > -1){
        if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)){
            system.ios = parseFloat(RegExp.$1.replace("_", "."));
        } else {
            system.ios = 2;  //can't really detect - so guess
        }
    }
    
    //determine Android version
    if (/Android (\d+\.\d+)/.test(ua)){
        system.android = parseFloat(RegExp.$1);
    }
    
    //gaming systems
    system.wii = ua.indexOf("Wii") > -1;
    system.ps = /playstation/i.test(ua);
    
    return {
        engine:     engine,
        browser:    browser,
        system:     system        
    };
})() ;
