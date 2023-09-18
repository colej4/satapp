// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::commands::*;
use crate::tracking::*;
mod commands;
mod rigctl;
mod tle;
mod tracking;


fn main() {
    tle::get_satellites();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![listen, next, get_all_sat_x_y, get_all_r])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}