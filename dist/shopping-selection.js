import {byId,storeById,levelOf,carried,stock,CLOSE,savedBags} from './engine.js?v=40.0.0';

export function validatePickup(state,storeId,bags,productId,size){
 const p=byId(productId),st=storeById(storeId);
 if(!p||p.archived)throw Error('This earlier listing is not available to pick up.');
 if(!st||p.store!==storeId)throw Error('Choose an item from this store.');
 if(levelOf(state)<st.tier)throw Error('Unlock this store’s shopping level first.');
 if(state.minutes>=CLOSE)throw Error('The mall is closed. Come back tomorrow.');
 if(!p.sizes.includes(size))throw Error('Choose an available size first.');
 if(carried(state).length+Object.values(bags).flat().length>=8)throw Error('Your hands are full. Pay, put an item back, or visit package check.');
 const quantity=(bags[storeId]||[]).filter(i=>i.id===productId&&i.size===size).length;
 if(quantity>=stock(state,productId,size))throw Error('That is all the game stock in this size today.');
 return {id:productId,size};
}
export function putBackSelection(bags,storeId,index){
 if(!Array.isArray(bags[storeId])||!Number.isInteger(index)||index<0||index>=bags[storeId].length)throw Error('That unpaid item is no longer in your hands.');
 return bags[storeId].splice(index,1)[0];
}
export function carriedSelections(state){return Object.entries(savedBags(state)).flatMap(([store,items])=>items.map(item=>({...item,store,product:byId(item.id)})));}
