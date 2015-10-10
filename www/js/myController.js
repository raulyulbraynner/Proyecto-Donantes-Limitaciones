angular.module('myApp', ['onsen'])
.controller('myController', function($scope) {
	var ctrl = this;

	ctrl.d_f_implemento = '';
	ctrl.d_f_estado = '';
	ctrl.d_f_cantidad = '';
	

	ctrl.quienesSomos = function(){
		$scope.myNavigator.pushPage('quienes-somos.html', { animation : 'slide' } );
	};

	ctrl.iniciarSesion = function(){
		if (ctrl.usuario === 'admin' && ctrl.password === 'admin') {
			$scope.myNavigator.pushPage('menu-admin.html', { animation : 'slide' } );
		}
		else{
			$scope.myNavigator.pushPage('menu-donante.html', { animation : 'slide' } );
		}
	};

	ctrl.agregarDonante = function(){
		$scope.myNavigator.popPage();
		ctrl.darMensaje('Se ha agregado correctamente el donante.');
	};

	ctrl.agregarBeneficiario = function(){
		$scope.myNavigator.pushPage('menu-admin.html', { animation : 'slide' } );
		ctrl.darMensaje('Se ha agregado correctamente el beneficiario.');
	};

	ctrl.verDonacionFundacion = function(id){
		ons.notification.confirm({
			message: 'Desea ver la donación seleccionada ?',
			  // or messageHTML: '<div>Message in HTML</div>',
			  title: 'SISTEMA DE INFORMACIÓN',
			  buttonLabels: ['Si', 'No'],
			  animation: 'default', // or 'none'
			  primaryButtonIndex: 1,
			  cancelable: true,
			  callback: function(index) {
			  	if(index === 0){
			  		$scope.myNavigator.pushPage('verDonacion.html', { animation : 'slide' } );
			  	}
			  	else{
			  		ctrl.darMensaje("Operación cancelada.");
			  	}
			  }
			});
	};

	ctrl.verDonacionUsuario = function(id){
		ons.notification.confirm({
			message: 'Desea ver la donación seleccionada ?',
			  // or messageHTML: '<div>Message in HTML</div>',
			  title: 'SISTEMA DE INFORMACIÓN',
			  buttonLabels: ['Si', 'No'],
			  animation: 'default', // or 'none'
			  primaryButtonIndex: 1,
			  cancelable: true,
			  callback: function(index) {
			  	if(index === 0){
			  		$scope.myNavigator.pushPage('verDonacion.html', { animation : 'slide' } );
			  	}
			  	else{
			  		ctrl.darMensaje("Operación cancelada.");
			  	}
			  }
			});
	};

	ctrl.verDonacionesDelUsuario = function(id){
		ons.notification.confirm({
			message: 'Desea ver las donaciones del usuario seleccionado ?',
			  // or messageHTML: '<div>Message in HTML</div>',
			  title: 'SISTEMA DE INFORMACIÓN',
			  buttonLabels: ['Si', 'No'],
			  animation: 'default', // or 'none'
			  primaryButtonIndex: 1,
			  cancelable: true,
			  callback: function(index) {
			  	if(index === 0){
			  		$scope.myNavigator.pushPage('donaciones-de-usuario.html', { animation : 'slide' } );
			  	}
			  	else{
			  		ctrl.darMensaje("Operación cancelada.");
			  	}
			  }
			});
	};

	ctrl.darMensaje = function(mensaje) {
		ons.notification.alert({
			message: mensaje,
			  // or messageHTML: '<div>Message in HTML</div>',
			  title: 'SISTEMA DE INFORMACIÓN',
			  buttonLabel: 'OK',
			  animation: 'default', // or 'none'
			  // modifier: 'optional-modifier'
			  callback: function() {
			    // Alert button is closed!
			}
		});
	};
});