document.addEventListener("alpine:init",()=>{Alpine.data("accountDropdown",()=>({open:!1,toggle(){this.open=!this.open},close(){this.open=!1}}))});
