const r="masonry-theme",o="masonry-is-loggedin";document.addEventListener("alpine:init",()=>{Alpine.data("scrolltop",()=>({scrolled:!1,height:60,mobileOpen:!1,init(){this.pathLength=this.$refs.progressPath.getTotalLength(),this.$refs.progressPath.style.transition=this.$refs.progressPath.style.WebkitTransition="none",this.$refs.progressPath.style.strokeDasharray=this.pathLength+" "+this.pathLength,this.$refs.progressPath.style.strokeDashoffset=this.pathLength,this.$refs.progressPath.getBoundingClientRect(),this.$refs.progressPath.style.transition=this.$refs.progressPath.style.WebkitTransition="stroke-dashoffset 10ms linear"},updateProgress(){let s=window.scrollY,t=document.body.scrollHeight-window.innerHeight,e=this.pathLength-s*this.pathLength/t;this.$refs.progressPath.style.strokeDashoffset=e},scroll(){this.updateProgress(),window.scrollY>=this.height?this.scrolled=!0:this.scrolled=!1},scrollTop(){return window.scrollTo({top:0,behavior:"smooth"}),!1}}))});export{r as M,o as a};