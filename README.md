# Termy
*An easily customisable web terminal built with JavaScript.*

![animated demo](termy.gif)

### Usage
----------
To use Termy, simply download `jquery-3.2.1.min.js`, `typed-2.0.6.min.js` and `termy.js` - then add the following code to the <head> element of your file, and Termy will do the rest:
```
<script src="jquery-3.2.1.min.js"></script>
<script src="typed-2.0.6.min.js"></script>
<script src="termy.min.js"></script>
```

### Default Commands
---------------------
The core commands of Termy are `help - display all available commands`, `man - show detailed information about commands`, `clear - remove all previously run commands from the terminal` and `exit - logs out, to execute commands afterwards the page must be reloaded`.

There are also 2 built-in "custom commands": `time - display the current time` and `google - google the command arguments`.

### Adding Custom Commands
---------------------------
Adding your own commands to Termy is simple. Open `shell.js`, and add your command to the `commands` object. There you have three options. These are best demonstrated by the `exit` command:
```
exit: { // The name of the command

  description: 'logs out, to execute commands once again the page must be reloaded.', // The description of the comand to be shown when running help or man

  usage: 'exit', // The usage of the command to be shown when running man - the first word of the usage should be the name of the command.

  typed: true // If this is set to true, that means the command uses Typed.js and will display the next prefix itself.

}
```
To animate the appearance of text, Termy uses Typed.js. So that all text appears and stays in the right place in the terminal, this is how it should be run:
```
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
Now that the command has been registered with Termy, adding functionality is easy. Just scroll to the bottom of the page to the custom commands section - where you can see `time` and `google` already are. To add functionality to your own command, just create a function named the name of your command.
```
// Adds functionality for the command named dosomething
function dosomething(args){ // args argument contains all words input after.
  $('#' + (commandCount - 1)).append('something'); // Adds the word something to the terminal.
}
```
When adding text to the terminal, always either use the Typed.js method demonstrated above, or append text to the `$('#' + (commandCount - 1)` element like it is done here.

***NOTE:** Currently, only letters, numbers, underscores, hyphens and full stops can be typed into the terminal, and typing into the terminal on mobile does not yet work. Keep this in mind when adding custom commands.*

### Other Customisation
------------------------
The only other parts of Termy meant to be modified are the `user` and `host` variables. By default `user = 'visitor'` and `host = window.location.hostname || 'example.domain'` - this means that the default hostname is the website's domain name, but if there is no valid domain name (E.g. Termy is being opened from a local file), the default hostname is `example.domain`. These can be modified, or left as they are. You choose.
```
user = 'termy',
host = 'thedragonring.me',
// This sets the prefix to: termy@thedragonring.me:~ $
```

### Other Details
------------------
Termy was originally made as a 2017 Christmas gift to the community by TheDragonRing, inspired when he saw https://host01.th3f.de/ during some random browsing. It is licensed under the [MIT License](LICENSE).