// The original select owns the value and change events. Mallside owns the visible picker.
const controls = new WeakMap();
let sequence = 0;
let openControl = null;

function identity(select) {
 if (select.id) return '#' + CSS.escape(select.id);
 for (const key of ['pref', 'setting', 'character-style', 'experience-field']) {
  const value = select.getAttribute('data-' + key);
  if (value) return 'select[data-' + key + '="' + CSS.escape(value) + '"]';
 }
 return '';
}

function labelFor(select) {
 const labelledBy = select.getAttribute('aria-labelledby');
 if (labelledBy) {
  const name = labelledBy.split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join(' ').trim();
  if (name) return name;
 }
 const label = select.getAttribute('aria-label');
 if (label) return label;
 for (const source of select.labels || []) {
  const copy = source.cloneNode(true);
  copy.querySelectorAll('select,.game-select').forEach(node => node.remove());
  if (copy.textContent.trim()) return copy.textContent.trim();
 }
 return 'Choose an option';
}

function optionsFor(select) {
 return Array.from(select.options, option => ({
  text: option.label,
  disabled: option.disabled || (option.parentElement?.tagName === 'OPTGROUP' && option.parentElement.disabled)
 }));
}

function sync(control) {
 const {select, trigger, value} = control;
 value.textContent = select.selectedOptions[0]?.label || 'Choose…';
 trigger.disabled = select.matches(':disabled');
}

function close() {
 if (!openControl) return;
 const {trigger, list} = openControl;
 openControl = null;
 trigger.setAttribute('aria-expanded', 'false');
 trigger.removeAttribute('aria-activedescendant');
 if (typeof list.hidePopover === 'function' && list.matches(':popover-open')) list.hidePopover();
 list.hidden = true;
 list.replaceChildren();
}

function place(control) {
 if (!control.trigger.isConnected || !control.trigger.getClientRects().length ||
     control.trigger.closest('[inert]') || getComputedStyle(control.trigger).visibility === 'hidden') {
  close();
  return;
 }
 const {trigger, list} = control;
 const bounds = trigger.getBoundingClientRect();
 const viewport = window.visualViewport;
 const left = viewport?.offsetLeft ?? 0, top = viewport?.offsetTop ?? 0;
 const right = left + (viewport?.width ?? innerWidth), bottom = top + (viewport?.height ?? innerHeight);
 const before = bounds.top - top - 12, after = bottom - bounds.bottom - 12;
 if (bounds.bottom < top || bounds.top > bottom) {
  close();
  return;
 }
 const above = after < 168 && before > after;
 const width = Math.min(right - left - 16, Math.max(bounds.width, 196));
 list.style.width = width + 'px';
 list.style.maxHeight = Math.max(48, Math.min(280, above ? before : after)) + 'px';
 list.style.left = Math.max(left + 8, Math.min(bounds.left, right - width - 8)) + 'px';
 list.style.top = (above ? bounds.top - list.offsetHeight - 6 : bounds.bottom + 6) + 'px';
}

function setActive(control, index, reveal = true) {
 const previous = control.rows[control.active];
 if (previous) previous.classList.remove('is-active');
 control.active = index;
 const next = control.rows[index];
 if (!next) {
  control.trigger.removeAttribute('aria-activedescendant');
  return;
 }
 next.classList.add('is-active');
 control.trigger.setAttribute('aria-activedescendant', next.id);
 if (reveal) {
  const {list} = control;
  if (next.offsetTop < list.scrollTop) list.scrollTop = next.offsetTop;
  else if (next.offsetTop + next.offsetHeight > list.scrollTop + list.clientHeight) {
   list.scrollTop = next.offsetTop + next.offsetHeight - list.clientHeight;
  }
 }
}

function choose(control, index) {
 const {select, trigger, selector} = control;
 const option = optionsFor(select)[index];
 if (select.matches(':disabled') || !option || option.disabled) return;
 close();
 trigger.focus({preventScroll:true});
 if (select.selectedIndex === index) return;
 select.selectedIndex = index;
 sync(control);
 select.dispatchEvent(new Event('input', {bubbles:true}));
 select.dispatchEvent(new Event('change', {bubbles:true}));
 // Settings and catalogue changes can replace the entire view during the change event.
 if (!select.isConnected && selector) gameSelectButton(document.querySelector(selector))?.focus({preventScroll:true});
}

function show(control, direction = 1) {
 if (openControl === control) return;
 close();
 sync(control);
 if (control.trigger.disabled) return;
 const {trigger, list, select} = control;
 control.options = optionsFor(select);
 control.enabled = control.options.flatMap((option, i) => option.disabled ? [] : [i]);
 if (!control.enabled.length) return;
 control.prefix = '';
 control.rows = control.options.map(({text, disabled}, index) => {
  const row = document.createElement('button');
  row.type = 'button';
  row.tabIndex = -1;
  row.id = list.id + '-' + index;
  row.className = 'game-select-option';
  row.setAttribute('role', 'option');
  row.setAttribute('aria-selected', String(index === select.selectedIndex));
  row.disabled = disabled;
  row.textContent = text;
  row.dataset.option = index;
  return row;
 });
 list.replaceChildren(...control.rows);
 list.hidden = false;
 if (typeof list.showPopover === 'function') list.showPopover();
 openControl = control;
 trigger.setAttribute('aria-expanded', 'true');
 trigger.focus({preventScroll:true});
 place(control);
 const index = control.enabled.includes(select.selectedIndex) ? select.selectedIndex :
  direction < 0 ? control.enabled.at(-1) : control.enabled[0];
 if (openControl === control) setActive(control, index);
}

