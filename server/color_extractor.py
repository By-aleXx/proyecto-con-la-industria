import sys
import cv2
import numpy as np
from sklearn.cluster import KMeans
import json


def _rgb_to_hex(rgb):
    r, g, b = [int(max(0, min(255, c))) for c in rgb]
    return "#{:02x}{:02x}{:02x}".format(r, g, b)


def extract_colors(image_path, n_colors=4, max_samples=10000):
    """Extrae exactamente `n_colors` colores dominantes de la imagen indicada.

    - Ignora píxeles totalmente transparentes (si la imagen tiene canal alfa).
    - Muestra hasta `max_samples` píxeles para acelerar KMeans sin sacrificar calidad.
    - Agrupa en espacio RGB y devuelve una lista de colores y porcentajes.
    """
    try:
        # Leer la imagen (incluye canal alfa si existe)
        image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
        if image is None:
            raise FileNotFoundError(f"No se pudo encontrar la imagen en la ruta: {image_path}")

        # Si la imagen tiene 4 canales (RGBA), filtrar píxeles transparentes
        if image.shape[2] == 4:
            bgr = image[:, :, :3]
            alpha = image[:, :, 3]
            # Considerar opaco si alpha > 10 (evitar casi transparentes)
            mask = alpha > 10
            if not np.any(mask):
                raise ValueError("La imagen no contiene píxeles opacos para extraer colores")
            # Extraer solo píxeles opacos
            pixels = bgr[mask]
            # Convertir BGR -> RGB
            pixels = pixels[:, ::-1]
        else:
            # Convertir BGR a RGB
            pixels = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            pixels = pixels.reshape((-1, 3))

        # Si hay demasiados píxeles, muestrear aleatoriamente para acelerar
        num_pixels = pixels.shape[0]
        if num_pixels == 0:
            raise ValueError("No hay píxeles válidos en la imagen")

        if num_pixels > max_samples:
            idx = np.random.choice(num_pixels, size=max_samples, replace=False)
            sample = pixels[idx]
        else:
            sample = pixels

        # Convertir a float para KMeans
        sample = np.array(sample, dtype=float)

        # Ejecutar KMeans en espacio RGB
        model = KMeans(n_clusters=n_colors, n_init=10, random_state=42)
        labels = model.fit_predict(sample)

        # Contar ocurrencias por cluster (asegurando longitud n_colors)
        counts = np.bincount(labels, minlength=n_colors)

        # Obtener centros y asegurarlos a 0..255
        centers = np.clip(model.cluster_centers_, 0, 255).astype(int)

        # Ordenar por dominancia
        order = np.argsort(counts)[::-1]
        sorted_counts = counts[order]
        sorted_centers = centers[order]

        total = sorted_counts.sum()
        if total == 0:
            raise ValueError("No se pudieron calcular los porcentajes de color")

        percentages = [round(float(c) / total * 100, 2) for c in sorted_counts]

        formatted_colors = [[_rgb_to_hex(center), [int(center[0]), int(center[1]), int(center[2])]]
                            for center in sorted_centers]

        result = {
            "colors": formatted_colors,
            "percentages": percentages
        }

        print(json.dumps(result))
        return 0

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        return 1


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Se requiere la ruta de la imagen"}))
        sys.exit(1)

    image_path = sys.argv[1]
    # permitir pasar número de colores opcional como segundo argumento
    try:
        n = int(sys.argv[2]) if len(sys.argv) >= 3 else 4
    except Exception:
        n = 4

    sys.exit(extract_colors(image_path, n_colors=n))