/* eslint max-len: 0 */
export default {
  GENERICS: {
    SAVE: '保存',
    SIGN_IN: '登录',
    SIGN_OUT: '退出',
    DONE: '完成',
    START: '开始',
    CONTINUE: '继续',
    SEND: '发送',
    DISMISS: '忽略',
    TRY_AGAIN: '再试一次',
    OK: 'OK',
    ERROR: '报错',
    NOT_STARTED: '尚未开始',
    RESTART: '重启',
    DELETE: '删除',
    CANCEL: '取消',
    SAVE_AND_DONE: '保存并完成',
    NOT_FOUND: '没找到',
    BACK: '返回',
    NEXT: '下一个',
    EXIT: '退出',
    ALL: '所有',
    GET_STARTED: '开始',
    ENTER_UPC_ITEM_NBR: '输入UPC或 商品号',
    INPUT_LOC: '录入位置标签',
    CHANGE: '更改',
    SEE_ALL: '查看全部',
    ADD: '增加',
    NOT_ASSIGNED: '没有分配',
    UPDATED: '更新',
    DAILY: '每日',
    WEEKLY: '每周',
    WEEK: '周',
    TOTAL: '总计',
    DEFAULT: '默认',
    CLUB: '会员店',
    SUBMIT: '递交',
    RETRY: '重试',
    GOAL: '目标',
    VERSION: '版本',
    BARCODE_SCAN_ERROR: '此条码类型有误',
    ITEM: '商品',
    ITEMS: '多个商品',
    TOOLS: '工具箱',
    OR: '要么',
    CURRENCY_SYMBOL: '¥',
    UNDO: '未处理',
    YES: '是',
    NO: '否',
    ENABLED: '激活',
    DISABLED: '不可用',
    REQUIRED: '适用',
    REMOVED: '移除',
    CREATE: '创建',
    UNASSIGNED: '未分配',
    SELECTED: '已选择',
    UPDATE: '更新配置',
    WARNING_LABEL: '警示'
  },
  HOME: {
    OWN_YOUR_INVENTORY: '管理库存工具',
    WORKLIST_API_ERROR: '检索任务汇总清单错误，请重试',
    HOME: '主页',
    WELCOME: '欢迎',
    STYLE_GUIDE: '页面风格',
    CHANGE_LANGUAGE: '改变语言',
    ITEMS: '商品例外',
    WORKLIST_GOAL_COMPLETE: '%{complete}的%{total}项目'
  },
  EXCEPTION: {
    PO: '价格替代报告',
    NIL_PICK: '未拣货成功清单',
    PRICE_OVERRIDE: '覆盖原价格',
    NO_SALES: '无销售清单',
    NEGATIVE_ON_HANDS: '负现货清单',
    CANCELLED: '取消状态商品清单',
    NSFL: '无楼面位置商品清单',
    UNKNOWN: '未知错误',
    MISSING_PALLETS: '不在储位卡板',
    AUDITS: '盘点',
    ROLLOVER_AUDITS: '上周遗留盘点清单'
  },
  ITEM: {
    TITLE: '查看商品明细',
    ITEM: '商品号',
    UPC: 'UPC',
    STATUS: '状态',
    CATEGORY: '品类',
    QUANTITY: '数量',
    ON_HANDS: '现货',
    ON_ORDER: '已订货',
    REPLENISHMENT: '补货',
    PENDING_MGR_APPROVAL: '待经理审批',
    LOCATION: '位置',
    TO_PICKLIST: '添加到补货清单',
    RESERVE_NEEDED: '高货架位置需要添加到补货清单',
    ADDED_TO_PICKLIST: '项目已添加到选择列表',
    ADDED_TO_PICKLIST_ERROR: '选择列表提交失败。 请再试一遍。',
    ITEM_NOT_FOUND: '找不到扫描的项目。',
    FLOOR: '楼面',
    RESERVE: '高货架',
    SALES_METRICS: '销售',
    AVG_SALES: '平均销售',
    TOGGLE_GRAPH: '切换图',
    OH_UPDATE_ERROR: '输入数字(%{min}-%{max})',
    OH_UPDATE_API_ERROR: '更新数量时出错。 请再试一遍。',
    API_ERROR: '提取商品详细信息时出错。 请再试一遍。',
    SCAN_FOR_NO_ACTION: '扫描无动作',
    USE_SCANNER_SCAN_FOR_NO_ACTION: '使用条形码扫描仪进行任何扫描',
    SCAN_DOESNT_MATCH: '扫描不匹配',
    SCAN_DOESNT_MATCH_DETAILS: '扫描的项目与当前项目的upc不匹配',
    NO_SIGN_PRINTED: '没有印制标志',
    NO_SIGN_PRINTED_DETAILS: '项目未完成，因为您从未打印过新标志',
    NO_FLOOR_LOCATION: '没有楼层位置',
    NO_FLOOR_LOCATION_DETAILS: '项目未完成，因为您从未添加楼层位置',
    ACTION_COMPLETE_ERROR: '系统错误',
    ACTION_COMPLETE_ERROR_DETAILS: '系统处理请求错误，请再试一次。',
    WEEKLY_AVG_SALES: '每周平均销售',
    SALES_FLOOR_QTY: '楼面库存',
    RESERVE_QTY: '高货架库存',
    CLAIMS_QTY: '索赔库存',
    CONSOLIDATED_QTY: '临时外仓',
    FLY_CLOUD_QTY: '云仓库存',
    IN_TRANSIT_FLY_QTY: '云仓转运量',
    ERROR_SALES_HISTORY: '无法获取历史销售',
    ITEM_NUMBER: '商品号',
    OH_CHANGE_HISTORY: '现货变更历史记录',
    NO_OH_CHANGE_HISTORY: '无历史库存信息可获取',
    ERROR_OH_CHANGE_HISTORY: '重置数据出错',
    PICK_HISTORY: '历史补货清单',
    NO_PICK_HISTORY: '无补货历史记录',
    ERROR_PICK_HISTORY: '重置数据出错',
    ADDITIONAL_ITEM_DETAILS: '其它商品信息',
    VENDOR_PACK: '供应商包装',
    SIZE: '整版库存量',
    COLOR: 'Ti-Hi',
    PRICE_BEFORE_TAX: '税前零售',
    MARGIN: '利润',
    GROSS_PROFIT: '毛利',
    HISTORY: '历史信息',
    NO_HISTORY: '无历史记录信息'
  },
  PRINT: {
    MAIN_TITLE: '打印价签',
    QUEUE_TITLE: '打印清单',
    CHANGE_TITLE: '打印机',
    LOCATION_TITLE: '打印货架标签',
    PALLET_TITLE: '打印卡板标签',
    PRICE_SIGN: '打印价签',
    COPY_QTY: '副本数量',
    COPIES: '副本',
    SIGN_SIZE: '价签尺寸',
    FRONT_DESK: '前台打印机',
    EMPTY_LIST: '打印清单为空',
    PRINT: '打印',
    PRINT_ALL: '打印所有',
    ADD_TO_QUEUE: '添加到打印列表',
    TOTAL_ITEMS: '所有商品',
    XSmall: '加小标签',
    Small: '小标签',
    Wine: '红酒价签',
    Medium: '中标签',
    Large: '大标签',
    PRINTER_LIST: '打印机清单',
    PRINTER_LIST_PRICE: '选择商品价签打印',
    PRINTER_LIST_LOCATION: '选择货架标签打印',
    PRINTER_LIST_PALLET: '选择卡板标签打印',
    CHANGE_PRINTER: '更换打印机',
    MAC_ADDRESS: '输入或扫描MAC地址',
    MAC_ADDRESS_ERROR: 'MAC地址通常是12个数字',
    PORTABLE_PRINTER: '便携式打印机',
    PRINT_SERVICE_ERROR: '打印标签时发生错误，请重试',
    PLEASE_CHOOSE_PORTABLE: '请选择便携式打印机',
    LOCATION_SUCCESS: '货架标签打印成功',
    PALLET_SUCCESS: '卡板标签打印成功',
    DUPLICATE_PRINTER: '现存打印机',
    SOME_PRINTS_FAILED: '有些商品打印失败',
    PRICE_SIGN_PRINTER: '价格标签打印机',
    LOCATION_LABEL_PRINTER: '货架标签打印机',
    PALLET_LABEL_PRINTER: '卡板标签打印机',
    LOCATION_PRINTING: '正在打印货架标签',
    PRICE_SIGNS: '价格标签',
    LOCATIONS: '位置',
    PRICE_SIGN_SUCCESS: '价格标签打印成功',
    PRINTER_NOT_ASSIGNED: '未分配打印机'
  },
  PALLET: {
    PALLET_MANAGEMENT: '卡板管理',
    ENTER_PALLET_ID: '输入卡板ID',
    SCAN_PALLET: '扫描卡板标签',
    PRINT_PALLET: '打印卡板',
    COMBINE_PALLETS: '合并卡板',
    CLEAR_PALLET: '清空卡板信息',
    MANAGE_PALLET: '管理卡板',
    PALLET_ID: '卡板号',
    EXPIRATION_DATE: '到期日',
    SCAN_INSTRUCTIONS: '扫描UPC添加商品',
    ITEM_DELETE: '1个商品待删除',
    X_ITEMS_DELETE: '%{nbrOfItems} 商品待删除',
    PALLET_DETAILS_ERROR: '报错：无法找到卡板',
    PALLET_MERGE: '将合并到',
    CANNOT_HAVE_NEGATIVE_QTY: '商品库存不可是负',
    ITEMS_DETAILS_EXIST: '扫描的商品已经在此卡板',
    ITEMS_DETAILS_ERROR: '报错:无法找到此商品UPC信息',
    PALLET_UPC_NOT_FOUND: '未找到卡板或者UPC',
    ADD_UPC_SUCCESS: '所有商品成功添加到卡板',
    ADD_UPC_ERROR: '添加商品到卡板时出错',
    COMBINE_PALLET_SUCCESS: '卡板合并成功',
    COMBINE_PALLET_FAILURE: '卡板合并失败，请重试',
    PALLET_EXISTS: '已经扫描到此卡板',
    PALLET_EXISTS_AS_TARGET: '此卡板是目标卡板',
    PALLET_DOESNT_EXIST: '扫描卡板不存在',
    SAVE_PALLET_SUCCESS: '卡板更新成功',
    SAVE_PALLET_PARTIAL: '部分卡板更新成功',
    SAVE_PALLET_FAILURE: '卡板更新失败',
    CLEAR_PALLET_CONFIRMATION: '确定要清除此卡板信息?',
    CLEAR_PALLET_ERROR: '清除卡板信息发生错误导致失败',
    CLEAR_PALLET_SUCCESS: '卡板%{palletId}清理成功',
    UNSAVED_WARNING_MSG: '未保存的卡板补货信息将丢失',
    CREATE_PALLET: '创建卡板',
    CREATE_PALLET_SUCCESS: '卡板创建成功',
    CREATE_PALLET_FAILED: '卡板创建失败'
  },
  LOCATION: {
    TITLE: '所有位置',
    FLOOR: '楼面位置',
    RESERVE: '高货架位置',
    FLOORS: '楼面',
    RESERVES: '高货架',
    ADD_LOCATION_API_ERROR: '添加位置出错，\n请重试',
    ADD_DUPLICATE_ERROR: '位置和对应类型已经存在',
    MANUAL_ENTRY_BUTTON: '手工添加位置',
    SELECTION_INSTRUCTION: '\t选择位置类型',
    SCAN_INSTRUCTION: '扫描货架标签',
    EDIT_DUPLICATE_ERROR: '已有位置类型',
    EDIT_LOCATION_API_ERROR: '编辑位置报错，\n请重试',
    DELETE_CONFIRMATION: '确认删除位置 ',
    DELETE_LOCATION_API_ERROR: '删除位置报错，\n请重试',
    ADD_NEW_LOCATION: '新增位置',
    EDIT_LOCATION: '修改位置',
    LOCATION_MANAGEMENT: '通道管理',
    ITEMS: '多个商品',
    PALLETS: '卡板例外',
    PALLET: '卡板',
    ZONES: '区域',
    ZONE: '区域',
    AISLES: '通道',
    AISLE: '通道',
    SECTIONS: '货架',
    SECTION: '货架',
    AREAS: '区域',
    LOCATION_DETAILS: '具体位置',
    NO_ZONES_AVAILABLE: '无区域',
    NO_AISLES_AVAILABLE: '无通道',
    NO_SECTIONS_AVAILABLE: '无货架信息可获取',
    LOCATION_API_ERROR: '获取位置数据失败，\n请重试',
    CLEAR_ALL: '全部清除',
    CLEAR_SECTION: '清除此货架位置',
    REMOVE_SECTION: '移除此货架位置',
    REMOVE_ZONE: '移除此区域',
    REMOVE_ALL: 'Remove all',
    ADD: '增加',
    SCAN_LOCATION: '无效位置名，如A1-2',
    ADD_ZONE: '添加一个新区域',
    ADD_AISLES: '增加通道',
    CREATED_ON: '创建于',
    MORE: '更多',
    PRINT_SECTION: '打印所有已选货架标签',
    ADD_SECTIONS: '增加货架位置',
    CLEAR_AISLE: '清除通道',
    REMOVE_AISLE: '移除通道',
    SCAN_PALLET: '扫描卡板标签',
    PALLET_VALIDATE_ERROR: '卡板号只能是数字',
    PALLET_PLACEHOLDER: '输入或扫描卡板号',
    PRINT_LABEL: '打印标签',
    PRINT_LABELS: '打印标签',
    ADD_PALLET_ERROR: '添加卡板时出错',
    ADD_PALLET_API_ERROR: '错误添加卡板标签，请重试',
    PALLET_ERROR: '卡板未找到/空卡板',
    PALLET_NOT_FOUND: '因未找到卡板/卡板为空系统报错',
    PALLET_ADDED: '卡板添加成功',
    PALLET_DELETE_CONFIRMATION: '确定要从货架%{section}移除卡板 %{pallet}吗?',
    FLOOR_EMPTY: '楼面清单无商品',
    RESERVE_EMPTY: '存储区域无卡板',
    GET_FAILED_PALLETS: '获取 %{amount} 卡板失败',
    AISLES_ADDED: '通道号{number}已添加',
    INCOMPLETE_AISLES_ADDED:
      '创建通道/货架位置数量缺失，只创建了{number}通道/货架',
    INCOMPLETE_AISLES_PLEASE_CHECK: '请确认已创建的通道和货架清单',
    ADD_AISLES_ERROR: '添加通道/货架时出错,请再试一次。',
    SECTIONS_ADDED: '已添加 %{number} 个货架位置',
    ADD_SECTIONS_ERROR: '添加货架时错误，请重试.',
    EDIT_ITEM: '编辑商品',
    REMOVE_ITEM: '删除商品',
    SECTION_NOT_FOUND: '扫描的货架标签没收到',
    PRINT_LABEL_EXISTS_HEADER: '打印既有标签',
    PRINT_LABEL_EXISTS: '此标签已经在打印清单中',
    ZONE_ADDED: '区域 %{name} 已添加',
    ADD_ZONE_ERROR: '添加区域失败，请重试。',
    INCOMPLETE_ZONE_ADDED:
      '区域 %{name} 已添加， 但是仅部分通道/货架创建成功，请检查已创建的通道/货架清单',
    REMOVE_ZONE_CONFIRMATION: '确定移除此区域?',
    REMOVE_ZONE_WILL_REMOVE_AISLES_SECTIONS: '移除所有通道和此通道内的货架号',
    REMOVE_ZONE_FAIL: '移除此区域失败，请重试。',
    DELETE_ITEM: '删除%{itemNbr} \n%{itemName}',
    ERROR_DELETE_ITEM: '删除商品失败，请重试',
    UPC_VALIDATE_ERROR: 'UPC只能是数字',
    SCAN_ITEM: '扫描商品',
    ITEM_ADDED: '商品添加成功',
    ADD_ITEM_ERROR: '商品添加成功',
    ADD_ITEM_API_ERROR: '添加商品时出错，请重试',
    CLEAR_SECTION_CONFIRMATION: '确定清除此货架标签下所有内容？',
    CLEAR_SECTION_SALES_FLOOR_MESSAGE: '将清除此货架标签下所有楼面商品',
    CLEAR_SECTION_RESERVE_MESSAGE: '将清除此货架标签下所有卡板',
    CLEAR_SECTION_WONT_DELETE: '将不删除此货架标签',
    CLEAR_SECTION_SALES_FLOOR_SUCCEED: '此货架所有楼面商品都被清除',
    CLEAR_SECTION_RESERVE_SUCCEED: '此货架所有卡板信息都被清除',
    CLEAR_SECTION_FAIL: '清除货架标签信息时出错，请重试',
    REMOVE_AISLE_CONFIRMATION: '确定移除此通道？',
    REMOVE_AISLE_WILL_REMOVE_SECTIONS: '将移除此通道下所有货架标签信息',
    REMOVE_AISLE_FAIL: '移除通道时出错，请重试',
    AISLE_REMOVED: '通道移除成功',
    REMOVE_SECTION_CONFIRMATION: '确定删除此货架标签:%{sectionName}?',
    REMOVE_SECTION_FAIL: '移除货架号发生错误,请重试',
    SECTION_REMOVED: '货架移除成功',
    ZONE_NAME_ERROR: '重置区域名称出错，\n请重试',
    SELECT_ZONE: '选择区域',
    CLEAR_AISLE_ITEMS_CONFIRMATION: '确定要移除此通道所有商品吗？',
    CLEAR_AISLE_ITEMS_CHOOSE_SF_OR_RESERVE:
      '请选择楼面，高货架或者两个都选进行清除',
    CLEAR_AISLE_ITEMS_WONT_DELETE: '删除此通道的货架信息',
    CLEAR_AISLE_ITEMS_SUCCEED: '已清除此通道下所有选择的商品信息',
    CLEAR_AISLE_ITEMS_FAIL: '清除此通道下商品时出错，请重试',
    PALLET_MANAGEMENT: '卡板管理',
    LOCATION_MGMT_EDIT: '编辑位置管理',
    SCAN_LOCATION_HEADER: '扫描地点'
  },
  WORKLIST: {
    WORKLIST: '待办任务',
    CATEGORY: '品类',
    EXCEPTION_TYPE: '例外类型',
    ALL: '全部',
    REFINE: '更新',
    CLEAR: '清除',
    TODO: '待完成',
    COMPLETED: '已完成',
    WORKLIST_ITEM_API_ERROR: '检索任务清单时出错，请重试',
    AREA: '区域',
    ITEM_WORKLIST: '商品例外清单',
    PALLET_WORKLIST: '卡板例外清单',
    AUDIT_WORKLIST: '盘点任务清单',
    SCAN_PALLET: '扫描卡板',
    SCAN_PALLET_LABEL: '扫描卡板标签继续操作',
    SCAN_PALLET_ERROR: '扫描的卡板标签必须和任务清单的匹配'
  },
  MISSING_PALLET_WORKLIST: {
    MISSING_PALLET_LABEL: '不在货架位卡板',
    PALLET_ID: '卡板号',
    LAST_LOCATION: '原位置',
    REPORTED_DATE: '报告日期',
    REPORTED_BY: '报告人',
    ADD_LOCATION: '添加位置',
    DELETE_PALLET: '删除卡板',
    DELETE_PALLET_CONFIRMATION: '确定要删除此卡板吗?'
  },
  SELECTLOCATIONTYPE: {
    TITLE: '选择位置类型',
    FLOOR: '边柜',
    ENDCAP: '端头',
    POD: '堆头',
    DISPLAY: '橱窗',
    RESERVE: '库存'
  },
  APPROVAL: {
    NEW_QUANTITY: '新更改数量',
    CURRENT_QUANTITY: '当前库存数量',
    DAYS_LEFT: '剩余%{time}天',
    APPROVALS: '审批',
    APPROVE_ITEMS: '审批商品清单',
    OH_CHANGE: '库存调整',
    SELECT_ALL: '选择全部',
    DESELECT_ALL: '取消选择',
    SELECTED: '已选择',
    APPROVAL_API_ERROR: '检索审批列表出错, \n请重试',
    APPROVE: '审批',
    REJECT: '拒绝',
    GO_BACK: '返回',
    CONFIRM: '确认',
    APPROVE_SUMMARY: '审批汇总',
    REJECT_SUMMARY: '拒绝汇总',
    INCREASES: '增加总量',
    DECREASES: '减少总量',
    REVIEW: '浏览变化',
    LIST_NOT_FOUND: '无审批清单',
    UPDATE_APPROVED: '审批现货变更',
    UPDATE_REJECTED: '拒绝现货变更',
    FAILED_APPROVE: '审批未成功',
    FAILED_ITEMS: '此商品未成功审批',
    UPDATE_API_ERROR: '更新审批状态时发生错误，\n请再试',
    MANAGER_APPROVAL: '副总审批'
  },
  LOGIN: {
    CLUB_NBR_REQUIRED: '需店号开启OYI',
    ENTER_CLUB_NBR: '输入店号'
  },
  PICKING: {
    PICKING: '楼面补货',
    QUICKPICK: '快速拣货',
    ASSIGNED: '已分配',
    CREATED_BY: '创建者',
    CREATED: '已创建',
    READY_TO_PICK: '开始补货',
    ACCEPTED_PICK: '已接受补货任务',
    READY_TO_WORK: '开始运行',
    READY_TO_BIN: '准备上架',
    ACCEPTED_BIN: '已接受上架任务',
    COMPLETE: '完成',
    DELETED: '删除',
    NO_PALLETS_FOUND: '未发现卡板',
    ASSIGNED_TO_ME: '分配给我',
    PICK: '拣货',
    WORK: '工作状态',
    BIN: '上架',
    SCAN_ITEM_LABEL: '扫描商品添加到补货清单',
    SELECT_LOCATION: '选择货架位置',
    NUMBER_PALLETS: '卡板数量',
    CREATE_PICK: '创建补货',
    CREATE_QUICK_PICK: '创建快速补货',
    MOVE_TO_FRONT: '移到最前',
    QUICK_PICK: '快速拣货',
    RESERVE_LOC: '高货架位置',
    FLOOR_LOC: '楼面位置',
    FRONT: '靠前',
    ACCEPT: '接收',
    RELEASE: '释放',
    UPDATE_REMAINING_QTY: '继续之前请更新卡板剩余商品的数量',
    REMAINING_QTY: '卡板剩余数量',
    REMOVE_PERISHABLE: '移除易腐商品',
    REMOVE_PERISHABLE_NEW_EXPIRY: '请录入新到期日',
    PICKLIST_SUCCESS: '补货清单重置成功',
    PICKLIST_NOT_FOUND: '此门店无补货清单',
    PICKLIST_ERROR: '重置补货清单时报错',
    UPDATE_PICKLIST_STATUS_SUCCESS: '补货清单状态更新成功',
    UPDATE_PICKLIST_STATUS_ERROR: '更新补货清单时出错',
    ITEM_QUANTITY_IS_MANDATORY_ERROR: '楼面需陈列数量已更新',
    LOCATIONS_UPDATED: '位置已更新',
    LOCATIONS_FAILED_UPDATE: '位置更新失败',
    SELECT_CONTINUE_ACTION: '选择任务继续',
    PALLET_NOT_FOUND: '未找到卡板',
    CREATE_NEW_PICK_SUCCESS: '补货已创建',
    CREATE_NEW_PICK_FAILURE: '创建补货时报错',
    PICK_REQUEST_CRITERIA_ALREADY_MET: '无足够的卡板可供提取',
    NEW_PICK_ADDED_TO_PICKLIST: '一个补货需求已经添加到补货清单',
    NEW_PICK_ADDED_TO_PICKLIST_PLURAL: '多个补货需求已经添加到补货清单',
    NO_PALLETS_AVAILABLE_PICK_DELETED: '无法获取卡板，补货需求已被删除',
    UPDATE_PICK_FAILED_TRY_AGAIN: '补货更新失败，请重试',
    UPDATE_PICK_FAILED_TRY_AGAIN_PLURAL: '补货更新失败，请重试',
    PICK_COMPLETED: '补货已完成',
    PICK_COMPLETED_PLURAL: '补货已完成',
    PICKLIST_UPDATED: '补货清单已更新',
    PICK_COMPLETED_AND_PICKLIST_UPDATED: '已完成一个补货，补货清单已更新',
    PICK_COMPLETED_AND_PICKLIST_UPDATED_PLURAL:
      '已完成多个补货，补货清单已更新',
    NO_RESERVE_PALLET_AVAILABLE_ERROR: '高货架无卡板可取',
    ADDITIONAL_ITEMS: '卡板有其它商品',
    QUANTITY_STOCKED: '楼面陈列数量'
  },
  BINNING: {
    BINNING: '上架',
    ASSIGN_LOCATION: '分配货架位置',
    WARNING_LABEL: '警示',
    WARNING_DESCRIPTION:
      '如果你离开此屏幕，已经扫描的卡板将不会被维护在此高货架位置',
    SCAN_LOCATION: '扫描货架号进行单卡板上架操作',
    SCAN_LOCATION_PLURAL: '扫描货架号进行多卡板上架操作',
    SCAN_PALLET: '扫描卡板号开始上架',
    SCAN_PALLET_BIN: '扫描卡板号进行上架',
    PALLET_BIN_SUCCESS: '卡板上架成功',
    PALLET_BIN_FAILURE: '卡板上架失败',
    PALLET_BIN_PARTIAL: '部分卡板上架成功，%{number} 失败',
    LAST_LOC: '上一个位置',
    FIRST_ITEM: '第一个item',
    EMPTY_PALLET: '空卡板',
    PALLET_NOT_READY: '尚不可上架，部分卡板正处于补货状态'
  },
  SETTINGS: {
    TITLE: '设置',
    FEATURE_UPDATE_SUCCESS: '系统功能已更新',
    FEATURE_UPDATE_FAILURE: '无法获取已更新的系统功能',
    FEATURES: '功能模块',
    AREA_FILTER: '区域筛选'
  },
  AUDITS: {
    AUDIT_ITEM: '盘点商品'
  }
};
