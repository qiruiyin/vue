(function(){

	var data = [
		{name: 'tab', url: 'tab.html', desc: 'tab组件学习'}
	];

	var menu = new Vue({
		el: '#menu',
		data: {
			menus: {}
		},
		methods:{
	        getData: function(){
	            $.ajax({
	            	url: '../data/menus.json',
	            	dataType: 'json',
	                success: function(result) {
	                    menu.menus = result.data;
	                }
	            })
	        }
	    }
	});

	menu.getData();
})();