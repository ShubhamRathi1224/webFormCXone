function setTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem('theme', name);

//   const label = document.querySelector('.theme-name');
//   label.textContent = `Active Theme: ${name.charAt(0).toUpperCase() + name.slice(1)}`;
}

function loadSavedTheme() {
  const saved = localStorage.getItem('theme') || 'cunard';
  setTheme(saved);
  document.getElementById('serviceSelector').value = saved;
}

document.addEventListener('DOMContentLoaded', () => {
	loadSavedTheme();

	document.getElementById('serviceSelector').addEventListener('change', (e) => {
		setTheme(e.target.value);
	});

	// Compact mode toggle wiring
	const compactToggle = document.getElementById('compactToggle');
	const appRoot = document.getElementById('app');
	if(compactToggle && appRoot){
		const saved = localStorage.getItem('cxone-compact') === '1';
		compactToggle.checked = saved;
		appRoot.classList.toggle('compact', saved);
		compactToggle.addEventListener('change', (ev)=>{
			const on = !!ev.target.checked;
			appRoot.classList.toggle('compact', on);
			localStorage.setItem('cxone-compact', on ? '1' : '0');
		});
	}

	// Make panels collapsible: wrap panel contents (after H3) into .panel-body and add a small toggle
	document.querySelectorAll('.panel').forEach(panel => {
		if(panel.querySelector('.panel-body')) return; // already processed
		// find first heading (h3)
		const header = Array.from(panel.children).find(n=> n.tagName && n.tagName.toLowerCase() === 'h3');
		const body = document.createElement('div'); body.className = 'panel-body';
		if(header){
			// move all following sibling nodes into body
			let node = header.nextSibling;
			const toMove = [];
			while(node){
				toMove.push(node);
				node = node.nextSibling;
			}
			toMove.forEach(n=> body.appendChild(n));
			// append collapse toggle to header
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'panel-toggle';
			btn.setAttribute('aria-expanded','true');
			btn.innerHTML = '▾';
			btn.addEventListener('click', ()=>{
				panel.classList.toggle('collapsed');
				const expanded = !panel.classList.contains('collapsed');
				btn.setAttribute('aria-expanded', expanded);
				btn.innerHTML = expanded ? '▾' : '▸';
			});
			header.appendChild(btn);
			panel.appendChild(body);
		}
	});
});


// ----------------*************************------------------


// CXoneWebForm.js
// Extracted from CXoneWebForm.html

// Utility: safe JSON parse
function tryParseJSON(s){ try{ return JSON.parse(s) }catch(e){ return null } }

