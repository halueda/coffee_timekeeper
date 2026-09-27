/*
The MIT License (MIT)

Copyright (c) 2014-2023 Ichiro Maruta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

$(function () {
	let nletters = 7, last_nletters = 7;
	let time_str = "00:00";
	let time_inner = 0;
	var loadedcss = '';

	// The schedule is the single source of truth for inputs, display, URL
	// parameters, chimes, and timer transitions.
	var scheduleSteps = [
		{ key: 't0', inputId: 'time0', phase: 0, type: 'pour', scheduleLabel: '開始', messageLabel: '1投目', title: 'Initial Time. Negative value for countdown', time: '0:00', amount: 60, total: 60, chime: null },
		{ key: 't1', inputId: 'time1', phase: 1, type: 'pour', scheduleLabel: '2投目', messageLabel: '2投目', title: '1st bell', time: '0:40', amount: 60, total: 120, chime: './wav/chime1.mp3' },
		{ key: 't2', inputId: 'time2', phase: 2, type: 'pour', scheduleLabel: '3投目', messageLabel: '3投目', title: '2nd bell', time: '1:30', amount: 60, total: 180, chime: './wav/chime2.mp3' },
		{ key: 't3', inputId: 'time3', phase: 3, type: 'pour', scheduleLabel: '4投目', messageLabel: '4投目', title: '3rd bell', time: '2:10', amount: 60, total: 240, chime: './wav/chime3.mp3' },
		{ key: 't4', inputId: 'time4', phase: 4, type: 'pour', scheduleLabel: '5投目', messageLabel: '5投目', title: '4th bell', time: '2:40', amount: 60, total: 300, chime: './wav/chime3.mp3' },
		{ key: 't5', inputId: 'time5', phase: 5, type: 'finish', scheduleLabel: '終了', messageLabel: '完了', title: 'last bell', time: '3:30', amount: null, total: null, chime: './wav/chime3.mp3' }
	];

	function renderScheduleSettings() {
		var settingsHtml = '';
		var scheduleHtml = '';
		scheduleSteps.forEach(function (step) {
			settingsHtml += '<label for="' + step.inputId + '">' + step.scheduleLabel
				+ '<input id="' + step.inputId + '" class="form-control" data-step-key="' + step.key
				+ '" data-toggle="tooltip" data-placement="bottom" title="' + step.title
				+ '" type="text" pattern="[\\-:0-9]*"></label>';

			scheduleHtml += '<div class="schedule-row' + (step.type === 'finish' ? ' finish' : '')
				+ '" data-phase="' + step.phase + '" data-step-key="' + step.key + '">'
				+ '<span class="schedule-step">' + step.scheduleLabel + '</span>'
				+ '<span class="schedule-time" data-step-key="' + step.key + '">' + step.time + '</span>'
				+ '<strong>' + (step.total === null ? '—' : step.total + 'g') + '</strong></div>';
		});

		$('#time-settings').html(settingsHtml);
		$('#schedule-rows').html(scheduleHtml);
		scheduleSteps.forEach(function (step) {
			$('#' + step.inputId).val(step.time);
		});
	}

	renderScheduleSettings();
	$('#info').html("一回に60gずつ入れる.");

	function syncSchedule() {
		scheduleSteps.forEach(function (step) {
			$('#schedule .schedule-time[data-step-key="' + step.key + '"]').text($('#' + step.inputId).val());
		});
	}
	function setSchedulePhase(phase) {
		$('#schedule .schedule-row').removeClass('active');
		$('#schedule .schedule-row[data-phase="' + phase + '"]').addClass('active');
	}

	function getHashParams() {
		var hashParams = {};
		var e,
			a = /\+/g, // Regex for replacing addition symbol with a space
			r = /([^&;=]+)=?([^&;]*)/g,
			d = function (s) {
				return decodeURIComponent(s.replace(a, " "));
			},
			q = window.location.hash.substring(1);

		while (e = r.exec(q))
			hashParams[d(e[1])] = d(e[2]);
		return hashParams;
	}

	function parseHashParams() {
		var params = getHashParams();
		scheduleSteps.forEach(function (step) {
			if (params[step.key] !== undefined) {
				$('#' + step.inputId).val(params[step.key]);
			}
		});
		if (params.m !== undefined) $('#info').html(DOMPurify.sanitize(params.m));
		if (loadedcss !== '') {
			location.reload();
		}
		if (params.th !== undefined && /^[a-zA-Z0-9\-]+$/.test(params.th)) {
			loadedcss = params.th;
		} else {
			loadedcss = 'default';
		}
		$('head').append('<link rel="stylesheet" type="text/css" href="theme/' + loadedcss + '.css">');
	}

	function updateHash() {
		var hashstr = '#';
		scheduleSteps.forEach(function (step, index) {
			if (index > 0) hashstr += '&';
			hashstr += step.key + '=' + $('#' + step.inputId).val();
		});
		hashstr += '&m=' + encodeURIComponent($('#info').html());
		if (loadedcss !== 'default') {
			hashstr = hashstr + '&th=' + encodeURIComponent(loadedcss);
		}
		$('#seturl').attr("href", hashstr);
		try {
			history.replaceState(undefined, undefined, hashstr);
		} catch (e) {
		}
	};

	$(window).on('hashchange', function () {
		parseHashParams();
		updateHash();
	});

	parseHashParams();
	updateHash();

	$('#time-settings input[data-step-key], #info').change(function () {
		syncSchedule();
		updateHash();
	});

	var infoline = $('#info').html();
	$('#info').blur(function () {
		if (infoline != $(this).html()) {
			infoline = $(this).html();
			updateHash();
		}
	});

	var audioChimes = {};
	scheduleSteps.forEach(function (step) {
		audioChimes[step.key] = step.chime === null ? null : new Audio(step.chime);
	});

	function changeStateClass(s) {
		$('body').removeClass(function (index, className) {
			return (className.match(/\bstate-\S+/g) || []).join(' ');
		});
		$('body').addClass('state-' + s);
	};

	function changePhaseClass(s) {
		$('body').removeClass(function (index, className) {
			return (className.match(/\bphase-\S+/g) || []).join(' ');
		});
		$('body').addClass('phase-' + s);
	};

	function standby() {
		$('.nav li').removeClass('active');
		$('.nav li#standby').addClass('active');
		$('#state').html('待機中');
		changeStateClass('standby');
		changePhaseClass('0');
		setSchedulePhase(0);
		time_inner = parse_time($('#time0').val());
		show_time();
	}

	function start() {
		if ($('.nav li#start').hasClass('active')) {
			return;
		}
		$('.nav li').removeClass('active');
		$('.nav li#start').addClass('active');
		$('#state').html('');
		changeStateClass('start');
		start_time = new Date((new Date()).getTime() - time_inner);
		last_time = null;
		scheduleSteps.forEach(function (step) {
			var audio = audioChimes[step.key];
			if (audio !== null) audio.load();
		});
	}

	$('.nav #standby').click(function (event) {
		event.preventDefault();
		standby();
	});

	standby();
	var start_time = new Date();
	var last_time;

	$('.nav #start').click(function (event) {
		event.preventDefault();
		start();
	});

	$('#time').dblclick(function (event) {
		event.preventDefault();
		let new_time = prompt('Force the time to', time_str);
		if (new_time !== null) {
			set_time(new_time);
		}
	});

	function pause() {
		if ($('.nav li#standby').hasClass('active')) {
			return;
		}

		if ($('.nav li#pause').hasClass('active')) {
			return;
		}

		$('.nav li').removeClass('active');
		$('.nav li#pause').addClass('active');
		update_time();
		$('#state').html('一時停止');
		changeStateClass('paused');
	}

	$('.nav #pause').click(function (event) {
		event.preventDefault();
		pause();
	});

	function resize_display() {
		var height = $('.timer-display').height() || $('.timer-layout').height() || $('body').height();
		var width = $('.timer-display').width() || $('.timer-layout').width() || $('body').width();
		var theight = Math.min(height * 3 / 5, width * 1.95 / nletters);
		$('#time').css('top', (height - theight) / 2 * 1.1);
		$('#time').css('font-size', theight + 'px');
		$('#time').css('line-height', theight + 'px');
		var sheight = theight / 6;
		$('#state').css('top', height / 2 - theight / 2 - sheight / 2);
		$('#state').css('font-size', sheight + 'px');
		$('#state').css('line-height', sheight + 'px');
		var iheight = sheight;
		$('#info').css('top', height / 2 + theight / 2 + iheight * 0.9);
		$('#info').css('font-size', iheight + 'px');
		$('#info').css('line-height', iheight + 'px');
	}
	$(window).bind("resize", resize_display);
	$(window).bind("orientationchange", resize_display);

	$('#soundcheck').click(function (event) {
		event.preventDefault();
		var soundCheck = null;
		scheduleSteps.some(function (step) {
			soundCheck = audioChimes[step.key];
			return soundCheck !== null;
		});
		if (soundCheck !== null) {
			soundCheck.load();
			soundCheck.currentTime = 0;
			soundCheck.play();
		}
	});

	function format_time(t) {
		if (t < 0) {
			return '−' + format_time(-t + 999);
		}
		var h = Math.floor(t / 3600000);
		var m = Math.floor((t - h * 3600000) / 60000);
		var s = Math.floor((t - h * 3600000 - m * 60000) / 1000);
		var ms = Math.floor((t - h * 3600000 - m * 60000 - s * 1000) / 10);
		return ((h > 0) ? (h + ':') : '') + ('00' + m).slice(-2) + ':' + ('00' + s).slice(-2);
	}
	function show_time() {
		time_str = format_time(time_inner);
		nletters = time_str.length;
		if (nletters != last_nletters) {
			resize_display();
			last_nletters = nletters;
		}
		$('#time').html(time_str);
	}

	function set_time(t_str) {
		start_time = new Date((new Date()).getTime() - parse_time(t_str));
		update_time();
	}

	window.set_time = set_time;



	function update_time() {
		var cur_time = new Date();
		var e = cur_time - start_time;
		time_inner = e;
		show_time();
	}

	function parse_time(tstr) {
		if (tstr.charAt(0) === '-' || tstr.charAt(0) === '−') {
			return (-parse_time(tstr.slice(1)));
		}
		const parts = tstr.split(/[:∶]/).reverse();
		let time = 0;

		// seconds
		if (parts[0]) time += parseInt(parts[0], 10) * 1000;
		// minutes
		if (parts[1]) time += parseInt(parts[1], 10) * 60 * 1000;
		// hours
		if (parts[2]) time += parseInt(parts[2], 10) * 60 * 60 * 1000;

		return time;
	}

	function getStepTime(step) {
		return $('#' + step.inputId).val();
	}

	function activateStep(step) {
		changePhaseClass(step.phase);
		setSchedulePhase(step.phase);

		var audio = audioChimes[step.key];
		if (audio !== null) {
			audio.currentTime = 0;
			audio.play();
		}

		if (step.type === 'finish') {
			$('#state').html('完了');
		} else {
			$('#state').html(step.messageLabel + ': +' + step.amount + 'g, total: ' + step.total + 'g');
		}
		console.log(step.key);
	}

	$('[data-toggle="tooltip"]').tooltip();
	$.timer(100, function (timer) {
		resize_display();
		if ($('.nav li#start').hasClass('active')) {
			update_time();

			var cur_time = new Date();
			if (last_time != null) {
				scheduleSteps.forEach(function (step) {
					var stepTime = new Date(start_time.getTime() + parse_time(getStepTime(step)));
					if ((last_time < stepTime && stepTime <= cur_time) || (last_time == stepTime && cur_time == stepTime)) {
						activateStep(step);
					}
				});
			}
			last_time = cur_time;
		}
	});

	function obs_scene_change(name) {
		if (name.indexOf(':standby') != -1) {
			standby();
		}
		if (name.indexOf(':start') != -1) {
			start();
		}
		if (name.indexOf(':pause') != -1) {
			pause();
		}
	}

	if (window.obsstudio) {
		window.obsstudio.getCurrentScene(function (scene) {
			obs_scene_change(scene.name);
		});
		window.addEventListener('obsSceneChanged', function (event) {
			obs_scene_change(event.detail.name);
		})
	}
	show_time();
	syncSchedule();
});
