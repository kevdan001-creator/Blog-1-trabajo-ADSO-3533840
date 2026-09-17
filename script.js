/* ==========================================================
   DANKEVSA - Funciones compartidas de todas las páginas
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

   
    var btnTop = document.getElementById('btn-scroll-top');
    if (btnTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                btnTop.classList.add('visible');
            } else {
                btnTop.classList.remove('visible');
            }
        });
        btnTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

 
    var banner = document.getElementById('cookie-banner');
    if (banner) {
        // Si ya aceptó antes, no se vuelve a mostrar
        if (localStorage.getItem('dankevsa_cookies') === 'aceptadas') {
            banner.style.display = 'none';
        } else {
            banner.style.display = 'flex';
        }

        var btnAceptar = document.getElementById('btn-aceptar-cookies');
        if (btnAceptar) {
            btnAceptar.addEventListener('click', function () {
                localStorage.setItem('dankevsa_cookies', 'aceptadas');
                banner.style.display = 'none';
            });
        }

        var btnRechazar = document.getElementById('btn-rechazar-cookies');
        if (btnRechazar) {
            btnRechazar.addEventListener('click', function () {
                localStorage.setItem('dankevsa_cookies', 'rechazadas');
                banner.style.display = 'none';
            });
        }
    }

    var enlacesInternos = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < enlacesInternos.length; i++) {
        enlacesInternos[i].addEventListener('click', function (e) {
            var destino = document.querySelector(this.getAttribute('href'));
            if (destino) {
                e.preventDefault();
                destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    
    var formNews = document.getElementById('form-newsletter');
    if (formNews) {
        formNews.addEventListener('submit', function (e) {
            e.preventDefault();
            var correo = document.getElementById('correo-newsletter').value;
            var msg = document.getElementById('msg-newsletter');
            localStorage.setItem('dankevsa_newsletter', correo);
            msg.textContent = '¡Gracias! Enviaremos las promociones a ' + correo + ' 🍦';
            msg.classList.add('mostrar');
            formNews.reset();
        });
    }

   
    var formReserva = document.getElementById('form-reserva');
    if (formReserva) {
        formReserva.addEventListener('submit', function (e) {
            e.preventDefault();

            var nombre = document.getElementById('nombre').value;
            var fecha = document.getElementById('fecha').value;
            var hora = document.getElementById('hora').value;
            var personas = document.getElementById('personas').value;

            
            var resumen = document.getElementById('resumen-reserva');
            resumen.innerHTML = '<strong>Resumen de tu reserva</strong><br>' +
                '👤 ' + nombre + '<br>' +
                '📅 ' + formatearFecha(fecha) + ' a las ' + hora + '<br>' +
                '🪑 ' + personas + ' persona(s)';
            resumen.classList.add('mostrar');

            document.getElementById('msg-reserva').classList.add('mostrar');
            formReserva.style.display = 'none';
        });

       
        var campoFecha = document.getElementById('fecha');
        if (campoFecha) {
            campoFecha.min = new Date().toISOString().split('T')[0];
        }
    }

    var formContacto = document.getElementById('form-contacto');
    if (formContacto) {
        formContacto.addEventListener('submit', function (e) {
            e.preventDefault();
            var nombre = document.getElementById('nombre-c').value;
            var correo = document.getElementById('correo-c').value;
            var asunto = document.getElementById('asunto').value;
            var mensaje = document.getElementById('mensaje').value;

            var cuerpo = 'Nombre: ' + nombre + '\nCorreo: ' + correo + '\n\n' + mensaje;
            window.location.href = 'mailto:hola@dankevsa.com' +
                '?subject=' + encodeURIComponent('[Web] ' + asunto) +
                '&body=' + encodeURIComponent(cuerpo);

            document.getElementById('msg-contacto').classList.add('mostrar');
            formContacto.reset();
        });
    }

    var listaResenas = document.getElementById('lista-resenas');
    if (listaResenas) {
        cargarResenasGuardadas();

        var formResena = document.getElementById('form-resena');
        if (formResena) {
            formResena.addEventListener('submit', function (e) {
                e.preventDefault();
                var resena = {
                    nombre: document.getElementById('nombre-resena').value,
                    estrellas: document.getElementById('valoracion').value,
                    comentario: document.getElementById('comentario-resena').value
                };
                guardarResena(resena);
                pintarResena(resena, true);
                document.getElementById('msg-resena').classList.add('mostrar');
                formResena.reset();
                actualizarPromedio();
            });
        }

        actualizarPromedio();
    }

    var filtro = document.getElementById('filtro-resenas');
    if (filtro) {
        filtro.addEventListener('change', function () {
            var valor = this.value;
            var tarjetas = document.querySelectorAll('#lista-resenas .tarjeta-resena');
            for (var j = 0; j < tarjetas.length; j++) {
                var texto = tarjetas[j].querySelector('.autor-resena').textContent;
                var num = (texto.match(/⭐/g) || []).length;
                if (valor === 'todas' || num === parseInt(valor)) {
                    tarjetas[j].style.display = 'block';
                } else {
                    tarjetas[j].style.display = 'none';
                }
            }
        });
    }

    var buscador = document.getElementById('buscador-productos');
    if (buscador) {
        buscador.addEventListener('input', function () {
            var texto = this.value.toLowerCase();
            var items = document.querySelectorAll('#lista-menu .item-producto');
            var visibles = 0;
            for (var k = 0; k < items.length; k++) {
                if (items[k].textContent.toLowerCase().indexOf(texto) !== -1) {
                    items[k].style.display = 'block';
                    visibles++;
                } else {
                    items[k].style.display = 'none';
                }
            }
            var aviso = document.getElementById('sin-resultados');
            if (aviso) {
                aviso.style.display = (visibles === 0) ? 'block' : 'none';
            }
        });
    }

    var botonesCat = document.querySelectorAll('.btn-categoria');
    for (var m = 0; m < botonesCat.length; m++) {
        botonesCat[m].addEventListener('click', function () {
            var cat = this.getAttribute('data-categoria');

            for (var n = 0; n < botonesCat.length; n++) {
                botonesCat[n].classList.remove('activo-cat');
            }
            this.classList.add('activo-cat');

            var items = document.querySelectorAll('#lista-menu .item-producto');
            for (var p = 0; p < items.length; p++) {
                if (cat === 'todas' || items[p].getAttribute('data-categoria') === cat) {
                    items[p].style.display = 'block';
                } else {
                    items[p].style.display = 'none';
                }
            }
        });
    }

    var btnCompartir = document.getElementById('btn-compartir');
    if (btnCompartir) {
        btnCompartir.addEventListener('click', function () {
            if (navigator.share) {
                navigator.share({
                    title: 'Heladería Dankevsa',
                    text: '¡Mira los helados de Dankevsa!',
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                btnCompartir.textContent = '✅ ¡Enlace copiado!';
                setTimeout(function () {
                    btnCompartir.textContent = '🔗 Compartir';
                }, 2000);
            }
        });
    }
});




function formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    var partes = fechaISO.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

function guardarResena(resena) {
    var guardadas = JSON.parse(localStorage.getItem('dankevsa_resenas') || '[]');
    guardadas.unshift(resena);
    localStorage.setItem('dankevsa_resenas', JSON.stringify(guardadas));
}

function cargarResenasGuardadas() {
    var guardadas = JSON.parse(localStorage.getItem('dankevsa_resenas') || '[]');
    for (var i = guardadas.length - 1; i >= 0; i--) {
        pintarResena(guardadas[i], true);
    }
}

function pintarResena(resena, alInicio) {
    var lista = document.getElementById('lista-resenas');
    var div = document.createElement('div');
    div.className = 'tarjeta-resena';
    div.innerHTML = '<p class="comentario">"' + escaparTexto(resena.comentario) + '"</p>' +
        '<span class="autor-resena">- ' + escaparTexto(resena.nombre) + ' ' + resena.estrellas + '</span>';
    if (alInicio) {
        lista.prepend(div);
    } else {
        lista.appendChild(div);
    }
}

function actualizarPromedio() {
    var contenedor = document.getElementById('promedio-resenas');
    if (!contenedor) return;

    var tarjetas = document.querySelectorAll('#lista-resenas .tarjeta-resena');
    var total = 0;
    for (var i = 0; i < tarjetas.length; i++) {
        var texto = tarjetas[i].querySelector('.autor-resena').textContent;
        total += (texto.match(/⭐/g) || []).length;
    }
    var promedio = tarjetas.length ? (total / tarjetas.length).toFixed(1) : 0;
    contenedor.innerHTML = '⭐ <strong>' + promedio + '</strong> / 5 &nbsp;·&nbsp; ' +
        tarjetas.length + ' reseña(s)';
}

function escaparTexto(texto) {
    var div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}
