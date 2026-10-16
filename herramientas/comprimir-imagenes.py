"""Comprime las imágenes de una carpeta para que el sitio pese poco.

Uso (desde la carpeta del repositorio):
    python herramientas/comprimir-imagenes.py actividades/<id>/imagenes

- Achica las fotos más anchas que ANCHO_MAXIMO (se ven igual en el proyector).
- Guarda JPG y WebP con calidad CALIDAD; los PNG se optimizan sin perder calidad.
- Solo reemplaza un archivo si el resultado pesa menos que el original.
Requiere Pillow (pip install pillow).
"""
import sys
from pathlib import Path

from PIL import Image

ANCHO_MAXIMO = 1600
CALIDAD = 80
EXTENSIONES = {".jpg", ".jpeg", ".png", ".webp"}


def comprimir(ruta: Path) -> tuple[int, int]:
    antes = ruta.stat().st_size
    temporal = ruta.with_name(ruta.stem + ".tmp" + ruta.suffix)
    with Image.open(ruta) as img:
        if img.width > ANCHO_MAXIMO:
            alto = round(img.height * ANCHO_MAXIMO / img.width)
            img = img.resize((ANCHO_MAXIMO, alto), Image.LANCZOS)
        ext = ruta.suffix.lower()
        if ext in (".jpg", ".jpeg"):
            img.convert("RGB").save(temporal, "JPEG", quality=CALIDAD, optimize=True, progressive=True)
        elif ext == ".webp":
            img.save(temporal, "WEBP", quality=CALIDAD, method=6)
        else:
            img.save(temporal, "PNG", optimize=True)
    despues = temporal.stat().st_size
    if despues < antes:
        temporal.replace(ruta)
        return antes, despues
    temporal.unlink()
    return antes, antes


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    carpeta = Path(sys.argv[1])
    if not carpeta.is_dir():
        sys.exit(f"No existe la carpeta: {carpeta}")
    total_antes = total_despues = 0
    for ruta in sorted(carpeta.iterdir()):
        if ruta.suffix.lower() not in EXTENSIONES:
            continue
        antes, despues = comprimir(ruta)
        total_antes += antes
        total_despues += despues
        print(f"{ruta.name}: {antes // 1024} KB -> {despues // 1024} KB")
    print(f"Total: {total_antes // 1024} KB -> {total_despues // 1024} KB")


if __name__ == "__main__":
    main()
