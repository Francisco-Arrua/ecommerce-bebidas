const secciones = [
  {
    id: "primeros-pasos",
    titulo: "1. Primeros pasos y navegación",
    introduccion:
      "El panel de administración reúne las herramientas para mantener el catálogo, el contenido público y la operación diaria de la tienda. En una computadora, elegí una sección desde el menú lateral; en una pantalla pequeña, abrí el selector de secciones del encabezado. La vista cambia dentro del panel y no hace falta volver a iniciar sesión para pasar de un módulo a otro.",
    puntos: [
      "Inicio muestra el resumen disponible de la tienda. Usalo como punto de partida para revisar la actividad y luego entrá a los módulos que necesiten atención.",
      "Productos, Categorías y Subcategorías organizan lo que se vende. Conviene crear primero la categoría y, si corresponde, su subcategoría antes de cargar los productos.",
      "Portadas, Anuncios, Colecciones y Secciones administran distintas partes del contenido visible en la tienda. No son intercambiables: cada módulo alimenta un bloque diferente del sitio.",
      "Pedidos, Clientes, Configuración y Credenciales MP cubren la gestión de ventas, los datos de contacto de la tienda y la conexión de cobros.",
    ],
    nota:
      "Si una sección no aparece en el sidebar, revisá el selector del encabezado cuando estés usando un teléfono o una ventana angosta.",
  },
  {
    id: "mercado-pago",
    titulo: "2. Conectar Mercado Pago",
    introduccion:
      "La sección Credenciales MP conecta el checkout de la tienda con tu aplicación de Mercado Pago. Antes de guardar, tené a mano el Access Token, la Public Key y la clave secreta del Webhook. Se encuentran en la configuración de la aplicación y de sus Webhooks en Mercado Pago.",
    puntos: [
      "Abrí Credenciales MP y revisá primero el Estado Actual. Ahí se indica si la integración está lista para cobrar y si está configurada la confirmación automática de pagos.",
      "Pegá el Access Token de la aplicación en su campo. Es una credencial privada; el formulario la oculta mientras la escribís y el panel solo muestra una versión enmascarada del valor guardado.",
      "Completá la Public Key. Si ya había una configurada, el panel la carga en el campo para que puedas conservarla o reemplazarla.",
      "Pegá la clave secreta del Webhook para habilitar la validación de las notificaciones y la confirmación automática de pagos. Si el estado indica que ya está configurada, podés dejar ese campo vacío al actualizar las otras credenciales.",
      "Presioná Guardar y esperá la confirmación en pantalla. El Access Token y la Public Key son obligatorios cada vez que guardás; por eso, al renovar credenciales, volvé a escribir también el Access Token.",
      "Volvé a mirar el Estado Actual después de guardar. Confirmá que figure Listo para cobrar y que la confirmación automática esté activa si ingresaste el secreto del Webhook.",
    ],
    nota:
      "No compartas el Access Token ni la clave secreta del Webhook por mensajes o capturas. Usá credenciales de la aplicación y el entorno de Mercado Pago que correspondan a la tienda; probá el flujo de pago antes de anunciar que ya está disponible.",
  },
  {
    id: "productos",
    titulo: "3. Crear y mantener productos",
    introduccion:
      "En Productos podés cargar artículos, encontrar productos existentes y actualizar sus datos. La ficha admite nombre, descripción, marca, categoría, subcategoría, precio, stock, talles, imágenes y opciones de publicación o promoción.",
    puntos: [
      "Antes de abrir el formulario, definí en Categorías y Subcategorías dónde querés ubicar el artículo. Así estará disponible la clasificación correcta al completar la ficha.",
      "Completá un nombre reconocible y una descripción clara. Agregá la marca cuando corresponda y seleccioná la categoría y subcategoría adecuadas.",
      "Ingresá el precio y el stock disponible. Si el artículo se vende por talle, activá la opción de talles y completá cada talle con su stock; mantené esas cantidades al día para evitar ofrecer unidades que no tenés.",
      "Subí las imágenes del producto desde el formulario. Se pueden asociar hasta ocho imágenes; la primera queda como principal automáticamente. Podés marcar otra como principal o quitar imágenes antes de guardar.",
      "Usá las opciones de producto activo, destacado y oferta según corresponda. Para una oferta, completá el precio promocional además del precio habitual y verificá que los dos importes sean correctos.",
      "Guardá el producto y revisá que aparezca en el listado. Para corregir información, abrilo en edición, actualizá los campos necesarios y guardá los cambios.",
      "Para localizar artículos, usá la búsqueda y los filtros de categoría y subcategoría. El listado se muestra en páginas, así que cambiá de página para acceder a otros resultados.",
    ],
    nota:
      "Las imágenes se optimizan antes de subirlas. Aun así, elegí fotos nítidas, bien iluminadas y que representen el producto; una imagen principal clara mejora la presentación en el catálogo.",
  },
  {
    id: "categorias",
    titulo: "4. Categorías y subcategorías",
    introduccion:
      "Las categorías son la clasificación principal del catálogo y las subcategorías refinan esa organización. Una estructura coherente ayuda a encontrar artículos tanto al administrar la tienda como al recorrerla como cliente.",
    puntos: [
      "En Categorías, escribí el nombre de la nueva categoría y guardala. Elegí nombres breves y estables, que describan grupos amplios de productos.",
      "En Subcategorías, seleccioná la Categoría Padre, escribí el nombre y guardá. La subcategoría siempre debe pertenecer a una categoría existente.",
      "Si la pantalla indica que primero debés crear una categoría, hacelo antes de volver al formulario de subcategorías.",
      "Al editar un producto, seleccioná la clasificación que refleje mejor su uso. Evitá crear categorías duplicadas con variantes de mayúsculas o nombres casi iguales.",
    ],
    nota:
      "Antes de renombrar o eliminar elementos de clasificación, revisá los productos que los usan para conservar un catálogo fácil de navegar.",
  },
  {
    id: "portadas",
    titulo: "5. Portadas de la página principal",
    introduccion:
      "Portadas administra las diapositivas principales (Hero) que aparecen en la página de inicio. Cada portada puede combinar imagen, título, subtítulo y un botón que dirige a una página o listado.",
    puntos: [
      "Completá el título y el subtítulo con un mensaje breve que se lea bien sobre la imagen.",
      "Para agregar una llamada a la acción, definí el Texto del Botón y su Enlace de Destino. Comprobá que la dirección exista; puede ser, por ejemplo, una ruta interna a un listado.",
      "Seleccioná la imagen principal y esperá a que termine de procesarse y subirse antes de guardar.",
      "Definí la Posición / Orden para controlar la secuencia en que se presentan las portadas. Usá valores consistentes y revisá la lista ordenada.",
      "Guardá la portada y comprobá su vista previa/listado. En las portadas existentes podés editar textos, enlace, orden e imagen, cambiar su estado activo o eliminarlas.",
    ],
    nota:
      "Revisá la portada en una pantalla grande y en un teléfono: el recorte de la imagen puede variar según el tamaño de pantalla.",
  },
  {
    id: "anuncios-colecciones",
    titulo: "6. Anuncios y colecciones",
    introduccion:
      "Anuncios permite gestionar promociones gráficas independientes; Colecciones permite agrupar productos bajo una presentación común. Usá cada herramienta para el bloque que querés destacar en la tienda.",
    puntos: [
      "En Anuncios podés definir título, subtítulo, imagen, colores de inicio y fin, y orden de presentación. También podés editar un anuncio, cambiar si está activo o eliminarlo.",
      "Para crear un anuncio, subí la imagen si la promoción ya está diseñada; si no, completá el título y el subtítulo para acompañar el bloque con texto. Revisá el orden antes de guardar.",
      "En Colecciones, completá nombre, subtítulo y descripción; agregá una imagen de portada y seleccioná los productos que formarán parte de la colección.",
      "Al editar una colección, revisá tanto la información como la selección de productos para mantenerla actualizada. Confirmá cualquier eliminación: quitar la colección remueve ese agrupamiento del sitio.",
    ],
    nota:
      "Usá imágenes legibles y mensajes vigentes. Si una campaña termina, desactivá o actualizá el contenido para no dejar promociones vencidas a la vista.",
  },
  {
    id: "secciones-configuracion",
    titulo: "7. Secciones y datos de la tienda",
    introduccion:
      "Secciones sirve para crear páginas de contenido que complementan el catálogo. Configuración reúne el nombre de la tienda y sus canales de contacto.",
    puntos: [
      "Para crear una sección, escribí un título. Podés completar el slug que identifica la dirección, el contenido, una imagen, la visibilidad en el menú y el orden.",
      "Activá Visible en menú si querés que esa página aparezca en la navegación de la tienda. Ajustá el orden para decidir su posición junto a las demás secciones.",
      "Guardá para crear la página. Para modificar una existente, elegila en el listado, actualizá el formulario y guardá; usá Eliminar solo cuando ya no necesites esa página.",
      "En Configuración, actualizá el nombre de la tienda, el número de WhatsApp, el usuario de Instagram y el enlace de Facebook. Presioná Guardar y verificá el mensaje de confirmación.",
      "Escribí el teléfono de WhatsApp con código de país y área, sin espacios ni signos (por ejemplo, 5491123456789). Ingresá el usuario de Instagram sin el arroba y el identificador de Facebook en el formato solicitado por el campo.",
    ],
    nota:
      "Antes de publicar una sección, comprobá ortografía, enlaces e imágenes. Mantené los datos de contacto al día para que los clientes puedan comunicarse con la tienda.",
  },
  {
    id: "pedidos-clientes",
    titulo: "8. Pedidos y clientes",
    introduccion:
      "Pedidos concentra el seguimiento de las compras y permite mantener informado el estado del despacho. Clientes permite consultar la información disponible de quienes compran en la tienda.",
    puntos: [
      "Abrí un pedido para revisar sus datos antes de preparar la compra. El estado del pedido y el estado del envío son campos distintos: actualizalos de acuerdo con lo que realmente ocurrió.",
      "El estado del pedido puede ser Pendiente, Pagado o Cancelado. Confirmá el pago con la información del cobro antes de marcarlo como pagado; no confundas un pedido pendiente con un pago confirmado.",
      "Para el envío, usá Pendiente de despacho, Enviado o Entregado. Cuando la compra ya fue despachada, completá también el código de seguimiento si el transportista proporcionó uno.",
      "Guardá las modificaciones y revisá el pedido nuevamente para confirmar que quedaron reflejadas.",
      "En Clientes, consultá la información que presenta el listado para atender preguntas o dar seguimiento a compradores. Protegé esos datos y úsalos solo para la gestión de la tienda.",
    ],
    nota:
      "No marques un envío como entregado hasta tener confirmación. Si el pago o el despacho no coinciden con la información del pedido, verificá el caso antes de cambiar su estado.",
  },
  {
    id: "buenas-practicas",
    titulo: "9. Rutina recomendada y solución de problemas",
    introduccion:
      "Una revisión breve y frecuente reduce errores en el catálogo y ayuda a que la información pública sea confiable.",
    puntos: [
      "Al recibir mercadería, actualizá stock y talles; al cambiar precios, revisá también si el artículo tiene una oferta activa.",
      "Después de subir imágenes, comprobá que se vean bien y que la principal sea la correcta. Si la imagen no aparece, esperá a que termine la carga y volvé a intentarlo con un archivo válido.",
      "Después de editar contenido, visitá la tienda como cliente y revisá la sección publicada, los enlaces de los botones y la visualización en móvil.",
      "Después de guardar credenciales de Mercado Pago, leé los indicadores de integración y confirmación automática. Si falta el Webhook Secret, ingresalo para habilitar la validación automática de avisos.",
      "Si un cambio no se refleja, comprobá que se guardó, recargá la página y volvé a revisar el módulo correspondiente. Si el problema continúa, anotá la sección y el mensaje visible para facilitar el diagnóstico.",
    ],
    nota:
      "Guardá los cambios antes de salir del formulario y evita compartir credenciales o información privada de clientes con personas no autorizadas.",
  },
];

