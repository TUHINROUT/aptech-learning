(() => {
  const $ = s => document.querySelector(s);
  const menu = $('#menu'), burger = $('#burger');
  burger.onclick = () => { menu.classList.toggle('open'); burger.classList.toggle('on'); };
  menu.querySelectorAll('a').forEach(a => a.onclick = () => { menu.classList.remove('open'); burger.classList.remove('on'); });

  const tabs = $('#tabs'), panel = $('#panel'), sel = $('#courseSelect');
  const li = a => a.map(x => `<li>${x}</li>`).join('');
  function show(i) {
    const c = COURSES[i];
    tabs.querySelectorAll('button').forEach((b, k) => b.classList.toggle('active', k === i));
    panel.innerHTML = `<h3>${c.title}</h3><p>${c.desc}</p>
      <div class="grid g2"><div><h4>What You’ll Learn</h4><ul class="list">${li(c.learn)}</ul></div>
      <div><h4>Career Outcomes</h4><ul class="list">${li(c.out)}</ul></div></div>
      <p class="hint">${c.note}</p><a href="#contact" class="btn">${c.cta} →</a>`;
    panel.querySelector('.btn').onclick = () => sel.value = c.title;
  }
  sel.insertAdjacentHTML('afterbegin', '<option value="">Select a course</option>');
  COURSES.forEach((c, i) => {
    tabs.insertAdjacentHTML('beforeend', `<button type="button">${c.tab}</button>`);
    sel.insertAdjacentHTML('beforeend', `<option>${c.title}</option>`);
    tabs.lastChild.onclick = () => show(i);
  });
  show(0);

  $('#gallery').innerHTML = GALLERY.map(u => `<img src="${u}" alt="Aptech Learning campus" loading="lazy">`).join('');

  const sl = $('#slider'), dots = $('#dots'); let cur = 0, timer;
  sl.innerHTML = STORIES.map(s => `<figure class="story"><img src="https://placehold.co/100x100/000/FFC72C?text=${s[0]}" alt="${s[1]}"><blockquote>“${s[3]}”</blockquote><figcaption><b>${s[1]}</b><br>${s[2]}</figcaption></figure>`).join('');
  STORIES.forEach((_, i) => { dots.insertAdjacentHTML('beforeend', `<button aria-label="Slide ${i + 1}"></button>`); dots.lastChild.onclick = () => go(i, true); });
  function go(i, manual) {
    cur = (i + STORIES.length) % STORIES.length;
    sl.style.setProperty('--i', cur);
    dots.querySelectorAll('button').forEach((d, k) => d.classList.toggle('on', k === cur));
    if (manual) { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5000); }
  }
  go(0); timer = setInterval(() => go(cur + 1), 5000);

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    const el = e.target, t = +el.dataset.count; let n = 0;
    const step = setInterval(() => { n += Math.max(1, Math.ceil(t / 40)); if (n >= t) { n = t; clearInterval(step); } el.textContent = n + el.dataset.suffix; }, 30);
  }), { threshold: .5 });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));

  const rv = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), rv.unobserve(e.target))), { threshold: .12 });
  document.querySelectorAll('.card,.step,.chips span,.stats>div,.cert,.rounded,.faq details').forEach(el => { el.classList.add('rv'); rv.observe(el); });

  $('#form').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target), m = $('#msg');
    if (!f.get('name').trim() || !/^[+\d\s-]{8,15}$/.test(f.get('phone').trim())) { m.textContent = 'Please enter your name and a valid phone number.'; m.className = 'msg err'; return; }
    const text = `Hello! I'm ${f.get('name')} (${f.get('phone')}). Interested in: ${f.get('course') || 'IT courses'}.`;
    m.textContent = 'Thanks! Opening WhatsApp…'; m.className = 'msg ok';
    window.open('https://wa.me/917697027697?text=' + encodeURIComponent(text), '_blank');
    e.target.reset();
  };

  const st = document.querySelector('.sticky');
  addEventListener('scroll', () => st.classList.toggle('show', scrollY > 600 && !(innerHeight + scrollY > document.body.scrollHeight - 900)), { passive: true });
})();
