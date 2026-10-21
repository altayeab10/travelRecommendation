// Task 6: جلب البيانات والتأكد منها عبر console.log
fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        console.log('Fetched Data Successfully:', data);
    })
    .catch(error => console.error('Error loading API data:', error));

// Task 7 & 8: منطق البحث والنتائج عند الضغط على زر البحث
document.getElementById('btnSearch').addEventListener('click', () => {
    const searchInput = document.getElementById('conditionInput').value.toLowerCase().trim();
    
    if (!searchInput) return;

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let results = [];

            // مطابقة الكلمات المفتاحية للشواطئ
            if (searchInput === 'beach' || searchInput === 'beaches') {
                results = data.beaches;
            } 
            // مطابقة الكلمات المفتاحية للمعابد
            else if (searchInput === 'temple' || searchInput === 'temples') {
                results = data.temples;
            } 
            // مطابقة الدول أو المدن
            // مطابقة الكلمات المفتاحية للشواطئ
            if (searchInput === 'beach' || searchInput === 'beaches') {
                results = data.beaches;
            } 
            // مطابقة الكلمات المفتاحية للمعابد
            else if (searchInput === 'temple' || searchInput === 'temples') {
                results = data.temples;
            } 
            // مطابقة الكلمات المفتاحية للدول (مفرد أو جمع) أو اسم دولة محدد
            else if (searchInput === 'country' || searchInput === 'countries') {
                data.countries.forEach(country => {
                    results = results.concat(country.cities);
                });
            } 
            // البحث باسم دولة معينة أو مدينة
            else {
                data.countries.forEach(country => {
                    if (country.name.toLowerCase().includes(searchInput)) {
                        results = results.concat(country.cities);
                    } else {
                        country.cities.forEach(city => {
                            if (city.name.toLowerCase().includes(searchInput)) {
                                results.push(city);
                            }
                        });
                    }
                });
            }

            displayResults(results);
        });
});

// Task 9: زر مسح النتائج (Clear)
document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('conditionInput').value = '';
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
    }
});

// دالة عرض النتائج بتنسيق Grid (Task 8)
function displayResults(results) {
    let container = document.getElementById('resultsContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'resultsContainer';
        // استخدام Grid كما هو مطلوب في التعليمات لتظهر النتائج بجانب بعضها
        container.style.cssText = "position: absolute; top: 100px; left: 50%; transform: translateX(-50%); width: 80%; max-width: 900px; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; background: rgba(11,37,51,0.95); padding: 25px; border-radius: 10px; color: white; z-index: 1000;";
        document.body.appendChild(container);
    }
    
    container.style.display = 'grid';
    container.innerHTML = '';
    
    if (results.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No results found.</p>';
        return;
    }

    results.forEach(item => {
        const card = document.createElement('div');
        card.style.cssText = "background: rgba(0,0,0,0.5); border-radius: 8px; overflow: hidden; padding: 15px; display: flex; flex-direction: column; gap: 10px;";
        
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px;">
            <h3 style="font-size: 16px; color: #00bcd4;">${item.name}</h3>
            <p style="font-size: 13px; line-height: 1.4; color: #ddd;">${item.description}</p>
        `;
        container.appendChild(card);
    });
}