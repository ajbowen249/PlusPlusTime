fn itoa(value: i32, base: i32) -> String{
    let alphabet = vec!['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'H', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    
    if base as usize > alphabet.len() || base < 0 {
        panic!("Unsupported base!");
    }

    let mut value = value;

    let is_negative = if base == 10 && value < 0 {
        value *= -1;
        true
    } else {false};    

    let mut chars = Vec::<char>::new();

    while value != 0{
        let digit = alphabet[(value % base) as usize];
        chars.push(digit);
        value = value / base;
    }

    if is_negative{
        chars.push('-');
    }

    chars.into_iter().rev().collect()
}

fn main() {
    println!("{}", itoa(1234, 10));
    println!("{}", itoa(-1234, 10));
    println!("{}", itoa(1234, 2));
    println!("{}", itoa(1234, 8));
    println!("{}", itoa(1234, 16));
    println!("{}", itoa(1, 2));
    println!("{}", itoa(3, 4));
    println!("{}", itoa(7, 8));
    println!("{}", itoa(15, 16));
    println!("{}", itoa(31, 32));
    println!("{}", itoa(35, 36));
    println!("{}", itoa(-2147483648, 10));
}
