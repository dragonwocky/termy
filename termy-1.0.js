/**
 * Termy - An easily customisable web terminal built with JavaScript.
 * ==================================================================
 * Copyright (c) 2017 - 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

// Variables for later use.
var command = '',
  commandCount = 0,
  loggedIn = true,
  // User and host names.
  user = 'visitor',
  promptColour = '#f00',
  host = window.location.hostname || 'example.domain',
  // Registered Default commands.
  // If typed is set to true, that command uses Typed.js and should prepare the prompt for the next command itself.
  commands = {
    help: {
      description: 'displays all available commands.',
      usage: 'help'
    },
    man: {
      description: 'shows detailed information about commands.',
      usage: 'man &lt;command - run <i>help</i> to see all available&gt;'
    },
    clear: {
      description: 'removes all previously run commands from the terminal.',
      usage: 'clear'
    },
    exit: {
      description: 'logs out, to execute commands once again the page must be reloaded.',
      usage: 'exit',
      typed: true
    }
  };

// Add neccessary CSS.
$('head').append('<style type="text/css">@import url("https://fonts.googleapis.com/css?family=Ubuntu+Mono");a,body{color:#fff;font-size:1.1rem;max-width:100%;overflow-wrap:break-word;overflow-x:hidden}body{background:#000;font-family:"Ubuntu Mono",monospace}a{text-decoration:none;font-weight:700}p{margin:0}.caret{height:3px;width:10px;margin-left:5px;margin-bottom:-1px;background:#fff;display:inline-block}.cmd-input{margin-top:-1.225rem;font-size:1.1rem;font-family:"Ubuntu Mono",monospace;color:#fff;background:none;border:none;outline:none;padding:none;margin:none;width:100%;resize:none}body{-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}</style>');
// Add neccessary <div> elements.
$(window).bind('load', function () {
  document.body.innerHTML = '<div class="init"></div><div class="terminal"></div><div class="typed"></div>';
  initializeTermy();
});

// Adds Termy loading text.
function initializeTermy() {
  var init = '<span style="color: #0f0">Welcome to ' + host + '!</span><br>';
  init += '<br>';
  init += '>> Scanning for data... <br>';
  init += '>> Loading and configuring Termy... <br>';
  init += '<span style="margin-left:28px">==================================</span><br>';
  init += '>> Done! <br>';
  init += '<br>';
  init += 'This webpage is running <a href="https://github.com/TheDragonRing/termy">Termy v1.0</span>, <br>';
  init += 'by <a href="https://thedragonring.me">TheDragonRing</a>, licensed under the <a href="https://opensource.org/licenses/MIT">MIT License</a>.<br>';
  init += '<br>';
  init += 'Run <i>help</i> to see available commands.<br>';
  new Typed('.init', {
    strings: [init],
    typeSpeed: -100,
    showCursor: false,
    onComplete: function (self) {
      shell();
    }
  });
}

// Adds prefix.
function displayPrefix() {
  $('.terminal').append('<p id="' + commandCount + '"><span class="host"><span style="color: #0f0">' + user + '@' + host + '</span>:<span style="color: ' + promptColour + '">~$</span></span> <textarea class="cmd-input" ></textarea></p>');
  commandCount++;
  $('.cmd-input').css('textIndent', ($('.host').width() + 6.5) + 'px');
  autosize($('.cmd-input'));
  $(this).scrollTop($(this).height());
}

/* Animate flashing caret. Disabled until I figure out how to replace the default textarea caret.
function flashingCaret() {
  $('.caret').animate({
    opacity: 0
  }, 600).animate({
    opacity: 1
  }, 600);
}
setInterval('flashingCaret()', 1200); */

// Focuses input.
$(document).click(function () {
  $('.cmd-input').focus();
});
setInterval(function(){ $(document).trigger("click") }, 5);

// Enables input of commands.
function shell() {
  displayPrefix();
  $(document).keyup(function (e) {
    if (loggedIn) {
      console.log(e);
      var key = e.which;
      // Input text.
      if (key === 13) {
        e.preventDefault();
        command = $('.cmd-input').val().trim();
        if (command) {
          $('.cmd-input').replaceWith(`<span>${command}</span><br>`);
          // $('.caret').remove();
          // Turn input into command.
          var raw = command,
            arguments = command.split(' '),
            arguments = arguments.filter(function (e) {
              return e !== ''
            });
          command = arguments[0].toLowerCase(),
            // Error message if unregistered command.
            registered = [];
          Object.getOwnPropertyNames(commands).forEach(
            function (val, idx, array) {
              registered.push(val);
            }
          );
          if (registered.indexOf(command) === -1) {
            $('#' + (commandCount - 1)).append('<span style="color: #f00">ERROR</span>: ' + command + ': command not found');
          } else {
            var args = raw.split(' ');
            arguments.shift();
            try {
              // Execute command.
              window[command](arguments);
            } catch (err) {
              // Error message if error recieved when attempting to run command.
              $('#' + (commandCount - 1)).append('<span style="color: #f00">ERROR</span>: ' + command + ': an error occured while running this command.');
            }
            $(this).scrollTop($(this).height());
          }
          // Prepare to recieve next command.
          var typedCommands = [];
          Object.getOwnPropertyNames(commands).forEach(
            function (val, idx, array) {
              if (commands[val]['typed']) {
                typedCommands.push(val);
              }
            }
          );
          if (typedCommands.indexOf(command) === -1) {
            command = '';
            displayPrefix();
          }
        }
        return false;
      }
    }
  });
}

