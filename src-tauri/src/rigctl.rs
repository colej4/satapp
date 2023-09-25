use std::io::Write;
use std::net::TcpStream;

const HOST: &str = "localhost";
const PORT: u16 = 4532;

pub fn set_frequency(frequency: u32) {
    send_command(format!("F {}\n", frequency));
}

pub fn set_mode_bandwidth(mode: &str, bandwidth: u32) {
    send_command(format!("M {} {}\n", mode, bandwidth));
}

pub fn send_command(command: String) {
    let mut stream = TcpStream::connect(format!("{}:{}", HOST, PORT)).expect("Failed to connect to rigctl server");
    stream.write_all(command.as_bytes()).expect("Failed to send command");
}