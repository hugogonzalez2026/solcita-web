# SOLCITA · Centro de operaciones público 🤖

Web: https://hugogonzalez2026.github.io/solcita-web/

## Estado de la HP Mini

El tablero de Solcita muestra **únicamente** el contenido autorizado de `status.json`: porcentaje de batería, carga, RAM y disco, y última señal.

La tarea programada de ChatGPT consulta el bridge de Debian en el repositorio **privado** y publica en este repositorio **público** exclusivamente un JSON filtrado. No necesita nuevos tokens ni que Windows esté encendido.

- Actualización programada del estado: aproximadamente **cada hora**.
- La web consulta `status.json` cada **2 minutos**.
- Cuando la última señal supera **90 minutos**, conserva los últimos números registrados, pero los identifica claramente como históricos y no como mediciones actuales.

## Cotizaciones cripto públicas

Se incorporaron **BTC, ETH, SOL, DOT y PAXG (oro tokenizado)** en USD, con variación en 24 horas cuando la fuente la proporciona.

- El navegador consulta directamente el endpoint público de **CoinGecko** al abrir la página y luego cada **5 minutos** mientras está abierta.
- Si CoinGecko falla o devuelve datos viejos, intenta obtener el último precio negociado de **Kraken**; en ese caso la variación de 24 h aparece como no disponible, y la hora corresponde a la consulta (no a la operación).
- No se utilizan tokens API, ni credenciales del exchange, ni datos de la SQLite de la HP.
- Se indica fuente y hora. Si ambas fuentes fallan, se muestran guiones; no se inventan valores.
- El precio es **indicativo** y no una cotización ejecutable garantizada.
- Si se cierra la página, no se continúan las consultas de cotizaciones; se reanudan al abrirla.

**Importante:** el tablero público consulta CoinGecko/Kraken, independiente de la HP. Más abajo, la sección Debian muestra observaciones locales efectivamente publicadas. PAXG solo aparecerá allí cuando el recolector de Debian lo capture y el publicador local incorpore la nueva lista de activos; no se inventan mediciones.

## Seguridad

No se publican IPs, hostnames, puertos, credenciales, carteras, saldos, posiciones, información personal, bases de datos ni logs. El navegador no se conecta directamente a la HP Mini.


## Nuevo laboratorio: análisis por siete capas

