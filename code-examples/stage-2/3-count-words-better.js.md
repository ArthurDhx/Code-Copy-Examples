# Count words more accurately

Consecutive spaces confused the previous program, so here's a smarter one:

<img>

The program can be shorter. We can drop `foundFirstWord` if we
pretend that there is a space before the sentence. Try it: set 
`previousWasSpace` to `true` at first, and remove 
`foundFirstWord` and the first `if`, only keep the 
`else` part.
