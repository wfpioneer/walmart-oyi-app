/* eslint max-len: 0 */
export default {
  GENERICS: {
    SAVE: 'Guardar',
    SIGN_IN: 'Registrarse',
    SIGN_OUT: 'Desconectarse',
    DONE: 'Hecho',
    START: 'Empezar',
    CONTINUE: 'Continuar',
    SEND: 'Enviar',
    DISMISS: 'Descartar',
    TRY_AGAIN: 'Vuelve a intentarlo',
    OK: 'Okay',
    ERROR: 'Error',
    NOT_STARTED: 'Sin comenzar',
    RESTART: 'Reiniciar',
    DELETE: 'Eliminar',
    CANCEL: 'Cancelar',
    SAVE_AND_DONE: 'Guardar y Salir',
    NOT_FOUND: 'No encontrado',
    BACK: 'Atrás',
    NEXT: 'Siguiente',
    EXIT: 'Salir',
    ALL: 'Todo',
    GET_STARTED: 'Empezar',
    ENTER_UPC_ITEM_NBR: 'Ingresa el UPC o Número de Artículo',
    INPUT_LOC: 'Entrada de Etiqueta de Ubicación.',
    CHANGE: 'Cambiar',
    SEE_ALL: 'Ver todo',
    ADD: 'Agregar',
    NOT_ASSIGNED: 'No asignado',
    UPDATED: 'Actualizar',
    DAILY: 'Diario',
    WEEKLY: 'Semanal',
    WEEK: 'Semana',
    TOTAL: 'Total',
    DEFAULT: 'Default',
    CLUB: 'Club',
    SUBMIT: 'Enviar',
    RETRY: 'Reintentar',
    GOAL: 'Objetivo',
    VERSION: 'Versión',
    BARCODE_SCAN_ERROR: 'Este formato de código de barras no es válido',
    ITEM: 'Artículo',
    ITEMS: 'Artículos',
    TOOLS: 'Herramientas'
  },
  HOME: {
    OWN_YOUR_INVENTORY: 'Aduéñate de tu inventario',
    WORKLIST_API_ERROR: 'Hubo un error al mostrar el resumen de las Listas de Trabajo. \nPor favor inténtalo de nuevo.',
    WELCOME: 'Bienvenido',
    HOME: 'Casa',
    STYLE_GUIDE: 'Guía de estilo',
    CHANGE_LANGUAGE: 'Cambiar idioma',
    ITEMS: 'Artículos',
    WORKLIST_GOAL_COMPLETE: '%{complete} de %{total} artículos'
  },
  EXCEPTION: {
    PO: 'Anulación de Precio',
    NIL_PICK: 'Nil Pick',
    PRICE_OVERRIDE: 'Anulación de Precio',
    NO_SALES: 'Sin Venta',
    NEGATIVE_ON_HANDS: 'Existencia Negativa',
    CANCELLED: 'Cancelados',
    NSFL: 'Sin Ubicación en Piso de Ventas',
    UNKNOWN: 'desconocida' // TODO needs spanish Translation
  },
  ITEM: {
    TITLE: 'Revisar detalles del Artículo',
    ITEM: 'Artículo',
    UPC: 'UPC',
    STATUS: 'Estatus',
    CATEGORY: 'Categoría',
    QUANTITY: 'Cantidad',
    ON_HANDS: 'Existencia',
    ON_ORDER: 'Ordenado',
    REPLENISHMENT: 'Resurtido',
    PENDING_MGR_APPROVAL: 'Pendiente de aprobación de gerente',
    LOCATION: 'Ubicación',
    TO_PICKLIST: ' a Lista de Pickeo',
    RESERVE_NEEDED: 'Ubicación en bodega necesaria para agregar a lista de pickeo',
    ADDED_TO_PICKLIST: 'Elemento agregado a la lista de Pickeo',
    ADDED_TO_PICKLIST_ERROR: 'El envío de la lista de Pickeo no se realizó correctamente. Inténtalo de nuevo.',
    ITEM_NOT_FOUND: 'No se encontró el elemento escaneado.',
    FLOOR: 'Piso',
    RESERVE: 'Bodega',
    SALES_METRICS: 'Ventas',
    AVG_SALES: 'Ventas Promedio',
    TOGGLE_GRAPH: 'Alternar gráfico',
    OH_UPDATE_ERROR: 'Por favor ingresa un número entre %{min} y %{max}',
    OH_UPDATE_API_ERROR: 'Hubo un error al actualizar la cantidad. Inténtalo de nuevo.',
    API_ERROR: 'Hubo un error al extraer los detalles del artículo. Inténtalo de nuevo.',
    SCAN_FOR_NO_ACTION: 'Finalizar sin cambios',
    USE_SCANNER_SCAN_FOR_NO_ACTION: 'Utilice el escáner de código de barras para escanear sin realizar ninguna acción',
    SCAN_DOESNT_MATCH: 'El escaneo no coincide',
    SCAN_DOESNT_MATCH_DETAILS: 'El elemento escaneado no coincide con el upc del elemento actual',
    NO_SIGN_PRINTED: 'Ningún cartel impreso',
    NO_SIGN_PRINTED_DETAILS: 'Artículo no completado porque nunca imprimiste un nuevo cartel',
    NO_FLOOR_LOCATION: 'Sin ubicación en el piso',
    NO_FLOOR_LOCATION_DETAILS: 'El artículo no se completó porque nunca agregó una ubicación en el piso',
    ACTION_COMPLETE_ERROR: 'Error completando la acción',
    ACTION_COMPLETE_ERROR_DETAILS: 'Hubo un error complentando la acción. Por favor inténtalo de nuevo.',
    WEEKLY_AVG_SALES: 'Ventas Semanales',
    SALES_FLOOR_QTY: 'Piso de Venta',
    RESERVE_QTY: 'Bodega',
    CLAIMS_QTY: 'Claims',
    CONSOLIDATED_QTY: 'Consol',
    FLY_CLOUD_QTY: 'Fly Cloud Qty', // Leaving This as is until MX has a need for Cloud Qty
    ERROR_SALES_HISTORY: 'Incapaz de mostrar el historial de ventas'
  },
  PRINT: {
    MAIN_TITLE: 'Imprimir Señalización',
    QUEUE_TITLE: 'Cola de Impresión',
    CHANGE_TITLE: 'Impresoras',
    LOCATION_TITLE: 'Imprimir Etiquetas de Ubicación',
    PRICE_SIGN: 'Imprimir la señalización',
    COPY_QTY: 'Número de Copias',
    COPIES: 'Copias',
    SIGN_SIZE: 'Tamaño de la señalización',
    FRONT_DESK: 'Impresora del mostrador',
    EMPTY_LIST: 'Nada en la cola de impresión',
    PRINT: 'Imprimir',
    PRINT_ALL: 'Imprimir todo',
    ADD_TO_QUEUE: 'Agregar a la lista de impresión',
    TOTAL_ITEMS: 'Atrículos totales',
    XSmall: 'Xchico',
    Small: 'Chico',
    Wine: 'Vino',
    Medium: 'Mediano',
    Large: 'Grande',
    PRINTER_LIST: 'Lista de impresoras',
    CHANGE_PRINTER: 'Cambiar impresora',
    MAC_ADDRESS: 'Ingrese o escanee la dirección MAC',
    MAC_ADDRESS_ERROR: 'La dirección MAC suele ser de 12 números',
    PORTABLE_PRINTER: 'Impresora portátil',
    PRINT_SERVICE_ERROR: 'Hubo un error al imprimir la señalización. \nPor favor inténtalo de nuevo.',
    PLEASE_CHOOSE_PORTABLE: 'Por favor elija impresora portátil',
    LOCATION_SUCCESS: 'Section Label Successfully Printed', // TODO Spanish translation
    DUPLICATE_PRINTER: 'Una impresora ya existe',
    SOME_PRINTS_FAILED: 'Algunos artículos fallaron al imprimirse'
  },
  LOCATION: {
    TITLE: 'Todas las Ubicaciones',
    FLOOR: 'Ubicación en Piso',
    RESERVE: 'Ubicaciones en Bodega',
    FLOORS: 'Piso',
    RESERVES: 'Bodega',
    ADD_LOCATION_API_ERROR: 'Hubo un error agregando la ubicación. \nPor favor inténtalo de nuevo.',
    EDIT_LOCATION_API_ERROR: 'Hubo en un error editando la ubicación. \nPor favor inténtalo de nuevo.',
    ADD_DUPLICATE_ERROR: 'La combinación de ubicación y el tipo, \nya existen.',
    EDIT_DUPLICATE_ERROR: 'La combinación de ubicación y el tipo, \nya existen.',
    MANUAL_ENTRY_BUTTON: 'Ingresa manualmente la ubicación.',
    SELECTION_INSTRUCTION: '1. Elija un tipo de ubicación.',
    SCAN_INSTRUCTION: 'Escanea la etiqueta de Ubicación.',
    DELETE_CONFIRMATION: 'Confirma la eliminación de \nla ubicación ',
    DELETE_LOCATION_API_ERROR: 'Hubo un error eliminando la ubicación. \nInténtalo de nuevo?',
    ADD_NEW_LOCATION: 'Agregar Nueva Ubicación',
    EDIT_LOCATION: 'Editar Ubicación',
    LOCATION_MANAGEMENT: 'Administración de Ubicaciones',
    ITEMS: 'Items', // TODO Spanish Translation
    PALLETS: 'Pallets', // TODO Spanish Translation
    PALLET: 'Pallet', // TODO Spanish Translation
    ZONES: 'Zonas',
    ZONE: 'Zona', // TODO Spanish Translation
    AISLES: 'Pasillos',
    AISLE: 'Pasillo',
    SECTIONS: 'Secciones',
    SECTION: 'Sección',
    AREAS: 'Areas', // TODO Spanish Translation
    LOCATION_DETAILS: 'Detalles de ubicación',
    NO_ZONES_AVAILABLE: 'No hay zonas disponibles',
    NO_AISLES_AVAILABLE: 'No hay pasillos disponibles',
    NO_SECTIONS_AVAILABLE: 'No Sections Available', // TODO Spanish Translation
    LOCATION_API_ERROR: 'Hubo un error agregando la ubicación. Por favor inténtalo de nuevo.',
    CLEAR_ALL: 'Limpiar',
    CLEAR_SECTION: 'Limpiar sección',
    REMOVE_SECTION: 'Eliminar sección',
    REMOVE_ZONE: 'Eliminar la zona',
    REMOVE_ALL: 'Remove all', // TODO Spanish Translation
    ADD: 'Agregar',
    SCAN_LOCATION: 'Nombre de ubicación invalida e.g: ABCD1-2',
    ADD_ZONE: 'Añadir zona',
    ADD_AISLES: 'Agregar pasillos',
    CREATED_ON: 'Creado en',
    MORE: 'Más',
    PRINT_SECTION: 'Imprimir todas las etiquetas de la sección',
    ADD_SECTIONS: 'Agregar secciones',
    CLEAR_AISLE: 'Limpiar pasillo',
    REMOVE_AISLE: 'Eliminar pasillo',
    SCAN_PALLET: 'Escanea la etiqueta del Pallet',
    PALLET_VALIDATE_ERROR: 'El Pallet ID solo puede contener números',
    PALLET_PLACEHOLDER: 'Ingresa o escanea un pallet ID',
    PRINT_LABEL: 'Imprimir etiqueta',
    PRINT_LABELS: 'Imprimir etiquetas',
    ADD_PALLET_ERROR: 'error al agregar el pallet',
    ADD_PALLET_API_ERROR: 'Hubo un error al agregar el pallet. Inténtar de nuevo',
    PALLET_ERROR: 'Pallet no encontrada/Pallet vacía',
    PALLET_NOT_FOUND: 'Hubo un error debido a que no se encontró el pallet/Pallet vacía',
    PALLET_ADDED: 'Pallet agregado con éxito',
    PALLET_DELETE_CONFIRMATION: 'Confirmar: Borrar pallet',
    FLOOR_EMPTY: 'La lista de Piso está vacía',
    RESERVE_EMPTY: 'La lista de Bodega está vacía',
    GET_FAILED_PALLETS: 'No se pudieron recuperar %{amount} Pallet(s)',
    AISLES_ADDED: '{number} pasillos agregados',
    INCOMPLETE_AISLES_ADDED: 'No todos los pasillos/secciones se crearon. Sólo {number} pasillos/secciones se agregaron',
    INCOMPLETE_AISLES_PLEASE_CHECK: 'Por favor revisa la lista de pasillos y secciones que se crearon',
    ADD_AISLES_ERROR: 'Hubo un error agregando pasillos/secciones. Por favor inténtalo de nuevo',
    SECTION_NOT_FOUND: 'La sección escaneada no se encontró',
    EDIT_ITEM: 'Editar Artículo',
    REMOVE_ITEM: 'Borrar Artículo',
    PRINT_LABEL_EXISTS_HEADER: 'Esta etiqueta ya se mandó a imprimir',
    PRINT_LABEL_EXISTS: 'Esta etiqueta ya existe en la cola de impresión',
    SECTIONS_ADDED: '%{number} secciones agregadas',
    ADD_SECTIONS_ERROR: 'Hubo un error agregando las secciones. Por favor inténtalo de nuevo',
    ZONE_ADDED: 'Zona %{name} agregada',
    ADD_ZONE_ERROR: 'Hubo un error agregando la zona. Por favor inténtalo de nuevo',
    INCOMPLETE_ZONE_ADDED: 'Zona %{name} agregada, pero no todos los pasillos y secciones se crearon. Por favor revisa la lista de los que si se crearon',
    REMOVE_ZONE_CONFIRMATION: '¿Estas seguro que quieres eliminar esta zona?',
    REMOVE_ZONE_WILL_REMOVE_AISLES_SECTIONS: 'Esto eliminará todos los pasillos y secciones asociados',
    REMOVE_ZONE_FAIL: 'Hubo un error eliminando la zona. Por favor inténtalo de nuevo',
    DELETE_ITEM: 'Borrar %{itemNbr} \n%{itemName}',
    ERROR_DELETE_ITEM: 'Hubo un error borrando el artículo. Por favor inténtalo de nuevo',
    UPC_VALIDATE_ERROR: 'El UPC solo puede contener números',
    SCAN_ITEM: 'Escanear artículo',
    ITEM_ADDED: 'Artículo agregado correctamente',
    ADD_ITEM_ERROR: 'Error agregando artículo',
    ADD_ITEM_API_ERROR: 'Hubo un error agregando el artículo. \nPor favor Inténtalo de nuevo',
    CLEAR_SECTION_CONFIRMATION: '¿Estas seguro de que quieres limpiar la sección?',
    CLEAR_SECTION_SALES_FLOOR_MESSAGE: 'Esto eliminará los artículos en Piso de esta sección',
    CLEAR_SECTION_RESERVE_MESSAGE: 'Esto eliminará los pallets en bodega de esta sección',
    CLEAR_SECTION_WONT_DELETE: 'Esto no eliminará la sección',
    CLEAR_SECTION_SALES_FLOOR_SUCCEED: 'Todos los artículos del piso fueron limpiados correctamente',
    CLEAR_SECTION_RESERVE_SUCCEED: 'Todos los pallets de la bodega fueron limpiados correctamente',
    CLEAR_SECTION_FAIL: 'Hubo un error eliminando la sección. Por favor inténtalo de nuevo',
    REMOVE_AISLE_CONFIRMATION: '¿Estás seguro que quieres eliminar el pasillo?',
    REMOVE_AISLE_WILL_REMOVE_SECTIONS: 'Esto eliminará todas las secciones asociadas',
    REMOVE_AISLE_FAIL: 'Hubo un error eliminando el pasillo. Por favor inténtalo de nuevo',
    AISLE_REMOVED: 'Pasillo eliminado correctamente',
    REMOVE_SECTION_CONFIRMATION: '¿Estas seguro que quieres borrar la sección %{sectionName}?',
    REMOVE_SECTION_FAIL: 'Hubo un error eliminando la sección. Por favor inténtalo de nuevo',
    SECTION_REMOVED: 'Sección eliminada correctamente',
    ZONE_NAME_ERROR: 'There was an error retrieving the possible zone names. \nPlease try again.', // TODO spanish translation
    SELECT_ZONE: 'Selecciona la Zona',
    CLEAR_AISLE_ITEMS_CONFIRMATION: '¿Estás seguro que quieres limpiar todos los artículos del pasillo?',
    CLEAR_AISLE_ITEMS_CHOOSE_SF_OR_RESERVE: 'Por favor selecciona Piso, bodega o ambos para limpiar',
    CLEAR_AISLE_ITEMS_WONT_DELETE: 'Esto no eliminará las secciones del pasillo',
    CLEAR_AISLE_ITEMS_SUCCEED: 'Todos los artículos seleccionados fueron limpiados del pasillo',
    CLEAR_AISLE_ITEMS_FAIL: 'Hubo un error limpiando artículos del pasillo. Por favor inténtalo de nuevo'
  },
  WORKLIST: {
    WORKLIST: 'Lista de Trabajo',
    CATEGORY: 'Categoría',
    EXCEPTION_TYPE: 'Tipo de Excepción',
    ALL: 'Todo',
    REFINE: 'Refinar',
    CLEAR: 'Limpiar',
    TODO: 'Que hacer',
    COMPLETED: 'Terminado',
    WORKLIST_ITEM_API_ERROR: 'Hubo un error al recuperar los artículos de la lista de trabajo. \nPor favor inténtalo de nuevo'
  },
  SELECTLOCATIONTYPE: {
    TITLE: 'Seleccione el tipo de ubicación',
    FLOOR: 'Piso',
    ENDCAP: 'Cabecera',
    POD: 'POD',
    DISPLAY: 'Exhibición',
    RESERVE: 'Reserva'
  },
  APPROVAL: {
    NEW_QUANTITY: 'Nueva Cantidad',
    CURRENT_QUANTITY: 'Cantidad Actual',
    DAYS_LEFT: '%{time} día(s) restantes',
    APPROVALS: 'Aprobaciones',
    APPROVE_ITEMS: 'Aprobar artículos',
    OH_CHANGE: 'Cambio de Existencia',
    SELECT_ALL: 'Seleccionar Todo',
    DESELECT_ALL: 'Deseleccionar Todo',
    SELECTED: 'Seleccionado',
    APPROVAL_API_ERROR: 'Hubo un problema  al recuperar la lista de aprobación.\nPor favor inténtalo de nuevo',
    APPROVE: 'Aprobar',
    REJECT: 'Rechazar',
    GO_BACK: 'Ir atrás',
    CONFIRM: 'Confirmar',
    APPROVE_SUMMARY: 'Resumen de Aprobaciones',
    REJECT_SUMMARY: 'Resumen de Rechazos',
    INCREASES: 'Todos los incrementos',
    DECREASES: 'Todos los decrementos',
    REVIEW: 'Revisar cambios',
    LIST_NOT_FOUND: 'La lista de aprobación está vacía',
    UPDATE_APPROVED: 'Actualización de existencia aprobado',
    UPDATE_REJECTED: 'Actualización de existencia rechazado',
    FAILED_APPROVE: 'Las solicitudes fallaron al aprobarse',
    FAILED_ITEMS: 'Artículos Fallidos',
    UPDATE_API_ERROR: 'Hubo un error actualizando el estatus de aprobación. \nPor favor inténtalo de nuevo'
  },
  LOGIN: {
    CLUB_NBR_REQUIRED: 'Un número de club es necesario para ingresar a OYI',
    ENTER_CLUB_NBR: 'Ingresa número de club'
  }
};
