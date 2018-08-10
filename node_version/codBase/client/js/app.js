
class EventManager {
    constructor() {
        this.urlBase = "/events"
        this.logOut()
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
    }

    logOut() {
        $('.logout-container').on('click', function() {
            localStorage.removeItem('user');
            window.location.href = "/";
        });
    }

    obtenerDataInicial() {
        let url = this.urlBase + "/all";
        let user = localStorage.getItem('user');

        $.post(url, { user : user }, (items) => {
            var events = [];

            for (let item of items) {
                let event = new Object();
                event.title = item.title;
                event.id = item._id;

                if (!item.allDay) {
                    event.start = item.start + 'T' + item.start_hour;
                    event.end = item.end + 'T' + item.end_hour;
                } else {
                    event.start = item.start;
                    event.end = '';
                }

                events.push(event);
            }

            this.inicializarCalendario(events)
        })
    }

    eliminarEvento(evento, callback) {
        var eventId = evento.id;
        var user = localStorage.getItem('user');

        $.post(this.urlBase + '/delete', {id: eventId, user: user}, (data) => {
            callback(data);
        })
    }

    actualizarEvento(event) {
        var start = event.start._i;
        var end = '';
        var start_hour = '';
        var end_hour = '';

        if (!event.allDay) {
            var sliptStart = event.start._i.split('T');
            var sliptEnd = event.end._i.split('T');
            start = sliptStart[0];
            end = sliptEnd[0];
            start_hour = sliptStart[1];
            end_hour = sliptEnd[1];
        }

        $.post(this.urlBase + '/update', {
            _id: event.id,
            title: event.title,
            allDay: event.allDay,
            start: start,
            end: end,
            start_hour: start_hour,
            end_hour: end_hour
        }, (data) => {
            alert(data.message);
        });
    }

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault();
            let user = localStorage.getItem('user');
            let start = $('#start_date').val(),
            title = $('#titulo').val(),
            allDay = $('#allDay').is(':checked'),
            end = '',
            start_hour = '',
            end_hour = '';

            let model = {
                start: start,
                title: title,
                end: ''
            }

            if (!allDay) {
                end = $('#end_date').val()
                model.end = end;
                start_hour = $('#start_hour').val()
                end_hour = $('#end_hour').val()
                start = start + 'T' + start_hour
                end = end + 'T' + end_hour
            }
            let url = this.urlBase + "/new"
            if (title != "" && start != "") {
                let event = {
                    user: user,
                    title: model.title,
                    start: model.start,
                    start_hour: start_hour,
                    end: model.end,
                    end_hour: end_hour,
                    allDay: allDay
                }

                $.post(url, event, (data) => {
                    if (data.code === '1') {
                        let ev = {
                            title: title,
                            start: start,
                            end: end
                        }
        
                        $('.calendario').fullCalendar('renderEvent', ev);
                    }

                    alert(data.message);
                });
            } else {
                alert("Complete los campos obligatorios para el evento.")
            }
        })
    }

    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function(){
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            }else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }

    inicializarCalendario(eventos) {
        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            defaultDate: new Date(),
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            eventClick: (event)  => {
                $('#titulo, #start_date, #end_date, #start_hour, #end_hour').val('');
                $('#allDay').prop('checked', false);

                $('#titulo').val(event.title);
                $('#allDay').prop('checked', event.allDay);

                if (event.allDay) {
                    $('#start_date').val(event.start._i);
                } else {
                    var sliptStart = event.start._i.split('T');
                    var sliptEnd = event.end._i.split('T');

                    $('#start_date').val(sliptStart[0]);
                    $('#end_date').val(sliptEnd[0]);
                    $('#start_hour').val(sliptStart[1]);
                    $('#end_hour').val(sliptEnd[1]);
                }
            },
            eventDrop: (event) => {
                this.actualizarEvento(event)
            },
            events: eventos,
            eventDragStart: (event,jsEvent) => {
                $('.delete').find('img').attr('src', "img/delete-open.png");
                $('.delete').css('background-color', '#a70f19')
            },
            eventDragStop: (event,jsEvent) => {
                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                        this.eliminarEvento(event, function(data) {
                            if (data.code === '1') {
                                $('.calendario').fullCalendar('removeEvents', event.id);
                            }

                            alert(data.message);
                        });
                    }
                }
            })
        }
    }

    const Manager = new EventManager()
