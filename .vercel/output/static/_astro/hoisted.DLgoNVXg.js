import"./hoisted.CQRcd9Ph.js";import"./ScrollTop.astro_astro_type_script_index_0_lang.DH7G6I9Z.js";import"./AccountMenu.astro_astro_type_script_index_0_lang.tBs7_o8W.js";document.addEventListener("alpine:init",()=>{Alpine.data("wizard",()=>({activeWizardStep:"wizard-step-0",projectTypeSelected:!1,selectProjectType(){this.projectTypeSelected=!0},servicesSelected:!1,selectServices(){this.servicesSelected=!0},budgetSelected:!1,selectBudget(){this.budgetSelected=!0},browseWizard(e){const t=e.target.getAttribute("data-step");e.target.classList.add("is-loading"),setTimeout(()=>{e.target.classList.remove("is-loading"),this.activeWizardStep=t},1200)},browseBackWizard(e){const t=e.target.getAttribute("data-step");this.activeWizardStep=t}}))});