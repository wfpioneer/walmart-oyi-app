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
    TOOLS: 'Herramientas',
    OR: 'O',
    CURRENCY_SYMBOL: '$',
    UNDO: 'Deshacer',
    YES: 'Sí',
    NO: 'No',
    ENABLED: 'Activado',
    DISABLED: 'Desactivado',
    REQUIRED: 'Requerido',
    REMOVED: 'Removido',
    CREATE: 'Crear',
    UNASSIGNED: 'Sin asignar',
    SELECTED: 'Seleccionado',
    UPDATE: 'Actualizar Configuración',
    WARNING_LABEL: 'Aviso',
    CLOSE: 'Cerrar',
    NUMBER_MIN_MAX: 'El número debe estar entre %{minimum} y %{maximum}',
    FEEDBACK: 'Retroalimentación',
    UNSAVED_WARNING_MSG: 'Cambios no guardados se perderán'
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
    UNKNOWN: 'desconocida',
    MISSING_PALLETS: 'Pallets Faltantes',
    AUDITS: 'Auditorías',
    ROLLOVER_AUDITS: 'Auditorías Atrasadas',
    NEG_SALES_FLOOR_QTY: 'Negativos Piso'
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
    FLY_CLOUD_QTY: 'Cantidad Cloud', // Leaving This as is until MX has a need for Cloud Qty
    IN_TRANSIT_FLY_QTY: 'En Tránsito Cloud',
    ERROR_SALES_HISTORY: 'Incapaz de mostrar el historial de ventas',
    ITEM_NUMBER: 'Número de Artículo',
    OH_CHANGE_HISTORY: 'Historial de cambio de existencia',
    NO_OH_CHANGE_HISTORY: 'No hay cambios de existencia disponibles',
    ERROR_OH_CHANGE_HISTORY: 'Error obteniendo data',
    PICK_HISTORY: 'Historial de Picks',
    NO_PICK_HISTORY: 'No hay historial de Picks disponible',
    ERROR_PICK_HISTORY: 'Error obteniendo data',
    ADDITIONAL_ITEM_DETAILS: 'Detalles de artículo adicionales',
    VENDOR_PACK: 'Vendor Pack',
    COLOR: 'Color',
    SIZE: 'Tamaño',
    PRICE_BEFORE_TAX: 'Precio sin Impuesto',
    MARGIN: 'Margen',
    GROSS_PROFIT: 'Ganancia Bruta',
    HISTORY: 'Historial',
    NO_HISTORY: 'No hay historial disponible',
    RESERVE_ADJUSTMENT: 'Ajuste de Bodega',
    SAVE_MODAL: '¿Guardar los cambios de cantidad?',
    UPDATE_MULTI_PALLET_SUCCESS: 'Las cantidades por tarima se actualizaron',
    UPDATE_MULTI_PALLET_FAILURE: 'Incapaz de actualizar cantidades en pallet, por favor inténtalo de nuevo',
    ERROR_PI_DELIVERY_HISTORY: 'Hubo un error mostrando el historial de entregas. Por favor inténtalo de nuevo',
    ERROR_PI_SALES_HISTORY: 'Hubo un error mostrando el historial de ventas. Por favor inténtalo de nuevo',
    DELETE_PALLET_FAILURE: 'El borrado de pallet falló, por favor inténtalo de nuevo',
    RESERVE_CONFIRMATION: '¿Guardar Cambios de Pallet?',
    OTHER_ACTIONS: 'Otras Acciones',
    CLEAN_RESERVE: 'Limpiar Bodega',
    CHOOSE_ACTION: 'Elige la acción',
    DESIRED_ACTION: 'Competa el artículo ejecutando alguna de las acciones debajo:',
    CHOOSE_RESERVE: 'Realiza cambios a los pallets en bodega',
    CHOOSE_TOTAL_OH: 'Realiza un cambio de existencia',
    CHOOSE_PICKLIST: 'Crea un pick para reabastecer el piso',
    NO_ACTION_NEEDED: 'El artículo no requiere ninguna acción mencionada',
    REPLENISH_RESERVE: 'Por favor reabastece tu bodega para poder pickear el artículo',
    CANCEL_APPROVAL: 'Esta acción cancelará la acción pendiente actual, ¿Quieres continuar?',
    UNABLE_TO_CANCEL_APPROVAL: 'Incapaz de cancelar la aprobación en este momento, por favor ve con gerencia para que rechace este artículo'
  },
  PRINT: {
    MAIN_TITLE: 'Imprimir Señalización',
    QUEUE_TITLE: 'Cola de Impresión',
    CHANGE_TITLE: 'Impresoras',
    LOCATION_TITLE: 'Imprimir Etiquetas de Ubicación',
    PALLET_TITLE: 'Imprimir etiqueta de pallet',
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
    PRINTER_LIST_PRICE: 'Selecciona la impresora de señalización',
    PRINTER_LIST_LOCATION: 'Selecciona la impresora para ubicaciones',
    PRINTER_LIST_PALLET: 'Selecciona la impresora de etiquetas de pallet',
    CHANGE_PRINTER: 'Cambiar impresora',
    MAC_ADDRESS: 'Ingrese o escanee la dirección MAC',
    MAC_ADDRESS_ERROR: 'La dirección MAC suele ser de 12 números',
    PORTABLE_PRINTER: 'Impresora portátil',
    PRINT_SERVICE_ERROR: 'Hubo un error al imprimir la señalización. \nPor favor inténtalo de nuevo.',
    PLEASE_CHOOSE_PORTABLE: 'Por favor elija impresora portátil',
    LOCATION_SUCCESS: 'Etiqueta de sección impresa correctamente',
    PALLET_SUCCESS: 'Etiqueta de Pallet impresa correctamente',
    DUPLICATE_PRINTER: 'Una impresora ya existe',
    SOME_PRINTS_FAILED: 'Algunos artículos fallaron al imprimirse',
    PRICE_SIGN_PRINTER: 'Impresora de Señalización',
    LOCATION_LABEL_PRINTER: 'Impresora de etiquetas de ubicación',
    PALLET_LABEL_PRINTER: 'Impresora de etiquetas de pallet',
    LOCATION_PRINTING: 'Impresión de Ubicaciones',
    PRICE_SIGNS: 'Señalización Precios',
    LOCATIONS: 'Ubicaciones',
    PRICE_SIGN_SUCCESS: 'Señalización impresa correctamente',
    PRINTER_NOT_ASSIGNED: 'No impresoras asignadas',
    Was_Large: 'Promo - Grande',
    Was_Medium: 'Promo - Mediano',
    Was_Small: 'Promo - Chico',
    Was_XSmall: 'Promo - Xchico',
    INVALID_SIZE: 'Algunos artículos no se imprimirán debido a un tamaño inválido de señalización',
    CHOOSE_PRICE_SIGN: 'Imprime el precio del artículo'
  },
  PALLET: {
    PALLET_MANAGEMENT: 'Administración de Pallet',
    ENTER_PALLET_ID: 'Ingresa el Pallet ID',
    SCAN_PALLET: 'Escanea un pallet',
    PRINT_PALLET: 'Imprimir pallet',
    COMBINE_PALLETS: 'Combinar pallets',
    CLEAR_PALLET: 'Eliminar pallets',
    MANAGE_PALLET: 'Administrar Pallet',
    PALLET_ID: 'Pallet ID',
    EXPIRATION_DATE: 'Fecha de caducidad',
    SCAN_INSTRUCTIONS: 'Escanea el UPC para agregar artículos',
    ITEM_DELETE: '1 eliminación de artículo pendiente',
    X_ITEMS_DELETE: '%{nbrOfItems} eliminación de artículos pendientes',
    PALLET_DETAILS_ERROR: 'Error: incapaz de encontrar Pallet',
    PALLET_MERGE: 'será combinado con',
    CANNOT_HAVE_NEGATIVE_QTY: 'El artículo no puede teener cantidad negativa',
    ITEMS_DETAILS_EXIST: 'El artículo escaneado ya existe en el pallet',
    ITEMS_DETAILS_ERROR: 'Error. No es posible encontrar el UPC',
    ITEMS_NOT_FOUND: 'Item Not found', // TODO SPANISH TRANSLATION
    PALLET_UPC_NOT_FOUND: 'El pallet o un UPC no se encontraron',
    ADD_UPC_SUCCESS: 'Todos los artículos se agregaron satisfactoriamente al pallet',
    ADD_UPC_ERROR: 'Error agregando artículos al pallet',
    COMBINE_PALLET_SUCCESS: 'Pallets combinados con éxito',
    COMBINE_PALLET_FAILURE: 'Falló la combinación de pallets, por favor inténtalo de nuevo',
    PALLET_EXISTS: 'Este palles ya ha sido escaneado',
    PALLET_EXISTS_AS_TARGET: 'Este pallet ya es el pallet objetivo',
    PALLET_DOESNT_EXIST: 'El pallet escaneado no existe',
    SAVE_PALLET_SUCCESS: 'Pallet actualizado correctamente',
    SAVE_PALLET_PARTIAL: 'Pallet parcial actualizado correctamente',
    SAVE_PALLET_FAILURE: 'Falló la actualización de pallet',
    CLEAR_PALLET_CONFIRMATION: '¿Estás seguro que deseas limpiar el pallet?',
    CLEAR_PALLET_ERROR: 'Error limpiando el pallet',
    CLEAR_PALLET_SUCCESS: 'Pallet %{palletId} eliminado correctamente',
    CREATE_PALLET: 'Crear Pallet',
    CREATE_PALLET_SUCCESS: 'Pallet creado con éxito',
    CREATE_PALLET_FAILED: 'Falló la creación de pallet',
    DELETE_ONCE_MERGED: 'El pallet %{palletId} será eliminado una vez combinado'
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
    DELETE_LOCATION_API_SUCCESS: 'La ubicación %{locationName} ha sido eliminada con éxitoç',
    ADD_NEW_LOCATION: 'Agregar Nueva Ubicación',
    EDIT_LOCATION: 'Editar Ubicación',
    CHANGE_LOCATION: 'Actualiza la ubicación del artículo',
    LOCATION_MANAGEMENT: 'Administración de Ubicaciones',
    ITEMS: 'Artículos',
    PALLETS: 'Pallets',
    PALLET: 'Pallet',
    ZONES: 'Zonas',
    ZONE: 'Zona',
    AISLES: 'Pasillos',
    AISLE: 'Pasillo',
    SECTIONS: 'Secciones',
    SECTION: 'Sección',
    AREAS: 'Áreas',
    LOCATION_DETAILS: 'Detalles de ubicación',
    NO_ZONES_AVAILABLE: 'No hay zonas disponibles',
    NO_AISLES_AVAILABLE: 'No hay pasillos disponibles',
    NO_SECTIONS_AVAILABLE: 'No hay Secciones disponibles',
    LOCATION_API_ERROR: 'Hubo un error agregando la ubicación. Por favor inténtalo de nuevo.',
    CLEAR_ALL: 'Limpiar',
    CLEAR_SECTION: 'Limpiar sección',
    REMOVE_SECTION: 'Eliminar sección',
    REMOVE_ZONE: 'Eliminar la zona',
    REMOVE_ALL: 'Remove all', // TODO Spanish Translation (unused)
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
    PALLET_DELETE_CONFIRMATION: '¿Estás seguro que quieres eliminar el Pallet %{pallet} de la Sección %{section}?',
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
    ZONE_NAME_ERROR: 'Hubo un error al extraer los nombres de zonas. \nPor favor inténtalo de nuevo',
    SELECT_ZONE: 'Selecciona la Zona',
    CLEAR_AISLE_ITEMS_CONFIRMATION: '¿Estás seguro que quieres limpiar todos los artículos del pasillo?',
    CLEAR_AISLE_ITEMS_CHOOSE_SF_OR_RESERVE: 'Por favor selecciona Piso, bodega o ambos para limpiar',
    CLEAR_AISLE_ITEMS_WONT_DELETE: 'Esto no eliminará las secciones del pasillo',
    CLEAR_AISLE_ITEMS_SUCCEED: 'Todos los artículos seleccionados fueron limpiados del pasillo',
    CLEAR_AISLE_ITEMS_FAIL: 'Hubo un error limpiando artículos del pasillo. Por favor inténtalo de nuevo',
    PALLET_MANAGEMENT: 'Administración de Pallet',
    LOCATION_MGMT_EDIT: 'Editar Administración de Pallet',
    SCAN_LOCATION_HEADER: 'Ubicación De Escaneo'
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
    PENDING: 'Pendiente',
    PENDING_APPROVAL: 'Pendiente de Aprobación',
    PENDING_PICK: 'Pickeo Pendiente',
    WORKLIST_ITEM_API_ERROR: 'Hubo un error al recuperar los artículos de la lista de trabajo. \nPor favor inténtalo de nuevo',
    AREA: 'Área',
    ITEM_WORKLIST: 'Lista De Articulos',
    PALLET_WORKLIST: 'Lista De Pallet',
    AUDIT_WORKLIST: 'Lista de trabajo de Auditorías',
    SCAN_PALLET: 'Escanea Pallet',
    SCAN_PALLET_LABEL: 'Escanea la etiqueta del pallet para continuar',
    SCAN_PALLET_ERROR: 'El pallet escaneado debe coincidir con el pallet de la lista',
    MISSING_PALLET_API_ERROR: 'Hubo un error reportando el pallet como faltante. Inténtalo de nuevo',
    MISSING_PALLET_CONFIRMATION: 'Quieres reportar este pallet como faltante?',
    MISSING_PALLET_API_SUCCESS: 'El pallet se agregó a la lista de Pallets Faltantes'
  },
  MISSING_PALLET_WORKLIST: {
    MISSING_PALLET_LABEL: 'Pallets Faltantes',
    PALLET_ID: 'Pallet ID',
    LAST_LOCATION: 'Última Ubicación',
    REPORTED_DATE: 'Fecha Reportada',
    REPORTED_BY: 'Reportado Por',
    ADD_LOCATION: 'Agregar Ubicación',
    DELETE_PALLET: 'Eliminar Pallet',
    DELETE_PALLET_CONFIRMATION: '¿Estás seguro que quieres eliminar el Pallet?'
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
    UPDATE_API_ERROR: 'Hubo un error actualizando el estatus de aprobación. \nPor favor inténtalo de nuevo',
    MANAGER_APPROVAL: 'Aprobación de Gerencia',
    APPROVAL_LOADING_MSG: 'Las aprobaciones de muchos artículos pueden llevar un momento, por favor espera',
    SOURCE: 'Fuente de aprovacíon'
  },
  LOGIN: {
    CLUB_NBR_REQUIRED: 'Un número de club es necesario para ingresar a OYI',
    ENTER_CLUB_NBR: 'Ingresa número de club'
  },
  PICKING: {
    PICKING: 'Pickeo',
    QUICKPICK: 'Pickeo Rápido',
    ASSIGNED: 'Asignado',
    CREATED_BY: 'Creado Por',
    CREATED: 'Creado',
    READY_TO_PICK: 'Listo para pickear',
    ACCEPTED_PICK: 'Pickeo aceptado',
    READY_TO_WORK: 'Listo para trabajar',
    READY_TO_BIN: 'Listo para ingresar a bodega',
    ACCEPTED_BIN: 'Ingreso a bodega aceptado',
    COMPLETE: 'Completado',
    DELETED: 'Borrado',
    NO_PALLETS_FOUND: 'No se encontraron pallets',
    ASSIGNED_TO_ME: 'Asignado a mi',
    PICK: 'Pick',
    WORK: 'Trabajar',
    BIN: 'Ingresar a Bodega',
    SCAN_ITEM_LABEL: 'Escanea el artículo para agregarlo a la lista de pickeos',
    SELECT_LOCATION: 'Elige una ubicación',
    NUMBER_PALLETS: 'Número de pallets',
    CREATE_PICK: 'Crear un Pick',
    CREATE_QUICK_PICK: 'Crear un Pick Rápido',
    MOVE_TO_FRONT: 'Llevar al frente',
    QUICK_PICK: 'Pickeo rápido',
    RESERVE_LOC: 'Ubicación de Bodega',
    FLOOR_LOC: 'Ubicación en Piso',
    FRONT: 'Frente',
    ACCEPT: 'Aceptar',
    RELEASE: 'Liberar',
    UPDATE_REMAINING_QTY: 'Actualiza la cantidad de cada artículo antes de continuar',
    REMAINING_QTY: 'Cantidad restante en pallet',
    REMOVE_PERISHABLE: 'Eliminando artículo con caducidad',
    REMOVE_PERISHABLE_NEW_EXPIRY: 'Por favor ingresa la nueva fecha de caducidad',
    PICKLIST_SUCCESS: 'Se obtuvo con éxito la lista de pickeos',
    PICKLIST_NOT_FOUND: 'No se encontró la lista de pickeos para este club',
    PICKLIST_ERROR: 'Hubo un error obteniendo la lista de pickeos',
    UPDATE_PICKLIST_STATUS_SUCCESS: 'Se actualizaron correctamente los estatus de pick',
    UPDATE_PICKLIST_STATUS_ERROR: 'Hubo un error al actualizar el estatus de pickeo',
    ITEM_QUANTITY_IS_MANDATORY_ERROR: 'El campo de cantidad abastecida debe llenarse',
    LOCATIONS_UPDATED: 'Ubicaciones actualizadas',
    LOCATIONS_FAILED_UPDATE: 'Falló la actualización de ubicaciones',
    SELECT_CONTINUE_ACTION: 'Seleccionar acción para continuar',
    PALLET_NOT_FOUND: 'Pallet no encontrado',
    CREATE_NEW_PICK_SUCCESS: 'Pick creado',
    CREATE_NEW_PICK_FAILURE: 'Hubo un error creando el pick',
    PICK_REQUEST_CRITERIA_ALREADY_MET: 'No hay suficientes pallets disponibles para este pick',
    NEW_PICK_ADDED_TO_PICKLIST: 'La solicitud de pick se ha agregado a la lista',
    NEW_PICK_ADDED_TO_PICKLIST_PLURAL: 'Las solicitudes de picks se han agregado a la lista',
    NO_PALLETS_AVAILABLE_PICK_DELETED: 'El pallet no está disponible. La solicitud ha sido rechazada',
    UPDATE_PICK_FAILED_TRY_AGAIN: 'Falló la actualización de pick. Por favor inténtalo de nuevo',
    UPDATE_PICK_FAILED_TRY_AGAIN_PLURAL: 'Falló la actualización de picks. Por favor inténtalo de nuevo',
    PICK_COMPLETED: 'El pick ha sido completado',
    PICK_COMPLETED_PLURAL: 'Se han completado los picks',
    PICKLIST_UPDATED: 'La lista de pickeos ha sido actualizada',
    PICK_COMPLETED_AND_PICKLIST_UPDATED: 'El pickeo se ha completado y la lista se ha actualizado',
    PICK_COMPLETED_AND_PICKLIST_UPDATED_PLURAL: 'Los pickeos se han completado y la lista se ha actualizado',
    NO_RESERVE_PALLET_AVAILABLE_ERROR: 'No hay pallet de reserva disponibles',
    ADDITIONAL_ITEMS: 'El pallet contiene artículos adicionales',
    QUANTITY_STOCKED: 'Cantidad abastecida',
    ACCEPT_MULTIPLE_BINS: 'Aceptar Múltiples ingresos a bodega',
    ACCEPT_MULTIPLE_PICKS: 'Aceptar Múltiples Pickeos',
    ACCEPT_FOLLOWING_PICKS: 'Aceptar los siguientes pickeos?',
    ACCEPT_FOLLOWING_BINS: 'Aceptar los siguientes ingresos a bodega?',
    LOC_LABEL: 'Ubi'
  },
  BINNING: {
    BINNING: 'Bodega',
    ASSIGN_LOCATION: 'Agrega la ubicación',
    SCAN_LOCATION: 'Escanea la ubicación para ingresar a bodega el pallet',
    SCAN_LOCATION_PLURAL: 'Escanea la ubicación para ingresar a bodega los pallets',
    SCAN_PALLET: 'Escanear el pallet para comenzar',
    SCAN_PALLET_BIN: 'Escanear pallet a contenedor',
    PALLET_BIN_SUCCESS: 'Pallets agrupados con éxito',
    PALLET_BIN_FAILURE: 'Agrupacion de Pallets ha fallado',
    PALLET_BIN_PARTIAL: 'No todos los pallets se agruparon, %{number} fallido',
    WARNING_LABEL: 'Aviso',
    WARNING_DESCRIPTION: 'Si navega afuera de esta pantalla los pallets ya escaneados no se agruparán',
    LAST_LOC: 'Última ubicación en bodega',
    FIRST_ITEM: 'Primer articulo',
    EMPTY_PALLET: 'Pallet vacía',
    PALLET_NOT_READY: 'No se puede ingresar a bodega. Ell pallet es parte de un pick activo',
    MULTIPLE_BIN_ENABLED: 'Habilitar Múltiple Ingreso a Bodega',
    SINGLE_BIN_ENABLED: 'Ingreso a bodega individual habilitado'
  },
  SETTINGS: {
    TITLE: 'Ajustes',
    FEATURE_UPDATE_SUCCESS: 'Funcionalidades actualizadas',
    FEATURE_UPDATE_FAILURE: 'Incapaz de obtener las funcionalidades actualizadas',
    FEATURES: 'Funcionalidades',
    AREA_FILTER: 'Filtros por Área '
  },
  AUDITS: {
    AUDITS: 'Auditorías',
    AUDIT_ITEM: 'Auditar Artículo',
    ROLLOVER_AUDITS: 'Auditorías Atrasadas',
    COLLAPSE_ALL: 'Colapsar todo',
    EXPAND_ALL: 'Expandir todo',
    VALIDATE_QUANTITY: 'Valida la cantidad en cada ubicación',
    VALIDATE_SCAN_QUANTITY: 'Escanea cada pallet y valida la cantidad',
    VALIDATE_SCAN_QUANTITY_WHEN_SCAN_DISABLED: 'Valida la cantidad por pallet',
    OTHER_ON_HANDS: 'Otras ubicaciones',
    PALLET_COUNT: 'Por favor ingresa el conteo del pallet',
    CONFIRM_AUDIT: 'Confirma el cambio de existencia',
    UPDATED_QTY: 'Cantidad actualizada',
    LARGE_CURRENCY_CHANGE: 'Cambio de cantidad elevada',
    NO_LOCATION_AVAILABLE: 'Sin Ubicación Disponible',
    SCAN_PALLET_ERROR: 'El pallet escaneado debe coincidir con el pallet asociado al artículo',
    COMPLETE_AUDIT_ITEM_SUCCESS: 'Auditoría completada correctamente',
    COMPLETE_AUDIT_ITEM_ERROR: 'No se pudo completar la auditoría. Inténtalo de nuevo',
    OPEN_AUDIT_LABEL: 'Abrir Auditoría',
    INVALID_EQUATION: 'Fórmula invalida, por favor verifica la operación',
    NO_PALLETS_FOUND_FOR_ITEM: 'No hay pallets encontrados para este artículo',
    NEGATIVE_VALIDATION: 'Resultado inválido. La cantidad debe ser 0 o mayor',
    ITEMS: 'Artículos',
    CUSTOM_ITEMS: 'Artículos',
    IN_PROGRESS: 'En Progreso',
    CURRENT_TOTAL: 'Total Actual',
    LOCATIONS_SAVED: 'Ubicaciones Guardadas',
    LOCATIONS_SAVE_FAIL: 'Incapaz de guardar ubicaciones',
    SCANNED_ITEM_NOT_PRESENT: 'El artículo escaneado no está en la lista de auditorías',
    GET_SAVED_LOC_FAIL: 'Incapaz de recuperar las ubicaciones guardadas'
  },
  FEEDBACK: {
    VERY_POOR_RATE_LABEL: 'Muy Malo',
    POOR_RATE_LABEL: 'Malo',
    AVERAGE_RATE_LABEL: 'Regular',
    GOOD_RATE_LABEL: 'Bueno',
    EXCELLENT_RATE_LABEL: 'Excelente',
    FEEDBACK_REQUEST: '¿Quieres proporcionar retroalimentación de OYI?',
    YES: 'Si',
    NO: 'No',
    RATING_LABEL: 'Elige una calificación',
    COMMENT_PLACEHOLDER_LABEL: 'Escribe algún comentario',
    SUBMIT_FEEDBACK_SUCCESS: 'La retroalimentación se ha enviado con éxito',
    SUBMIT_FEEDBACK_FAILURE: 'Incapaz de enviar retroalimentación. Por favor inténtalo de nuevo.'
  }
};
