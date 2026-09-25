(function(){
  "use strict";

  /* year */
  document.getElementById("yr").textContent = new Date().getFullYear();

  /* nav scrolled state */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("progress");
  var ticking = false;
  function onScroll(){
    if(!ticking){
      ticking = true;
      requestAnimationFrame(function(){
        nav.classList.toggle("scrolled", window.scrollY > 24);
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
        ticking = false;
      });
    }
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  /* mobile menu */
  var burger = document.getElementById("burger");
  var mmenu = document.getElementById("mmenu");
  burger.addEventListener("click", function(e){
    e.stopPropagation();
    var open = mmenu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  mmenu.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click", function(){ mmenu.classList.remove("open"); });
  });
  document.addEventListener("click", function(e){
    if(mmenu.classList.contains("open") && !mmenu.contains(e.target) && e.target !== burger){
      mmenu.classList.remove("open");
    }
  });

  /* custom cursor */
  var dot = document.querySelector(".cursor");
  var ring = document.querySelector(".cursor-ring");
  var mx=0,my=0,rx=0,ry=0,rm=false;
  if(window.matchMedia("(pointer:fine)").matches){
    document.addEventListener("mousemove", function(e){
      mx=e.clientX; my=e.clientY;
      dot.style.left=mx+"px"; dot.style.top=my+"px";
    });
    (function loop(){
      rx += (mx-rx)*0.14; ry += (my-ry)*0.14;
      ring.style.left=rx+"px"; ring.style.top=ry+"px";
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", function(e){
      if(e.target.closest("a,button,.proj,.stat,.skill-card")){ ring.classList.add("hovering"); }
    });
    document.addEventListener("mouseout", function(e){
      if(e.target.closest("a,button,.proj,.stat,.skill-card")){ ring.classList.remove("hovering"); }
    });
    document.addEventListener("mousedown", function(){ ring.classList.add("clicking"); });
    document.addEventListener("mouseup", function(){ ring.classList.remove("clicking"); });
    document.addEventListener("mouseleave", function(){ dot.style.opacity=0; ring.style.opacity=0; });
    document.addEventListener("mouseenter", function(){ dot.style.opacity=1; ring.style.opacity=1; });
  }

  /* typewriter */
  var roles = ["build things.","craft clean code.","design APIs.","ship products.","solve problems."];
  var el = document.getElementById("types");
  var ri=0,ci=0,del=0;
  (function type(){
    var word = roles[ri];
    el.textContent = word.slice(0, ci);
    if(!del && ci < word.length){ ci++; setTimeout(type, 65); }
    else if(!del){ del=1; setTimeout(type, 1400); }
    else if(ci > 0){ ci--; setTimeout(type, 32); }
    else { del=0; ri=(ri+1)%roles.length; setTimeout(type, 350); }
  })();

  /* reveal on scroll */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        en.target.classList.add("in");
        var counters = en.target.querySelectorAll(".count");
        counters.forEach(animateCount);
        var fills = en.target.querySelectorAll(".fill");
        fills.forEach(function(f){ f.style.width = f.dataset.w + "%"; });
        io.unobserve(en.target);
      }
    });
  }, {threshold:.18});
  document.querySelectorAll(".reveal").forEach(function(e){ io.observe(e); });

  /* counters */
  function animateCount(c){
    if(c.dataset.done) return;
    c.dataset.done = "1";
    var target = parseInt(c.dataset.num, 10);
    var start = performance.now();
    var dur = 1400;
    function tick(now){
      var p = Math.min((now-start)/dur, 1);
      var ease = 1 - Math.pow(1-p, 3);
      c.textContent = Math.round(target*ease).toLocaleString("en-IN");
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* 3D project tilt */
  var reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(!reduced && window.matchMedia("(hover:hover)").matches){
    document.querySelectorAll(".proj").forEach(function(card){
      var raf = null;
      card.addEventListener("mousemove", function(e){
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5;
        var y = (e.clientY - r.top) / r.height - .5;
        if(raf) return;
        raf = requestAnimationFrame(function(){
          card.style.transform = "rotateY(" + (x*10) + "deg) rotateX(" + (-y*10) + "deg) translateZ(0)";
          raf = null;
        });
      });
      card.addEventListener("mouseleave", function(){
        if(raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function(){
          card.style.transform = "rotateY(0) rotateX(0)";
          raf = null;
        });
      });
    });
  }

  /* magnetic buttons */
  if(!reduced && window.matchMedia("(hover:hover)").matches){
    document.querySelectorAll(".magnet").forEach(function(btn){
      btn.addEventListener("mousemove", function(e){
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width/2) * 0.25;
        var y = (e.clientY - r.top - r.height/2) * 0.25;
        btn.style.transform = "translate(" + x + "px," + y + "px)";
      });
      btn.addEventListener("mouseleave", function(){ btn.style.transform = "translate(0,0)"; });
    });
  }

  /* mail button */
  document.getElementById("mailme").addEventListener("click", function(){
    window.location.href = "mailto:hello@vsaurabh.dev";
  });
})();