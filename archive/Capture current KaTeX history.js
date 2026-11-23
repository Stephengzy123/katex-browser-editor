(async()=>{
  'use strict';
  if(typeof sessionData==='function'&&typeof historyEdits!=='undefined'){
    const session=sessionData();downloadSession(session,'katex-session-backup.json');
    alert('This editor already has persistent history. Your session backup has been exported.');return session;
  }
  const source=document.getElementById('source');
  if(!(source instanceof HTMLTextAreaElement))throw Error('Run this in the still-open KaTeX editor tab.');
  if(window.__katexCaptureRunning)throw Error('A capture is already running.');
  window.__katexCaptureRunning=true;
  const snap=()=>({source:source.value,start:source.selectionStart,end:source.selectionEnd,direction:source.selectionDirection||'none'});
  const original=snap(),mode=document.getElementById('mode').value,theme=document.documentElement.dataset.theme==='dark'?'dark':'light';
  const recovery=window.__katexHistoryRecovery={original,undoWalk:[original],redoWalk:[],warnings:[],startedAt:Date.now()};
  const download=(value,filename)=>{const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  const diff=(a,b)=>{
    let at=0;while(at<a.source.length&&at<b.source.length&&a.source[at]===b.source[at])at++;
    let endA=a.source.length,endB=b.source.length;
    while(endA>at&&endB>at&&a.source[endA-1]===b.source[endB-1]){endA--;endB--;}
    const caret=s=>({start:s.start,end:s.end,direction:s.direction});
    return {at,removed:a.source.slice(at,endA),inserted:b.source.slice(at,endB),before:caret(a),after:caret(b)};
  };
  const compact=states=>({base:states[0],edits:states.slice(1).map((state,i)=>({...diff(states[i],state),group:i+1,kind:'capturedNativeEdit',time:Date.now()}))});
  const makeSession=(states,index)=>({format:'local-katex-editor-session',version:2,source:states[index].source,...compact(states),index,selection:{start:original.start,end:original.end,direction:original.direction},mode,theme,fullSizeMath:true,updatedAt:Date.now()});
  async function persist(value,key){
    let stored=false;
    try{localStorage.setItem('local-katex-editor:'+key,JSON.stringify(value));stored=true;}catch{}
    try{
      const database=await new Promise((resolve,reject)=>{const request=indexedDB.open('local-katex-editor',1);request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('sessions'))request.result.createObjectStore('sessions');};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('Storage blocked.'));});
      await new Promise((resolve,reject)=>{const tx=database.transaction('sessions','readwrite');tx.objectStore('sessions').put(value,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Storage interrupted.'));});database.close();stored=true;
    }catch{}
    return stored;
  }
  const baseline=makeSession([original],0);
  // Save and download the visible text BEFORE issuing even one native-history command.
  recovery.baselineStored=await persist(baseline,'pre-capture');
  download(baseline,'katex-current-text-backup.json');
  const overlay=document.createElement('div');overlay.style.cssText='position:fixed;inset:0;overflow:auto;z-index:2147483647;background:#fff;color:#111;padding:32px;font:16px/1.6 system-ui;';
  const message=document.createElement('p');message.textContent='Your current text has been backed up. Capturing history; do not reload or type yet.';overlay.append(message);document.body.append(overlay);
  const block=event=>{if(event.isTrusted){event.preventDefault();event.stopImmediatePropagation();}};
  document.addEventListener('keydown',block,true);document.addEventListener('pointerdown',block,true);
  async function walk(command,states){
    let count=0,unchanged=0;
    while(document.queryCommandEnabled(command)){
      const before=snap();source.focus();
      if(!document.execCommand(command))break;
      const after=snap();states.push(after);count++;
      unchanged=before.source===after.source?unchanged+1:0;
      if(unchanged>=64||count>=100000){recovery.warnings.push('The '+command+' traversal stopped at a safety boundary; some older or alternate states may be unavailable.');break;}
      if(count%100===0)await new Promise(resolve=>setTimeout(resolve,0));
    }
  }
  try{
    source.focus();await walk('undo',recovery.undoWalk);
    recovery.redoWalk.push(snap());await walk('redo',recovery.redoWalk);
  }catch(error){recovery.warnings.push('Native traversal stopped: '+error.message);}
  // Build the past from observed UNDO snapshots, not assumed redo counts.
  const past=recovery.undoWalk.slice().reverse().filter((state,i,states)=>i===0||state.source!==states[i-1].source);
  if(!past.length||past[past.length-1].source!==original.source)past.push(original);
  else past[past.length-1]=original;
  let originalInRedo=-1;
  for(let i=0;i<recovery.redoWalk.length;i++){
    if(recovery.redoWalk[i].source===original.source){
      originalInRedo=i;
      if(past.length<2||i>0&&recovery.redoWalk[i-1].source===past[past.length-2].source)break;
    }
  }
  const future=originalInRedo<0?[]:recovery.redoWalk.slice(originalInRedo+1).filter((state,i,states)=>state.source!==(i?states[i-1].source:original.source));
  if(originalInRedo<0&&recovery.redoWalk.length>1)recovery.warnings.push('Native redo did not reproduce the starting text. All observed redo states are preserved separately in the recovery backup.');
  const session=makeSession([...past,...future],past.length-1);
  const alternate=recovery.redoWalk.length?compact(recovery.redoWalk):null;
  session.captureRecovery={warnings:recovery.warnings,redoSequence:alternate};
  recovery.session=session;
  await persist(session,'capture-recovery');
  const stored=await persist(session,'current');
  if(stored){try{localStorage.setItem('local-katex-editor:session:v1',JSON.stringify(session));}catch{}}
  // The original text is restored explicitly. We now have a separate, replayable edit history.
  // Do not issue more native undo commands in an attempt to restore a presumed stack position.
  source.value=original.source;source.setSelectionRange(original.start,original.end,original.direction);
  source.dispatchEvent(new Event('input',{bubbles:true}));
  try{localStorage.setItem('local-katex-editor:v1',JSON.stringify({source:original.source,mode}));}catch{}
  document.removeEventListener('keydown',block,true);document.removeEventListener('pointerdown',block,true);window.__katexCaptureRunning=false;
  message.textContent='Your starting text has been restored. Captured '+(past.length-1)+' undo states and '+future.length+' redo states. '+(stored?'The updated editor can restore them after reload.':'Download the session below before reloading, then use Session → Import session.');
  if(recovery.warnings.length){const warning=document.createElement('p');warning.textContent=recovery.warnings.join(' ');overlay.append(warning);}
  const button=document.createElement('button');button.textContent='Download captured session';button.style.cssText='font:inherit;padding:8px 12px;margin:8px';button.onclick=()=>download(session,'katex-recovered-session.json');overlay.append(button);
  const close=document.createElement('button');close.textContent='Close';close.style.cssText=button.style.cssText;close.onclick=()=>{overlay.remove();source.focus();};overlay.append(close);
  console.log('KaTeX recovery backup (also available as window.__katexHistoryRecovery):',recovery);
  return session;
})();