const estiloTarjeta = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
};

export default function Manual() {
  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "8px 0 40px",
        color: "#0f172a",
        fontFamily: "Inter, system-ui, sans-serif",
        lineHeight: 1.65,
      }}
    >
      <header style={{ marginBottom: "28px" }}>
        <p
          style={{
            margin: "0 0 8px",
            color: "#2563eb",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Centro de ayuda
        </p>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(28px, 4vw, 38px)",
            lineHeight: 1.15,
            letterSpacing: "-0.04em",
            fontWeight: 800,
          }}
        >
          Manual de administración
        </h1>
        <p style={{ margin: "12px 0 0", color: "#64748b", fontSize: "15px", maxWidth: "760px" }}>
          Guía práctica para configurar los cobros, mantener el catálogo, actualizar el contenido
          de la tienda y gestionar las compras desde el panel.
        </p>
      </header>

      <nav
        aria-label="Índice del manual"
        style={{
          ...estiloTarjeta,
          marginBottom: "20px",
          background: "#f8fafc",
          boxShadow: "none",
        }}
      >
        <h2 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: 750 }}>En esta guía</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {secciones.map((seccion) => (
            <a
              key={seccion.id}
              href={`#${seccion.id}`}
              style={{
                padding: "7px 10px",
                border: "1px solid #e2e8f0",
                borderRadius: "999px",
                background: "#ffffff",
                color: "#334155",
                fontSize: "12px",
                fontWeight: 650,
                textDecoration: "none",
              }}
            >
              {seccion.titulo}
            </a>
          ))}
        </div>
      </nav>

      <div style={{ display: "grid", gap: "16px" }}>
        {secciones.map((seccion) => (
          <section
            id={seccion.id}
            key={seccion.id}
            style={estiloTarjeta}
            aria-labelledby={`${seccion.id}-titulo`}
          >
            <h2
              id={`${seccion.id}-titulo`}
              style={{
                margin: "0 0 10px",
                fontSize: "20px",
                lineHeight: 1.3,
                fontWeight: 780,
                letterSpacing: "-0.02em",
              }}
            >
              {seccion.titulo}
            </h2>
            <p style={{ margin: "0 0 14px", color: "#475569", fontSize: "14px" }}>
              {seccion.introduccion}
            </p>
            <ol style={{ margin: "0 0 16px", paddingLeft: "22px", color: "#334155", fontSize: "14px" }}>
              {seccion.puntos.map((punto) => (
                <li key={punto} style={{ paddingLeft: "4px", marginBottom: "9px" }}>
                  {punto}
                </li>
              ))}
            </ol>
            <aside
              style={{
                padding: "12px 14px",
                borderLeft: "3px solid #3b82f6",
                borderRadius: "0 10px 10px 0",
                background: "#eff6ff",
                color: "#1e3a8a",
                fontSize: "13px",
              }}
            >
              <strong>Recomendación:</strong> {seccion.nota}
            </aside>
          </section>
        ))}
      </div>
    </main>
  );
}