function findTyped(control, key, options, index) {
 const now = performance.now();
 const char = key.toLocaleLowerCase();
 if (!control.typedAt || now - control.typedAt > 650) control.prefix = '';
 control.typedAt = now;
 control.prefix += char;
 const repeated = Array.from(control.prefix).every(letter => letter === char);
 const query = repeated ? char : control.prefix;
 const offset = repeated ? 1 : 0;
 for (let i = 0; i < options.length; i++) {
  const next = (Math.max(0, index + offset) + i) % options.length;
  if (!options[next].disabled && options[next].text.toLocaleLowerCase().startsWith(query)) return next;
 }
 return -1;
}

function handleKey(control, event) {
 const active = openControl === control, key = event.key;
 if (key === 'Tab') {
  if (active) close();
  return;
 }
 const arrow = key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0;
 const press = key === 'Enter' || key === ' ';
 const type = key.length === 1 && !press && !event.metaKey && !event.ctrlKey && !event.altKey;
 const handled = arrow || press || type || key === 'Home' || key === 'End' || (active && key === 'Escape');
 if (!handled) return;
 event.preventDefault();
 event.stopPropagation();
 if (key === 'Escape') {
  close();
  return;
 }
 if (type) {
  const options = active ? control.options : optionsFor(control.select);
  const index = findTyped(control, key, options, active ? control.active : control.select.selectedIndex);
  if (index >= 0) {
   if (active) setActive(control, index);
   else choose(control, index);
  }
  return;
 }
 if (!active) show(control, arrow);
 if (openControl !== control) return;
 if (key === 'Home' || key === 'End') {
  setActive(control, key === 'Home' ? control.enabled[0] : control.enabled.at(-1));
 } else if (active && arrow) {
  const position = control.enabled.indexOf(control.active);
  setActive(control, control.enabled[Math.max(0, Math.min(control.enabled.length - 1, position + arrow))]);
 } else if (active && press) choose(control, control.active);
}

export function gameSelectButton(select) {
 if (!(select instanceof HTMLSelectElement) || select.multiple || select.size > 1) return null;
 if (controls.has(select)) return controls.get(select).trigger;
 const host = document.createElement('span'), trigger = document.createElement('button');
 const value = document.createElement('span'), list = document.createElement('div');
 const control = {select, host, trigger, value, list, selector:identity(select), prefix:''};
 host.className = 'game-select';
 trigger.type = 'button';
 trigger.className = 'game-select-trigger';
 trigger.setAttribute('role', 'combobox');
 trigger.setAttribute('aria-haspopup', 'listbox');
 trigger.setAttribute('aria-label', labelFor(select));
 trigger.setAttribute('aria-expanded', 'false');
 list.id = 'game-select-list-' + ++sequence;
 list.className = 'game-select-list';
 list.setAttribute('role', 'listbox');
 list.setAttribute('aria-label', labelFor(select));
 list.setAttribute('popover', 'manual');
 list.hidden = true;
 trigger.setAttribute('aria-controls', list.id);
 value.className = 'game-select-value';
 trigger.append(value);
 host.append(trigger, list);
 select.classList.add('game-select-native');
 select.hidden = true;
 select.after(host);
 controls.set(select, control);
 sync(control);
 select.addEventListener('change', () => sync(control));
 trigger.addEventListener('click', () => openControl === control ? close() : show(control));
 trigger.addEventListener('keydown', event => handleKey(control, event));
 list.addEventListener('pointerdown', event => {
  if (event.target.closest('[data-option]')) event.preventDefault();
 });
 list.addEventListener('click', event => {
  const option = event.target.closest('[data-option]');
  if (option) choose(control, Number(option.dataset.option));
 });
 return trigger;
}

export function installGameSelects(root = document.body) {
 const mount = node => {
  if (!(node instanceof Element)) return;
  if (node.matches('select')) gameSelectButton(node);
  else node.querySelectorAll('select').forEach(gameSelectButton);
 };
 mount(root);
 new MutationObserver(records => {
  if (openControl && (!openControl.select.isConnected || !openControl.trigger.isConnected)) close();
  for (const record of records) {
   const source = record.target instanceof Element && record.target.closest('select');
   const control = source && controls.get(source);
   if (control) {
    sync(control);
    if (openControl === control) close();
   }
   if (record.type === 'attributes' && record.target.matches('fieldset')) {
    record.target.querySelectorAll('select').forEach(select => {
     const fieldControl = controls.get(select);
     if (fieldControl) sync(fieldControl);
    });
   }
   for (const node of record.addedNodes) mount(node);
  }
 }).observe(root, {childList:true, subtree:true, attributes:true, attributeFilter:['disabled','selected']});
 document.addEventListener('pointerdown', event => {
  if (openControl && !openControl.host.contains(event.target)) close();
 }, true);
 document.addEventListener('focusin', event => {
  if (openControl && !openControl.host.contains(event.target)) close();
 });
 document.addEventListener('click', event => {
  const label = event.target.closest('label');
  if (label?.control?.matches('select.game-select-native') && !event.target.closest('.game-select')) {
   event.preventDefault();
   gameSelectButton(label.control)?.click();
  }
 });
 document.addEventListener('reset', event => queueMicrotask(() => {
  event.target.querySelectorAll('select').forEach(select => {
   const control = controls.get(select);
   if (control) sync(control);
  });
 }));
 const reposition = event => {
  if (openControl && event.target !== openControl.list) place(openControl);
 };
 window.addEventListener('scroll', reposition, true);
 window.addEventListener('resize', reposition);
 window.visualViewport?.addEventListener('resize', reposition);
}
