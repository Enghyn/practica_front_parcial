#!/usr/bin/env python3
"""Servidor de desarrollo del frontend de la librería.

Sirve ``public/`` y reenvía ``/api/*`` al backend quitando el prefijo, igual que
la regla ``location /api/`` de Nginx. Usa solo la biblioteca estándar, así que no
requiere Docker ni dependencias instaladas.

Uso:
    python dev_server.py
    python dev_server.py --puerto 8080 --destino http://127.0.0.1:8000

El destino por omisión es la API pública; para trabajar contra un backend local
pasá ``--destino http://127.0.0.1:8000``.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import posixpath
import sys
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

RAIZ = (Path(__file__).resolve().parent / "public").resolve()
DESTINO_POR_OMISION = "https://libreria.enzogiaquinta.me"
TIEMPO_ESPERA = 20


class Manejador(BaseHTTPRequestHandler):
    servidor_version = "LibreriaDevServer/1.0"
    destino = DESTINO_POR_OMISION

    # ---------- utilidades ----------

    def _responder_texto(self, estado: int, texto: str, tipo: str = "text/plain; charset=utf-8") -> None:
        datos = texto.encode("utf-8")
        self.send_response(estado)
        self.send_header("Content-Type", tipo)
        self.send_header("Content-Length", str(len(datos)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(datos)

    def _responder_json(self, estado: int, objeto: dict) -> None:
        self._responder_texto(estado, json.dumps(objeto, ensure_ascii=False), "application/json; charset=utf-8")

    def _copiar_cabeceras(self, origen, datos: bytes) -> None:
        tipo = origen.get("Content-Type") if origen else None
        self.send_header("Content-Type", tipo or "application/octet-stream")
        self.send_header("Content-Length", str(len(datos)))
        self.send_header("Cache-Control", "no-store")

    # ---------- proxy ----------

    def _es_api(self, camino: str) -> bool:
        return camino == "/api" or camino.startswith("/api/")

    def _proxy(self, partes: urllib.parse.SplitResult) -> None:
        resto = partes.path[len("/api"):] or "/"
        if not resto.startswith("/"):
            resto = "/" + resto
        url = self.destino.rstrip("/") + resto
        if partes.query:
            url = url + "?" + partes.query

        cuerpo = None
        largo = self.headers.get("Content-Length")
        if largo:
            try:
                cuerpo = self.rfile.read(int(largo))
            except (ValueError, OSError):
                self._responder_json(400, {"detail": "Cuerpo de la petición inválido"})
                return

        peticion = urllib.request.Request(url, data=cuerpo, method=self.command)
        for cabecera in ("Content-Type", "Accept", "Authorization"):
            valor = self.headers.get(cabecera)
            if valor:
                peticion.add_header(cabecera, valor)
        peticion.add_header("Accept-Encoding", "identity")

        try:
            with urllib.request.urlopen(peticion, timeout=TIEMPO_ESPERA) as respuesta:
                datos = respuesta.read()
                self.send_response(respuesta.status)
                self._copiar_cabeceras(respuesta.headers, datos)
                self.end_headers()
                if self.command != "HEAD":
                    self.wfile.write(datos)
        except urllib.error.HTTPError as error:
            datos = error.read()
            self.send_response(error.code)
            self._copiar_cabeceras(error.headers, datos)
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(datos)
        except (urllib.error.URLError, TimeoutError, OSError) as error:
            self.log_error("falló el proxy a %s: %s", url, error)
            self._responder_json(
                502,
                {"detail": "No se pudo conectar con la API en %s" % self.destino},
            )

    # ---------- estáticos ----------

    def _estatico(self, camino: str) -> None:
        relativo = posixpath.normpath(urllib.parse.unquote(camino)).lstrip("/")
        if camino.endswith("/") or relativo == "":
            relativo = posixpath.join(relativo, "index.html") if relativo else "index.html"

        destino = (RAIZ / relativo).resolve()
        try:
            destino.relative_to(RAIZ)
        except ValueError:
            self._responder_texto(403, "Prohibido")
            return

        if not destino.is_file():
            self._responder_texto(404, "No se encontró %s" % camino)
            return

        datos = destino.read_bytes()
        tipo = mimetypes.guess_type(destino.name)[0] or "application/octet-stream"
        if tipo.startswith("text/") or tipo in ("application/javascript", "application/json"):
            tipo = tipo + "; charset=utf-8"

        self.send_response(200)
        self.send_header("Content-Type", tipo)
        self.send_header("Content-Length", str(len(datos)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(datos)

    # ---------- despacho ----------

    def _despachar(self) -> None:
        partes = urllib.parse.urlsplit(self.path)
        if self._es_api(partes.path):
            self._proxy(partes)
        else:
            self._estatico(partes.path)

    def do_GET(self) -> None:  # noqa: N802
        self._despachar()

    def do_HEAD(self) -> None:  # noqa: N802
        self._despachar()

    def do_POST(self) -> None:  # noqa: N802
        self._despachar()

    def do_PATCH(self) -> None:  # noqa: N802
        self._despachar()

    def do_PUT(self) -> None:  # noqa: N802
        self._despachar()

    def do_DELETE(self) -> None:  # noqa: N802
        self._despachar()

    def do_OPTIONS(self) -> None:  # noqa: N802
        self._despachar()

    def log_message(self, formato: str, *argumentos) -> None:
        sys.stderr.write("[dev] %s - %s\n" % (self.address_string(), formato % argumentos))


def main() -> int:
    analizador = argparse.ArgumentParser(description="Servidor de desarrollo del frontend de la librería")
    analizador.add_argument("--puerto", type=int, default=8080, help="puerto local (por omisión 8080)")
    analizador.add_argument(
        "--destino",
        default=DESTINO_POR_OMISION,
        help="URL del backend sin barra final (por omisión %s)" % DESTINO_POR_OMISION,
    )
    argumentos = analizador.parse_args()

    if not (RAIZ / "index.html").is_file():
        print("No se encontró public/index.html junto a este script", file=sys.stderr)
        return 1

    Manejador.destino = argumentos.destino.rstrip("/")
    servidor = ThreadingHTTPServer(("127.0.0.1", argumentos.puerto), Manejador)
    print("Frontend:  http://127.0.0.1:%d/" % argumentos.puerto)
    print("Proxy:     /api/* -> %s/*" % Manejador.destino)
    print("Salud:     http://127.0.0.1:%d/api/health/ready" % argumentos.puerto)
    print("Ctrl+C para detener.")
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nDetenido.")
    finally:
        servidor.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
