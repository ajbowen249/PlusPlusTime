use std::io::prelude::*;
use std::fs::File;
use std::io::BufReader;
use std::env;

fn main() {
    let file_name = env::args().nth(1).unwrap();

    match File::open(file_name) {
        Ok(file) => {
            let reader = BufReader::new(file);
            let mut triangle = Vec::new();
            for line in reader.lines() {
                let mut row = Vec::new();

                for number in line.unwrap().split(" ") {
                    row.push(number.parse::<i32>().unwrap());
                }

                triangle.push(row);
            }

            //println!("{}", brute_force(&triangle, 0, 0, 0));
            println!("{}", smart(&mut triangle));
        },
        Err(_) => println!("Could not read file!")
    }
}

fn brute_force(triangle: &Vec<Vec<i32>>, row: usize, index: usize, sum: i32) -> i32 {
    let value_here = triangle[row][index] + sum;
    if row == triangle.len() - 1 {
        return value_here;
    } else {
        let left_sum = brute_force(triangle, row + 1, index, value_here);
        let right_sum = brute_force(triangle, row + 1, index + 1, value_here);
        if left_sum > right_sum {
            return left_sum;
        } else {
            return right_sum;
        }
    }
}

//Note: stole the algorithm from http://stackoverflow.com/questions/8002252/euler-project-18-approach
fn smart(triangle: &mut Vec<Vec<i32>>) -> i32 {
    let mut row: i32 = triangle.len() as i32 - 2;
    while row >= 0 {
        let mut index: i32 = triangle[row as usize].len() as i32 - 1;
        while index >= 0 {
            if triangle[(row + 1) as usize][index as usize] > triangle[(row + 1) as usize][(index + 1) as usize] {
                triangle[row as usize][index as usize] = triangle[row as usize][index as usize] + triangle[(row + 1) as usize][index as usize];
            } else {
                triangle[row as usize][index as usize] = triangle[row as usize][index as usize] + triangle[(row + 1) as usize][(index + 1) as usize];
            }

            index = index - 1;
        }

        row = row - 1;
    }

    triangle[0][0]
}
