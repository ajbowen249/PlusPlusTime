This week, we did some code golfing, attempting to solve the [Longest Collatz Sequence](https://projecteuler.net/problem=14) problem in our language of choice using the fewest number of charaters. My solution, in [Rust](https://www.rust-lang.org/en-US/) (150 characters):

```rust
fn main(){let mut x=(0,0);for i in 1i64..1000000{let(mut n,mut l)=(i,1);while n>1{l+=1;n=if n%2==0{n/2}else{3*n+1}}if l>x.0{x=(l,i)}}print!("{}",x.1)}
```

The winning solution, in JavaScript (99 bytes) (must be run via the node.js repl):
```js
let l=0,n=0,i=1
while(i<1e6){
let t=i,c=0
while(t>1){c++
t=t%2==0?t/2:t*3+1
if(c>l){n=i;l=c}}i++}
n
```
