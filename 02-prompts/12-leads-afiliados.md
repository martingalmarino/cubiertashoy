# Prompt 12 — Leads para gomerías + afiliados Mercado Libre
## Pasos manuales
- Sumate al programa de afiliados en mercadolibre.com.ar/l/afiliados (requiere monotributo después de 60 días). Verificá el % de neumáticos en el panel.
- Registrá una app en developers.mercadolibre.com.ar (la API de búsqueda devuelve 403 sin token).
## Pegá esto en Cursor (Agent)
```
1) Leads: componente LeadForm "Pedí precio con colocación en tu zona" en /medida y /auto: nombre, WhatsApp, localidad (combobox de localidades), medida (precargada), cantidad (2/4), consentimiento. Guardar en tabla leads + aviso por mail (Resend) o webhook. Tabla gomerias(nombre, localidad, whatsapp, plan, activo) y ruteo del lead a gomerías activas de la localidad. Página /para-gomerias explicando el servicio. Anti-spam: honeypot + rate limit.
2) Mercado Libre: scraper scrapers/mercadolibre.py usando la API oficial con OAuth client_credentials/refresh token (secrets ML_CLIENT_ID, ML_CLIENT_SECRET), solo vendedores con reputación verde y productos nuevos. Columna affiliate_url; los links a ML usan el link de afiliado y rel="sponsored nofollow".
3) Página /como-ganamos-plata (transparencia) y aviso en el footer.
```
## Checklist
- [x] Un lead de prueba llega por mail/webhook.
- [x] Links de ML llevan rel="sponsored".
