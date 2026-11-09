# SOLCITA · Centro de operaciones público 🤖

Web: https://hugogonzalez2026.github.io/solcita-web/

La interfaz muestra **únicamente** los campos públicos de `status.json`:
- Último reporte recibido (hora, no IP).
- Porcentaje de batería y estado de carga.
- Porcentaje de RAM usada.
- Porcentaje del disco ocupado.

**Todavía no hay lecturas reales públicas** hasta que se active en Debian el publicador limitado. Por ahora la interfaz muestra "Esperando primera lectura".

## Protección

No se publican IPs, usuarios, versiones internas, puertos, claves, cuentas, saldos, base de datos financiera ni logs. El navegador solo descarga un archivo estático de GitHub Pages; **no se conecta directamente a la HP Mini**.

El código de Debian está en otro repositorio privado. El publicador solo tendrá una credencial de GitHub con permiso de escritura para **este** repositorio público, sin acceso al privado.

La pantalla busca actualizaciones cada 2 minutos. Debian generará una nueva lectura aproximadamente cada 15 minutos. Si el archivo no se actualiza por 45 minutos, las cifras se ocultan para no presentar datos viejos como actuales.
