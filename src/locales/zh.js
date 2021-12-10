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
    OK: 'Okay',
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
    TOOLS: '工具箱'
  },
  HOME: {
    OWN_YOUR_INVENTORY: '管理库存工具',
    WORKLIST_API_ERROR: '检索任务汇总清单错误，请重试',
    HOME: '主页',
    WELCOME: '欢迎',
    STYLE_GUIDE: '页面风格',
    CHANGE_LANGUAGE: '改变语言',
    ITEMS: '项目',
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
    UNKNOWN: '未知错误'
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
    ERROR_SALES_HISTORY: '无法获取历史销售'
  },
  PRINT: {
    MAIN_TITLE: '打印价签',
    QUEUE_TITLE: '打印清单',
    CHANGE_TITLE: '打印机',
    LOCATION_TITLE: '打印货架标签',
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
    CHANGE_PRINTER: '更换打印机',
    MAC_ADDRESS: '输入或扫描MAC地址',
    MAC_ADDRESS_ERROR: 'MAC地址通常是12个数字',
    PORTABLE_PRINTER: '便携式打印机',
    PRINT_SERVICE_ERROR: '打印标签时发生错误，请重试',
    PLEASE_CHOOSE_PORTABLE: '请选择便携式打印机',
    LOCATION_SUCCESS: 'Section Label Successfully Printed', // TODO Mandarin Translation
    DUPLICATE_PRINTER: '现存打印机'
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
    SCAN_INSTRUCTION: '\t扫描货架标签',
    EDIT_DUPLICATE_ERROR: '已有位置类型',
    EDIT_LOCATION_API_ERROR: '编辑位置报错，\n请重试',
    DELETE_CONFIRMATION: '确认删除位置 ',
    DELETE_LOCATION_API_ERROR: '删除位置报错，\n请重试',
    ADD_NEW_LOCATION: '新增位置',
    EDIT_LOCATION: '修改位置',
    LOCATION_MANAGEMENT: '通道管理',
    ITEMS: '多个商品',
    PALLETS: 'Pallets', // TODO Mandarin Translation
    PALLET: 'Pallet', // TODO Mandarin Translation
    ZONES: '区域',
    ZONE: 'Zone', // TODO Mandarin Translation
    AISLES: '通道',
    AISLE: 'Aisle', // TODO Mandarin Translation
    SECTIONS: '货架',
    SECTION: 'Section', // TODO Mandarin Translation
    AREAS: 'Areas',
    LOCATION_DETAILS: '具体位置',
    NO_ZONES_AVAILABLE: '无区域',
    NO_AISLES_AVAILABLE: '无通道',
    LOCATION_API_ERROR: 'There was an error pulling the location data.\nPlease try again.', // TODO Mandarin Translation
    CLEAR_ALL: '全部清除',
    CLEAR_SECTION: '清除此货架位置',
    REMOVE_SECTION: '移除此货架位置',
    REMOVE_ZONE: '移除此区域',
    REMOVE_ALL: 'Remove all', // TODO Mandarin Translation
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
    PALLET_DELETE_CONFIRMATION: '确认：删除卡板',
    FLOOR_EMPTY: '楼面清单无商品',
    RESERVE_EMPTY: '存储区域无卡板',
    GET_FAILED_PALLETS: '获取 %{amount} 卡板失败',
    SECTION_NOT_FOUND: 'The Scanned Section was not found.', // TODO Mandarin Translation
    EDIT_ITEM: '编辑商品',
    REMOVE_ITEM: '删除商品',
    PRINT_LABEL_EXISTS_HEADER: '打印既有标签',
    PRINT_LABEL_EXISTS: '此标签已经在打印清单中',
    SECTIONS_ADDED: '已添加 %{number} 个货架位置',
    ADD_SECTIONS_ERROR: '添加货架时错误，请重试.',
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
    WORKLIST_ITEM_API_ERROR: '检索任务清单时出错，请重试'
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
    UPDATE_API_ERROR: '更新审批状态时发生错误，\n请再试'
  },
  LOGIN: {
    CLUB_NBR_REQUIRED: '需店号开启OYI',
    ENTER_CLUB_NBR: '输入店号'
  }
};
