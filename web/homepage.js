// A concise, human-first public homepage. The deeper product remains in the visitor’s browser workspace.
landing=function(){
 return `${publicNav()}<main id="content" class="public-main">
  <section class="landing-hero human-hero">
   <div class="hero-copy">
    <span class="eyebrow">FOR PEOPLE WHO RUN A SMALL BUSINESS</span>
    <h1>Less busywork.<br/><em>More business.</em></h1>
    <p>Discover how AI can work for your business. AnthroBiz helps you understand your needs, find and test the right AI tools, and manage everything through a personalized dashboard.</p>
    <div class="hero-actions">${primaryLink('Find a solution','/discover')}<a class="outline signup-link" href="${signIn}">Create my free profile ${icon('plus')}</a></div>
   </div>
   <figure class="hero-owner-collage"><img src="/anthrobiz-local-business-owners.jpg" alt="Six local business owners, including a café owner, HVAC professional, hairstylist, chef, florist and office-based owner"/><figcaption><small>FOR THE PEOPLE BEHIND LOCAL BUSINESS</small><strong>You know your craft.<br/>We’ll help with the rest.</strong></figcaption></figure>
  </section>
  <section class="discovery-strip compact-discovery"><p><span class="eyebrow">AI TOOL DIRECTORY</span><strong>120+ tools for everyday business work.</strong></p><div>${['canva','chatgpt','square','hubspot','notion','zapier'].map(id=>{const t=catalog.find(x=>x.id===id);return `<button data-action="tool" data-value="${id}" aria-label="View ${esc(t.name)}"><img src="/${t.logo}" alt="${esc(t.name)}"/></button>`}).join('')}</div><a href="/discover">Search the directory ${icon('arrow')}</a></section>
  <section class="simple-journey" id="how-it-works">
   <div class="section-intro simple-intro"><span class="eyebrow">HOW ANTHROBIZ WORKS</span><h2>One problem.<br/>One clear path.</h2><p>Start in plain English. Keep control of every decision.</p></div>
   <div class="journey-steps compact-steps">
    <article><span>01</span><h3>Tell us about your business</h3><p>Share a few business details, the tools you already use and what you want to improve.</p></article>
    <article><span>02</span><h3>Meet your AI Roundtable</h3><p>AI managers examine the issue from several business perspectives and define what a useful solution must do.</p></article>
    <article><span>03</span><h3>Get your best-fit options</h3><p>See up to three practical options matched to your needs, budget, current software and ease of adoption.</p></article>
    <article><span>04</span><h3>Track what works</h3><p>Record results, costs and feedback. This evidence helps refine your plan and improve future recommendations.</p></article>
   </div>
  </section>
  <section class="core-features">
   <article class="core-card roundtable-card simple-system-card"><span class="feature-icon">${icon('chat')}</span><span class="eyebrow">UNDERSTAND BEFORE RECOMMENDING</span><h2>Your AI manager Roundtable.</h2><p>Your business context, existing software and issue are considered together. The Roundtable identifies likely causes and defines what a useful solution needs to accomplish.</p><div class="simple-system-flow" aria-label="Your business information enters the AI Roundtable, which produces clear solution requirements."><div><small>START</small><b>Your business</b><span>Profile + tools + issue</span></div><em aria-hidden="true">→</em><div><small>REVIEW</small><b>AI Roundtable</b><span>Several perspectives</span></div><em aria-hidden="true">→</em><div><small>OUTPUT</small><b>Clear requirements</b><span>What the solution must do</span></div></div><button class="outline" data-action="roundtable-info">See an example ${icon('arrow')}</button></article>
   <article class="core-card sandbox-card learning-card"><span class="feature-icon">${icon('chart')}</span><span class="eyebrow">EVIDENCE-DRIVEN RECOMMENDATIONS</span><h2>Recommendations that improve with evidence.</h2><p>AnthroBiz compares suitable tools using your needs, budget, current software and available evidence. Results and feedback help make the next recommendation more useful.</p><div class="evidence-loop" aria-label="Recommend, use, measure and improve in a continuous evidence loop."><div class="loop-stages"><span><i>01</i><b>Recommend</b></span><em>→</em><span><i>02</i><b>Use</b></span><em>→</em><span><i>03</i><b>Measure</b></span><em>→</em><span><i>04</i><b>Improve</b></span></div><div class="loop-signal"><small>EVIDENCE THAT STRENGTHENS THE NEXT RECOMMENDATION</small><p>Customer feedback · KPI results · actual cost · structured testing when available</p></div></div>${primaryLink('Explore your options','/discover')}</article>
  </section>
  <section class="final-cta simpler-cta"><div><span class="eyebrow">YOUR BUSINESS. YOUR NEXT STEP.</span><h2>Start with what you’d like to make easier.</h2></div><div>${primaryLink('Explore your options','/discover')}<a class="outline signup-link" href="${signIn}">Create a free profile</a></div></section>
 </main>${publicFooter()}`;
};
if(page==='landing')render();