// SVG icon helpers (returns an inline SVG string)
function svgCheck(){ return '<svg class="auth-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
function svgCross(){ return '<svg class="auth-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
function svgWarn(){ return '<svg class="auth-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="0" fill="currentColor"/><path d="M12 9v4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17h.01" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
function svgPhone(){ return '<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12 1.05.38 2.07.77 3.03a2 2 0 0 1-.45 2.11L8.91 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.96.39 1.98.65 3.03.77A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
function svgEmail(){ return '<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4 4h16v16H4z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 6L12 13 2 6" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
function svgSMS(){ return '<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
function svgChat(){ return '<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }

function setAuthChip(status){
	// status: 'authenticated' | 'partial' | 'unauthenticated'
	if(!document.getElementById('authChip')) return;
	if(status === 'authenticated'){
		document.getElementById('authChip').innerHTML = '<span class="icon check" style="color:var(--brand);">'+svgCheck()+'</span><span><strong>Authenticated</strong></span>';
	} else if(status === 'partial'){
		document.getElementById('authChip').innerHTML = '<span class="icon warn" style="color:#d97706;">'+svgWarn()+'</span><span>Partially Authenticated</span>';
	} else {
		document.getElementById('authChip').innerHTML = '<span class="icon cross" style="color:#9ca3af;">'+svgCross()+'</span><span>Unauthenticated</span>';
	}
}

// Read query params into an object
function getQueryParams(){
	const qs = location.search.replace(/^\?/, '');
	if(!qs) return {};
	return qs.split('&').reduce((acc, pair) => {
		const [k, v] = pair.split('=');
		if(!k) return acc;
		try{ acc[decodeURIComponent(k)] = decodeURIComponent(v || ''); }catch(e){ acc[k] = v || ''; }
		return acc;
	}, {});
}

// Build API URL by appending known params if base is provided
function buildApiUrl(base, params){
	if(!base) return null;
	try{
		const url = new URL(base, location.href);
		Object.keys(params).forEach(k => {
			if(params[k]) url.searchParams.set(k, params[k]);
		});
		return url.toString();
	}catch(e){
		// base might be a raw string - try simple concatenation
		const qs = Object.keys(params).filter(k=>params[k]).map(k=> encodeURIComponent(k)+'='+encodeURIComponent(params[k])).join('&');
		return base + (base.includes('?') ? '&' : '?') + qs;
	}
}

// Fetch from REST API (apiUrl may be passed) and populate form
async function fetchFromApi(apiUrl, params){
	const statusEl = document.getElementById('fetchStatus');
	if(!apiUrl){ statusEl.textContent = 'No API URL configured (use ?api=...)'; return null; }
	statusEl.textContent = 'Loading...';
	try{
		const url = buildApiUrl(apiUrl, params);
		const resp = await fetch(url, { method:'GET', credentials:'omit' });
		if(!resp.ok) throw new Error('HTTP '+resp.status);
		const data = await resp.json();
		statusEl.textContent = 'Data loaded';
		// attempt to map common fields
		const mapped = {
			brand: data.brand || params.brand || serviceSelector.value,
			phone: data.phone || data.contact?.phone || data.mobile || data.msisdn || '',
			email: data.email || data.contact?.email || '',
			customerId: data.customerId || data.customer_id || data.ccn || params.customerId || '',
			callerName: data.callerName || data.name || '',
			ccn: data.ccn || data.ccnNumber || '',
			callerType: data.callerType || data.caller_type || '',
			travelAdvisor: data.travelAdvisor || data.advisor || '',
			intent: data.intent || data.callerIntent || '',
			rating: data.rating || data.urgency || '',
			satisfied: data.satisfied || data.isSatisfied || '',
			booking: { id: data.booking?.id || data.bookingNumber || params.bookingNumber || '', date: data.booking?.date || data.bookingDate || '' },
			notes: data.notes || data.transferNotes || data.callerTranscript || '',
			mediaType: data.mediaType || data.media || '',
			authenticated: data.authenticated || data.auth || '' ,
			lang: data.lang || data.language || ''
		};
		// set brand/service and lang if provided by API
		if(mapped.brand) serviceSelector.value = mapped.brand;
		if(mapped.lang) setLangFlag(mapped.lang);
		applyService(serviceSelector.value);
		populateFromIVR(mapped);
		// Show the raw payload in IVR textarea for debugging
		ivrPayload.value = JSON.stringify(data, null, 2);
		return data;
	}catch(err){
		statusEl.textContent = 'Error: ' + (err.message || err);
		return null;
	}
}

// Elements
const app = document.getElementById('app');
const serviceSelector = document.getElementById('serviceSelector');
// const serviceName = document.getElementById('serviceName');
const logo = document.getElementById('logo');
const authLabel = document.getElementById('authLabel');
const authChip = document.getElementById('authChip');
const regChip = document.getElementById('registeredVal');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const customerId = document.getElementById('customerId');
const intent = document.getElementById('intent');
const bookingSection = document.getElementById('bookingSection');
const bookingId = document.getElementById('bookingId');
const bookingDate = document.getElementById('bookingDate');
const notes = document.getElementById('notes');
const ivrPayload = document.getElementById('ivrPayload');
const btnPopulate = document.getElementById('btnPopulate');
const btnSample = document.getElementById('btnSample');
const btnClear = document.getElementById('btnClear');
const btnCheckAuth = document.getElementById('btnCheckAuth');
const acceptTerms = document.getElementById('acceptTerms');
const btnNext = document.getElementById('btnNext');
const btnSave = document.getElementById('btnSave');
const btnCancel = document.getElementById('btnCancel');
const summary = document.getElementById('summary');
const serviceFooterName = document.getElementById('serviceFooterName');

// Cruise brand metadata
const SERVICES = {
	holland: {name:'Holland America Line', tag:'Taking you to extraordinary places', theme:'theme-hal', short:'HAL'},
	princess: {name:'Princess Cruises', tag:'Come back new', theme:'theme-pcl', short:'PCL'},
	seabourn: {name:'Seabourn', tag:'Elegant, ultra-luxury cruises', theme:'theme-sbn', short:'SBN'},
	cunard: {name:'Cunard', tag:'Leaders in luxury ocean travel', theme:'theme-cun', short:'CUN'}
};

// Set language flag based on lang code such as en-DE, de-DE, nl-NL
function setLangFlag(lang){
	const el = document.getElementById('langFlag');
	if(!el) return;
	if(!lang){ el.textContent = ''; return; }
	const parts = (lang||'').split('-');
	const country = (parts[1] || '').toUpperCase();
	const map = { 'DE':'🇩🇪', 'NL':'🇳🇱', 'US':'🇺🇸', 'GB':'🇬🇧' };
	const flag = map[country] || '';
	el.textContent = flag + (flag? ' ' + lang : lang);
}

// Initialize
function applyService(s){
	const meta = SERVICES[s] || Object.values(SERVICES)[0];
	console.log('meta: ', meta);
	// set class theme
	Object.values(SERVICES).forEach(v=> app.classList.remove(v.theme));
	app.classList.add(meta.theme);
	// serviceName.textContent = meta.name;
	serviceFooterName.textContent = meta.name;
	document.getElementById('serviceFooterTagline').textContent = meta.tag;
}

// Update summary
function updateSummary(){
	const s = {
		service: serviceSelector.value,
			phone: phone.value || null,
			email: email.value || null,
			customerId: customerId.value || null,
			callerName: document.getElementById('callerName')?.value || null,
			ccn: document.getElementById('ccn')?.value || null,
			intent: intent.value || null,
			rating: document.getElementById('rating')?.value || null,
			satisfied: (document.getElementById('satisfiedYes')?.checked ? 'yes' : (document.getElementById('satisfiedNo')?.checked ? 'no' : null)),
			bookingId: bookingId.value || null
	};
	summary.textContent = JSON.stringify(s, null, 2);
}

// Check auth: simple heuristic/demo
function checkAuth(){
	let registered = !!customerId.value.trim();
	regChip.textContent = registered ? 'Yes' : 'No';
	if(registered){
		authLabel.textContent = 'Authenticated';
		setAuthChip('authenticated');
	} else if(phone.value.trim() || email.value.trim()){
		authLabel.textContent = 'Partially Authenticated';
		setAuthChip('partial');
	} else {
		authLabel.textContent = 'Unauthenticated';
		setAuthChip('unauthenticated');
	}
	updateNextEnabled();
	updateSummary();
}

// Enable Next only when terms accepted and at least an intent selected
function updateNextEnabled(){
	btnNext.disabled = !(acceptTerms.checked && !!intent.value);
}

// Populate from IVR payload
function populateFromIVR(payload){
	if(!payload) return;
	if(payload.service) serviceSelector.value = payload.service;
	if(payload.phone) phone.value = payload.phone;
	if(payload.email) email.value = payload.email;
	if(payload.customerId) customerId.value = payload.customerId;
	if(payload.intent){
		intent.value = payload.intent;
		handleIntentChange();
	}
	if(payload.booking){
		bookingId.value = payload.booking.id || '';
		bookingDate.value = payload.booking.date || '';
		bookingSection.style.display = 'block';
	}
	if(payload.notes) notes.value = payload.notes;
	checkAuth();
}

function handleIntentChange(){
	if(intent.value === 'booking') bookingSection.style.display = 'block'; else bookingSection.style.display = 'none';
	updateNextEnabled();
	updateSummary();
}

// Events
serviceSelector.addEventListener('change', ()=>{ applyService(serviceSelector.value); });
phone.addEventListener('input', ()=>{ updateSummary(); });
email.addEventListener('input', ()=>{ updateSummary(); });
customerId.addEventListener('input', ()=>{ updateSummary(); });
intent.addEventListener('change', handleIntentChange);
acceptTerms.addEventListener('change', updateNextEnabled);
btnCheckAuth.addEventListener('click', checkAuth);

btnPopulate.addEventListener('click', ()=>{
	const parsed = tryParseJSON(ivrPayload.value);
	if(!parsed){ alert('Invalid JSON'); return; }
	populateFromIVR(parsed);
});

btnSample.addEventListener('click', ()=>{
	const sample = { service:'telecom', phone:'+15551234567', email:'caller@example.com', customerId:'C-0001', intent:'billing', booking:{id:'B-123', date:'2025-11-05 09:30'}, notes:'IVR detected billing issue' };
	ivrPayload.value = JSON.stringify(sample, null, 2);
	populateFromIVR(sample);
});

btnClear.addEventListener('click', ()=>{
	ivrPayload.value = '';
});

// collapse/expand IVR pane on small screens
const ivrToggle = document.getElementById('ivrToggle');
if(ivrToggle){
	ivrToggle.addEventListener('click', ()=>{
		const aside = document.querySelector('aside');
		aside.classList.toggle('collapsed');
		ivrToggle.setAttribute('aria-expanded', !aside.classList.contains('collapsed'));
	});
}

btnSave.addEventListener('click', ()=>{
	const data = {
		service: serviceSelector.value,
		phone: phone.value, email: email.value, customerId: customerId.value,
		intent: intent.value, booking:{id:bookingId.value, date:bookingDate.value}, notes:notes.value,
		routes: {email: document.getElementById('routeEmail').checked, phone: document.getElementById('routePhone').checked, sms: document.getElementById('routeSMS').checked, chat: document.getElementById('routeChat').checked},
		transferTo: document.getElementById('transferTo').value,
		timestamp: new Date().toISOString()
	};
	localStorage.setItem('cxone-form-draft', JSON.stringify(data));
	alert('Saved locally');
	updateSummary();
});

btnCancel.addEventListener('click', ()=>{
	if(confirm('Discard changes?')){
		// reload last saved or clear
		const saved = localStorage.getItem('cxone-form-draft');
		if(saved){
			const obj = JSON.parse(saved); populateFromIVR(obj);
		} else {
			phone.value = email.value = customerId.value = '';
			intent.value = '';
			bookingId.value = bookingDate.value = '';
			notes.value = '';
			acceptTerms.checked = false;
			checkAuth();
		}
	}
});

btnNext.addEventListener('click', ()=>{
	if(btnNext.disabled) return;
	// In a real app we'd POST to server or route to next screen
	const payload = {
		service: serviceSelector.value,
		phone: phone.value, email: email.value, customerId: customerId.value,
		intent: intent.value, booking:{id:bookingId.value, date:bookingDate.value}, notes:notes.value
	};
	alert('Proceeding to next step with payload:\n' + JSON.stringify(payload, null, 2));
});

// Init on load
(function init(){
	document.getElementById('copyrightYear').textContent = new Date().getFullYear();
	applyService(serviceSelector.value);
	// load saved draft if any
	const draft = localStorage.getItem('cxone-form-draft');
	if(draft){
		const obj = JSON.parse(draft);
		// show a small indicator
		summary.textContent = 'Loaded saved draft — click Populate to apply';
		ivrPayload.value = JSON.stringify(obj, null, 2);
	}
		// check URL params and optionally call API
		const params = getQueryParams();
		console.log('params: ', params);
		// Recognize common keys: bookingNumber, customerId, api, service
		const bookingNumberParam = params.bookingNumber || params.booking || params.booking_id || params.bookingNumber;
		const customerIdParam = params.customerId || params.customer_id || params.customer || params.ccn || '';
		const apiUrlParam = params.api || params.apiUrl || params.endpoint || '';
		const serviceParam = params.service || '';

		// prefill booking/customer fields from URL
		if(bookingNumberParam) bookingId.value = bookingNumberParam; 
		if(customerIdParam) customerId.value = customerIdParam;
		if(serviceParam) serviceSelector.value = serviceParam;

			// if an API is supplied, call it with booking/customer
			if(apiUrlParam){
				fetchFromApi(apiUrlParam, { bookingNumber: bookingNumberParam, customerId: customerIdParam, service: serviceParam }).then((data)=>{
					// if API returned language or brand we may have already applied it. Ensure flag is set if present in params
					if(params.lang) setLangFlag(params.lang);
					checkAuth(); updateSummary();
				});
			} else {
			// no API: just update UI from query params
			if(bookingNumberParam || customerIdParam || serviceParam){
				updateSummary();
				checkAuth();
				document.getElementById('fetchStatus').textContent = 'Populated from URL params';
			} else {
				checkAuth();
				updateSummary();
			}
		}
    // Responsive: collapse IVR aside by default on narrow screens and restore on wider screens
    const aside = document.querySelector('aside');
    const toggle = document.getElementById('ivrToggle');
    function handleResponsiveAside(){
        try{
            const narrow = window.innerWidth <= 820;
            if(!aside) return;
            if(narrow){
                aside.classList.add('collapsed');
                if(toggle) toggle.setAttribute('aria-expanded', 'false');
            } else {
                aside.classList.remove('collapsed');
                if(toggle) toggle.setAttribute('aria-expanded', 'true');
            }
        }catch(e){ /* ignore */ }
    }
    // initial
    handleResponsiveAside();
    // throttle resize
    let rr;
    window.addEventListener('resize', ()=>{ clearTimeout(rr); rr = setTimeout(handleResponsiveAside, 120); });
})();
