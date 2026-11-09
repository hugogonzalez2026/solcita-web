# SOLCITA · Centro de operaciones público 🤖

Sitio: https://hugogonzalez2026.github.io/solcita-web/

Esta web muestra **únicamente** el contenido permitido de `status.json`:

- Porcentaje de batería y estado de carga.
- Porcentaje aproximado de RAM ocupada.
- Porcentaje de disco ocupado.
- Hora UTC de la última medición.

## ¿De dónde vienen los datos?

Un proceso programado en ChatGPT, llamado **Actualizar web Solcita**, consulta por GitHub el agente de Debian a través de un Issue en el repositorio **privado**. Luego extrae solo las métricas autorizadas y reemplaza `status.json` en este repositorio **público** usando el conector GitHub ya conectado.

**No se usa ningún token nuevo ni se publican IPs, hostnames, credenciales, datos de cuentas, registros o detalles financieros personales.** La web tampoco se conecta a Debian directamente.

- **Actualización programada:** cada hora, comenzando el 9 de noviembre de 2026 a las 20:00 (Argentina).
- **Consulta desde navegador:** cada dos minutos.
- **Control de antigüedad:** si el dato es mayor a 90 minutos, la web lo marca como desactualizado y oculta cifras.
- Si el sensor de la batería reporta 101 o 102 %, se normaliza a 100 % sin inventar que está cargando. El texto del estado de carga se conserva aparte.

La primera actualización se hizo manualmente desde ChatGPT. La ejecución autónoma horaria quedó programada y requiere comprobar su primera corrida.

## Futuras mejoras

Incorporar datos financieros agregados y públicos, cada tipo revisado y autorizado por separado. El repositorio operativo de Debian sigue siendo privado.
