// Reads JSON responses and turns non-2xx responses into normal JavaScript errors.
async function api(url, options={}) {
  const response = await fetch(url, {headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
  if (!response.ok) {
    let body={}; try { body=await response.json(); } catch (_) {}
    throw new Error(body.message || `Request failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}
function toast(message,error=false){const box=document.querySelector('.toast');box.textContent=message;box.className=`toast show${error?' error':''}`;setTimeout(()=>box.className='toast',2800)}
function esc(value=''){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]))}
function localInput(value){if(!value)return '';const date=new Date(value);const pad=n=>String(n).padStart(2,'0');return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`}
async function ensureDemo(){await api('/api/schedule/demo-data',{method:'POST'});toast('Demo users and event are ready');}
