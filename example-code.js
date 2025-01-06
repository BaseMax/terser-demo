const errorElm=document.getElementById("error"),execBtn=document.getElementById("execute"),outputElm=document.getElementById("output"),dbFileElm=document.getElementById("dbfile"),savedbElm=document.getElementById("savedb"),commandsElm=document.getElementById("commands"),tablesListElm=document.getElementById("tables-list"),editorContainerElm=document.getElementById("editor-container");let tictime;window.performance&&performance.now||(window.performance={now:Date.now});const INITIAL_SQL_QUERY="SELECT `name`, `sql`\n  FROM `sqlite_master`\n  WHERE type='table';",editor=CodeMirror.fromTextArea(commandsElm,{mode:"text/x-mysql",viewportMargin:1/0,indentWithTabs:!0,smartIndent:!0,lineNumbers:!0,matchBrackets:!0,autofocus:!0,extraKeys:{"Ctrl-Enter":execEditorContents,"Ctrl-S":savedb}}),tableCreate=function(){function e(e,t){if(0===e.length)return"";var o="<"+t+">",n="</"+t+">";return o+e.join(n+o)+n}return function(t,o){var n=document.createElement("table"),r="<thead>"+e(t,"th")+"</thead>",s=o.map((function(t){return e(t,"td")}));return r+="<tbody>"+e(s,"tr")+"</tbody>",n.innerHTML=r,n}}();function tic(){tictime=performance.now()}function toc(e){const t=performance.now()-tictime;console.log((e||"toc")+": "+t+"ms")}function print(e){outputElm.innerHTML=e.replace(/\n/g,"<br>")}function error(e){console.log(e),errorElm.style.display="block",errorElm.textContent=e.message}function noerror(){errorElm.style.display="none"}function execute(e){console.log("execute: ",e),tic(),worker.onmessage=function(t){var o=t.data.results;if(console.log("onmessage in execute: ",e,o),toc("Executing SQL"),o){tic(),outputElm.innerHTML="";for(var n=0;n<o.length;n++)outputElm.appendChild(tableCreate(o[n].columns,o[n].values));toc("Displaying results"),e===INITIAL_SQL_QUERY&&populateTableList(o[0].values)}else error({message:t.data.error})},worker.postMessage({action:"exec",sql:e}),outputElm.textContent="Fetching results..."}function execEditorContents(){noerror();const e=editor.getValue().trimEnd();""!==e?execute(e.endsWith(";")?e:e+";"):alert("No SQL query to execute")}function populateTableList(e){tablesListElm.innerHTML="",console.log("tables:",e),e.forEach((function(e){var t=document.createElement("li");t.textContent=e[0],t.addEventListener("click",(function(){console.log("Table clicked: "+e[0]),editor.setValue("SELECT * FROM "+e[0]+" LIMIT 100;"),execEditorContents()})),tablesListElm.appendChild(t)}))}function savedb(){worker.onmessage=function(e){toc("Exporting the database");const t=e.data.buffer;if(0===t.byteLength)return void alert("Database is empty, not saving");const o=new Blob([t]),n=document.createElement("a");document.body.appendChild(n),n.href=window.URL.createObjectURL(o),n.download="sql.db",n.onclick=function(){setTimeout((function(){window.URL.revokeObjectURL(n.href)}),1500)},n.click()},tic(),worker.postMessage({action:"export"})}execBtn.addEventListener("click",execEditorContents,!0),dbFileElm.onchange=function(){var e=dbFileElm.files[0];if(e){const t=new FileReader;t.onload=function(){console.log("File loaded:",e.name),worker.onmessage=function(e){console.log("Worker response:",e.data),editorContainerElm.classList.remove("hidden"),execBtn.classList.remove("hidden"),savedbElm.classList.remove("hidden"),toc("Loading database from file"),editor.setValue(INITIAL_SQL_QUERY),execEditorContents()},tic();try{worker.postMessage({action:"open",buffer:t.result},[t.result])}catch(e){worker.postMessage({action:"open",buffer:t.result})}},t.readAsArrayBuffer(e)}else error({message:"No file selected"})},savedbElm.addEventListener("click",savedb,!0);const worker=new Worker("assets/js/worker.sql-wasm.js");worker.onerror=error,worker.postMessage({action:"open"}),worker.onmessage=function(e){console.log("worker onmessage");var t=e.data;console.log(t,t.sql),"exec"===t.action&&"SELECT name FROM sqlite_master WHERE type='table';"===t.sql&&(console.log("Table names:",t.results),populateTableList(t.results)),t.error&&error({message:t.error})};