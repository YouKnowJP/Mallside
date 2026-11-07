import {NEW_COLLECTION_REFERENCE} from './store-product-additions-v67.js?v=67.0.0';
import {referenceSize} from './verified-sizing.js';

const PRICE_LIMITS = [25, 50, 100, 250, 500, 1000, 2500, 5000];
const AVAILABILITY = [['all', 'Any availability'], ['stock', 'In stock'], ['saved', 'On my wishlist'], ['new', 'New this update']];
const SCOPE = [['models', 'One listing per model'], ['listings', 'All shop listings']];
const ALPHA_TYPES = ['shirt', 'hoodie', 'cardigan', 'jacket', 'shorts', 'pants'];

export function usualShoppingSize(s, p) {
 if (p.audience === 'child') return null;
 if (['shoes', 'sandals', 'ring'].includes(p.type)) {
  const size = p.type === 'ring' ? s.ringSize : s.shoeSize;
  return p.sizes.find(label => label === size || Number(label) === Number(size)) || null;
 }
 if (!ALPHA_TYPES.includes(p.type)) return null;
 if (p.sizingSystem === 'waist-inseam') {
  const selected = referenceSize(s, p);
  return selected && /^(?:W)?(\d+)/.exec(selected)?.[1] === String(s.waist) ? selected : null;
 }
 return referenceSize(s, p) || p.sizes.find(label => label === (p.type === 'pants' && !p.sizingSystem ? s.waist : s.size)) || null;
}

export function filterShoppingItems(items, s, filters, E, affordable = false) {
 const wishlist = filters.availability === 'saved' ? new Set(s.wishlist) : null;
 const cap = Math.min(filters.price ? Number(filters.price) * 100 : Infinity, affordable ? s.cash : Infinity);
 return items.filter(p => {
  if (wishlist && !wishlist.has(p.id)) return false;
  if (filters.availability === 'new' && p.collectionReference !== NEW_COLLECTION_REFERENCE) return false;
  if (cap < Infinity) {
   const price = E.price(s, p);
   if (price + Math.round(price * E.TAX) > cap) return false;
  }
  const size = filters.size === 'mine' ? usualShoppingSize(s, p) : filters.size;
  if (filters.size && (!size || !p.sizes.includes(size))) return false;
  if (filters.availability === 'stock') return size ? E.stock(s, p.id, size) > 0 : p.sizes.some(option => E.stock(s, p.id, option) > 0);
  return true;
 });
}

export function oneListingPerModel(items, rank) {
 const unique = new Map();
 for (const p of items) {
  const key = p.brand + ' · ' + p.name;
  const prior = unique.get(key);
  if (!prior || rank(p) < rank(prior) || (rank(p) === rank(prior) && p.price < prior.price)) unique.set(key, p);
 }
 return [...unique.values()];
}

export function shoppingFiltersHTML(scope, items, filters, esc) {
 const select = (key, name, options, fallback = '') => `<select id="${scope}-filter-${key}" data-shopping-filter="${key}" data-shopping-scope="${scope}" aria-label="${name}">${options.map(([value,label]) => `<option value="${esc(value)}"${(filters[key] ?? fallback) === value ? ' selected' : ''}>${esc(label)}</option>`).join('')}</select>`;
 const sizes = [...new Set(items.flatMap(p => p.sizes))].sort((a,b) => a.localeCompare(b, 'en', {numeric:true}));
 return `<div class="shopping-filters" role="group" aria-label="Shopping filters">
 <span class="shopping-filter-label">Narrow the shelves</span>
 <div class="shopping-filter-options">
 ${select('size', 'Filter by size or format', [['', 'Any size or format'], ['mine', 'My saved size'], ...sizes.map(size => [size, size])])}
 ${select('price', 'Maximum game price including tax', [['', 'Any price'], ...PRICE_LIMITS.map(limit => [String(limit), '$' + limit.toLocaleString('en-US') + ' or less with tax'])])}
 ${select('availability', 'Filter by stock or collection', AVAILABILITY, 'all')}
 ${scope === 'catalog' ? select('scope', 'Group catalog listings', SCOPE, 'models') : ''}
 </div></div>`;
}
