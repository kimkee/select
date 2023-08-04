const ui = {
    popsel:{ // 셀렉트 스와이프
        init:function(){
            this.evt();
            this.set();
        },
        evt:function(){

            document.addEventListener("click", (e)=> {
                const target = e.target;
                if (target.closest(".select-pop .btsel:not(.open)")) {
                    const select = target.closest(".select-pop").querySelector(".slist");
                    const name = select.getAttribute("name");
                    const tit = select.getAttribute("data-select-title") || "";
                    const sel = select.value;
                    const list = [];
                    // console.log(name, tit, list, sel);
                    this.open(name, tit, list, sel);
                }
            });

            document.addEventListener("click", (e)=> {
                const target = e.target;
                if (target.closest(".pop-select .btsbot .btcom")) {
                    const val = target.closest(".pop-select").querySelector(".swiper-slide-active .bt").getAttribute("value");
                    const txt = target.closest(".pop-select").querySelector(".swiper-slide-active .bt").textContent;
                    const name = target.closest(".pop-select").getAttribute("data-selt-pop");
                    const select = document.querySelector(`select[name='${name}']`)
                    
                    // console.log(name, sel);
                    select.querySelector(`option[value='${val}']`).selected = true;
                    select.value = val;
                    select.closest(".select-pop").querySelector(".btsel").innerHTML = `<i class="txt">${txt}</i>`;
                    select.closest(".select-pop").querySelector(".btsel").classList.remove("is-tit");
                    select.dispatchEvent(new Event("change"));
                    this.close();
                }
            });

            document.addEventListener("click", (e) => e.target.classList.contains("pop-select") ? this.close() : null );
            
            document.addEventListener("click", (e) => e.target.closest(".pop-select .btn-sel-close") ? this.close() : null );

        },
        sld:{ // 
            els:".pop-select .swiper-container",
            opt: {
                centeredSlides:true,
                direction:"vertical",
                slidesPerView: 3,
                freeMode: {
                    enabled: true,
                    sticky: true,
                    momentumRatio: 0.2,
                },
                mousewheel: {
                    invert: false,
                    sensitivity: 0.2,
                },
                speed: 100,  // 300
                observer: true,
                observeParents: true,
                spaceBetween:0,
                watchOverflow:true,
                loop: false
            },
            using: function() {
                if( document.querySelectorAll(`${this.els} .swiper-slide`).length <= 1) {
                    this.opt.loop = false;
                }
                this.slide = new Swiper(this.els, this.opt);
            }
        },
        set:function(){

            document.querySelectorAll(".select-pop").forEach(function(pop) {
                if (!pop.querySelector(".btsel")) {
                    pop.insertAdjacentHTML("afterbegin", '<button class="btsel" type="button"></button>');
                }
                if (!pop.classList.contains("set")) {
                    pop.classList.add("set");
                }
                pop.querySelector(".slist").tabIndex = "-1"
                const btsel = pop.querySelector(".btsel");
                
                const selectedOption = pop.querySelector(".slist option:checked");
                const txt = selectedOption ? selectedOption.textContent : "";
                const dis = pop.querySelector(".slist").disabled;
                const list = [];
                pop.querySelectorAll(".slist option").forEach(function(option) {
                    const isDis = option.disabled;
                    list.push({ v: option.value, t: option.textContent, d: isDis });
                });
                // console.log(list, txt, dis);

                btsel.innerHTML = `<i class="txt">${txt}</i>`;
                btsel.disabled = dis ? true : false;
                
            });


        },
        open:function(name,tit,list,sel){
            
            document.querySelectorAll('.pop-select.on').forEach( (pop)=>  pop.remove());

            if (document.querySelector('.pop-select:is(:visible)')) { return; }

            document.querySelectorAll(`[name='${name}'] option`).forEach( option => {
                list.push( { v: option.value, t: option.textContent, d: option.disabled } );
            });
            console.log(list);
            
            const blist = list.map( (li, i) => {
                const dis = list[i].d == true ? "disabled" : null;
                return `<li class="swiper-slide ${dis}"><span class="bt ${dis}" ${dis} value="${list[i].v}">${list[i].t}</span></li>`;
            }).join("");

            const lyPop =
            `<article class="pop-select" data-selt-pop="${name}">
                <div class="pbd">
                    <div class="phd ${tit ? 'is-tit':''}" ><h3 class="ptit">${tit}</h3></div>
                    <button type="button" class="btn-sel-close">닫기</button>
                    <div class="pct">
                        <main class="poptents">
                            <div class="swiper-container slide">
                                <ul class="swiper-wrapper list">${blist}</ul>
                            </div>
                            <div class="btsbot btn-set">
                                <button type="button" class="btn a lg btcom">완료</button>
                            </div>
                        </main>
                    </div>
                </div>
            </article>`;
            document.body.insertAdjacentHTML("beforeend", lyPop);

            this.sld.using();
            
            document.querySelector(`select[name='${name}']`).closest(".select-pop").querySelector(".btsel").classList.add("open");
            
            const _this = this;
            const pop = document.querySelector(`[data-selt-pop='${name}']`);
            pop.classList.add("on");
            pop.tabIndex = 0;
            pop.focus();

            console.log(name, sel);
            pop.querySelector(`.list .bt[value='${sel}']`)?.closest("li")?.classList.add("active");
            
            const ul = pop.querySelector(".list");
            const li = ul.querySelectorAll("li");
            const activeIdx = Array.from(li).indexOf(ul.querySelector("li.active"));
            console.log(activeIdx);

            _this.sld.slide.slideTo(activeIdx);

            _this.sld.slide.on("init slideChangeTransitionEnd scroll",function(){
                const isAct = pop.querySelector(".list>li.swiper-slide-active")?.classList.contains("disabled");
                pop.querySelector(".btcom").disabled =  isAct == true ? true : false;
            });

            document.body.classList.add("is-pop-select");

        },
        close:function(){
            const id = document.querySelector('.pop-select.on')?.getAttribute("data-selt-pop");
            if(!id) {return};
            document.querySelector('.pop-select')?.classList.remove("on")
            document.querySelector('.pop-select').addEventListener("transitionend", pop => pop.target.remove() );
            const select = document.querySelector(`select[name='${id}']`);
            const btsel = select?.closest(".select-pop").querySelector(".btsel");
            btsel.classList.remove("open");
            btsel.focus();

            document.body.classList.remove("is-pop-select");
            console.log( `select[name="${id}"] 값 = " ,  ${select.value} `);
        }
    },
}
ui.popsel.init();