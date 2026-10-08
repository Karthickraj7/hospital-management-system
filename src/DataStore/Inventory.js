const initstate = {
  MedicalProductMaster: {},
  SupplierMasterStore: {},
  PurchaseOrderList: {},
  GoodsReceiptNoteList: {},
  GoodsReceiptNoteEdit: {},
  OldGoodsReceiptNote: {},
  IndentEditData: {},
  Supplierpaydata: {},
  SerialNoData: {},
  MinimumMaximumData: {},
  PurchaseReturnList: {},
  StockEvaluationSingleItem: {},
};

const Inventory = (state = initstate, action) => {
  switch (action.type) {
    case 'MedicalProductMaster':
      return { ...state, MedicalProductMaster: action.value };
    case 'SupplierMasterStore':
      return { ...state, SupplierMasterStore: action.value };
    case 'PurchaseOrderList':
      return { ...state, PurchaseOrderList: action.value };
    case 'GoodsReceiptNoteList':
      return { ...state, GoodsReceiptNoteList: action.value };
    case 'GoodsReceiptNoteEdit':
      return { ...state, GoodsReceiptNoteEdit: action.value };
    case 'IndentEditData':
      return { ...state, IndentEditData: action.value };
    case 'OldGoodsReceiptNote':
      return { ...state, OldGoodsReceiptNote: action.value };
    case 'Supplierpaydata':
      return { ...state, Supplierpaydata: action.value };
    case 'SerialNoData':
      return { ...state, SerialNoData: action.value };
    case 'MinimumMaximumData':
      return { ...state, MinimumMaximumData: action.value };
    case 'PurchaseReturnList':
      return { ...state, PurchaseReturnList: action.value };
    case 'PurchaseReturnList':
      return { ...state, PurchaseReturnList: action.value };
    case 'StockEvaluationSingleItem':
      return { ...state, StockEvaluationSingleItem: action.value };
    default:
      return state;
  }
};

export default Inventory;
