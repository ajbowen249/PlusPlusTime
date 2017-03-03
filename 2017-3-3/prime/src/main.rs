use std::env;

fn is_prime(number: u64) -> i8 {
    if number == 1 {
        return 0;
    } else if number == 2 {
        return 1;
    }

    let mut maybe_factor = 2;

    loop {
        if number % maybe_factor == 0 {
            return -1
        //I couldn't find a way of finding the square root of a u64 in the allotted time,
        //and with a small set of inputs this at least proves faster than testing from 2 to n-1.
        } else if maybe_factor * maybe_factor > number {
            return 1;
        }

        maybe_factor = maybe_factor + 1;
    }
}

fn main() {
    //0th argument is the path to the executable
    let arg = env::args().nth(1);

    match arg {
        Some(arg_value) => {
            let parsed = arg_value.parse::<u64>();
            match parsed{
                Ok(value) =>{
                    let result = is_prime(value);
                    let response = if result == 1 {"true"} else if result == -1 {"false"} else {"undefined"};
                    println!("{}", response);
                },
                Err(_) => println!("Error: could not parse")
            }
        },
        None => println!("Error: no argument")
    }
}