// Add an underline to a string.
function stringUnderline(str, char) {
  var underline = '';
  for (let i = 0; i < str.length; i++) {
    underline = underline + char;
  }
  return '<br>' + underline;
}

/* CORE COMMANDS */

// help - displays all available commands.
function help(args) {
  var help = 'Available Commands:' + stringUnderline('Available Commands:', '-');
  Object.getOwnPropertyNames(commands).forEach(
    function (val, idx, array) {
      help += '<br>' + val + ': ' + commands[val]['description'];
    }
  );
  $('#' + (commandCount - 1)).append(help);
}

// man - shows detailed information about commands.
function man(args) {
  var manual = false;
  Object.getOwnPropertyNames(commands).forEach(
    function (val, idx, array) {
      if (val == args[0]) {
        manual = 'Manual: ' + val + stringUnderline('Manual: ' + val, '-');
        if (commands[val]['description']) {
          manual += '<br> DESCRIPTION: ' + commands[val]['description'];
        }
        if (commands[val]['usage']) {
          manual += '<br> USAGE: ' + commands[val]['usage'];
        }
        if (commands[val]['info']) {
          manual += '<br> INFO: ' + commands[val]['info'];
        }
      }
    }
  );
  // If a valid command was inputted, display manual page. Otherwise show error.
  if (manual) {
    $('#' + (commandCount - 1)).append(manual);
  } else {
    $('#' + (commandCount - 1)).append('<span style="color: #f00">ERROR</span>: this command should be executed as <i>man &lt;command&gt;</i>. To see available commands run <i>help</i>.');
  }
}

// clear - remove all previously run commands from the terminal.
function clear(args) {
  $('.terminal').empty();
}

// exit - logs out, to execute commands once again the page must be reloaded.
function exit(args, url) {
  loggedIn = false;
  $(document).unbind('keyup');
  var logout = '<br>';
  logout += '>> Logged out<br>';
  logout += '>> Closed connection to ' + host + '<br>';
  if (url) {
    logout += 'Goodbye. Thank you for using Termy.';
  } else {
    logout += 'To use Termy once again, <a href="">reload the page</a>.';
  }
  $(this).scrollTop($(this).height());
  new Typed('.typed', {
    strings: [logout],
    typeSpeed: -100,
    showCursor: false,
    onComplete: function (self) {
      if (url) {
        window.location.href = url;
      }
    }
  });
}

/* CUSTOM COMMANDS */

// time - googles the command arguments.
function google(args) {
  if (args[0]) {
    exit(args, 'https://google.com/search?q=' + args.join('+'));
  } else {
    $('#' + (commandCount - 1)).append('<span style="color: #f00">ERROR</span>: this command should be executed as <i>google &lt;query&gt;</i>.');
    command = '';
  }
}

// 8ball - gives a random response to the input.
// defined like this to prevent errors from number in function name
window['8ball'] = function (args) {
  if (args[0]) {
    let answers = [
      'Who cares?',
      'I\'m not sure... try asking again later!',
      'I\'m not telling! Ask me again and I might consider it...',
      'Uhhh... do you really want to know?',
      'No. Definitely not.',
      'Dot. Definitely dot.',
      'There\'s an easy answer to that - nope!',
      'I doubt it.',
      'Of course!',
      'Yeah...',
      'It is most likely that that is so.',
      'Is fire hot?'
    ];
    // reply with random answer
    let x = Math.floor(Math.random() * answers.length);
    $('#' + (commandCount - 1)).append('<strong>Q:</strong> ' + args.join(' ') + '<br><strong>A:</strong> ' + answers[x]);
  } else {
    $('#' + (commandCount - 1)).append('<span style="color: #f00">ERROR</span>: this command should be executed as <i>8ball &lt;input&gt;</i>.');
    command = '';
  }
};

// time - displays the current time.
function time(args) {
  // Get what hour of the day it is.
  var date = new Date(),
    // Get what hour of the day it is.
    h = (date.getHours() > 12) ? date.getHours() - 12 : date.getHours();
  if (h === 0) {
    h = 12;
  }
  // Get what minute of the hour it is.
  var m = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes(),
    // Get what second of the minute it is.
    s = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds(),
    // Get what meridiem of the day it is.
    meridiem = (date.getHours() > 11) ? 'PM' : 'AM',
    // Get the the date in dd/mm/yyyy format.
    dd = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate(),
    mm = (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
    yyyy = date.getFullYear(),
    // Get the user's timezone.
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    // Get the user's timezone's offset from GMT.
    hourOffset = (parseInt(Math.abs(date.getTimezoneOffset() / 60)) < 10) ? '0' + parseInt(Math.abs(date.getTimezoneOffset() / 60)) : parseInt(Math.abs(date.getTimezoneOffset() / 60)),
    minOffset = (Math.abs(date.getTimezoneOffset() % 60) < 10) ? '0' + Math.abs(date.getTimezoneOffset() % 60) : Math.abs(date.getTimezoneOffset() % 60),
    gmt = (date.getTimezoneOffset() < 0) ? '+' + hourOffset + ':' + minOffset : ((date.getTimezoneOffset() > 0) ? '-' + hourOffset + ':' + minOffset : '00:00');
  // Display time details to user.
  $('#' + (commandCount - 1)).append(h + ':' + m + ':' + s + ' ' + meridiem + ', ' + dd + '/' + mm + '/' + yyyy + ', ' + timezone + ' (GMT' + gmt + ')');
}
