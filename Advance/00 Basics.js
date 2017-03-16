Node:

Features:
1. Latest ($node -v  and $node -p "process.versions.v8")
2. Staged ($node --harmony -p "youCanUseStagedFeaturesInHere"
3. In progress ($node --v8-options | grep "in progress")
For eg: see the last feature inProgress which is about trailing commas in function arguments. (a,b,)

Type the following:
.break - When in the process of inputting a multi-line expression, entering the .break command (or pressing the <ctrl>-C key combination) will abort further input or processing of that expression.
.clear - Resets the REPL context to an empty object and clears any multi-line expression currently being input.
.exit - Close the I/O stream, causing the REPL to exit.
.help - Show this list of special commands.
.save - Save the current REPL session to a file: > .save ./file/to/save.js
.load - Load a file into the current REPL session. > .load ./file/to/load.js
.editor - Enter editor mode (<ctrl>-D to finish, <ctrl>-C to cancel)


Event Loop:
1. ' https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#poll '
2. ' https://www.youtube.com/watch?v=8aGhZQkoFbQ '
3. ' http://latentflip.com/loupe/ ' (best)
