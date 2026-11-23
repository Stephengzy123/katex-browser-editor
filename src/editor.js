
const COMMON_PROOF_NOTATION_IDS = ['fraction', 'power', 'times', 'sqrt', 'root', 'subscript', 'sum', 'absolute', 'layout-align-star', 'layout-gathered', 'matrix', 'cases'];
const f = (key, label, value) => ({ key, label, value });
const expression = () => f('expression', 'Expression', 'a_n');
const PROOF_NOTATIONS = [
    { id: 'sum', group: 'Sums and products', label: 'Summation ∑', template: String.raw `\sum_{ {{lower}} }^{ {{upper}} } {{expression}}`, fields: [f('lower', 'Lower bound', 'n=1'), f('upper', 'Upper bound', String.raw `\infty`), expression()] },
    { id: 'product', group: 'Sums and products', label: 'Product ∏', template: String.raw `\prod_{ {{lower}} }^{ {{upper}} } {{expression}}`, fields: [f('lower', 'Lower bound', 'n=1'), f('upper', 'Upper bound', 'N'), expression()] },
    { id: 'fraction', group: 'Algebra', label: 'Fraction a/b', template: String.raw `\frac{ {{numerator}} }{ {{denominator}} }`, fields: [f('numerator', 'Numerator', 'a'), f('denominator', 'Denominator', 'b')] },
    { id: 'power', group: 'Algebra', label: 'Power / exponent', template: '{{base}}^{ {{exponent}} }', fields: [f('base', 'Base', 'x'), f('exponent', 'Exponent', '2')] },
    { id: 'subscript', group: 'Algebra', label: 'Subscript', template: '{{base}}_{ {{index}} }', fields: [f('base', 'Base', 'a'), f('index', 'Subscript', 'n')] },
    { id: 'sqrt', group: 'Algebra', label: 'Square root √', template: String.raw `\sqrt{ {{expression}} }`, fields: [f('expression', 'Expression', 'x')] },
    { id: 'root', group: 'Algebra', label: 'Nth root', template: String.raw `\sqrt[{{index}}]{ {{expression}} }`, fields: [f('index', 'Root index', '3'), f('expression', 'Expression', 'x')] },
    { id: 'binomial', group: 'Algebra', label: 'Binomial coefficient', template: String.raw `\binom{ {{top}} }{ {{bottom}} }`, fields: [f('top', 'Top', 'n'), f('bottom', 'Bottom', 'k')] },
    { id: 'absolute', group: 'Algebra', label: 'Absolute value |x|', template: String.raw `\left| {{expression}} \right|`, fields: [f('expression', 'Expression', 'x')] },
    { id: 'floor', group: 'Algebra', label: 'Floor ⌊x⌋', template: String.raw `\left\lfloor {{expression}} \right\rfloor`, fields: [f('expression', 'Expression', 'x')] },
    { id: 'ceiling', group: 'Algebra', label: 'Ceiling ⌈x⌉', template: String.raw `\left\lceil {{expression}} \right\rceil`, fields: [f('expression', 'Expression', 'x')] },
    { id: 'log', group: 'Algebra', label: 'Logarithm with base', template: String.raw `\log_{ {{base}} }\left({{expression}}\right)`, fields: [f('base', 'Base', '2'), f('expression', 'Expression', 'x')] },
    { id: 'ln', group: 'Algebra', label: 'Natural logarithm', template: String.raw `\ln\left({{expression}}\right)`, fields: [f('expression', 'Expression', 'x')] },
    { id: 'factorial', group: 'Algebra', label: 'Factorial n!', template: '{{expression}}!', fields: [f('expression', 'Expression', 'n')] },
    { id: 'parentheses', group: 'Algebra', label: 'Scalable parentheses', template: String.raw `\left({{expression}}\right)`, fields: [f('expression', 'Expression', 'a+b')] },
    { id: 'modulo', group: 'Algebra', label: 'Congruence modulo', template: String.raw `{{left}} \equiv {{right}} \pmod{ {{modulus}} }`, fields: [f('left', 'Left side', 'a'), f('right', 'Right side', 'b'), f('modulus', 'Modulus', 'n')] },
    { id: 'integral', group: 'Calculus', label: 'Definite integral ∫', template: String.raw `\int_{ {{lower}} }^{ {{upper}} } {{expression}}\,d{{variable}}`, fields: [f('lower', 'Lower bound', '0'), f('upper', 'Upper bound', '1'), f('expression', 'Integrand', 'f(x)'), f('variable', 'Variable', 'x')] },
    { id: 'indefinite', group: 'Calculus', label: 'Indefinite integral', template: String.raw `\int {{expression}}\,d{{variable}}`, fields: [f('expression', 'Integrand', 'f(x)'), f('variable', 'Variable', 'x')] },
    { id: 'limit', group: 'Calculus', label: 'Limit', template: String.raw `\lim_{ {{variable}} \to {{target}} } {{expression}}`, fields: [f('variable', 'Variable', 'x'), f('target', 'Approaches', '0'), f('expression', 'Expression', 'f(x)')] },
    { id: 'derivative', group: 'Calculus', label: 'Derivative', template: String.raw `\frac{d}{d{{variable}}}\left({{expression}}\right)`, fields: [f('variable', 'Variable', 'x'), f('expression', 'Expression', 'f(x)')] },
    { id: 'partial', group: 'Calculus', label: 'Partial derivative', template: String.raw `\frac{\partial {{expression}}}{\partial {{variable}}}`, fields: [f('expression', 'Expression', 'f'), f('variable', 'Variable', 'x')] },
    { id: 'vector', group: 'Vectors and layouts', label: 'Vector arrow', template: String.raw `\vec{ {{expression}} }`, fields: [f('expression', 'Expression', 'v')] },
    { id: 'norm', group: 'Vectors and layouts', label: 'Norm ‖v‖', template: String.raw `\left\lVert {{expression}} \right\rVert`, fields: [f('expression', 'Expression', 'v')] },
    { id: 'overline', group: 'Geometry', label: 'Segment / overline', template: String.raw `\overline{ {{expression}} }`, fields: [f('expression', 'Expression', 'AB')] },
    ...['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'arcsin', 'arccos', 'arctan'].map(name => ({ id: name, group: 'Trigonometry', label: name, template: `\\${name}\\left({{expression}}\\right)`, fields: [f('expression', 'Angle', String.raw `\theta`)] })),
    { id: 'matrix', group: 'Vectors and layouts', label: 'Matrix (2 × 2)', template: String.raw `\begin{pmatrix} {{a}} & {{b}} \\ {{c}} & {{d}} \end{pmatrix}`, fields: [f('a', 'Top left', 'a'), f('b', 'Top right', 'b'), f('c', 'Bottom left', 'c'), f('d', 'Bottom right', 'd')] },
    { id: 'cases', group: 'Vectors and layouts', label: 'Piecewise / cases', template: String.raw `\begin{cases} {{first}} & {{condition1}} \\ {{second}} & {{condition2}} \end{cases}`, fields: [f('first', 'First expression', 'x^2'), f('condition1', 'First condition', String.raw`x \ge 0`), f('second', 'Second expression', '-x'), f('condition2', 'Second condition', 'x<0')] },
    { id: 'aligned', group: 'Vectors and layouts', label: 'Aligned equations', template: String.raw `\begin{aligned} {{left1}} &= {{right1}} \\ {{left2}} &= {{right2}} \end{aligned}`, fields: [f('left1', 'First left side', 'a+b'), f('right1', 'First right side', 'c'), f('left2', 'Second left side', 'a'), f('right2', 'Second right side', 'c-b')] },
    { id: 'set', group: 'Sets and probability', label: 'Set builder', template: String.raw `\left\{ {{element}} \mid {{condition}} \right\}`, fields: [f('element', 'Element', 'x'), f('condition', 'Condition', 'x>0')] },
    { id: 'probability', group: 'Sets and probability', label: 'Probability P(A)', template: String.raw `\Pr\left({{expression}}\right)`, fields: [f('expression', 'Event', 'A')] },
    { id: 'expectation', group: 'Sets and probability', label: 'Expectation E[X]', template: String.raw `\mathbb{E}\left[{{expression}}\right]`, fields: [f('expression', 'Random variable', 'X')] },
    ...[
        ['Symbols', 'times', 'Multiply ×', String.raw `\times`], ['Symbols', 'cdot', 'Dot product ·', String.raw `\cdot`],
        ['Symbols', 'divide', 'Divide ÷', String.raw `\div`], ['Symbols', 'pm', 'Plus or minus ±', String.raw `\pm`],
        ['Symbols', 'infinity', 'Infinity ∞', String.raw `\infty`], ['Symbols', 'dots', 'Ellipsis …', String.raw `\ldots`],
        ['Relations and logic', 'le', 'Less than or equal ≤', String.raw `\le`], ['Relations and logic', 'ge', 'Greater than or equal ≥', String.raw `\ge`],
        ['Relations and logic', 'ne', 'Not equal ≠', String.raw `\ne`], ['Relations and logic', 'approx', 'Approximately ≈', String.raw `\approx`],
        ['Relations and logic', 'implies', 'Implies ⇒', String.raw `\implies`], ['Relations and logic', 'iff', 'If and only if ⇔', String.raw `\iff`],
        ['Relations and logic', 'forall', 'For all ∀', String.raw `\forall`], ['Relations and logic', 'exists', 'There exists ∃', String.raw `\exists`],
        ['Relations and logic', 'and', 'And ∧', String.raw `\land`], ['Relations and logic', 'or', 'Or ∨', String.raw `\lor`],
        ['Relations and logic', 'not', 'Not ¬', String.raw `\neg`], ['Relations and logic', 'therefore', 'Therefore ∴', String.raw `\therefore`],
        ['Relations and logic', 'divides', 'Divides ∣', String.raw `\mid`],
        ['Sets and probability', 'in', 'Element of ∈', String.raw `\in`], ['Sets and probability', 'notin', 'Not an element of ∉', String.raw `\notin`],
        ['Sets and probability', 'subset', 'Subset ⊆', String.raw `\subseteq`], ['Sets and probability', 'union', 'Union ∪', String.raw `\cup`],
        ['Sets and probability', 'intersection', 'Intersection ∩', String.raw `\cap`], ['Sets and probability', 'empty', 'Empty set ∅', String.raw `\varnothing`],
        ['Sets and probability', 'naturals', 'Natural numbers ℕ', String.raw `\mathbb{N}`], ['Sets and probability', 'integers', 'Integers ℤ', String.raw `\mathbb{Z}`],
        ['Sets and probability', 'rationals', 'Rational numbers ℚ', String.raw `\mathbb{Q}`], ['Sets and probability', 'reals', 'Real numbers ℝ', String.raw `\mathbb{R}`],
        ['Sets and probability', 'complex', 'Complex numbers ℂ', String.raw `\mathbb{C}`],
        ['Geometry', 'angle', 'Angle ∠', String.raw `\angle`], ['Geometry', 'triangle', 'Triangle △', String.raw `\triangle`],
        ['Geometry', 'parallel', 'Parallel ∥', String.raw `\parallel`], ['Geometry', 'perp', 'Perpendicular ⊥', String.raw `\perp`],
        ['Geometry', 'degree', 'Degrees °', String.raw `{}^\circ`],
    ].map(([group, id, label, template]) => ({ group, id, label, template, fields: [] })),
    ...(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'varepsilon', 'zeta', 'eta', 'theta', 'vartheta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'varphi', 'chi', 'psi', 'omega', 'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi', 'Pi', 'Sigma', 'Phi', 'Psi', 'Omega']).map(name => ({ id: `greek-${name}`, group: 'Greek letters', label: name, template: `\\${name}`, fields: [] })),
    { id: 'custom', group: 'Custom formula', label: 'Custom LaTeX formula', template: '{{expression}}', fields: [f('expression', 'LaTeX', String.raw `x^2+y^2=z^2`)] },
];

const layoutRows=(value)=>({...f('rows','Rows (one per line; use & for alignment or columns)',value),multiline:true});
const layoutHelp='Write one row per line. The helper adds row breaks and alignment markers for your chosen alignment. Only the selected source text is replaced.';
for(const [id,label,environment,rows] of [
  ['align','Align (numbered)','align','a &= b + c\nx &= y + z'],
  ['align-star','Align (no numbering)','align*','a &= b + c\nx &= y + z'],
  ['aligned','Aligned block','aligned','a &= b + c\nx &= y + z'],
  ['gather','Centered equations (numbered)','gather','a = b + c\nx = y + z'],
  ['gathered','Centered equations (no numbering)','gathered','a = b + c\nx = y + z'],
  ['pmatrix','Matrix (parentheses)','pmatrix','a & b\nc & d'],
  ['bmatrix','Matrix (square brackets)','bmatrix','a & b\nc & d'],
  ['vmatrix','Determinant','vmatrix','a & b\nc & d'],
  ['cases','Piecewise / cases (any number of rows)','cases','x^2 & x \\ge 0\n-x & x < 0']
]){
  PROOF_NOTATIONS.push({id:'layout-'+id,group:'Environments and layouts',label,environment,help:layoutHelp,template:'\\begin{'+environment+'}\n{{rows}}\n\\end{'+environment+'}',fields:[layoutRows(rows)]});
}
PROOF_NOTATIONS.push({id:'layout-equation',group:'Environments and layouts',label:'Equation (numbered)',environment:'equation',help:'Select source text to wrap only that expression in an equation block.',template:'\\begin{equation}\n{{expression}}\n\\end{equation}',fields:[{...f('expression','Equation','E=mc^2'),multiline:true}]});

function notationTex(notation, values) {
    return notation.template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? notation.fields.find(f => f.key === key)?.value ?? '');
}
/** Determine whether the cursor is already inside supported math delimiters. */
function mathContextAt(source,position){
  let context=null;
  for(let i=0;i<position;i++){
    if(context&&source.startsWith(context.close,i)){i+=context.close.length-1;context=null;continue;}
    if(source.startsWith('\\$',i)){i++;continue;}
    if(!context){
      const environment=/^\\begin\{(align\*?|alignat\*?|gather\*?|equation\*?|CD)\}/.exec(source.slice(i));
      if(environment){context={close:'\\end{'+environment[1]+'}',display:true};i+=environment[0].length-1;continue;}
      const delimiter=source.startsWith('$$',i)?['$$','$$',true]:source.startsWith('\\[',i)?['\\[','\\]',true]:source.startsWith('\\(',i)?['\\(','\\)',false]:source[i]==='$'?['$','$',false]:null;
      if(delimiter){context={close:delimiter[1],display:delimiter[2]};i+=delimiter[0].length-1;continue;}
    }
    if(source[i]==='\\')i++;
  }
  return context;
}
function inMathAt(source,position){return Boolean(mathContextAt(source,position));}

function mathInsertion(source, position, tex, display) {
    if (inMathAt(source, position))
        return tex;
    return display ? `\n$$${tex}$$\n` : `$${tex}$`;
}

const $=id=>document.getElementById(id);
const source=$('source'),mode=$('mode'),preview=$('preview'),dialog=$('dialog'),notation=$('notation'),fields=$('fields');
const storageKey='local-katex-editor:v1';
const themeKey='local-katex-editor:theme';
function setTheme(theme){
  const dark=theme==='dark';
  document.documentElement.dataset.theme=dark?'dark':'light';
  $('theme').textContent=dark?'Dark':'Light';
  $('theme').setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
}
let savedTheme='light';
try{savedTheme=localStorage.getItem(themeKey)||'light';}catch{}
setTheme(savedTheme);
$('theme').addEventListener('click',()=>{
  const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
  setTheme(theme);save();
});
const sample=String.raw`\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}`;
let selected,selection={start:0,end:0},saveTimer;
source.value=sample;
try{const saved=JSON.parse(localStorage.getItem(storageKey));if(saved && typeof saved.source==='string'){source.value=saved.source;mode.value=saved.mode==='document'?'document':'equation';}}catch{}
const sessionKey='local-katex-editor:session:v1'; // Also accepts the one-time capture from an older editor.
const sessionFormat='local-katex-editor-session';
let historyBase=snapshot(),historyEdits=[],historyIndex=0,currentSource=source.value;
let pendingEdit=null,lastEdit=null,composing=false,historyGroup=0,sessionDatabase=null,sessionReady=false,persistQueue=Promise.resolve();
function caret(){return {start:source.selectionStart,end:source.selectionEnd,direction:source.selectionDirection||'none'};}
function snapshot(){return {source:source.value,...caret()};}
function diffEdit(before,after){
  let at=0,tail=0;
  while(at<before.length&&at<after.length&&before[at]===after[at])at++;
  while(tail<before.length-at&&tail<after.length-at&&before[before.length-1-tail]===after[after.length-1-tail])tail++;
  return {at,removed:before.slice(at,before.length-tail),inserted:after.slice(at,after.length-tail)};
}
function applyEdit(text,edit,reverse=false){
  const removed=reverse?edit.inserted:edit.removed,inserted=reverse?edit.removed:edit.inserted;
  if(edit.at<0||edit.at+removed.length>text.length||text.slice(edit.at,edit.at+removed.length)!==removed)throw Error('The session contains inconsistent edit history.');
  return text.slice(0,edit.at)+inserted+text.slice(edit.at+removed.length);
}
function validCaret(value,length){return value&&Number.isInteger(value.start)&&Number.isInteger(value.end)&&value.start>=0&&value.end>=value.start&&value.end<=length&&['none','forward','backward'].includes(value.direction);}
function normalizeSession(value){
  const invalid=()=>{throw Error('This file is not a valid KaTeX editor session.');};
  if(!value||value.format!==sessionFormat||!['equation','document'].includes(value.mode)||!['light','dark'].includes(value.theme))invalid();
  if(value.version===1){
    const history=value.history;
    if(!history||!Array.isArray(history.entries)||!history.entries.length||!Number.isInteger(history.index)||history.index<0||history.index>=history.entries.length)invalid();
    const entries=history.entries;
    for(const entry of entries)if(!entry||typeof entry.source!=='string'||!validCaret(entry,entry.source.length))invalid();
    const edits=entries.slice(1).map((entry,index)=>({...diffEdit(entries[index].source,entry.source),before:{start:entries[index].start,end:entries[index].end,direction:entries[index].direction},after:{start:entry.start,end:entry.end,direction:entry.direction},group:index+1,time:Date.now(),kind:'capturedEdit'}));
    value={...value,version:2,base:entries[0],edits,index:history.index,source:entries[history.index].source};
  }
  if(value.version!==2||!value.base||typeof value.base.source!=='string'||!validCaret(value.base,value.base.source.length)||!Array.isArray(value.edits)||!Number.isInteger(value.index)||value.index<0||value.index>value.edits.length)invalid();
  let text=value.base.source,current=value.index===0?text:null;
  const edits=[];
  for(let i=0;i<value.edits.length;i++){
    const edit=value.edits[i];
    if(!edit||!Number.isInteger(edit.at)||typeof edit.removed!=='string'||typeof edit.inserted!=='string'||!Number.isSafeInteger(edit.group)||edit.group<0||!Number.isFinite(edit.time)||typeof edit.kind!=='string'||!validCaret(edit.before,text.length))invalid();
    text=applyEdit(text,edit);
    if(!validCaret(edit.after,text.length))invalid();
    edits.push({at:edit.at,removed:edit.removed,inserted:edit.inserted,before:{...edit.before},after:{...edit.after},group:edit.group,time:edit.time,kind:edit.kind});
    if(i+1===value.index)current=text;
  }
  if(value.source!==current)invalid();
  return {...value,edits,images:validateImageAssets(value.images)};
}
function sessionData(){
  return {format:sessionFormat,version:2,name:activeTab()?.name,source:source.value,mode:mode.value,theme:document.documentElement.dataset.theme==='dark'?'dark':'light',images:imageAssets,base:historyBase,edits:historyEdits,index:historyIndex,selection:caret(),fullSizeMath:$('full-size-math').checked,updatedAt:Date.now()};
}
function restoreSession(value){
  const session=normalizeSession(value);
  imageAssets=session.images;
  historyBase={...session.base};historyEdits=session.edits;historyIndex=session.index;currentSource=session.source;source.value=currentSource;
  const selection=validCaret(session.selection,currentSource.length)?session.selection:historyIndex?historyEdits[historyIndex-1].after:historyBase;
  source.setSelectionRange(selection.start,selection.end,selection.direction);
  mode.value=session.mode;setTheme(session.theme);$('full-size-math').checked=session.fullSizeMath!==false;
  historyGroup=historyEdits.reduce((max,edit)=>Math.max(max,edit.group),0);lastEdit=null;pendingEdit=null;
}
function historyStatus(){
  if($('history-info'))$('history-info').textContent=historyEdits.length.toLocaleString()+' recorded edits · '+historyIndex.toLocaleString()+' applied';
}
function commitEdit(type='insertReplacementText',before=pendingEdit){
  const next=source.value;if(next===currentSource){pendingEdit=null;return;}
  const now=Date.now(),previous=historyIndex?historyEdits[historyIndex-1].after:historyBase;
  const beforeCaret=before&&before.source===currentSource?{start:before.start,end:before.end,direction:before.direction}:{start:Math.min(previous.start,currentSource.length),end:Math.min(previous.end,currentSource.length),direction:previous.direction};
  const typing=['insertText','deleteContentBackward','deleteContentForward'].includes(type);
  const combine=historyIndex===historyEdits.length&&lastEdit&&lastEdit.type===type&&now-lastEdit.time<1000&&((composing&&type==='insertCompositionText')||(typing&&beforeCaret.start===beforeCaret.end&&beforeCaret.start===lastEdit.end));
  if(!combine)historyGroup++;
  historyEdits.splice(historyIndex);
  historyEdits.push({...diffEdit(currentSource,next),before:beforeCaret,after:caret(),group:historyGroup,time:now,kind:type});historyIndex++;
  currentSource=next;lastEdit={type,time:now,end:source.selectionEnd};pendingEdit=null;historyStatus();
}
function historyStep(delta){
  if(!sessionReady)return;
  if(delta<0&&historyIndex>0){
    const group=historyEdits[historyIndex-1].group;let selection;
    do{const edit=historyEdits[--historyIndex];currentSource=applyEdit(currentSource,edit,true);selection=edit.before;if(edit.kind==='insertImageAndConvert')mode.value='equation';}while(historyIndex>0&&historyEdits[historyIndex-1].group===group);
    source.value=currentSource;source.setSelectionRange(selection.start,selection.end,selection.direction);
  }else if(delta>0&&historyIndex<historyEdits.length){
    const group=historyEdits[historyIndex].group;let selection;
    do{const edit=historyEdits[historyIndex++];currentSource=applyEdit(currentSource,edit);selection=edit.after;if(edit.kind==='insertImageAndConvert')mode.value='document';}while(historyIndex<historyEdits.length&&historyEdits[historyIndex].group===group);
    source.value=currentSource;source.setSelectionRange(selection.start,selection.end,selection.direction);
  }else return;
  lastEdit=null;pendingEdit=null;source.focus();render();historyStatus();save();
}
source.addEventListener('beforeinput',event=>{
  if(event.inputType==='historyUndo'||event.inputType==='historyRedo'){event.preventDefault();historyStep(event.inputType==='historyUndo'?-1:1);return;}
  pendingEdit=snapshot();
});
source.addEventListener('compositionstart',()=>{composing=true;lastEdit=null;});
source.addEventListener('compositionend',()=>{composing=false;lastEdit=null;save();});
source.addEventListener('blur',()=>{lastEdit=null;});
source.addEventListener('pointerdown',()=>{lastEdit=null;});
source.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key))lastEdit=null;});
document.addEventListener('keydown',event=>{
  if($('settings-dialog').open||$('rename-dialog').open||document.activeElement===$('document-name')||dialog.open||$('image-dialog').open||composing||event.altKey||!(event.metaKey||event.ctrlKey))return;
  if(event.key.toLowerCase()==='z'){event.preventDefault();historyStep(event.shiftKey?1:-1);}
  else if(event.ctrlKey&&event.key.toLowerCase()==='y'){event.preventDefault();historyStep(1);}
});
function openSessionDatabase(){return new Promise((resolve,reject)=>{
  const request=indexedDB.open('local-katex-editor',1);request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('sessions'))request.result.createObjectStore('sessions');};
  request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
  request.onblocked=()=>reject(Error('Session storage is blocked by another tab.'));
});}
function readDatabase(key='current'){return new Promise((resolve,reject)=>{const request=sessionDatabase.transaction('sessions').objectStore('sessions').get(key);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
function writeDatabase(workspace,value){return new Promise((resolve,reject)=>{
  const transaction=sessionDatabase.transaction('sessions','readwrite');transaction.objectStore('sessions').put(workspace,'workspace');transaction.objectStore('sessions').put(value,'current');transaction.oncomplete=resolve;transaction.onerror=()=>reject(transaction.error);transaction.onabort=()=>reject(transaction.error||Error('Session storage was interrupted.'));
});}
const workspaceKey='local-katex-editor:workspace:v1',workspaceFormat='local-katex-editor-workspace';
let workspaceTabs=[],activeTabId=null;
function normalizedName(value,fallback='Untitled'){
  return typeof value==='string'&&value.trim()?value.replace(/[\r\n\t]+/g,' ').trim().slice(0,80):fallback;
}
function downloadName(){return normalizedName(activeTab()?.name).replace(/[<>:"/\\|?*\x00-\x1f]/g,'-').replace(/[. ]+$/,'').trim()||'Untitled';}
function activeTab(){return workspaceTabs.find(tab=>tab.id===activeTabId);}
function downloadName(){return normalizedName(activeTab()?.name).replace(/[<>:"/\\|?*\u0000-\u001f]/g,'-').replace(/[. ]+$/g,'')||'Untitled';}
function captureActiveTab(){
  const tab=activeTab();if(!tab)return;
  const value=sessionData();tab.session={...value,edits:value.edits.slice()};
  tab.view={sourceScroll:source.scrollTop,previewScroll:preview.scrollTop,expanded:$('columns').dataset.expanded||''};
}
function workspaceData(){captureActiveTab();return {format:workspaceFormat,version:1,activeId:activeTabId,theme:document.documentElement.dataset.theme==='dark'?'dark':'light',tabs:workspaceTabs.map(tab=>({...tab})),updatedAt:Date.now()};}
function normalizeWorkspace(value){
  if(!value||value.version!==1||value.format!==workspaceFormat||!Array.isArray(value.tabs)||!value.tabs.length||value.tabs.length>10||!['light','dark'].includes(value.theme))throw Error('This is not a valid KaTeX tabs backup.');
  const ids=new Set();
  const tabs=value.tabs.map((tab,index)=>{
    if(!tab||typeof tab.id!=='string'||!/^[a-f0-9-]{36}$/i.test(tab.id)||ids.has(tab.id))throw Error('Invalid or duplicate tab identifier.');ids.add(tab.id);
    return {id:tab.id,name:normalizedName(tab.name,'Untitled '+(index+1)),session:normalizeSession(tab.session),view:tab.view&&typeof tab.view==='object'?{sourceScroll:Number(tab.view.sourceScroll)||0,previewScroll:Number(tab.view.previewScroll)||0,expanded:['source','preview'].includes(tab.view.expanded)?tab.view.expanded:''}:{}};
  });
  if(!ids.has(value.activeId))throw Error('The active tab is missing from this backup.');
  return {...value,tabs};
}
let renamingTabId=null;
const pencilIcon='<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 5 5L8 21H3v-5Z"/><path d="m13 6 5 5"/></svg>';
function renderTabs(){
  const list=$('document-tabs');list.replaceChildren();
  for(const tab of workspaceTabs){
    const group=document.createElement('div');group.className='document-tab';group.dataset.active=String(tab.id===activeTabId);group.setAttribute('role','presentation');
    const button=document.createElement('button');button.type='button';button.role='tab';button.textContent=tab.name;button.title=tab.name;button.dataset.tabId=tab.id;button.id='document-tab-'+tab.id;button.setAttribute('aria-selected',String(tab.id===activeTabId));button.setAttribute('aria-controls','columns');button.tabIndex=tab.id===activeTabId?0:-1;
    button.addEventListener('click',()=>switchTab(tab.id));group.append(button);
    const rename=document.createElement('button');rename.type='button';rename.className='tab-icon';rename.dataset.renameTab=tab.id;rename.title='Rename '+tab.name;rename.setAttribute('aria-label','Rename '+tab.name);rename.innerHTML=pencilIcon;rename.disabled=!sessionReady;
    rename.addEventListener('click',()=>{renamingTabId=tab.id;$('document-name').value=tab.name;$('rename-dialog').showModal();$('document-name').focus();$('document-name').select();});group.append(rename);
    const close=document.createElement('button');close.type='button';close.className='tab-icon';close.title='Close '+tab.name;close.setAttribute('aria-label','Close '+tab.name);close.textContent='×';close.disabled=!sessionReady;close.addEventListener('click',()=>closeDocumentTab(tab.id));group.append(close);list.append(group);
  }
  $('new-tab').disabled=workspaceTabs.length>=10||!sessionReady;
  $('tab-count').textContent=workspaceTabs.length+'/10';document.title=downloadName();
}
function restoreTab(tab,theme){
  restoreSession({...tab.session,theme});
  const columns=$('columns');if(['source','preview'].includes(tab.view?.expanded))columns.dataset.expanded=tab.view.expanded;else delete columns.dataset.expanded;
  source.scrollTop=tab.view?.sourceScroll||0;preview.scrollTop=tab.view?.previewScroll||0;
  for(const control of document.querySelectorAll('[data-expand]')){control.textContent=columns.dataset.expanded===control.dataset.expand?'Restore':'Expand';control.setAttribute('aria-expanded',String(columns.dataset.expanded===control.dataset.expand));}
  render();historyStatus();renderTabs();source.scrollTop=tab.view?.sourceScroll||0;preview.scrollTop=tab.view?.previewScroll||0;
}
function restoreWorkspace(value){const data=normalizeWorkspace(value);workspaceTabs=data.tabs;activeTabId=data.activeId;restoreTab(activeTab(),data.theme);}
function switchTab(id){
  if(!sessionReady||composing||id===activeTabId||!workspaceTabs.some(tab=>tab.id===id))return;
  captureActiveTab();const theme=document.documentElement.dataset.theme==='dark'?'dark':'light';activeTabId=id;restoreTab(activeTab(),theme);save();$('status').textContent='';
}
function addTab(session=null,name=null){
  if(!sessionReady||workspaceTabs.length>=10){$('status').textContent='You can keep up to 10 tabs. Export and close a tab before adding another.';return false;}
  captureActiveTab();
  let number=1;while(workspaceTabs.some(tab=>tab.name==='Untitled '+number))number++;
  const theme=document.documentElement.dataset.theme==='dark'?'dark':'light';
  const value=session?normalizeSession(session):{format:sessionFormat,version:2,source:'',base:{source:'',start:0,end:0,direction:'none'},edits:[],index:0,mode:mode.value,theme,fullSizeMath:true,images:Object.create(null)};
  const tab={id:crypto.randomUUID(),name:normalizedName(name||value.name,'Untitled '+number),session:value,view:{}};workspaceTabs.push(tab);activeTabId=tab.id;restoreTab(tab,theme);save();source.focus();return true;
}
$('new-tab').addEventListener('click',()=>addTab());
$('rename-form').addEventListener('submit',event=>{
  event.preventDefault();const tab=workspaceTabs.find(tab=>tab.id===renamingTabId);if(!tab)return;
  tab.name=normalizedName($('document-name').value,tab.name);tab.session={...tab.session,name:tab.name};save();renderTabs();$('rename-dialog').close();
});
$('cancel-rename').addEventListener('click',()=>$('rename-dialog').close());
$('rename-dialog').addEventListener('close',()=>{const button=document.querySelector('[data-rename-tab="'+renamingTabId+'"]');button?.focus({preventScroll:true});renamingTabId=null;});
$('document-tabs').addEventListener('keydown',event=>{
  if(event.target.getAttribute('role')!=='tab'||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();
  const index=workspaceTabs.findIndex(tab=>tab.id===activeTabId);const next=event.key==='Home'?0:event.key==='End'?workspaceTabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+workspaceTabs.length)%workspaceTabs.length;
  switchTab(workspaceTabs[next].id);$('document-tab-'+activeTabId).focus();
});
function closeDocumentTab(id){
  if(!sessionReady)return;const tab=workspaceTabs.find(tab=>tab.id===id);if(!tab)return;
  if(!confirm('Close “'+tab.name+'”? Export its session first if you want to keep a separate backup.'))return;
  captureActiveTab();if(sessionDatabase){try{sessionDatabase.transaction('sessions','readwrite').objectStore('sessions').put(workspaceData(),'before-close');}catch{}}
  const index=workspaceTabs.findIndex(tab=>tab.id===id),wasActive=id===activeTabId,theme=document.documentElement.dataset.theme==='dark'?'dark':'light';workspaceTabs.splice(index,1);
  if(!workspaceTabs.length){activeTabId=null;addTab();}
  else if(wasActive){activeTabId=workspaceTabs[Math.min(index,workspaceTabs.length-1)].id;restoreTab(activeTab(),theme);save();}
  else{renderTabs();save();}
}
$('export-tabs').addEventListener('click',()=>{if(!sessionReady)return;downloadSession(workspaceData(),'KaTeX tabs.json');$('status').textContent='All tabs exported with their images and undo/redo history.';});

async function initializeSession(){
  source.disabled=true;
  let savedWorkspace=null;
  try{
    sessionDatabase=await openSessionDatabase();
    savedWorkspace=await readDatabase('workspace');
  }catch{$('status').textContent='Session storage is unavailable. Export all tabs to keep a backup.';}
  try{
    const mirror=JSON.parse(localStorage.getItem(workspaceKey));
    if(mirror){const valid=normalizeWorkspace(mirror);if(!savedWorkspace||(valid.updatedAt||0)>=(savedWorkspace.updatedAt||0))savedWorkspace=valid;}
  }catch{}
  let loaded=false;
  if(savedWorkspace){try{restoreWorkspace(savedWorkspace);loaded=true;}catch{$('status').textContent='Could not restore the tabs backup. Your previous draft is still available.';}}
  if(!loaded){
    let saved;
    try{if(sessionDatabase)saved=await readDatabase();}catch{}
    try{const candidate=JSON.parse(localStorage.getItem(sessionKey));if(candidate){const captured=normalizeSession(candidate);if(!saved||(captured.updatedAt||0)>=(saved.updatedAt||0))saved=captured;}}catch{}
    if(saved){try{restoreSession(saved);}catch{}}
    const tab={id:crypto.randomUUID(),name:normalizedName(saved?.name,'Untitled 1'),session:sessionData(),view:{}};workspaceTabs=[tab];activeTabId=tab.id;
  }
  sessionReady=true;source.disabled=false;render();historyStatus();renderTabs();save();
}
function save(){
  if(!sessionReady)return;
  const workspace=workspaceData(),value=activeTab().session;
  try{localStorage.setItem(storageKey,JSON.stringify({source:value.source,mode:value.mode}));localStorage.setItem(themeKey,workspace.theme);}catch{}
  // IndexedDB is primary; synchronous mirrors recover a reload that interrupts its transaction.
  try{localStorage.setItem(workspaceKey,JSON.stringify(workspace));}catch{}
  try{localStorage.setItem(sessionKey,JSON.stringify(value));}catch{}
  const failed=()=>{$('status').textContent='Could not save tabs locally. Export all tabs to keep a backup.';};
  try{if(sessionDatabase)persistQueue=writeDatabase(workspace,value).catch(failed);else localStorage.setItem(workspaceKey,JSON.stringify(workspace));}catch{failed();}
}

function downloadSession(value,filename=downloadName()+'.json'){
  const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$('export-session').addEventListener('click',()=>{if(!sessionReady)return;downloadSession(sessionData());$('status').textContent='Session exported with undo/redo history.';});
$('import-session').addEventListener('click',()=>{if(sessionReady){$('session-file').click();}});
$('session-file').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try{
    const raw=JSON.parse(await file.text());
    const value=raw.format===workspaceFormat?normalizeWorkspace(raw):normalizeSession(raw);
    if(sessionDatabase){try{sessionDatabase.transaction('sessions','readwrite').objectStore('sessions').put(workspaceData(),'before-import');}catch{}}
    if(value.format===workspaceFormat){restoreWorkspace(value);save();$('status').textContent='All tabs imported with their history and images.';}
    else if(addTab(value,normalizedName(value.name,file.name.replace(/\.json$/i,''))))$('status').textContent='Session imported in a new tab with undo/redo history.';
  }catch(error){$('status').textContent=error.message||'Could not import this session.';}
  event.target.value='';
});



const imageLimits={file:10*1024*1024,pixels:25000000,dimension:16000,stored:5*1024*1024,total:25*1024*1024,count:32};
let imageAssets=Object.create(null),imageSelection=null,importingImage=false,pendingImage=null;
function rasterInfo(bytes){
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  if(bytes.length>=24&&[137,80,78,71,13,10,26,10].every((byte,i)=>bytes[i]===byte)&&String.fromCharCode(...bytes.slice(12,16))==='IHDR')return {type:'image/png',width:view.getUint32(16),height:view.getUint32(20)};
  if(bytes.length>=4&&bytes[0]===255&&bytes[1]===216){
    let offset=2;
    while(offset+3<bytes.length){
      if(bytes[offset++]!==255)break;while(offset<bytes.length&&bytes[offset]===255)offset++;
      const marker=bytes[offset++];if(marker===217||marker===218)break;
      if(marker===1||marker>=208&&marker<=215)continue;
      if(offset+2>bytes.length)break;const length=view.getUint16(offset);if(length<2||offset+length>bytes.length)break;
      if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)&&length>=8)return {type:'image/jpeg',height:view.getUint16(offset+3),width:view.getUint16(offset+5)};
      offset+=length;
    }
  }
  throw Error('Only valid PNG or JPEG images are supported.');
}
function checkRaster(info){if(!info.width||!info.height||info.width>imageLimits.dimension||info.height>imageLimits.dimension||info.width*info.height>imageLimits.pixels)throw Error('Image dimensions exceed the limit (25 megapixels, 16,000 pixels per side).');}
function validateImageAssets(value){
  if(value===undefined)return Object.create(null);
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid session images.');
  const entries=Object.entries(value);if(entries.length>imageLimits.count)throw Error('Too many session images (maximum 32).');
  const assets=Object.create(null);let total=0;
  for(const [id,asset] of entries){
    if(!/^[a-f0-9-]{36}$/i.test(id)||!asset||typeof asset.name!=='string'||asset.name.length>256||typeof asset.data!=='string'||asset.data.length>imageLimits.stored*1.4)throw Error('Invalid session image.');
    const match=/^data:(image\/(?:png|jpeg));base64,([A-Za-z0-9+/]+={0,2})$/.exec(asset.data);if(!match)throw Error('Session images must be embedded PNG/JPEG files.');
    const raw=atob(match[2]);total+=raw.length;if(raw.length>imageLimits.stored||total>imageLimits.total)throw Error('Session images exceed the size limit (5 MB each, 25 MB total).');
    const info=rasterInfo(Uint8Array.from(raw,char=>char.charCodeAt(0)));checkRaster(info);if(info.type!==match[1])throw Error('Image format does not match its contents.');
    assets[id]={name:asset.name,data:asset.data};
  }
  return assets;
}
function imageMarkers(text){
  const matches=[];
  for(const match of text.matchAll(/^[ \t]*\[\[image:([a-f0-9-]{36}):(\d{1,3})\]\][ \t]*(?=\r?$)/gm))if(!inMathAt(text,match.index))matches.push({start:match.index,end:match.index+match[0].length,id:match[1],width:Math.max(20,Math.min(100,Number(match[2])))});
  return matches;
}
function texWithoutImages(text){const markers=imageMarkers(text);for(const marker of markers.reverse())text=text.slice(0,marker.start)+text.slice(marker.end);return text;}
function updateImageMarker(marker,width){
  const text=source.value.slice(marker.start,marker.end);
  if(!text.includes('[[image:'+marker.id+':'))return;
  replaceSource(width===null?'':'[[image:'+marker.id+':'+Math.max(20,Math.min(100,width))+']]',marker.start,marker.end,{focus:false});
}
// A small DOM-only Markdown subset. Math is shielded before Markdown is parsed.
// HTML, links and external Markdown images remain literal text.
function markdownMathTokens(text){
  const tokens=[],prefix='\uE000'+crypto.randomUUID()+'-';let masked='',start=0;
  const delimiters=[['$$','$$'],['\\[','\\]'],['\\(','\\)'],['$','$']];
  for(let i=0;i<text.length;){
    const environment=text.startsWith('\\begin{',i)?/^\\begin\{(align\*?|alignat\*?|gather\*?|equation\*?|CD)\}/.exec(text.slice(i)):null;
    const delimiter=environment?[environment[0],'\\end{'+environment[1]+'}']:delimiters.find(([open])=>text.startsWith(open,i));
    if(delimiter){
      let end=i+delimiter[0].length,depth=0;
      for(;end<text.length;end++){
        if(depth===0&&text.startsWith(delimiter[1],end))break;
        if(text[end]==='\\'){end++;continue;}
        if(text[end]==='{')depth++;else if(text[end]==='}')depth=Math.max(0,depth-1);
      }
      end=end<text.length?end+delimiter[1].length:text.length;
      masked+=text.slice(start,i)+prefix+tokens.length+'\uE001';tokens.push(text.slice(i,end));start=end;i=end;
    }else if(text[i]==='\\')i+=2;else i++;
  }
  return {text:masked+text.slice(start),tokens,prefix};
}
function appendMarkdown(text,parent){
  const protectedMath=markdownMathTokens(text),{tokens,prefix}=protectedMath;
  function restore(value){return value.replace(new RegExp(prefix+'(\\d+)\uE001','g'),(_,index)=>tokens[Number(index)]);}
  function appendInline(value,target,depth=0){
    if(depth>16){target.append(document.createTextNode(restore(value)));return;}
    let buffer='';const flush=()=>{if(buffer){target.append(document.createTextNode(buffer));buffer='';}};
    for(let i=0;i<value.length;){
      if(value.startsWith(prefix,i)){
        const end=value.indexOf('\uE001',i),index=Number(value.slice(i+prefix.length,end));
        if(end>=0&&tokens[index]!==undefined){buffer+=tokens[index];i=end+1;continue;}
      }
      if(value[i]==='\\'&&/[`*_{}[\]()#+.!>~-]/.test(value[i+1]||'')){buffer+=value[i+1];i+=2;continue;}
      if(value[i]==='`'){
        const end=value.indexOf('`',i+1);
        if(end>i+1){flush();const code=document.createElement('code');code.textContent=restore(value.slice(i+1,end));target.append(code);i=end+1;continue;}
      }
      const marker=['***','___','**','__','*','_','~~'].find(mark=>value.startsWith(mark,i));
      if(marker&&!/\s/.test(value[i+marker.length]||' ')&&!(marker[0]==='_'&&/[\p{L}\p{N}]/u.test(value[i-1]||''))){
        let end=i+marker.length;
        for(;end<value.length;end++){
          if(value[end]==='\\'){end++;continue;}
          if(value.startsWith(prefix,end)){const tokenEnd=value.indexOf('\uE001',end);if(tokenEnd>=0){end=tokenEnd;continue;}}
          if(!value.startsWith(marker,end)||/\s/.test(value[end-1]||' '))continue;
          if(marker.length===1&&(value[end+1]===marker||value[end-1]===marker))continue;
          if(marker[0]==='_'&&/[\p{L}\p{N}]/u.test(value[end+marker.length]||''))continue;
          break;
        }
        if(end<value.length){
          flush();let node=document.createElement(marker==='~~'?'s':marker.length>=2?'strong':'em');
          if(marker.length===3){const emphasis=document.createElement('em');node.append(emphasis);appendInline(value.slice(i+marker.length,end),emphasis,depth+1);}
          else appendInline(value.slice(i+marker.length,end),node,depth+1);
          target.append(node);i=end+marker.length;continue;
        }
      }
      buffer+=value[i++];
    }
    flush();
  }
  const lines=protectedMath.text.split('\n');let plain=[];
  const flushPlain=()=>{if(plain.length){appendInline(plain.join('\n'),parent);plain=[];}};
  for(let index=0;index<lines.length;index++){
    const line=lines[index],heading=/^ {0,3}(#{1,6})[ \t]+(.+?)(?:[ \t]+#+[ \t]*)?$/.exec(line);
    if(/^ {0,3}```/.test(line)){
      flushPlain();const contents=[];while(index+1<lines.length&&!/^ {0,3}```[ \t]*$/.test(lines[index+1]))contents.push(lines[++index]);if(index+1<lines.length)index++;
      const pre=document.createElement('pre'),code=document.createElement('code');code.textContent=restore(contents.join('\n'));pre.append(code);parent.append(pre);continue;
    }
    if(heading){flushPlain();const node=document.createElement('h'+heading[1].length);node.className='markdown-heading';appendInline(heading[2],node);parent.append(node);continue;}
    const item=/^ {0,3}(?:([-+*])|([0-9]{1,9})[.)])[ \t]+(.+)$/.exec(line);
    if(item){
      flushPlain();const ordered=Boolean(item[2]),list=document.createElement(ordered?'ol':'ul');list.className='markdown-list';if(ordered)list.start=Number(item[2]);
      for(;;){
        const li=document.createElement('li');appendInline(item[3],li);list.append(li);
        const next=index+1<lines.length?/^ {0,3}(?:([-+*])|([0-9]{1,9})[.)])[ \t]+(.+)$/.exec(lines[index+1]):null;
        if(!next||Boolean(next[2])!==ordered)break;index++;item.splice(0,item.length,...next);
      }
      parent.append(list);continue;
    }
    plain.push(line);if(index===lines.length-1)flushPlain();
  }
  flushPlain();
}

function renderDocumentImages(text){
  let offset=0;
  for(const marker of imageMarkers(text)){
    appendMarkdown(text.slice(offset,marker.start),preview);offset=marker.end;
    const figure=document.createElement('figure');figure.className='editor-image';figure.dataset.markerStart=String(marker.start);figure.style.width=marker.width+'%';
    const asset=imageAssets[marker.id];
    if(asset){
      const img=document.createElement('img');img.src=asset.data;img.alt=asset.name;img.decoding='sync';img.addEventListener('error',()=>{$('error').textContent='An embedded image could not be decoded. Remove it or import the image again.';});figure.append(img);
      const controls=document.createElement('div');controls.className='image-controls';
      const slider=document.createElement('input');slider.type='range';slider.min='20';slider.max='100';slider.step='5';slider.value=String(marker.width);slider.setAttribute('aria-label','Image width for '+asset.name);
      slider.addEventListener('input',()=>{figure.style.width=slider.value+'%';size.textContent=slider.value+'%';});slider.addEventListener('change',()=>updateImageMarker(marker,Number(slider.value)));controls.append(slider);
      const size=document.createElement('span');size.textContent=marker.width+'%';controls.append(size);
      for(const [label,width] of [['Smaller',marker.width-10],['Larger',marker.width+10],['Remove',null]]){const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-label',label+' image '+asset.name);button.disabled=width!==null&&(width<20||width>100);button.addEventListener('click',()=>updateImageMarker(marker,width));controls.append(button);}
      figure.append(controls);
    }else{
      const note=document.createElement('span');note.textContent='Missing image. Import the session containing this image, or remove the marker.';figure.append(note);$('error').textContent='An image is missing from this session.';
    }
    preview.append(figure);
  }
  appendMarkdown(text.slice(offset),preview);
}
$('insert-image').addEventListener('click',()=>{
  if(!sessionReady||importingImage)return;
  const start=source.selectionStart,end=source.selectionEnd;
  if(mode.value==='document'&&(inMathAt(source.value,start)||inMathAt(source.value,end))){$('status').textContent='Place the cursor outside a math formula to insert an image.';return;}
  imageSelection={start,end,source:source.value,tabId:activeTabId,mode:mode.value};$('image-file').click();
});
$('image-file').addEventListener('change',async event=>{
  const file=event.target.files[0];event.target.value='';if(!file||!imageSelection)return;
  const selection={...imageSelection};let url;importingImage=true;$('insert-image').disabled=true;
  try{
    if(!/\.(png|jpe?g)$/i.test(file.name)||file.type&&!['image/png','image/jpeg'].includes(file.type))throw Error('Choose a PNG or JPEG image. SVG, GIF, HTML and other file types are not accepted.');
    if(file.size>imageLimits.file)throw Error('Image file is too large (maximum 10 MB).');
    if(Object.keys(imageAssets).length>=imageLimits.count)throw Error('This session already contains 32 stored images, including images retained for undo.');
    const bytes=new Uint8Array(await file.arrayBuffer());const info=rasterInfo(bytes);checkRaster(info);
    url=URL.createObjectURL(new Blob([bytes],{type:info.type}));const image=new Image();image.src=url;await image.decode();
    checkRaster({width:image.naturalWidth,height:image.naturalHeight});
    const ratio=Math.min(1,2400/Math.max(image.naturalWidth,image.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
    const data=canvas.toDataURL(info.type,0.92),size=Math.ceil((data.length-data.indexOf(',')-1)*3/4);
    if(size>imageLimits.stored)throw Error('The processed image is too large (maximum 5 MB). Use a smaller image.');
    const total=Object.values(imageAssets).reduce((sum,asset)=>sum+Math.ceil((asset.data.length-asset.data.indexOf(',')-1)*3/4),0);
    if(total+size>imageLimits.total)throw Error('Session image storage would exceed 25 MB, including images kept for undo.');
    if(activeTabId!==selection.tabId||source.value!==selection.source||mode.value!==selection.mode)throw Error('The source changed while the image was loading. Choose the insertion point and try again.');
    pendingImage={selection,asset:{name:file.name.slice(0,256),data}};
    $('new-image-preview').src=data;$('new-image-preview').alt=file.name;
    $('new-image-width').value='50';updateNewImageSize();$('image-dialog').showModal();
  }catch(error){$('status').textContent=error.message||'The image could not be imported.';}
  finally{if(url)URL.revokeObjectURL(url);importingImage=false;$('insert-image').disabled=false;}
});

function updateNewImageSize(){const width=Number($('new-image-width').value);$('new-image-width-value').textContent=width+'%';$('new-image-preview-wrap').style.width=width+'%';}
$('new-image-width').addEventListener('input',updateNewImageSize);
$('cancel-image').addEventListener('click',()=>$('image-dialog').close());
$('image-dialog').addEventListener('close',()=>{pendingImage=null;$('new-image-preview').removeAttribute('src');source.focus();});
$('confirm-image').addEventListener('click',()=>{
  if(!pendingImage)return;
  const {selection,asset}=pendingImage;
  if(activeTabId!==selection.tabId||source.value!==selection.source||mode.value!==selection.mode){$('status').textContent='The source changed. Choose the insertion point and import the image again.';$('image-dialog').close();return;}
  const id=crypto.randomUUID(),width=Number($('new-image-width').value);
  const before=source.value.slice(0,selection.start),after=source.value.slice(selection.end);
  const marker=(before&&!before.endsWith('\n')?'\n':'')+'[[image:'+id+':'+width+']]'+(after&&!after.startsWith('\n')?'\n':'');
  imageAssets[id]=asset;$('image-dialog').close();
  if(selection.mode==='equation'){
    const equation=selection.source.trim();
    const display=environmentDelimiters.some(({left,right})=>equation.startsWith(left)&&equation.endsWith(right));
    const math=display?equation:equation?['$$',unwrapEquation(equation),'$$'].join('\n'):'';
    mode.value='document';
    replaceSource([math,marker.trim()].filter(Boolean).join('\n\n'),0,selection.source.length,{editKind:'insertImageAndConvert'});
  }else{
    replaceSource(marker,selection.start,selection.end);
  }
  $('status').textContent='Image inserted at '+width+'% width. Resize it below the preview. Images are omitted from .tex exports.';
});

const environmentDelimiters=['align','align*','alignat','alignat*','gather','gather*','equation','equation*','CD'].map(name=>({left:'\\begin{'+name+'}',right:'\\end{'+name+'}',display:true}));
const options={throwOnError:true,trust:false,strict:code=>code==='newLineInDisplayMode'?'ignore':'warn',output:'htmlAndMathml'};
// Text-only LaTeX (such as \text and \textbf) should flow like prose, not an indivisible equation.
function wrapLatexProse(){
  const allowed=new Set(['math','semantics','mrow','mstyle','mtext','mspace','annotation']);
  for(const math of preview.querySelectorAll('.katex')){
    const mathml=math.querySelector('.katex-mathml');
    if(!mathml||!mathml.querySelector('mtext')||[...mathml.querySelectorAll('*')].some(node=>!allowed.has(node.localName)))continue;
    const html=math.querySelector('.katex-html');if(!html)continue;
    math.classList.add('katex-prose');
    const walker=document.createTreeWalker(html,NodeFilter.SHOW_TEXT);
    while(walker.nextNode())walker.currentNode.nodeValue=walker.currentNode.nodeValue.replace(/\u00a0/g,' ');
  }
}
let printMathStyles=[];
function restorePrintMath(){
  for(const {element,value,priority} of printMathStyles){if(value)element.style.setProperty('font-size',value,priority);else element.style.removeProperty('font-size');}
  printMathStyles=[];
}
function fitPrintMath(){
  restorePrintMath();
  const style=getComputedStyle(preview);
  const previewWidth=preview.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
  // Match the Letter page and 16 mm margins in @page. A narrower dialog selection remains user-adjustable.
  const width=Math.min(previewWidth,8.5*96-32*96/25.4)-2;
  if(width<=0)return;
  for(const element of preview.querySelectorAll('.katex:not(.katex-prose)')){
    const naturalWidth=element.getBoundingClientRect().width;
    if(naturalWidth<=width)continue;
    printMathStyles.push({element,value:element.style.getPropertyValue('font-size'),priority:element.style.getPropertyPriority('font-size')});
    // KaTeX may change its internal line breaks as its font shrinks. Re-measure after each pass.
    for(let pass=0;pass<6;pass++){
      const measured=Math.max(element.getBoundingClientRect().width,element.scrollWidth);
      if(measured<=width)break;
      const size=parseFloat(getComputedStyle(element).fontSize)*width/measured*0.995;
      element.style.setProperty('font-size',size+'px','important');
    }
  }
}
window.addEventListener('beforeprint',fitPrintMath);
window.addEventListener('afterprint',restorePrintMath);

function unwrapEquation(value){
  let tex=value.trim();
  // Accept a complete equation pasted with common math delimiters, too.
  for(const [open,close] of [['$$','$$'],['\\[','\\]'],['\\(','\\)'],['$','$']]){
    if(tex.startsWith(open)&&tex.endsWith(close)&&tex.length>=open.length+close.length){tex=tex.slice(open.length,-close.length);break;}
  }
  return tex;
}

function render(){
  const previewScroll=preview.scrollTop;
  $('error').textContent=''; preview.replaceChildren();
  preview.dataset.fullSize=String($('full-size-math').checked);
  if(source.value.trim()){
    try{
      if(mode.value==='equation'){
        const tex=unwrapEquation(source.value);
        katex.render(tex,preview,{...options,displayMode:true});
      }else{
        renderDocumentImages(source.value);
        renderMathInElement(preview,{...options,ignoredClasses:['editor-image'],preProcess:tex=>$('full-size-math').checked?String.fromCharCode(92)+'displaystyle '+tex:tex,delimiters:[...environmentDelimiters,{left:'$$',right:'$$',display:true},{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false},{left:'$',right:'$',display:false}],errorCallback:message=>{$('error').textContent=message;}});
      }
    }catch(error){$('error').textContent=error.message;}
  }
  wrapLatexProse();
  preview.scrollTop=previewScroll;
  $('display-label').hidden=mode.value!=='document';
  $('insert-line').hidden=false;
  $('insert-image').disabled=!sessionReady||importingImage;
}

source.addEventListener('input',event=>{commitEdit(event.inputType||'insertReplacementText');render();save();});
mode.addEventListener('change',()=>{render();save();});
window.addEventListener('pagehide',save);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save();});
let helperTab='notation';
const isFormat=n=>n.id.startsWith('layout-')||['aligned','matrix','cases'].includes(n.id);
function setHelperTab(tab){
  helperTab=tab;
  $('tab-notation').setAttribute('aria-selected',String(tab==='notation'));
  $('tab-format').setAttribute('aria-selected',String(tab==='format'));
  $('dialog-title').textContent=tab==='format'?'Formatting helper':'Insert notation';
  $('notation-label').textContent=tab==='format'?'Format':'All notation';
  $('insert').textContent=tab==='format'?'Apply format':'Insert';
  $('quick').hidden=tab==='format';
  const items=PROOF_NOTATIONS.filter(n=>isFormat(n)===(tab==='format'));
  notation.replaceChildren();
  for(const group of [...new Set(items.map(n=>n.group))]){
    const optgroup=document.createElement('optgroup');optgroup.label=group;
    for(const n of items.filter(n=>n.group===group)){const option=document.createElement('option');option.value=n.id;option.textContent=n.label;optgroup.append(option);}notation.append(optgroup);
  }
  choose(tab==='format'?'layout-align-star':'fraction');
}
$('tab-notation').addEventListener('click',()=>setHelperTab('notation'));
$('tab-format').addEventListener('click',()=>setHelperTab('format'));
const rowBreak=String.fromCharCode(92).repeat(2);
const supportsAlignment=n=>['layout-align','layout-align-star','layout-aligned','layout-gather','layout-gathered'].includes(n.id);
// Find alignment markers and relations outside groups and nested environments.
function topLevelMathTokens(tex){
  let braces=0,brackets=0,parentheses=0,environments=0;
  const markers=[],relations=[],rowBreaks=[],blocks=[],newlines=[];
  let outerBlock;
  for(let i=0;i<tex.length;){
    const top=braces===0&&brackets===0&&parentheses===0&&environments===0;
    const ch=tex[i];
    if(ch==='\\'){
      const environment=/^\\(begin|end)\{[^}]+\}/.exec(tex.slice(i));
      if(environment){
        if(environment[1]==='begin'&&top)outerBlock={start:i,bodyStart:i+environment[0].length,name:/\{([^}]+)\}/.exec(environment[0])[1]};
        environments=Math.max(0,environments+(environment[1]==='begin'?1:-1));
        if(environment[1]==='end'&&environments===0&&outerBlock){blocks.push({...outerBlock,bodyEnd:i,end:i+environment[0].length});outerBlock=undefined;}
        i+=environment[0].length;continue;
      }
      const command=/^\\(?:[a-zA-Z]+|[\s\S])/.exec(tex.slice(i));
      if(command){
        if(top&&command[0]===rowBreak)rowBreaks.push(i);
        if(top&&/^\\(?:leq?|geq?|neq?|approx|equiv|sim|simeq|to|implies|iff)$/.test(command[0]))relations.push(i);
        i+=command[0].length;continue;
      }
    }
    if(top&&ch==='\n')newlines.push(i);
    if(top&&ch==='&')markers.push(i);
    if(top&&'=<>'.includes(ch))relations.push(i);
    if(ch==='{')braces++;
    else if(ch==='}')braces=Math.max(0,braces-1);
    else if(ch==='[')brackets++;
    else if(ch===']')brackets=Math.max(0,brackets-1);
    else if(ch==='(')parentheses++;
    else if(ch===')')parentheses=Math.max(0,parentheses-1);
    i++;
  }
  return {markers,relations,rowBreaks,blocks,newlines};
}
function formattingRows(tex){
  const blocks=topLevelMathTokens(tex).blocks.filter(block=>/^(?:align\*?|aligned|gather\*?|gathered|equation\*?)$/.test(block.name));
  if(blocks.length){
    const rows=[];let start=0;
    for(const block of blocks){
      rows.push(...formattingRows(tex.slice(start,block.start)),...formattingRows(tex.slice(block.bodyStart,block.bodyEnd)));
      start=block.end;
    }
    rows.push(...formattingRows(tex.slice(start)));return rows;
  }
  const tokens=topLevelMathTokens(tex);
  const breaks=[...tokens.rowBreaks.map(position=>({position,length:rowBreak.length})),...tokens.newlines.map(position=>({position,length:1}))].sort((a,b)=>a.position-b.position);
  const rows=[];let start=0;
  for(const {position,length} of breaks){rows.push(tex.slice(start,position));start=position+length;}
  rows.push(tex.slice(start));
  return rows.map(row=>row.trim()).filter(Boolean);
}
function removeTopLevelAlignment(row){
  const markers=new Set(topLevelMathTokens(row).markers);
  return row.split('').filter((ch,index)=>!markers.has(index)).join('').trim();
}
function alignAtRelation(row){
  const position=topLevelMathTokens(row).relations[0];
  return position===undefined?'& '+row:row.slice(0,position)+'&'+row.slice(position);
}
function texForInsertionContext(tex){
  if(mode.value!=='document'||mathContextAt(source.value,selection.start)?.display!==false)return tex;
  return tex.replace(/\\(begin|end)\{(align\*?|gather\*?|equation\*?)\}/g,(_,command,environment)=>String.fromCharCode(92)+command+'{'+(environment.startsWith('gather')?'gathered':'aligned')+'}');
}
function currentTex(){
  const values=Object.fromEntries([...fields.querySelectorAll('input,textarea')].map(input=>[input.dataset.key,input.value]));
  if(values.rows!==undefined){
    let rows=formattingRows(values.rows);
    if(supportsAlignment(selected)){
      const alignment=$('alignment').value;
      if(alignment!=='manual'){
        rows=rows.map(removeTopLevelAlignment);
        if(alignment==='left')rows=rows.map(row=>'& '+row);
        if(alignment==='right')rows=rows.map(row=>row+' &');
        if(alignment==='relation')rows=rows.map(alignAtRelation);
        const numbered=['layout-align','layout-gather'].includes(selected.id);
        const environment=alignment==='center'?(numbered?'gather':'gathered'):(numbered?'align':selected.id==='layout-align-star'?'align*':'aligned');
        return texForInsertionContext(String.fromCharCode(92)+'begin{'+environment+'}\n'+rows.join(' '+rowBreak+'\n')+'\n'+String.fromCharCode(92)+'end{'+environment+'}');
      }
    }
    values.rows=rows.join(' '+rowBreak+'\n');
  }
  return texForInsertionContext(notationTex(selected,values));
}
$('alignment').addEventListener('change',updateFormula);
function updateFormula(){$('notation-source').textContent=currentTex();try{katex.render(currentTex(),$('formula-preview'),{...options,displayMode:true});$('formula-error').textContent='';}catch(error){$('formula-preview').replaceChildren();$('formula-error').textContent=error.message;}}
function choose(id){
  notation.value=id;selected=PROOF_NOTATIONS.find(n=>n.id===id);fields.replaceChildren();
  $('notation-help').textContent=selected.help||(helperTab==='format'?'Select source text before opening Format to format only that selection. With no selection, a new block is inserted at the cursor.':'');
  $('alignment-label').hidden=!supportsAlignment(selected);
  $('alignment').value=['layout-gather','layout-gathered'].includes(selected.id)?'center':'relation';
  let text=source.value.slice(selection.start,selection.end).replace(/^\$\$?([\s\S]*?)\$\$?$/,'$1');
  if(selected.environment){
    text=text.trim().replace(/^\\\[([\s\S]*)\\\]$/,'$1').trim();
    const environment=/^\\begin\{(align\*?|aligned|gather\*?|gathered|equation\*?|[pbv]?matrix|cases)\}\s*([\s\S]*?)\s*\\end\{\1\}$/.exec(text);
    if(environment&&!supportsAlignment(selected))text=environment[2];
  }
  for(const field of selected.fields){
    const label=document.createElement('label');label.textContent=field.label;const input=document.createElement(field.multiline?'textarea':'input');if(!field.multiline)input.type='text';input.dataset.key=field.key;input.spellcheck=false;input.autocomplete='off';
    input.value=text&&['rows','expression','numerator','base','element'].includes(field.key)?(field.key==='rows'?formattingRows(text).join('\n'):text):field.value;
    input.addEventListener('input',updateFormula);label.append(input);fields.append(label);
  }updateFormula();
}
for(const id of COMMON_PROOF_NOTATION_IDS.filter(id=>!isFormat(PROOF_NOTATIONS.find(n=>n.id===id)))){const n=PROOF_NOTATIONS.find(n=>n.id===id);const button=document.createElement('button');button.textContent=n.label;button.addEventListener('click',()=>{choose(id);fields.querySelector('input')?.focus();});$('quick').append(button);}
notation.addEventListener('change',()=>choose(notation.value));
function openHelper(tab){
  if(!sessionReady)return;
  selection={start:source.selectionStart,end:source.selectionEnd};
  $('insert-line').disabled=mode.value==='document'&&(inMathAt(source.value,selection.start)||inMathAt(source.value,selection.end));
  $('insert-line').title=$('insert-line').disabled?'Place the cursor outside an existing math formula to insert a separate display formula.':'';
  setHelperTab(tab);dialog.showModal();
}
$('open').addEventListener('click',()=>openHelper('notation'));
$('open-format').addEventListener('click',()=>openHelper('format'));
$('close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>source.focus());
// Keep helper insertion and formatting as one recorded undo group.
function replaceSource(text,start,end,options={}){
  if(!sessionReady)return false;
  if(dialog.open)dialog.close();
  const focusSource=options.focus!==false,position={x:window.scrollX,y:window.scrollY},previewScroll=preview.scrollTop;
  if(focusSource){source.focus();source.setSelectionRange(start,end);}
  const before=snapshot(),scrollTop=source.scrollTop;
  source.setRangeText(text,start,end,'end');
  if(!focusSource){
    const delta=text.length-(end-start),map=position=>position<=start?position:position>=end?position+delta:start+text.length;
    source.setSelectionRange(map(before.start),map(before.end),before.direction);
  }
  source.scrollTop=scrollTop;
  lastEdit=null;commitEdit(options.editKind||'insertReplacementText',before);lastEdit=null;render();
  if(!focusSource){
    preview.scrollTop=previewScroll;
    const control=preview.querySelector('.editor-image[data-marker-start="'+start+'"] input[type=range]');
    if(control)control.focus({preventScroll:true});else{preview.tabIndex=-1;preview.focus({preventScroll:true});}
    window.scrollTo(position.x,position.y);
  }
  save();return true;
}
function insertEquationLine(tex){
  const before=source.value.slice(0,selection.start),after=source.value.slice(selection.end);
  const separator=before.trim()?(before.trimEnd().endsWith(rowBreak)?'\n':' '+rowBreak+'\n'):'';
  const suffix=after.trim()?(after.trimStart().startsWith(rowBreak)?'\n':' '+rowBreak+'\n'):'';
  replaceSource(separator+tex+suffix,selection.start,selection.end);
}
function insertNotation(separateLine=false){
  const tex=currentTex();
  let text=mode.value==='equation'?tex:mathInsertion(source.value,selection.start,tex,$('display').checked||Boolean(selected.environment));
  if(separateLine && mode.value==='equation'){
    insertEquationLine(tex);render();save();dialog.close();source.focus();return;
  }
  if(separateLine){
    const before=source.value.slice(0,selection.start),after=source.value.slice(selection.end);
    text=(before && !before.endsWith('\n')?'\n':'')+'$$'+tex+'$$'+(after && !after.startsWith('\n')?'\n':'');
  }
  replaceSource(text,selection.start,selection.end);render();save();dialog.close();source.focus();
}
$('insert').addEventListener('click',()=>insertNotation());
$('insert-line').addEventListener('click',()=>insertNotation(true));
fields.addEventListener('keydown',event=>{if(event.key==='Enter' && event.target.tagName!=='TEXTAREA'){event.preventDefault();$('insert').click();}});
$('download').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([texWithoutImages(source.value)],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=downloadName()+'.tex';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('status').textContent='Downloaded '+downloadName()+'.tex.';});
let preparingPdf=false;
$('download-pdf').addEventListener('click',async()=>{
  if(preparingPdf)return;
  render();
  if($('error').textContent){$('status').textContent='Fix the LaTeX preview error before exporting a PDF.';return;}
  if(!source.value.trim()){$('status').textContent='Type something to preview before exporting a PDF.';return;}
  preparingPdf=true;$('download-pdf').disabled=true;
  try{
    // Wait for the exact fonts used by the preview before opening the print dialog.
    if(document.fonts)await document.fonts.ready;
    await Promise.all([...preview.querySelectorAll('img')].map(image=>image.decode()));
    await new Promise(resolve=>requestAnimationFrame(resolve));
    $('status').textContent='Choose Save as PDF in the print dialog. Only the preview is printed.';
    window.print();
  }catch{$('status').textContent='Could not open printing. Use your browser’s Print command and choose Save as PDF.';}
  finally{preparingPdf=false;$('download-pdf').disabled=false;}
});
$('full-size-math').addEventListener('change',()=>{render();save();});
for(const button of document.querySelectorAll('[data-expand]'))button.addEventListener('click',()=>{
  const columns=$('columns'),panel=button.dataset.expand;
  if(columns.dataset.expanded===panel)delete columns.dataset.expanded;else columns.dataset.expanded=panel;
  for(const control of document.querySelectorAll('[data-expand]')){control.textContent=columns.dataset.expanded===control.dataset.expand?'Restore':'Expand';control.setAttribute('aria-expanded',String(columns.dataset.expanded===control.dataset.expand));}
});
$('open-settings').addEventListener('click',()=>{$('settings-dialog').showModal();$('open-settings').setAttribute('aria-expanded','true');});
$('close-settings').addEventListener('click',()=>$('settings-dialog').close());
$('settings-dialog').addEventListener('close',()=>{$('features-help').open=false;$('open-settings').setAttribute('aria-expanded','false');$('open-settings').focus({preventScroll:true});});
let settingsPointerOutside=false;
function outsideSettings(event){const box=$('settings-dialog').getBoundingClientRect();return event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom;}
$('settings-dialog').addEventListener('pointerdown',event=>{settingsPointerOutside=event.target===$('settings-dialog')&&outsideSettings(event);});
$('settings-dialog').addEventListener('click',event=>{if(settingsPointerOutside&&event.target===$('settings-dialog')&&outsideSettings(event))$('settings-dialog').close();settingsPointerOutside=false;});
for(const id of ['download','download-pdf','export-session','export-tabs','import-session'])$(id).addEventListener('click',()=>$('settings-dialog').close());
function syncPreviewSourceHeight(){
  if(matchMedia('print').matches)return;
  const height=source.getBoundingClientRect().height;if(height<=0)return;
  const cap=parseFloat(getComputedStyle(preview).maxHeight)||11*96;
  const previewSourceHeight=Math.min(cap,height);
  preview.style.setProperty('--source-preview-height',previewSourceHeight+'px');
}
const sourceHeightObserver=new ResizeObserver(syncPreviewSourceHeight);sourceHeightObserver.observe(source);
window.addEventListener('afterprint',()=>requestAnimationFrame(syncPreviewSourceHeight));

setHelperTab('notation');render();initializeSession();
