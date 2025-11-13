import React, { useEffect, useState, useRef } from 'react';
import '../modern_cxone_web_form.css';
import { SAMPLE_API_RESPONSES, BRANDS } from '../data';

export default function CxoneForm() {
  const [service, setService] = useState('holland');
  const [customerId, setCustomerId] = useState('C-0001');
  const [customer, setCustomer] = useState(SAMPLE_API_RESPONSES[0]);
  const [selectedTab, setSelectedTab] = useState('customer');
  const [satisfied, setSatisfied] = useState('');
  const [intent, setIntent] = useState('');
  const [bookingNumber, setBookingNumber] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');
  const [transcript, setTranscript] = useState('');

  const formAreaRef = useRef(null);

  useEffect(() => {
    // load initial
    applyService(service);
    setCustomerById(customerId);
    window.addEventListener('resize', repositionPanels);
    repositionPanels();
    return () => window.removeEventListener('resize', repositionPanels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyService(service);
    document.documentElement.setAttribute('data-theme', service);
  }, [service]);

  function setCustomerById(id) {
    const c = SAMPLE_API_RESPONSES.find((x) => x.customerId === id) || SAMPLE_API_RESPONSES[0];
    setCustomer(c);
    setTheme(c.brand || 'holland');
    setAuthChip(c.authenticated);
    setLangFlag(c.lang, c.langFlag);
    setPhoneType(c.phoneType, c.phoneTypeImage);
    populateFromIVR(c);
  }

  function setTheme(name = 'holland') {
    localStorage.setItem('theme', name);
    document.documentElement.setAttribute('data-theme', name);
    setService(name);
  }

  function applyService(s) {
    const meta = BRANDS[s] || Object.values(BRANDS)[0];
    const footer = document.getElementById('serviceFooterName');
    if (footer) footer.textContent = meta.name;
    const tag = document.getElementById('serviceFooterTagline');
    if (tag) tag.textContent = meta.tag;
  }

  function setAuthChip(isAuthenticated) {
    const authChip = document.getElementById('authChip');
    if (!authChip) return;
    if (isAuthenticated) {
      authChip.innerHTML = '<span class="icon check" style="color:var(--brand);">✓</span><span><strong>Authenticated</strong></span>';
    } else {
      authChip.innerHTML = '<span class="icon cross" style="color:#9ca3af;">✕</span><span>Unauthenticated</span>';
    }
  }

  function setPhoneType(phoneType, img) {
    const phoneTypeDiv = document.getElementById('phoneType');
    if (!phoneTypeDiv) return;
    phoneTypeDiv.innerHTML = '';
    const i = document.createElement('img');
    i.src = img || '/assets/phoneTypes/mobile.png';
    i.alt = phoneType;
    phoneTypeDiv.appendChild(i);
  }

  function setLangFlag(lang, img) {
    const flagDiv = document.getElementById('langFlag');
    if (!flagDiv) return;
    flagDiv.innerHTML = '';
    const i = document.createElement('img');
    i.src = img || '/assets/flags/english.png';
    i.alt = lang;
    flagDiv.appendChild(i);
  }

  function populateFromIVR(payload) {
    if (!payload) return;
    if (payload.intent) setIntent(payload.intent);
    if (payload.booking) {
      setBookingNumber(payload.booking.id || '');
      setBookingDate(payload.booking.date || '');
    }
    setTranscript(payload.transcript || '');
    setNotes(payload.notes || '');
  }

  function repositionPanels() {
    const isMobile = window.innerWidth < 768;
    const panels = Array.from(document.querySelectorAll('.cxone-form-panel'));
    panels.forEach((panel) => {
      const tab = document.querySelector(`.cxone-tab[data-tab="${panel.dataset.tab}"]`);
      if (!tab || !formAreaRef.current) return;
      if (isMobile) tab.insertAdjacentElement('afterend', panel);
      else formAreaRef.current.appendChild(panel);
    });
  }

  function handleThumb(value) {
    setSatisfied(value);
    const hidden = document.getElementById('satisfied');
    if (hidden) hidden.value = value;
  }

  function onSaveNext() {
    const data = {
      brand: service,
      intent,
      booking: { id: bookingNumber, date: bookingDate },
      notes,
      transcript,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cxone-form-draft', JSON.stringify(data));
    alert('Saved locally');
  }

  return (
    <div className="card">
      <header className="brand">
        <div className="brand">
          <div className="brand-logo" />
        </div>

        <div className="header-controls">
          <div>
            <select id="customerSelector" aria-label="Select customer" value={customerId} onChange={(e)=>{setCustomerId(e.target.value); setCustomerById(e.target.value);}}>
              {SAMPLE_API_RESPONSES.map((c)=> (
                <option key={c.customerId} value={c.customerId}>{c.customerId}</option>
              ))}
            </select>
          </div>
          <div>
            <select id="serviceSelector" aria-label="Select cruise line" value={service} onChange={(e)=>setService(e.target.value)}>
              <option value="holland">Holland America (HAL)</option>
              <option value="princess">Princess Cruise (PCL)</option>
              <option value="seabourn">Seabourn (SBN)</option>
              <option value="cunard">Cunard (CUN)</option>
            </select>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div id="authChip" className="chip auth-chip" aria-live="polite"></div>
          </div>
          <div id="phoneType"></div>
          <div id="langFlag"></div>
        </div>
      </header>

      <main>
        <div className="cxone-tabs" id="cxoneTabs">
          <div className={`cxone-tab ${selectedTab==='customer' ? 'selected':''}`} data-tab="customer" onClick={()=>{setSelectedTab('customer')}}>
            <div className="cxone-tab-icon">👥</div>
            <div className="cxone-tab-title">Customer</div>
            <div className="cxone-tab-desc">Customer Information</div>
          </div>
          <div className={`cxone-tab ${selectedTab==='travelAdvisor' ? 'selected':''}`} data-tab="travelAdvisor" onClick={()=>setSelectedTab('travelAdvisor')}>
            <div className="cxone-tab-icon">💬</div>
            <div className="cxone-tab-title">Travel advisor</div>
            <div className="cxone-tab-desc">Travel advisor Information</div>
          </div>
          <div className={`cxone-tab ${selectedTab==='intent' ? 'selected':''}`} data-tab="intent" onClick={()=>setSelectedTab('intent')}>
            <div className="cxone-tab-icon">📝</div>
            <div className="cxone-tab-title">Contact Intent</div>
            <div className="cxone-tab-desc">Contact Intent & Purpose of request</div>
          </div>
          <div className={`cxone-tab ${selectedTab==='booking' ? 'selected':''}`} data-tab="booking" onClick={()=>setSelectedTab('booking')}>
            <div className="cxone-tab-icon">📅</div>
            <div className="cxone-tab-title">Booking Details</div>
            <div className="cxone-tab-desc">Booking details</div>
          </div>
          <div className={`cxone-tab ${selectedTab==='pcc' ? 'selected':''}`}  data-tab="pcc" onClick={()=>setSelectedTab('pcc')}>
            <div className="cxone-tab-icon">💬</div>
            <div className="cxone-tab-title">PCC</div>
            <div className="cxone-tab-desc">PCC</div>
          </div>
          <div className={`cxone-tab ${selectedTab==='mediaType' ? 'selected':''}`}  data-tab="mediaType" onClick={()=>setSelectedTab('mediaType')}>
            <div className="cxone-tab-icon">💬</div>
            <div className="cxone-tab-title">Media type</div>
            <div className="cxone-tab-desc">Phone type & Authorization</div>
          </div>
        </div>

        <div className="cxone-form-area" ref={formAreaRef}>
          <div className="cxone-form-panel" data-tab="customer" style={{display: selectedTab==='customer' ? 'block':'none'}}>
            <div className="short-row">
                <div className="field">
                <label htmlFor="callerName">Customer Name</label>
                <input type="text" id="callerName" placeholder="Enter name" />
                </div>
                <div className="field">
                <label htmlFor="ccn">CCN</label>
                <input type="text" id="ccn" placeholder="Customer CCN" />
                </div>
            </div>
          </div>

          <div className="cxone-form-panel" data-tab="travelAdvisor" style={{display: selectedTab==='travelAdvisor' ? 'block':'none'}}>
            <div className="field" style={{marginBottom:16}}>
              <button type="button" className="advisor-chip">🏢 Travel Advisor: {customer.travelAdvisor || 'N/A'}</button>
            </div>
            <div className="short-row">
              <div className="field"><label>IATA</label><input type="text" /></div>
              <div className="field"><label>CLIA</label><input type="text" /></div>
              <div className="field"><label>Agency Id</label><input type="text" /></div>
              <div className="field"><label>Agency Name</label><input type="text" /></div>
            </div>
          </div>

          <div className="cxone-form-panel" data-tab="intent" style={{display: selectedTab==='intent' ? 'block':'none'}}>
            <div className="short-row">
              <div className="field">
                <label htmlFor="intent">Intent</label>
                <select id="intent" value={intent} onChange={(e)=>setIntent(e.target.value)}>
                  <option value="">-- Select intent --</option>
                  <option value="newBooking">New Booking</option>
                  <option value="modifyBooking">Modify Booking</option>
                  <option value="cancelBooking">Cancel Booking</option>
                  <option value="billingIssue">Billing Issue</option>
                  <option value="luggageLost">Luggage Lost</option>
                </select>
              </div>
              <div className="field">
                <div className="thumb-group">
                  <i className={`fa-solid fa-thumbs-up thumb ${satisfied==='yes' ? 'selected':''}`} data-value="yes" onClick={()=>handleThumb('yes')}></i>
                  <i className={`fa-solid fa-thumbs-down thumb ${satisfied==='no' ? 'selected':''}`} data-value="no" onClick={()=>handleThumb('no')}></i>
                </div>
                <input type="hidden" name="satisfied" id="satisfied" value={satisfied} />
              </div>
            </div>

            <div className="short-row">
              <div className="field">
                <label htmlFor="transcript">Transcript</label>
                <textarea id="transcript" className="cxone-textarea" placeholder="Paste transcript or chat history..." value={transcript} onChange={(e)=>setTranscript(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="cxone-form-panel" data-tab="booking" style={{display: selectedTab==='booking' ? 'block':'none'}}>
            <div className="field" style={{marginBottom:16}}>
              <button type="button" className="advisor-chip">🏢 Voyage Type: {customer.voyageType || 'N/A'}</button>
            </div>
            
            <div className="short-row">
                <div className="field"><label>Booking Number</label><input type="text" value={bookingNumber} onChange={(e)=>setBookingNumber(e.target.value)} placeholder="Booking or reservation Number" /></div>
                <div className="field"><label>Booking Date</label><input type="datetime-local" value={bookingDate} onChange={(e)=>setBookingDate(e.target.value)} /></div>
                <div className="field"><label>Booking Notes</label><textarea className="cxone-textarea" value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Additional booking details..." /></div>
            </div>
          </div>

          <div className="cxone-form-panel" data-tab="pcc" style={{display: selectedTab==='pcc' ? 'block':'none'}}>
            
            <div className="short-row">
                <div className="field"><label>Call transfer (if any)</label><input type="text" id="transferTo" placeholder="Transfer to queue or agent" /></div>
            </div>
          </div>

          <div className="cxone-form-panel" data-tab="mediaType" style={{display: selectedTab==='mediaType' ? 'block':'none'}}>
            <section className="panel" aria-labelledby="mediaType">
              <h3 id="mediaType">Media Type</h3>
              <div style={{marginTop:8, display:'flex', gap:12, alignItems:'center'}}>
                <button type="button" className="btn-save"> EMail</button>
                <button type="button" className="btn-ghost">💬 Chat</button>
                <button type="button" className="btn-ghost">📱 SMS</button>
              </div>
            </section>
          </div>

        </div>
      </main>

      <div className="controls">
        <div className="footer-note" style={{flex:1}}>© <span id="copyrightYear">{new Date().getFullYear()}</span> <span id="serviceFooterName">Service Line</span> — <span id="serviceFooterTagline">We connect you</span></div>
        <div className="control-buttons">
          <button id="btnCancel" className="btn-ghost cxone-btn-secondary" type="button" onClick={()=>{ if(window.confirm('Discard changes?')){ console.log('Changes discarded.'); } }}>Cancel</button>
          <button id="btnNext" className="btn-next cxone-btn-primary" type="button" onClick={onSaveNext} disabled={!intent}>Save & Next</button>
        </div>
      </div>
    </div>
  );
}
