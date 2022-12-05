#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn sum(num_a: i32, num_b: i32) -> i32{
    num_a + num_b
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, sum])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
