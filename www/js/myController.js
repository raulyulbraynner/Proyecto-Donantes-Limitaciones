angular.module('myApp', ['onsen'])
    .controller('myController', function($scope, $http) {
        var ctrl = this;

        ctrl.hostApp = 'http://paisa:82/RaulDonaciones/consultas.php?callback=JSON_CALLBACK';
        ctrl.hostImg = 'http://paisa:82/';

        // Variables internas de sesión.
        ctrl.G_idUsuario = '';
        ctrl.G_nombreUsuario = '';
        ctrl.G_tipoUsuario = '';

        // Listas
        ctrl.donacionesRevisar = [];
        ctrl.usuariosBeneficiarios = [];
        ctrl.donacionesMiFundacion = [];
        ctrl.donacionesMiUsuario = [];
        ctrl.usuariosBeneficiariosDiscapacidad = [];
        ctrl.donacionesRechazadas = [];
        ctrl.donacionesEnSeguimiento = [];
        ctrl.seguimientos = [];

        // Variables donación a fundación.
        // d_f = donación fundación.
        ctrl.d_f_implemento = '';
        ctrl.d_f_estado = '';

        // Variables donación a usuario.
        // d_u = donación usuario.
        ctrl.d_u_idUsuario = '';
        ctrl.d_u_implemento = '';
        ctrl.d_u_estado = '';

        // Variables registrar donante.
        ctrl.r_d_usuario = '';
        ctrl.r_d_password = '';
        ctrl.r_d_nombres = '';
        ctrl.r_d_apellidos = '';
        ctrl.r_d_documento = '';
        ctrl.r_d_telefono = '';
        ctrl.r_d_correo = '';

        // Ver donación
        ctrl.verDonacionNombre = '';
        ctrl.verDonacionImplemento = '';
        ctrl.verDonacionID = '';

        // Ver seguimiento
        ctrl.idDonacionSeguimiento = '';

        ctrl.quienesSomos = function() {
            $scope.myNavigator.pushPage('quienes-somos.html', {
                animation: 'slide'
            });
        };

        // Camara - Donación fundación.
        ctrl.capturarFotoFundacion = function() {
            navigator.camera.getPicture(ctrl.onPhotoDataSuccessFundacion, ctrl.onFail, {
                quality: 50,
                destinationType: destinationType.DATA_URL
            });
        };

        ctrl.onPhotoDataSuccessFundacion = function(imageData) {
            console.log(imageData);
            $scope.$apply(function() {
                ctrl.img_d_fundacion = "data:image/jpeg;base64," + imageData;
            });
        };

        // Camara - Donación Usuario.
        ctrl.capturarFotoUsuario = function() {
            navigator.camera.getPicture(ctrl.onPhotoDataSuccessUsuario, ctrl.onFail, {
                quality: 50,
                destinationType: destinationType.DATA_URL
            });
        };

        ctrl.onPhotoDataSuccessUsuario = function(imageData) {
            console.log(imageData);
            $scope.$apply(function() {
                ctrl.img_d_usuario = "data:image/jpeg;base64," + imageData;
            });
        };

        ctrl.onFail = function(mensaje) {
            ctrl.generarAlerta(mensaje, 'Error');
        };

        ctrl.cerrarSesion = function() {
            ctrl.G_idUsuario = '';
            ctrl.G_nombreUsuario = '';
            ctrl.G_tipoUsuario = '';
            $scope.myNavigator.resetToPage('home.html', {
                animation: 'default'
            });
            navigator.app.exitApp();
        };

        ctrl.iniciarSesion = function() {
            var data = {
                usuario: ctrl.usuario,
                password: ctrl.password
            };

            $http.jsonp(ctrl.hostApp + '&consulta=iniciarSesion' + "&data=" + JSON.stringify(data))
                .success(function(data) {

                    if (data.resultado === "1") {
                        ctrl.usuario = '';
                        ctrl.password = '';

                        ctrl.G_tipoUsuario = data.query[0].tipos_usuario_id;
                        ctrl.G_nombreUsuario = data.query[0].usuario;
                        ctrl.G_idUsuario = data.query[0].id;

                        if (ctrl.G_tipoUsuario === '1') {
                            $scope.myNavigator.pushPage('menu-admin.html', {
                                animation: 'slide'
                            });
                        } else {
                            $scope.myNavigator.pushPage('menu-donante.html', {
                                animation: 'slide'
                            });
                        }
                    } else {
                        ctrl.darMensaje('Ha ocurrido un error. Por favor revise los datos.');
                    }
                });
        };

        ctrl.agregarDonante = function() {
            if (ctrl.r_d_usuario === '' || ctrl.r_d_password === '' || ctrl.r_d_nombres === '' || ctrl.r_d_apellidos === '' || ctrl.r_d_documento === '' ||
                ctrl.r_d_telefono === '' || ctrl.r_d_correo === '' || ctrl.r_d_direccion === '') {
                ctrl.darMensaje('Por favor registre todos los datos del formulario.');
                return;
            }

            var data = {
                usuario: ctrl.r_d_usuario,
                password: ctrl.r_d_password,
                nombres: ctrl.r_d_nombres,
                apellidos: ctrl.r_d_apellidos,
                documento: ctrl.r_d_documento,
                implemento: ctrl.r_d_implemento,
                telefono: ctrl.r_d_telefono,
                correo: ctrl.r_d_correo,
                direccion: ctrl.r_d_direccion
            };

            $http.jsonp(ctrl.hostApp + '&consulta=agregarDonante' + "&data=" + JSON.stringify(data))
                .success(function(data) {
                    console.log(JSON.stringify(data));
                    console.log(data);
                    if (data.resultado === "1") {
                        ctrl.r_d_usuario = '';
                        ctrl.r_d_password = '';
                        ctrl.r_d_nombres = '';
                        ctrl.r_d_apellidos = '';
                        ctrl.r_d_documento = '';
                        ctrl.r_d_implemento = '';
                        ctrl.r_d_telefono = '';
                        ctrl.r_d_correo = '';
                        ctrl.r_d_direccion = '';

                        $scope.myNavigator.popPage();
                        ctrl.darMensaje('Se ha registrado correctamente como donante.');
                    } else {
                        ctrl.darMensaje('Ha ocurrido un error. Por favor revise los datos.');
                    }
                });
        };

        ctrl.agregarBeneficiario = function() {
            if (ctrl.r_b_nombres === '' || ctrl.r_b_apellidos === '' || ctrl.r_b_documento === '' || ctrl.r_b_implemento === '' ||
                ctrl.r_b_telefono === '' || ctrl.r_b_correo === '' || ctrl.r_b_direccion === '' || ctrl.r_b_tipo_discapacidad === '') {
                ctrl.darMensaje('Por favor registre todos los datos del formulario.');
                return;
            }

            var data = {
                nombres: ctrl.r_b_nombres,
                apellidos: ctrl.r_b_apellidos,
                documento: ctrl.r_b_documento,
                implemento: ctrl.r_b_implemento,
                telefono: ctrl.r_b_telefono,
                correo: ctrl.r_b_correo,
                direccion: ctrl.r_b_direccion,
                tipo_discapacidad: ctrl.r_b_tipo_discapacidad
            };

            $http.jsonp(ctrl.hostApp + '&consulta=agregarBeneficiario' + "&data=" + JSON.stringify(data))
                .success(function(data) {
                    console.log(JSON.stringify(data));
                    console.log(data);
                    if (data.resultado === "1") {
                        ctrl.r_b_nombres = '';
                        ctrl.r_b_apellidos = '';
                        ctrl.r_b_documento = '';
                        ctrl.r_b_implemento = '';
                        ctrl.r_b_telefono = '';
                        ctrl.r_b_correo = '';
                        ctrl.r_b_direccion = '';
                        ctrl.r_b_tipo_discapacidad = '';

                        $scope.myNavigator.popPage();
                        ctrl.darMensaje('Se ha registrado correctamente el beneficiario.');
                    } else {
                        ctrl.darMensaje('Ha ocurrido un error. Por favor revise los datos.');
                    }
                });
        };

        ctrl.verDonacionFundacion = function(id) {
            ons.notification.confirm({
                message: 'Desea ver la donación seleccionada ?',
                // or messageHTML: '<div>Message in HTML</div>',
                title: 'SISTEMA DE INFORMACIÓN',
                buttonLabels: ['Si', 'No'],
                animation: 'default', // or 'none'
                primaryButtonIndex: 1,
                cancelable: true,
                callback: function(index) {
                    if (index === 0) {
                        ctrl.verDonacionNombre = ctrl.donacionesRevisar[id].nombres + ' ' + ctrl.donacionesRevisar[id].apellidos;
                        ctrl.verDonacionImplemento = ctrl.donacionesRevisar[id].implemento;
                        ctrl.verDonacionID = ctrl.donacionesRevisar[id].id;
                        ctrl.verDonacionIMG = ctrl.hostImg + ctrl.donacionesRevisar[id].url_foto;

                        $scope.myNavigator.pushPage('verDonacion.html', {
                            animation: 'slide'
                        });
                    } else {
                        ctrl.darMensaje("Operación cancelada.");
                    }
                }
            });
        };

        ctrl.verDonacionesRechazadas = function() {
            ctrl.usuariosBeneficiarios = [];
            $http.jsonp(ctrl.hostApp + '&consulta=verDonacionesRechazadas')
                .success(function(data) {
                    if (data.resultado === "1") {
                        ctrl.donacionesRechazadas = data.query;
                        $scope.myNavigator.pushPage('donaciones-rechazadas.html', {
                            animation: 'slide'
                        });
                    } else {
                        ctrl.darMensaje('No se han encontrado usuarios beneficiarios.');
                    }
                });
        };

        ctrl.verDonacionesSeguimientos = function() {

            $http.jsonp(ctrl.hostApp + '&consulta=verDonacionesSeguimiento')
                .success(function(data) {
                    if (data.resultado === "1") {
                        ctrl.donacionesEnSeguimiento = data.query;
                        $scope.myNavigator.pushPage('donaciones-en-seguimiento.html', {
                            animation: 'slide'
                        });
                    } else {
                        ctrl.darMensaje('No se han encontrado donaciones en seguimiento.');
                    }
                });
        };


        ctrl.verDecisionDonacion = function(idDonacion) {
            ctrl.idDonacionSeguimiento = idDonacion;
            $scope.myNavigator.pushPage('decidir-donacion.html', {
                animation: 'slide'
            });
        };

        ctrl.guardarSeguimiento = function() {
            if (ctrl.descripcionSeguimiento === '') {
                ctrl.darMensaje('Por favor indique la descripción.');
                return;
            }

            var data = {
                idDonacion: ctrl.idDonacionSeguimiento,
                descripcion: ctrl.descripcionSeguimiento
            };

            $http.jsonp(ctrl.hostApp + '&consulta=guardarSeguimiento' + '&data=' + JSON.stringify(data))
                .success(function(data) {
                    if (data.resultado === "1") {
                        ctrl.donacionesEnSeguimiento = data.query;
                        $scope.myNavigator.pushPage('decidir-donacion.html', {
                            animation: 'default'
                        });
                        ctrl.darMensaje('Se ha realizado el seguimiento correctamente.');
                    } else {
                        ctrl.darMensaje('No se han encontrado donaciones en seguimiento.');
                    }
                });
        };

        ctrl.verSeguimientos = function() {
            ctrl.seguimientos = [];
            var data = {
                idDonacion: ctrl.idDonacionSeguimiento
            };
            $http.jsonp(ctrl.hostApp + '&consulta=verSeguimientos' + '&data=' + JSON.stringify(data))
                .success(function(data) {
                    if (data.resultado === "1") {
                        console.log(data);
                        ctrl.seguimientos = data.query;
                        $scope.myNavigator.pushPage('seguimientos.html', {
                            animation: 'slide'
                        });
                    } else {
                        ctrl.darMensaje('No se han encontrado donaciones en seguimiento.');
                    }
                });
        };

        ctrl.aceptarDonacion = function() {
            ons.notification.confirm({
                message: 'Desea aceptar la donación ?',
                title: 'SISTEMA DE INFORMACIÓN',
                buttonLabels: ['Si', 'No'],
                animation: 'default', // or 'none'
                primaryButtonIndex: 1,
                cancelable: true,
                callback: function(index) {
                    if (index === 0) {
                        var data = {
                            id: ctrl.verDonacionID
                        };

                        $http.jsonp(ctrl.hostApp + '&consulta=aceptarDonacion' + "&data=" + JSON.stringify(data))
                            .success(function(data) {
                                console.log(JSON.stringify(data));
                                console.log(data);
                                if (data.resultado === "1") {

                                    $scope.myNavigator.resetToPage('menu-admin.html', {
                                        animation: 'default'
                                    });
                                    ctrl.darMensaje('Se ha cambiado el estado correctamente de la donación.');
                                } else {
                                    ctrl.darMensaje('Ha ocurrido un error. Por favor revise los datos.');
                                }
                            });
                    }
                }
            });
        };

        ctrl.iniciarRechazarDonacion = function() {
            ons.notification.confirm({
                message: 'Desea rechazar la donación ?',
                title: 'SISTEMA DE INFORMACIÓN',
                buttonLabels: ['Si', 'No'],
                animation: 'default', // or 'none'
                primaryButtonIndex: 1,
                cancelable: true,
                callback: function(index) {
                    if (index === 0) {
                        $scope.myNavigator.pushPage('rechazarDonacion.html', {
                            animation: 'slide'
                        });
                    }
                }
            });
        };

        ctrl.rechazarDonacion = function() {
            ons.notification.confirm({
                message: 'Desea rechazar la donación ?',
                title: 'SISTEMA DE INFORMACIÓN',
                buttonLabels: ['Si', 'No'],
                animation: 'default', // or 'none'
                primaryButtonIndex: 1,
                cancelable: true,
                callback: function(index) {
                    if (index === 0) {
                        var data = {
                            id: ctrl.verDonacionID,
                            motivo: ctrl.motivoRechazo
                        };

                        $http.jsonp(ctrl.hostApp + '&consulta=rechazarDonacion' + "&data=" + JSON.stringify(data))
                            .success(function(data) {
                                console.log(JSON.stringify(data));
                                console.log(data);
                                if (data.resultado === "1") {

                                    $scope.myNavigator.resetToPage('menu-admin.html', {
                                        animation: 'default'
                                    });
                                    ctrl.darMensaje('Se ha cambiado el estado correctamente de la donación.');
                                } else {
                                    ctrl.darMensaje('Ha ocurrido un error. Por favor revise los datos.');
                                }
                            });
                    }
                }
            });
        };
        ctrl.verDonacionUsuario = function(id) {
            ons.notification.confirm({
                message: 'Desea ver la donación seleccionada ?',
                // or messageHTML: '<div>Message in HTML</div>',
                title: 'SISTEMA DE INFORMACIÓN',
                buttonLabels: ['Si', 'No'],
                animation: 'default', // or 'none'
                primaryButtonIndex: 1,
                cancelable: true,
                callback: function(index) {
                    if (index === 0) {
                        ctrl.verDonacionNombre = ctrl.donacionesMiUsuario[id].donante;
                        ctrl.verDonacionImplemento = ctrl.donacionesMiUsuario[id].implemento;
                        ctrl.verDonacionID = ctrl.donacionesMiUsuario[id].id;
                        ctrl.verDonacionIMG = ctrl.hostImg + ctrl.donacionesMiUsuario[id].url_foto;

                        $scope.myNavigator.pushPage('verDonacion.html', {
                            animation: 'slide'
                        });
                    } else {
                        ctrl.darMensaje("Operación cancelada.");
                    }
                }
            });
        };

        ctrl.agregarDonacionFundacion = function() {
            if (ctrl.d_f_implemento === '' || ctrl.d_f_estado === '' || ctrl.d_f_tipo_discapacidad === '' || ctrl.img_d_fundacion === '') {
                ctrl.darMensaje('Por favor registre todos los datos del formulario.');
                return;
            }

            //
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = "foto";
            options.mimeType = "image/jpeg";

            var params = new Object();
            params.implemento = ctrl.d_f_implemento;
            params.estado = ctrl.d_f_estado;
            params.idBeneficiario = ctrl.d_u_usuario;
            params.idDonante = ctrl.G_idUsuario;
            params.tipo_discapacidad = ctrl.d_f_tipo_discapacidad;

            options.params = params;

            var ft = new FileTransfer();
            ft.upload(ctrl.img_d_fundacion, ctrl.hostApp + '&consulta=agregarDonacionFundacion', ctrl.winDonacionFundacion, ctrl.onFail, options);
            //
            /*
            var data = {
                implemento: ctrl.d_f_implemento,
                estado: ctrl.d_f_estado,
                tipo_discapacidad: ctrl.d_f_tipo_discapacidad,
                idDonante: ctrl.G_idUsuario
            };

            $http.jsonp(ctrl.hostApp + '&consulta=agregarDonacionFundacion' + "&data=" + JSON.stringify(data))
            .success(function(data) {
                console.log(JSON.stringify(data));
                console.log(data);
                if (data.resultado === "1") {
                    ctrl.d_f_implemento = '';
                    ctrl.d_f_estado = '';
                    ctrl.d_f_tipo_discapacidad = '';

                    $scope.myNavigator.popPage();
                    ctrl.darMensaje('Gracias por su donación !. Esta será reclamada de Lunes a Viernes en horas de la tarde.');
                } else {
                    ctrl.darMensaje('Ha ocurrido un error. Por favor revise los datos.');
                }
            });
            */
        };

        ctrl.winDonacionFundacion = function() {
            ctrl.d_f_implemento = '';
            ctrl.d_f_estado = '';
            ctrl.d_f_tipo_discapacidad = '';
            ctrl.img_d_fundacion = '';

            $scope.myNavigator.popPage();
            ctrl.darMensaje('Gracias por su donación !. Esta será reclamada de Lunes a Viernes en horas de la tarde.');

        };

        ctrl.agregarDonacionUsuario = function() {
            if (ctrl.d_u_estado === '' || typeof ctrl.d_u_usuario == "undefined" || ctrl.d_u_tipo_discapacidad === '' || ctrl.img_d_usuario === '') {
                ctrl.darMensaje('Por favor registre todos los datos del formulario.');
                return;
            }
            //
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = "foto";
            options.mimeType = "image/jpeg";

            var params = new Object();
            params.implemento = "";
            params.estado = ctrl.d_u_estado;
            params.idBeneficiario = ctrl.d_u_usuario;
            params.idDonante = ctrl.G_idUsuario;
            params.tipo_discapacidad = ctrl.d_u_tipo_discapacidad;

            options.params = params;

            var ft = new FileTransfer();
            ft.upload(ctrl.img_d_usuario, ctrl.hostApp + '&consulta=agregarDonacionUsuario', ctrl.winDonacionUsuario, ctrl.onFail, options);
            //
            /*
                var data = {
                    implemento: '',
                    estado: ctrl.d_u_estado,
                    idBeneficiario: ctrl.d_u_usuario,
                    idDonante: ctrl.G_idUsuario,
                    tipo_discapacidad: ctrl.d_u_tipo_discapacidad
                };

                $http.jsonp(ctrl.hostApp + '&consulta=agregarDonacionUsuario' + "&data=" + JSON.stringify(data))
                .success(function(data) {
                    console.log(JSON.stringify(data));
                    console.log(data);
                    if (data.resultado === "1") {
                        ctrl.d_u_implemento = '';
                        ctrl.d_u_estado = '';
                        ctrl.d_u_usuario = '';
                        ctrl.d_u_tipo_discapacidad = '';

                        $scope.myNavigator.popPage();
                        ctrl.darMensaje('Gracias por su donación !. Esta será reclamada de Lunes a Viernes en horas de la tarde..');
                    } else {
                        ctrl.darMensaje('Ha ocurrido un error. Por favor revise los datos.');
                    }
                });*/
        };

        ctrl.winDonacionUsuario = function() {
            ctrl.d_u_implemento = '';
            ctrl.d_u_estado = '';
            ctrl.d_u_usuario = '';
            ctrl.d_u_tipo_discapacidad = '';
            ctrl.img_d_usuario = '';

            $scope.myNavigator.popPage();
            ctrl.darMensaje('Gracias por su donación !. Esta será reclamada de Lunes a Viernes en horas de la tarde..');
        };


        ctrl.verDonacionesFundacion = function() {
            ctrl.donacionesMiFundacion = [];
            $http.jsonp(ctrl.hostApp + '&consulta=verDonacionesFundacion')
                .success(function(data) {
                    console.log(JSON.stringify(data));
                    console.log(data);
                    if (data.resultado === "1") {
                        ctrl.donacionesMiFundacion = data.query;

                        $scope.myNavigator.pushPage('donaciones-fundacion.html', {
                            animation: 'slide'
                        });
                    } else {
                        ctrl.darMensaje('No hay donaciones para la fundación.');
                    }
                });
        };

        ctrl.cargarUsuariosBeneficiarios = function(conInterfaz) {
            ctrl.usuariosBeneficiarios = [];
            $http.jsonp(ctrl.hostApp + '&consulta=usuariosBeneficiarios')
                .success(function(data) {
                    console.log(JSON.stringify(data));
                    console.log(data);
                    if (data.resultado === "1") {
                        ctrl.usuariosBeneficiarios = data.query;
                        if (!conInterfaz) {
                            $scope.myNavigator.pushPage('realizar-donacion-usuario.html', {
                                animation: 'slide'
                            });
                        } else {
                            $scope.myNavigator.pushPage('usuarios-con-donaciones.html', {
                                animation: 'slide'
                            });
                        }
                    } else {
                        ctrl.darMensaje('No se han encontrado usuarios beneficiarios.');
                    }
                });
        };

        ctrl.cargarUsuariosConDiscapacidad = function() {
            ctrl.usuariosBeneficiariosDiscapacidad = [];
            var data = {
                tipo_discapacidad: ctrl.d_u_tipo_discapacidad

            };

            $http.jsonp(ctrl.hostApp + '&consulta=usuariosBeneficiariosDiscapacidad' + '&data=' + JSON.stringify(data))
                .success(function(data) {
                    console.log(JSON.stringify(data));
                    console.log(data);
                    if (data.resultado === "1") {
                        ctrl.usuariosBeneficiariosDiscapacidad = data.query;
                    } else {
                        ctrl.darMensaje('No se han encontrado usuarios con la discapacidad indicada.');
                    }
                });
        };

        ctrl.cargarDonacionesRevisar = function() {
            ctrl.donacionesRevisar = [];
            $http.jsonp(ctrl.hostApp + '&consulta=donacionesPendientes')
                .success(function(data) {
                    console.log(JSON.stringify(data));
                    console.log(data);
                    if (data.resultado === "1") {
                        ctrl.donacionesRevisar = data.query;

                        $scope.myNavigator.pushPage('donaciones-revisar.html', {
                            animation: 'slide'
                        });
                    } else {
                        ctrl.darMensaje('No hay donaciones pendientes por revisar.');
                    }
                });
        };

        ctrl.verDonacionesDelUsuario = function(id) {
            ons.notification.confirm({
                message: 'Desea ver las donaciones del usuario seleccionado ?',
                // or messageHTML: '<div>Message in HTML</div>',
                title: 'SISTEMA DE INFORMACIÓN',
                buttonLabels: ['Si', 'No'],
                animation: 'default', // or 'none'
                primaryButtonIndex: 1,
                cancelable: true,
                callback: function(index) {
                    if (index === 0) {
                        var data = {
                            idUsuario: ctrl.usuariosBeneficiarios[id].id
                        };

                        $http.jsonp(ctrl.hostApp + '&consulta=donacionesRealizadasUsuario' + '&data=' + JSON.stringify(data))
                            .success(function(data) {
                                console.log(JSON.stringify(data));
                                console.log(data);
                                if (data.resultado === "1") {
                                    ctrl.donacionesMiUsuario = data.query;
                                    $scope.myNavigator.pushPage('donaciones-de-usuario.html', {
                                        animation: 'slide'
                                    });
                                } else {
                                    ctrl.darMensaje('No hay donaciones pendientes por revisar.');
                                }
                            });
                    } else {
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