/**
 * Termy.js - An easily customisable web terminal interface.
 * ==========================================================
 * Copyright (c) 2017 - 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

// Custom commands
const commands = {
  // command name - STRING - e.g. hello
  time: {
    // command description - STRING - e.g. 'says hello.'
    description: 'displays the current time.',
    // run - FUNCTION - e.g. (args) => { $container.append('Hello!') }
    run: ($termy, $container, args, funcs, options, cmds) => {
      // Get what hour of the day it is.
      const date = new Date(),
        // Get what minute of the hour it is.
        m =
          date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes(),
        // Get what second of the minute it is.
        s =
          date.getSeconds() < 10 ? `0${date.getMinutes()}` : date.getSeconds(),
        // Get what meridiem of the day it is.
        meridiem = date.getHours() > 11 ? 'PM' : 'AM',
        // Get the the date in dd/mm/yyyy format.
        dd = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate(),
        mm =
          date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1,
        yyyy = date.getFullYear(),
        // Get the user's timezone.
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
        // Get the user's timezone's offset from GMT.
        hourOffset =
          parseInt(Math.abs(date.getTimezoneOffset() / 60)) < 10
            ? `0${parseInt(Math.abs(date.getTimezoneOffset() / 60))}`
            : parseInt(Math.abs(date.getTimezoneOffset() / 60)),
        minOffset =
          Math.abs(date.getTimezoneOffset() % 60) < 10
            ? `0${Math.abs(date.getTimezoneOffset() % 60)}`
            : Math.abs(date.getTimezoneOffset() % 60),
        gmt =
          date.getTimezoneOffset() < 0
            ? `+${hourOffset}:${minOffset}`
            : date.getTimezoneOffset() > 0
              ? `-${hourOffset}:${minOffset}`
              : '00:00';
      // Get what hour of the day it is.
      h = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
      if (h === 0) h = 12;
      // Display time details to user.
      $container.append(`${h}:${m}:${s} ${meridiem},
        ${dd}/${mm}/${yyyy}, ${timezone} (GMT${gmt})`);
    }
  },
  // command name - STRING - e.g. hello
  '8ball': {
    // command description - STRING - e.g. 'says hello.'
    description: 'gives a random response to the input',
    // arguments to show as usage - STRING - e.g. '<required> [optional]'
    usage: '&lt;input&gt;',
    // run - FUNCTION - e.g. (args) => { $container.append('Hello!') }
    run: ($termy, $container, args, funcs, options, cmds) => {
      if (args[0]) {
        let answers = [
            'Who cares?',
            "I'm not sure... try asking again later!",
            "I'm not telling! Ask me again and I might consider it...",
            'Uhhh... do you really want to know?',
            'No. Definitely not.',
            'Dot. Definitely dot.',
            "There's an easy answer to that - nope!",
            'I doubt it.',
            'Of course!',
            'Yeah...',
            'It is most likely that that is so.',
            'Is fire hot?'
          ],
          // reply with random answer
          x = Math.floor(Math.random() * answers.length);
        $container.append(
          `<strong>Q:</strong> ${args.join(' ')}<br><strong>A:</strong> ${
            answers[x]
          }`
        );
      } else {
        $container.append(`<span style="color: ${
          options.colours.error
        }">ERROR</span>: this command\
          should be executed as <i>8ball &lt;input&gt;</i>`);
        command = '';
      }
    }
  },
  // command name - STRING - e.g. hello
  google: {
    // command description - STRING - e.g. 'says hello.'
    description: 'googles the command arguments.',
    // arguments to show as usage - STRING - e.g. '<required> [optional]'
    usage: '&lt;query&gt;',
    // whether or not the command uses Typed.js and prepares the prompt for
    // the next command itself - BOOLEEN - e.g. true
    typed: true,
    // run - FUNCTION - e.g. (args) => { $container.append('Hello!') }
    run: ($termy, $container, args, funcs, options, cmds) => {
      if (args[0]) {
        funcs.exit(`https://google.com/search?q=${args.join('+')}`);
      } else {
        $container.append(
          `<span style="color: ${
            options.colours.error
          }">ERROR</span>: this command should be executed as <i>google &lt;query&gt;</i>`
        );
        command = '';
      }
    }
  },
  // command name - STRING - e.g. hello
  sudo: {
    // whether or not to hide the command in the help menu - BOOLEEN - e.g. true
    hidden: true,
    // run - FUNCTION - e.g. (args) => { $container.append('Hello!') }
    run: ($termy, $container, args, funcs, options, cmds) => {
      if (args.join(' ') === 'make me a sandwich') {
        // make a sandwhich
        $container.append(`Here you go: <i class="em em-sandwich"></i>`);
      } else {
        // pretend the command doesn't exist
        $container.append(
          `<span style="color: ${
            options.colours.eror
          }">ERROR</span>: sudo: command not found`
        );
      }
    }
  },
  // command name - STRING - e.g. hello
  make: {
    // whether or not to hide the command in the help menu - BOOLEEN - e.g. true
    hidden: true,
    // run - FUNCTION - e.g. (args) => { $container.append('Hello!') }
    run: ($termy, $container, args, funcs, options, cmds) => {
      if (args.join(' ') === 'me a sandwich') {
        // refuse to make a sandwich
        $container.append(`No way. Do it yourself!`);
      } else {
        // pretend the command doesn't exist
        $container.append(
          `<span style="color: ${
            options.colours.error
          }">ERROR</span>: make: command not found`
        );
      }
    }
  }
};

// Termy
class Termy {
  constructor(container, options) {
    // mimic jQuery's $.extend() function recursively
    function extend() {
      for (var i = 1; i < arguments.length; i++)
        for (var key in arguments[i])
          if (arguments[i].hasOwnProperty(key)) {
            if (
              typeof arguments[0][key] === 'object' &&
              typeof arguments[i][key] === 'object'
            )
              extend(arguments[0][key], arguments[i][key]);
            else arguments[0][key] = arguments[i][key];
          }
      return arguments[0];
    }
    // Save custom data to object
    (this.container = container || 'body'),
      (this.options = extend(
        {
          // user and host names
          // below settings will set it to user@site.com
          // if the window hostname is undefined, it'll show as user@example.domain
          user: 'user',
          host: window.location.hostname || 'example.domain',
          colours: {
            // colour to be user for error messages
            error: '#f00',
            // colour of the user@host
            prefix: '#0f0',
            // colour of the ~$
            prompt: '#00f',
            // background colour
            background: '#000',
            // text colour
            text: '#fff'
          },
          // font size for the terminal
          fontSize: '1em',
          typeSpeed: 1
        },
        options ? options : {}
      )),
      // commands
      (this.commands = extend(
        {
          // command name - STRING - e.g. hello
          help: {
            // command description - STRING - e.g. 'says hello.'
            description: 'displays all available commands.',
            // command aliases - ARRAY - e.g. ['hello', 'hi']
            aliases: ['?'],
            // run - FUNCTION - e.g. (args) => { $container.append('Hello!') }
            run: ($termy, $container, args, funcs, options, cmds) => {
              let help = funcs.underline('Available Commands:', '-');
              Object.getOwnPropertyNames(cmds).forEach((val, idx, array) => {
                if (!cmds[val].hidden)
                  help += `<br>${val}: ${cmds[val].description}`;
              });
              $container.append(help);
            }
          },
          // command name - STRING - e.g. hello
          man: {
            // command description - STRING - e.g. 'says hello.'
            description: 'shows detailed information about commands.',
            // arguments to show as usage - STRING - e.g. '<required> [optional]'
            usage: '&lt;command - run <i>help</i> to see all available&gt;',
            // run - FUNCTION - e.g. (args) => { $container.append('Hello!') }
            run: ($termy, $container, args, funcs, options, cmds) => {
              let manual = false;
              Object.getOwnPropertyNames(cmds).forEach((val, idx, array) => {
                if (!cmds[val].hidden && val === args[0]) {
                  manual = funcs.underline(`Manual: ${val}`, '-');
                  if (cmds[val]['description'])
                    manual += `<br> DESCRIPTION: ${cmds[val]['description']}`;
                  if (cmds[val]['usage'])
                    manual += `<br> USAGE: ${cmds[val]['usage']}`;
                  if (cmds[val]['info'])
                    manual += `<br> INFO: ${cmds[val]['info']}`;
                }
              });
              // If a valid command was inputted, display manual page. Otherwise show error.
              if (manual) {
                $container.append(manual);
              } else {
                $container.append(
                  `<span style="color: ${
                    this.options.colours.error
                  }">ERROR</span>: this command should be executed as <i>man &lt;command&gt;</i>: to see available commands run <i>help</i>`
                );
              }
            }
          },
          // command name - STRING - e.g. hello
          clear: {
            // command description - STRING - e.g. 'says hello.'
            description:
              'removes all previously run commands from the terminal.',
            // run - FUNCTION - e.g. (args) => { $container.append('Hello!') }
            run: ($termy, $container, args, funcs, options, cmds) => {
              $(container).innerHTML = '';
            }
          },
          // command name - STRING - e.g. hello
          exit: {
            // command description - STRING - e.g. 'says hello.'
            description:
              'logs out, to execute commands once again the page must be reloaded.',
            // arguments to show as usage - STRING - e.g. '<required> [optional]'
            usage: 'exit',
            // whether or not the command uses Typed.js and prepares the prompt for
            // the next command itself - BOOLEEN - e.g. true
            typed: true,
            // run - FUNCTION - e.g. (args) => { $container.append('Hello!') }
            run: ($termy, $container, args, funcs, options, cmds) => {
              funcs.exit(false);
            }
          }
        },
        commands ? commands : {}
      ));
    // vars for later use
    (this.cmd = ''), (this.count = 0);
    // define functions
    this.funcs = {
      // mimic jQuery's $.extend() function recursively
      extend: extend,
      // get element within container
      el: element => {
        if (this.container === 'body' || this.container === 'html') {
          if (!element) {
            return document.body;
          } else {
            return document.querySelectorAll(element);
          }
        } else {
          const elements = [];
          document.querySelectorAll(this.container).forEach(el => {
            elements.push(el.querySelectorAll(element));
          });
          return elements;
          console.log(elements);
        }
      },
      // Add an underline to a string
      underline: (str, char) => {
        let line = '';
        for (let i = 0; i < str.length; i++) {
          line += char;
        }
        return `${str}<br>${line}`;
      },
      // Add prefix for each command
      displayPrefix: () => {
        this.funcs.el('.terminal').forEach(el => {
          const newEl = document.createElement('p');
          newEl.setAttribute('class', `cmd-${this.count}`);
          el.appendChild(newEl);
          this.funcs.el(`.cmd-${this.count}`).forEach(el => {
            // Textarea has Grammarly disabled
            el.innerHTML =
              '<textarea class="current-input" rows="1" data-gramm="false"></textarea>';
          });
        });
        this.funcs.el(`.cmd-${this.count}`).forEach(el => {
          const $prefix = document.createElement('span');
          $prefix.setAttribute('class', 'host');
          el.prepend($prefix);
        });
        // Fix textarea positioning
        this.funcs.el(`.cmd-${this.count} .host`).forEach(el => {
          (el.style.margin = `${this.funcs.el(
            `.cmd-${this.count} .current-input`
          )[this.funcs.el(`.cmd-${this.count} .current-input`).length - 1].style
            .padding || '2px'} 0`),
            (el.style.paddingRight =
              this.funcs.el(`.cmd-${this.count} .current-input`)[
                this.funcs.el(`.cmd-${this.count} .current-input`).length - 1
              ].style.padding || '2px'),
            (el.style.left =
              this.funcs.el(`.cmd-${this.count} .current-input`)[
                this.funcs.el(`.cmd-${this.count} .current-input`).length - 1
              ].style.left || '0px'),
            (el.style.top =
              this.funcs.el(`.cmd-${this.count} .current-input`)[
                this.funcs.el(`.cmd-${this.count} .current-input`).length - 1
              ].style.top || '0px');
          el.innerHTML = `<span style="color: ${this.options.colours.prefix}">${
            this.options.user
          }@${this.options.host}</span>:<span style="color: ${
            this.options.colours.prompt
          }">~$`;
        });
        this.funcs.el(`.cmd-${this.count} .current-input`).forEach(el => {
          el.style.textIndent = `${
            this.funcs.el(`.cmd-${this.count} .host`)[
              this.funcs.el(`.cmd-${this.count} .host`).length - 1
            ].offsetWidth
          }px`;
          autosize(el);
        });
        // Add event listeners - focus textarea on click, autosize
        document.querySelectorAll(this.container).forEach(el => {
          el.addEventListener('click', () =>
            this.funcs
              .el(`.cmd-${this.count} .current-input`)
              .forEach(el => el.focus())
          );
        });
        this.funcs
          .el(`.cmd-${this.count} .current-input`)
          .forEach(el =>
            el.addEventListener('focus', () => autosize.update(el))
          );
        this.funcs
          .el(`.cmd-${this.count} .current-input`)
          .forEach(el => el.focus());
        $(this.container).scrollTop($(this.container).height());
        this.count++;
      },
      // Logs out of the terminal
      // To execute commands once again the page must be reloaded
      // Parameter is optional, if used it will send the user to that URL after logging them out
      exit: url => {
        $(this.container).unbind('keyup');
        $(this.container).append('<div class="exit"></div>');
        let logout = `<br>
          >> Logged out
          <br>
          >> Closed connection to ${this.options.host}
          <br>
          ${
            url
              ? 'Goodbye. Thank you for using Termy.'
              : `To use Termy once again, <button class="exit">
          reload the terminal</button>.`
          }`;
        $(`${this.container} .exit`).click(() => {
          $(this.container).empty();
          this.init();
        });
        $(this.container).scrollTop($(this.container).height());
        new Typed(`${this.container} .exit`, {
          strings: [logout],
          typeSpeed: this.options.typeSpeed,
          showCursor: false,
          onComplete: function(self) {
            if (url) window.location.href = url;
          }
        });
      }
    };
  }

  init() {
    // Initialize Termy
    const start = () => {
      // Display init text
      const init = `<span style="color: ${
        this.options.colours.prefix
      }">Welcome to ${this.options.host}!</span>
        <br>
        <br>
        >> Scanning for data...
        <br>
        >> Loading and configuring Termy...
        <br>
        <span>&nbsp;&nbsp;&nbsp;==================================</span>
        <br>
        >> Done!
        <br>
        <br>
        This webpage is running <a href="https://thedragonring.me/termy">Termy v1.0</span>,
        <br>
        by <a href="https://thedragonring.me">TheDragonRing</a>,
        under the <a href="https://opensource.org/licenses/MIT">MIT License</a>.
        <br>
        <br>
        Run <i>help</i> to see available commands.<br>`;
      new Typed(`${this.container} .init`, {
        strings: [init],
        typeSpeed: this.options.typeSpeed,
        showCursor: false,
        onComplete: () => {
          shell();
        }
      });

      // Manage commands
      const shell = () => {
        this.funcs.displayPrefix();
        $(this.container).keyup(e => {
          const key = e.which;
          // Input text.
          if (key === 13) {
            this.cmd = $(`${this.container} .cmd-input`)
              .val(
                $(`${this.container} .cmd-input`)
                  .val()
                  .slice(0, -1)
              )
              .val()
              .trim();
            autosize.update($(`${this.container} textarea`));
            if (this.cmd) {
              $(`${this.container} .cmd-input`)
                .attr('disabled', '')
                .attr('class', '');
              // $('.caret').remove();
              // Turn input into command.
              let args = this.cmd.split(' ');
              args = args.filter(a => a !== '');
              this.cmd = args[0].toLowerCase();
              // Error message if unregistered command.
              let registered = [];
              Object.getOwnPropertyNames(this.commands).forEach(val => {
                registered.push(val);
              });
              if (registered.indexOf(this.cmd) === -1) {
                $(`${this.container} .${this.count - 1}`).append(
                  `<span style="color: ${
                    this.options.colours.error
                  }">ERROR</span>: ${this.cmd}: command not found`
                );
              } else {
                args.shift();
                try {
                  // Execute command.
                  this.commands[this.cmd].run(
                    this.container,
                    `${this.container} .${this.count - 1}`,
                    args,
                    this.funcs,
                    this.options,
                    this.commands
                  );
                } catch (err) {
                  // Error message if error recieved when attempting to run command.
                  $(`${this.container} .${this.count - 1}`).append(
                    `<span style="color: ${
                      this.options.colours.error
                    }">ERROR</span>: ${
                      this.cmd
                    }: an error occurred while running this command: ${err}`
                  );
                }
                $(this.container).scrollTop($(this.container).height());
              }
              // Prepare to recieve next command.
              const typed = [];
              Object.getOwnPropertyNames(this.commands).forEach(
                (val, idx, array) => {
                  if (this.commands[val].typed) {
                    typed.push(val);
                  }
                }
              );
              if (typed.indexOf(this.cmd) === -1) {
                this.cmd = '';
                this.funcs.displayPrefix();
              }
            }
            return false;
          }
        });
      };

      // Focuses input on click
      $(this.container).click(() => {
        $(`${this.container} textarea`).focus();
      });
    };

    // Add neccessary CSS
    const styles = document.createElement('style');
    styles.setAttribute('id', `termyStyles-'${this.container}'`);
    styles.setAttribute('type', 'text/css');
    if (this.container === 'body' || this.container === 'html') {
      document.body.innerHTML = '';
      document.body.appendChild(styles);
    }
    if (this.container.charAt(0) === '.') {
      const elements = document.getElementsByClassName(this.container.slice(1));
      for (let i = 0; i < elements.length; i++) {
        elements[i].innerHTML = '';
        elements[i].appendChild(styles);
      }
    }
    if (this.container.charAt(0) === '#') {
      document.getElementById(this.container.slice(1)).innerHTML = '';
      document.getElementById(this.container.slice(1)).appendChild(styles);
    }
    document.getElementById(`termyStyles-'${this.container}'`).innerHTML = `
      @import url("https://afeld.github.io/emoji-css/emoji.css");
      @import url("https://fonts.googleapis.com/css?family=Ubuntu+Mono");
      ${this.container} {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background: ${this.options.colours.background};
        padding: 1rem;
        max-width: 100%;
        overflow-wrap: break-word;
        overflow-x: hidden;
        font-size: ${this.options.fontSize};
        font-family: "Ubuntu Mono", monospace;
      }
      ${this.container}, ${this.container} a {
        color: ${this.options.colours.text};
      }
      ${this.container} a {
        text-decoration: none;
        font-weight: 700;
      }
      ${this.container} button {
        color: ${this.options.colours.text};
        font-family: "Ubuntu Mono", monospace;
        font-size: ${this.options.fontSize};
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font-weight: 700;
      }
      ${this.container} button:hover {
       cursor: pointer;
      }
      ${this.container} p {
        position: relative;
        margin: 0;
      }
      ${this.container} .host {
        position: absolute;
      }
      ${this.container} textarea, ${this.container} .host {
        font-family: "Ubuntu Mono", monospace;
        font-size: inherit;
      }
      ${this.container} textarea {
        color: ${this.options.colours.text};
        width: 100%;
        border: none;
        background: none;
        outline: none;
        resize: none;
      }`;

    // Add neccessary <div> elements
    if (this.container === 'body' || this.container === 'html')
      document.body.innerHTML = `${
        document.body.innerHTML
      } <div class="init"></div><div class="terminal"></div>`;
    if (this.container.charAt(0) === '.') {
      const elements = document.getElementsByClassName(this.container.slice(1));
      for (let i = 0; i < elements.length; i++) {
        elements[i].innerHTML = `${
          elements[i].innerHTML
        } <div class="init"></div><div class="terminal"></div>`;
      }
    }
    if (this.container.charAt(0) === '#')
      document.getElementById(this.container.slice(1)).innerHTML = `${
        document.getElementById(this.container.slice(1)).innerHTML
      } <div class="init"></div><div class="terminal"></div>`;
    // Check for dependencies (jQuery, Typed.js, autosize)
    try {
      $;
    } catch (e) {
      if (this.container === 'body' || this.container === 'html')
        document.body.innerHTML = `${
          document.body.innerHTML
        } <span style="color: ${
          this.options.colours.error
        }">ERROR</span>: missing dependency: <a href="http://jquery.com/">jQuery</a><br>`;
      if (this.container.charAt(0) === '.') {
        const elements = document.getElementsByClassName(
          this.container.slice(1)
        );
        for (let i = 0; i < elements.length; i++) {
          elements[i].innerHTML = `${
            elements[i].innerHTML
          } <span style="color: ${
            this.options.colours.error
          }">ERROR</span>: missing dependency: <a href="http://jquery.com/">jQuery</a><br>`;
        }
      }
      if (this.container.charAt(0) === '#')
        document.getElementById(this.container.slice(1)).innerHTML = `${
          document.getElementById(this.container.slice(1)).innerHTML
        }
          <span style="color: ${
            this.options.colours.error
          }">ERROR</span>: missing dependency: <a href="http://jquery.com/">jQuery</a><br>`;
    }
    try {
      Typed;
    } catch (e) {
      if (this.container === 'body' || this.container === 'html')
        document.body.innerHTML = `${document.body.innerHTML}
          <span style="color: ${
            this.options.colours.error
          }">ERROR</span>: missing dependency:
          <a href="https://mattboldt.com/typed.js/">Typed.js</a><br>`;
      if (this.container.charAt(0) === '.') {
        const elements = document.getElementsByClassName(
          this.container.slice(1)
        );
        for (let i = 0; i < elements.length; i++) {
          elements[i].innerHTML = `${elements[i].innerHTML}
          <span style="color: ${
            this.options.colours.error
          }">ERROR</span>: missing dependency:
          <a href="https://mattboldt.com/typed.js/">Typed.js</a><br>`;
        }
      }
      if (this.container.charAt(0) === '#')
        document.getElementById(this.container.slice(1)).innerHTML = `${
          document.getElementById(this.container.slice(1)).innerHTML
        }
          <span style="color: ${
            this.options.colours.error
          }">ERROR</span>: missing dependency:
          <a href="https://mattboldt.com/typed.js/">Typed.js</a><br>`;
    }
    try {
      autosize;
    } catch (e) {
      if (this.container === 'body' || this.container === 'html')
        document.body.innerHTML = `${document.body.innerHTML}
          <span style="color: ${
            this.options.colours.error
          }">ERROR</span>: missing dependency:
          <a href="http://www.jacklmoore.com/autosize/">Autosize</a><br>`;
      if (this.container.charAt(0) === '.') {
        const elements = document.getElementsByClassName(
          this.container.slice(1)
        );
        for (let i = 0; i < elements.length; i++) {
          elements[i].innerHTML = `${elements[i].innerHTML}
          <span style="color: ${
            this.options.colours.error
          }">ERROR</span>: missing dependency:
          <a href="http://www.jacklmoore.com/autosize/">Autosize</a><br>`;
        }
      }
      if (this.container.charAt(0) === '#')
        document.getElementById(this.container.slice(1)).innerHTML = `${
          document.getElementById(this.container.slice(1)).innerHTML
        }
          <span style="color: ${
            this.options.colours.error
          }">ERROR</span>: missing dependency:
          <a href="http://www.jacklmoore.com/autosize/">Autosize</a><br>`;
    }
    try {
      // If everything is loaded, then start Termy
      if ($ && Typed && autosize) {
        start();
      }
    } catch (e) {
      console.log(e);
    }
  }

  clear() {
    $(this.container).innerHTML = '';
  }
}
