# Primality Test in Language of Choice

This challenge was to implement a command-line program to test for primality of the input and time the result. Run with:

         cd prime
         cargo build --release
         cd target/release
         time ./prime [INPUT]

Repost of the challenge markdown:

++ Time for Friday, Mar 3, 2017
===============================

Use any language and build system you like to create a **command line** program that:

- Takes a single argument on the command line. This argument will be an integer > 1. (If it's ≤ 1 your response is undefined.)
- Prints "true" if the integer is prime, else prints "false."

For example:

	`prime 60`

produces the output

	`false`

You are implementing a program, therefore, that implements a **primality test**.

Try solving the problem first *without consulting standard algorithms.* How are your mathematical chops? Can you puzzle out *any* sort of solution for the problem?

Once you've got some kind of "naive" solution, keep developing it—maybe implement a more sophisticated mathematical solution—to see how fast you can make your program.

If this task sounds too easy, you might consider trying it in a language you're still learning: Python, JavaScript, Java, C++, Swift, Go, Rust...? You can find a ready-made, in-browser IDE and execution context for most of these languages at http://ideone.com/.

## Testing

The following is a map of some sample inputs to correct values.

	2 : true
	3 : true
	4 : false
	5 : true
	6 : false
	7 : true
	8 : false
	9 : false
	10 : false
	11 : true
	12 : false
	13 : true
	14 : false
	15 : false
	16 : false
	17 : true
	18 : false
	19 : true
	20 : false
	101 : true
	541 : true
	543 : false
	2038074741 : false
	2038074743 : true

You can find other primes to test with via [Wolfram|Alpha] (https://www.wolframalpha.com/). Try entering "prime nearest to 100000", "5000th prime", or "random prime with 18 digits".

## Timing

On Unixes you may use the `time` command to measure how long your program takes to execute for a given number. Large primes could take seconds to compute.

	`time ./prime 22801763489`

How long does your program take to determine whether *9999999999971* is prime? (Note that your language/string parser may struggle to retain a number of that size in a useful form.)

If your program is too fast on that number, try:

* 99999999999999997
* 1000000000000000003
* 9223372036854775783		// The largest prime < 2^63

And if you're a glutton for punishment:

* 18446744073709551557		// The largest prime < 2^64

## Discussion

* How fast can you make your algorithm? What is the fastest implementation for a given context (interpreted languages, compiled languages...).
* What breakthroughs did you make to make your algorithm faster?