En [analisis.html](https://hugogonzalez2026.github.io/solcita-web/analisis.html) escribí un ticker y pulsá Enter. También hay un botón visible desde el inicio de la web.

**Siete capas:** (1) precio y contexto, (2) catalizadores, (3) negocio vs. precio, (4) valuación, (5) comparación, (6) riesgos y contra-tesis, (7) precio de entrada y tamaño de posición.

**Cobertura actual:**
- Cripto y oro tokenizado: BTC, ETH, SOL, DOT, PAXG y otros símbolos configurados, a partir de datos públicos de CoinGecko. Si no responde, se intenta Kraken. Se intenta obtener hasta 90 días de precios; el histórico puede no estar disponible por límites del proveedor.
- Acciones y ETF: ejemplos AAPL, IVV y símbolos de Yahoo Finance como MOLA.BA. Los precios e histórico diario se consultan a Yahoo Finance **mediante proxy.cors.dev**, un servicio externo no controlado por Solcita (Yahoo no ofrece CORS directo); solo se envía el símbolo público, sin credenciales ni cartera. Este acceso es experimental y puede fallar.
- Cálculos disponibles según datos: cambios 7/30/90 días, volatilidad histórica estimada, drawdown de los últimos 90 días, rangos de precios; tokenomics parciales y capitalización en criptos cuando CoinGecko los publica.
- **No incluye balances, múltiplos, análisis cualitativo de catalizadores o valor intrínseco verificados**. Esas capas muestran datos pendientes en lugar de inventar conclusiones.
- No es una IA conversacional ejecutándose en la web. Es un análisis cuantitativo y una metodología guiada, con reglas transparentes.
- **No consulta todavía el historial de nuestra HP Mini.** Esa base está privada; integrar una selección de datos requerirá un publicador con lista blanca y otro despliegue.
- El estado de la HP y las criptocotizaciones del tablero principal siguen siendo servicios separados. No se incluyen posiciones, transacciones ni saldos personales.

**Seguridad:** no hay registro de usuarios ni claves en la web. Las solicitudes de ticker a proveedores externos están sujetas a sus políticas; no ingreses identificadores privados, claves, documentos o información personal como ticker.

El analizador no califica un activo como "comprar" o "vender" y nunca estima precio objetivo sin fundamentos.

## 🌱🌽 Futuros mini agro de A3

La portada incluye exclusivamente **SOJ.MIN/** (soja índice mini) y **MAI.MIN/** (maíz índice mini), ambos de 10 toneladas y liquidación financiera en USD/t, con enlaces oficiales. Un control externo de cierre revisa ajustes mini verificables y movimientos relevantes; **la HP Mini aún no captura esos contratos ni publica sus precios locales**. Por eso no se muestran precios sin fuente. Nunca usar SOJ.ROS, MAI.ROS ni Chicago como sustitutos.

## 📈 Acciones argentinas en seguimiento

Se agregaron accesos directos a **COME.BA, CRES.BA, IRSA.BA y MOLA.BA** en el inicio y botones en el analizador de siete capas. El analizador consulta Yahoo Finance mediante su pasarela pública experimental al abrir la ficha, no desde el recolector de Debian. No hay garantía de disponibilidad. **La lista pública no publica cantidades, posiciones ni precios de compra**. La hipótesis de treinta días queda en el navegador que realizó el análisis. La capacidad 8 en la HP se limita por ahora a los criptoactivos soportados.

## 🧠 Memoria financiera de las siete capas (primera versión)

Abrí [Memoria financiera](https://hugogonzalez2026.github.io/solcita-web/memoria.html) desde la portada o el analizador.

- Cada vez que el usuario consulta un ticker desde el analizador, si la cotización es válida y suficientemente reciente, se guarda **una observación por ticker y día** en \`localStorage\` del **mismo navegador**. Se preservan la fecha, precio, moneda, fuente, movimiento de 7/30 días, volatilidad histórica, drawdown, **los siete resúmenes breves de la evaluación original** y lo que no se verificó (catalizadores/balances/valuación).
- Se registra una hipótesis **experimental y puramente mecánica**: continuación de la tendencia de los últimos 30 días. Suba mayor a 3% ⇒ alcista; baja menor a −3% ⇒ bajista; otro ⇒ lateral; sin variación calculable ⇒ ninguna. **Esto no constituye una conclusión de las siete capas ni una recomendación.**
- Antes de cumplir 30 días, el usuario puede guardar por separado su **propia hipótesis direccional y una nota**. Después del vencimiento, esa hipótesis queda bloqueada para reducir sesgos retrospectivos.
- Pasados 30 días, al abrir la memoria se intenta verificar hasta cinco observaciones vencidas. El botón «Revisar hipótesis vencidas» permite revisar más. Para calificar el resultado debe recuperarse una **cotización histórica próxima a la fecha de vencimiento**, no el último precio de hoy. Una variación de ±2% delimita acierto/error según la dirección anunciada; son **movimientos de precio** y no retornos netos.
- Fuente histórica: CoinGecko o Kraken para cripto y Yahoo Finance vía proxy experimental para acciones/ETF. Si la fuente no responde, el resultado se mantiene **pendiente** sin inventarlo. En activos con dividendos, splits, cambios de ticker o monedas distintas, las métricas no sustituyen un retorno total correctamente ajustado.
- El registro informa conteo y tasa descriptiva de aciertos de esta regla básica. **No hay aprendizaje automático, reentrenamiento, decisión autónoma ni trading real.** No se inferirá calidad predictiva con muestras insuficientes.
- La memoria vive **solo en este navegador**. No está conectada a la base SQLite de la HP ni sincroniza entre dispositivos. El usuario puede **exportar/importar un archivo JSON** y borrar el historial local. Borrar cookies/datos del sitio o cambiar de dispositivo sin exportar implica perder la memoria.
- No se guardan claves, saldos ni posiciones. Evitá escribir datos personales o sensibles en las notas. La exportación puede contener los tickers y las notas, y debe guardarse de forma privada.

**Siguiente etapa:** diseñar almacenamiento privado persistente en la HP y un canal de comunicación limitado y auditado. No se puede completar desde la web pública con el puente GitHub actualmente desplegado (que solo ejecuta acciones predefinidas). Cualquier sincronización debe evitar exponer la memoria privada a visitantes del sitio.
