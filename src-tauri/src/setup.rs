use tauri::{App, Manager};
use window_vibrancy::{self, NSVisualEffectMaterial};

/// setup
pub fn init(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    let win = app.get_window("main").unwrap();

    // 仅在 macOS 下执行
    #[cfg(target_os = "macos")]
    window_vibrancy::apply_vibrancy(&win, NSVisualEffectMaterial::FullScreenUI)
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
    // 仅在 windows 下执行
    #[cfg(target_os = "windows")]
    window_vibrancy::apply_acrylic(&win, Some((18, 18, 18, 125)))
        .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
    win.maximize();
    let maximized_window_size = win.inner_size().unwrap();
    let monitor_info = win.current_monitor()?.unwrap();
    let _win_w = 0.2;
    let calculated_window_width = (monitor_info.size().width as f64 * _win_w).floor() as u32;
    win.set_position(tauri::PhysicalPosition {
        x: monitor_info.size().width - calculated_window_width,
        y: 0,
    });
    win.set_size(tauri::PhysicalSize {
        width: calculated_window_width,
        height: maximized_window_size.height,
    });
    Ok(())
}
