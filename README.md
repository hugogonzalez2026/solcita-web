# SOLCITA · Centro de operaciones público 🤖

Web: https://hugogonzalez2026.github.io/solcita-web/

## Estado de la HP Mini

El tablero de Solcita muestra **únicamente** el contenido autorizado de `status.json`: porcentaje de batería, carga, RAM y disco, y última señal.

La tarea programada de ChatGPT consulta el bridge de Debian en el repositorio **privado** y publica en este repositorio **público** exclusivamente un JSON filtrado. No necesita nuevos tokens ni que Windows esté encendido.

- Actualización programada del estado: aproximadamente **cada hora**.
- La web consulta `status.json` cada **2 minutos**.
- Cuando la última señal supera **90 minutos**, conserva los últimos números registrados, pero los identifica claramente como históricos y no como mediciones actuales.

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


## Nuevo laboratorio: análisis por siete capas

En [analisis.html](https://hugogonzalez2026.github.io/solcita-web/analisis.html) escribí un ticker y pulsá Enter. También hay un botón visible desde el inicio de la web.

**Siete capas:** (1) precio y contexto, (2) catalizadores, (3) negocio vs. precio, (4) valuación, (5) comparación, (6) riesgos y contra-tesis, (7) precio de entrada y tamaño de posición.

**Cobertura actual:**
- Cripto: BTC, ETH, SOL, DOT y otros símbolos configurados, a partir de datos públicos de CoinGecko. Si no responde, se intenta Kraken. Se intenta obtener hasta 90 días de precios; el histórico puede no estar disponible por límites del proveedor.
- Acciones y ETF: ejemplos AAPL, IVV y símbolos de Yahoo Finance como MOLA.BA. Los precios e histórico diario se consultan a Yahoo Finance **mediante proxy.cors.dev**, un servicio externo no controlado por Solcita (Yahoo no ofrece CORS directo); solo se envía el símbolo público, sin credenciales ni cartera. Este acceso es experimental y puede fallar.
- Cálculos disponibles según datos: cambios 7/30/90 días, volatilidad histórica estimada, drawdown de los últimos 90 días, rangos de precios; tokenomics parciales y capitalización en criptos cuando CoinGecko los publica.
- **No incluye balances, múltiplos, análisis cualitativo de catalizadores o valor intrínseco verificados**. Esas capas muestran datos pendientes en lugar de inventar conclusiones.
- No es una IA conversacional ejecutándose en la web. Es un análisis cuantitativo y una metodología guiada, con reglas transparentes.
- **No consulta todavía el historial de nuestra HP Mini.** Esa base está privada; integrar una selección de datos requerirá un publicador con lista blanca y otro despliegue.
- El estado de la HP y las criptocotizaciones del tablero principal siguen siendo servicios separados. No se incluyen posiciones, transacciones ni saldos personales.

**Seguridad:** no hay registro de usuarios ni claves en la web. Las solicitudes de ticker a proveedores externos están sujetas a sus políticas; no ingreses identificadores privados, claves, documentos o información personal como ticker.

El analizador no califica un activo como "comprar" o "vender" y nunca estima precio objetivo sin fundamentos.
