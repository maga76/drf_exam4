import os
import math
from PIL import Image, ImageDraw

def create_smart_school_icon(size):
    # Создаем изображение RGBA
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Градиентный фон в форме скругленного квадрата (Apple Squircle / Alif style)
    # Цвета: Telegram / Alif Blue (#2AABEE -> #007AFF)
    radius = int(size * 0.22)
    # Рисуем скругленный прямоугольник
    box = [int(size * 0.05), int(size * 0.05), int(size * 0.95), int(size * 0.95)]
    
    # Заливка фона
    bg_color = (42, 171, 238, 255) # Telegram Blue
    draw.rounded_rectangle(box, radius=radius, fill=bg_color)

    # Добавляем градиентный акцент вверху
    accent_box = [int(size * 0.05), int(size * 0.05), int(size * 0.95), int(size * 0.5)]
    draw.rounded_rectangle(box, radius=radius, outline=(255, 255, 255, 60), width=max(1, int(size * 0.02)))

    # 2. Рисуем академическую шапочку магистра (Graduation Cap) белым цветом
    center_x = size // 2
    cap_y = int(size * 0.38)
    cap_w = int(size * 0.36)
    cap_h = int(size * 0.14)

    # Ромб шапочки
    diamond = [
        (center_x, cap_y - cap_h),           # Верх
        (center_x + cap_w, cap_y),           # Право
        (center_x, cap_y + cap_h),           # Низ
        (center_x - cap_w, cap_y)            # Лево
    ]
    draw.polygon(diamond, fill=(255, 255, 255, 255))

    # Нижняя дуга шапочки
    skull_box = [
        int(center_x - cap_w * 0.55),
        int(cap_y + cap_h * 0.2),
        int(center_x + cap_w * 0.55),
        int(cap_y + cap_h * 1.8)
    ]
    draw.arc(skull_box, start=0, end=180, fill=(255, 255, 255, 255), width=max(2, int(size * 0.035)))
    draw.chord(skull_box, start=0, end=180, fill=(255, 255, 255, 255))

    # Кисточка шапочки (Tassel)
    tassel_start = (center_x + int(cap_w * 0.9), cap_y)
    tassel_end = (center_x + int(cap_w * 0.95), cap_y + int(cap_h * 1.5))
    draw.line([tassel_start, tassel_end], fill=(255, 214, 10, 255), width=max(2, int(size * 0.03))) # Золотая нить
    draw.ellipse([tassel_end[0]-int(size*0.03), tassel_end[1]-int(size*0.03), tassel_end[0]+int(size*0.03), tassel_end[1]+int(size*0.03)], fill=(255, 214, 10, 255))

    # 3. Открытая книга внизу
    book_y = int(size * 0.62)
    book_w = int(size * 0.32)
    book_h = int(size * 0.18)

    # Левая страница
    left_page = [
        (center_x - int(size * 0.03), book_y + int(book_h * 0.2)),
        (center_x - book_w, book_y),
        (center_x - book_w, book_y + book_h),
        (center_x - int(size * 0.03), book_y + int(book_h * 1.15))
    ]
    draw.polygon(left_page, fill=(255, 255, 255, 245))

    # Правая страница
    right_page = [
        (center_x + int(size * 0.03), book_y + int(book_h * 0.2)),
        (center_x + book_w, book_y),
        (center_x + book_w, book_y + book_h),
        (center_x + int(size * 0.03), book_y + int(book_h * 1.15))
    ]
    draw.polygon(right_page, fill=(255, 255, 255, 245))

    # Закладка книги
    ribbon = [
        (center_x - int(size * 0.02), book_y + int(book_h * 0.2)),
        (center_x + int(size * 0.02), book_y + int(book_h * 0.2)),
        (center_x + int(size * 0.02), book_y + int(book_h * 1.35)),
        (center_x, book_y + int(book_h * 1.25)),
        (center_x - int(size * 0.02), book_y + int(book_h * 1.35))
    ]
    draw.polygon(ribbon, fill=(255, 214, 10, 255)) # Золотая лента

    return img

# Пути к папкам иконок в проекте Flutter
res_dir = "/home/muhammad/Рабочий стол/smart_school_app/android/app/src/main/res"

sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

for folder, s in sizes.items():
    folder_path = os.path.join(res_dir, folder)
    os.makedirs(folder_path, exist_ok=True)
    icon_img = create_smart_school_icon(s)
    # Сохраняем ic_launcher.png
    out_path = os.path.join(folder_path, "ic_launcher.png")
    icon_img.save(out_path, "PNG")
    print(f"Generated {out_path} ({s}x{s})")

# Также создаем 512x512 для главного логотипа
main_512 = create_smart_school_icon(512)
main_512.save("/home/muhammad/Рабочий стол/smart_school_app/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png", "PNG")
main_512.save("/home/muhammad/Рабочий стол/smart_school_app/assets_logo.png", "PNG")
print("All icon sizes created successfully!")
