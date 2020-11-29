// (攻擊力*(1-爆率)+(攻擊力+爆擊傷害)*爆率)*(1+B傷)*(1-防禦度(1-貫穿)/(防禦度(1-貫穿)+50*Boss等級)

const addPanel = document.querySelector('#add-panel');
addPanel.addEventListener('click', () => {
    let panel = document.querySelectorAll('.group-panel');
    let $index = panel.length
    let newPanel = document.createElement('div');
    newPanel.classList.add('group-panel', 'col-12', 'col-sm-6', 'col-md-4', 'col-lg-3');
    newPanel.dataset.index = $index;
    newPanel.innerHTML = `
        <div class="card mb-3">
            <div class="card-header"><input type="text" class="group-title border-bottom" value="Group ${$index + 1}"></div>
            <div class="card-body">
                <div class="mb-2">
                    <label>攻擊力</label>
                    <input type="number" class="form-control form-control-sm" data-input="aDamage" value="" />
                </div>
                <div class="mb-2">
                    <label>爆擊率 %</label>
                    <input type="number" class="form-control form-control-sm" data-input="cRate" value="" placeholder="不含隱藏爆率" />
                </div>
                <div class="mb-2">
                    <label>爆擊傷害</label>
                    <input type="number" class="form-control form-control-sm" data-input="cDamage" value="" />
                </div>
                <div class="mb-2">
                    <label>貫穿 %</label>
                    <input type="number" class="form-control form-control-sm" data-input="pRate" value="" />
                </div>
                <div class="mb-2">
                    <label>BOSS傷害 %</label>
                    <input type="number" class="form-control form-control-sm" data-input="bDamage" value="" />
                </div>
                <div class="formula d-none"></div>
                <div>輸出：<span class="damage"></span></div>
            </div>
        </div>`;
    panel[$index - 1].after(newPanel);
})

document.querySelector('#submit').addEventListener('click', () => {
    let bDefense = Number(document.querySelector('[data-input="bDefense"]').value) || 0;
    let bLevels = Number(document.querySelector('[data-input="bLevels"]').value) || 0;
    let bAntiRate = Number(document.querySelector('[data-input="bAntiRate"]').value) / 100 || 0;
    let panel = document.querySelectorAll('.group-panel');
    panel.forEach(item => {
        let aDamage = Number(item.querySelector('[data-input="aDamage"]').value) || 1;
        let cRate = (Number(item.querySelector('[data-input="cRate"]').value)) / 100 || 0;
            cRate = (cRate - bAntiRate > 1) ? 1 : cRate - bAntiRate;
        let cDamage = Number(item.querySelector('[data-input="cDamage"]').value) || 1;
        let bDamage = Number(item.querySelector('[data-input="bDamage"]').value) / 100 || 0;
        let pRate = Number(item.querySelector('[data-input="pRate"]').value) / 100 || 0;
            pRate = (pRate > 1) ? 1 : pRate;
        let textFormula = item.querySelector('.formula');
        let textDamage = item.querySelector('.damage');
        
        let formula = `(${aDamage} * (1 - ${cRate}) + (${aDamage} + ${cDamage}) * ${cRate}) * (1 + ${bDamage}) * (1 - ${bDefense} * (1 - ${pRate}) / (${bDefense} * (1 - ${pRate}) + 50 * ${bLevels}))` 
        let total = (aDamage * (1 - cRate) + (aDamage + cDamage) * cRate) * (1 + bDamage) * (1 - bDefense * (1 - pRate) / (bDefense * (1 - pRate) + 50 * bLevels));
        textFormula.textContent = formula;
        textDamage.dataset.value = total.toFixed(3);
        textDamage.textContent = `${formatNumber(total.toFixed(3))}`;
    });

    if (panel.length > 1) {
        let compare = document.querySelector('.group-compare');
        while (compare.firstChild) {
            compare.removeChild(compare.firstChild);
        }
        let origin = Number(panel[0].querySelector('span.damage').dataset.value);
        let title = [];
        panel.forEach((item, index) => {
            title[index] = panel[index].querySelector('.group-title').value;
            if (index > 0) {
                let value = Number(item.querySelector('span.damage').dataset.value);
                let rate = ((value / origin - 1) * 100).toFixed(2);
                let text = document.createElement('p');
                if (rate > 0) {
                    text.innerHTML = `<span class="text-primary">${title[index]}</span> 比 <span class="text-danger">${title[0]}</span> 增加 ${rate}% 傷害。`
                } else {
                    text.innerHTML = `<span class="text-primary">${title[index]}</span> 比 <span class="text-danger">${title[0]}</span> 減少 ${rate.replace('-', '')}% 傷害。`
                }
                compare.append(text);
            }
        });
    }
});

function formatNumber() {
    let arg = Array.from(arguments).toString();
    let arr = arg.split('.');
    let firstNum = arr[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ', ');
    let lastNum = (arr[1] > 0) ? `. ${arr[1]}` : '';
    return `${firstNum}${lastNum}`;
}