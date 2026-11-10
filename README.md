# SOLCITA · Centro de operaciones público 🤖

Web: https://hugogonzalez2026.github.io/solcita-web/

## Estado de la HP Mini

El tablero de Solcita muestra **únicamente** el contenido autorizado de `status.json`: porcentaje de batería, carga, RAM y disco, y última señal.

La tarea programada de ChatGPT consulta el bridge de Debian en el repositorio **privado** y publica en este repositorio **público** exclusivamente un JSON filtrado. No necesita nuevos tokens ni que Windows esté encendido.

- Actualización programada del estado: aproximadamente **cada hora**.
- La web consulta `status.json` cada **2 minutos**.
- Cuando la última señal supera **90 minutos**, oculta los números y marca la señal como desactualizada.

## Cotizaciones cripto públicas

Se incorporaron **BTC, ETH, SOL y DOT** en USD, con variación en 24 horas cuando la fuente la proporciona.

- El navegador consulta directamente el endpoint público de **CoinGecko** al abrir la página y luego cada **5 minutos** mientras está abierta.
- Si CoinGecko falla o devuelve datos viejos, intenta obtener el último precio negociado de **Kraken**; en ese caso la variación de 24 h aparece como no disponible, y la hora corresponde a la consulta (no a la operación).
- No se utilizan tokens API, ni credenciales del exchange, ni datos de la SQLite de la HP.
- Se indica fuente y hora. Si ambas fuentes fallan, se muestran guiones; no se inventan valores.
- El precio es **indicativo** y no una cotización ejecutable garantizada.
- Si se cierra la página, no se continúan las consultas de cotizaciones; se reanudan al abrirla.

**Importante:** las cotizaciones públicas NO son todavía las mediciones del proceso local de Kraken/Pionex en Debian. Esa integración requerirá ampliar de forma controlada el bridge privado.

## Seguridad

No se publican IPs, hostnames, puertos, credenciales, carteras, saldos, posiciones, información personal, bases de datos ni logs. El navegador no se conecta directamente a la HP Mini.
