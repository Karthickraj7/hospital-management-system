
const initstate={
    FinanceMasterEdit:{},
    FinanceLedgerMasterEdit:{},
    FinanceVouchersEdit:{},
    ExpensesVouchersEdit:{},
    DayCloseingEdit:{},



}


const Financedata =(state=initstate,action)=>{

    switch(action.type){

        case 'FinanceMasterEdit':
            return {...state,FinanceMasterEdit:action.value}
        case 'FinanceLedgerMasterEdit':
            return {...state,FinanceLedgerMasterEdit:action.value}
        case 'FinanceVouchersEdit':
            return {...state,FinanceVouchersEdit:action.value}
        case 'ExpensesVouchersEdit':
            return {...state,ExpensesVouchersEdit:action.value}
        case 'DayCloseingEdit':
            return {...state,DayCloseingEdit:action.value}
        default:
            return state;

    }
}

export default Financedata;