# Termy.js
*An easily customisable web terminal interface built with JavaScript for menus, tutorials, games, and more!*

![animated demo](termy.gif)

### Usage
----------
To use Termy, simply download `termy-1.0.min.js` (found in the `dist` folder) and the `dependencies` folder with all its contents (`jquery-3.3.1.min.js`, `typed-2.0.6.min.js` and `autosize-4.0.0.min.js`) - then include the JS files in the <head> element of your file, and you're good to go:
```html
<script src="dependencies/jquery-3.3.1.min.js"></script>
<script src="dependencies/typed-2.0.6.min.js"></script>
<script src="dependencies/autosize-4.0.0.min.js"></script>
<script src="termy-1.0.min.js"></script>
```
(Yes, of course you can optionally use a CDN instead of the provided [jQuery](http://jquery.com/), [typed.js](https://mattboldt.com/typed.js/) and [Autosize](http://www.jacklmoore.com/autosize/) files!)

Now that you've got the scripts, you can customise it as you like. If, instead of filling the entire page, you wanted Termy to be in a single element of the page, give that element the `termy` class, like so:
```html
<div class="termy"></div>
```

There are also 3 settings in the `termy-1.0.min.js` file you can modify. Open up the file, and you'll see that there is a `custom` object up the top, with the minified Termy beneath. Within this object, there is another, `settings`, object. There, you have 3 options (currently set to the default settings) - you can take advantage of them, or if you don't want to use them, completely remove the `settings` object:
```js
settings: {
  // user and host names
  // below settings will set it to visitor@site.com
  // if the window hostname is undefined, it'll show as visitor@example.domain
  user: 'visitor',
  host: window.location.hostname || 'example.domain',
  // colour of the ~$
  promptColour: '#00f',
},
```

(You'll see that below the settings object is the `commands` object - see the [adding custom commands](#adding-custom-commands) section for more info on that.)


### Default Commands
---------------------
The core commands of Termy are `help - display all available commands`, `man - show detailed information about commands`, `clear - remove all previously run commands from the terminal` and `exit - logs out, to execute commands afterwards the page must be reloaded`.

There are also 3 "custom commands" included to serve as examples: `time - display the current time`, `8ball - gives a random response to the input` and `google - google the command arguments`.

(Hey! I've added a little easter egg to the custom commands - see what you can do with it!)

### Adding Custom Commands
---------------------------
Adding your own commands to Termy is simple. Open up the `termy-1.0.min.js` file and go the the `commands` object (it's inside the `custom` object up the top). You'll see that there are a few already there - those are the ones mentioned in the [default commands](#default-commands) section. Here's an example command:
```js
// command name - STRING
hello: {
  // command description - STRING
  description: 'says hello.',
  // arguments to show as usage - STRING
  usage: '&lt;required - my name&gt; [optional - your name]',
  // extra information to show when the man command is run - STRING
  info: 'Just an example command.',
  // whether or not to hide the command in the help menu - BOOLEEN
  hidden: false,
  // whether or not the command uses Typed.js and prepares the prompt for
  // the next command itself - BOOLEEN
  typed: false,
  // run - FUNCTION
  run: (args) => {
    if (args[0]) {
      if (args[0] === 'Termy') {
        if (args[1]) {
          $(`${container} .${commandCount - 1}`).append(`Hello ${args[1]}!`);
        } else {
          $(`${container} .${commandCount - 1}`).append('Hello!');
        }
      } else {
        $(`${container} .${commandCount - 1}`).append('That\'s not my name!');
      }
    } else {
      $(`${container} .${commandCount - 1}`).append('<span style="color: #f00">ERROR</span>: this '
        + 'command should be executed as <i>hello &lt;required - my name&gt; [optional - your name]</i>');
    }
  }
},
```
Just like that, you've added a command called `hello`:

- when you run `hello`, it will reply `ERROR: this command should be executed as hello <required - my name> [optional - your name]`,

- when you run `hello someone`, it will reply `That's not my name!`,

- when you run `hello Termy`, it will reply `Hello!`,

- and when you run `hello Termy Me`, it will reply `Hello Me!`.

`description`, `usage` and `info` are shown by the `help` and `man` commands.

If `hidden` is set to true, then the command will be overlooked by the `help` and `man` commands.

If `typed` is set to `true`, then you must handle preparing the prompt for the next command yourself (neccessary if you use Typed.js in the command). This is done like so:

To animate the appearance of text, Termy uses Typed.js. So that all text appears and stays in the right place in the terminal, this is how it should be run:
```js
// Just an example variable - change it to whatever you wish, but make sure to change it in the strings setting below too.
var string = 'whatever it is you want to type'; 
new Typed('.typed', {
  strings: [string],
  typeSpeed: -100,
  showCursor: false,
  onComplete: function (self) {
    $('.typed').empty();
    $('#' + (commandCount - 1)).append(string);
    command = '';
    displayPrefix();
  }
});
```
Now that the command has been registered with Termy, adding functionality is easy. Just scroll to the bottom of the page to the custom commands section - where you can see `time`, `8ball` and `google` already are. To add functionality to your own command, just create a function named the name of your command.
```
// Adds functionality for the command named dosomething
function dosomething(args){ // args argument contains all words input after.
  $('#' + (commandCount - 1)).append('something'); // Adds the word something to the terminal.
}
```
When adding text to the terminal, always either use the Typed.js method demonstrated above, or append text to the `$('#' + (commandCount - 1)` element like it is done here.

### Other Details
------------------
Termy was originally made as a 2017 Christmas gift to the community, inspired by https://host01.th3f.de/ during some random browsing. It is released under the [MIT License](LICENSE).