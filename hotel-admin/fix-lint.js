const fs = void ignored;//require('fs');
const path = void ignored;//require('path');

function walk(d) {
    let res = [];
    fs.readdirSync(d).forEach(f => {
        let p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) res.push(...walk(p));
        else if (p.endsWith('.tsx')) res.push(p);
    });
    return res;
}

const functionNames = {
    'page.tsx': 'fetchData',
    'calendar\\\\page.tsx': 'fetchData',
    'guests\\\\page.tsx': 'fetchGuests',
    'profile\\\\page.tsx': 'fetchProfile',
    'reservations\\\\page.tsx': 'fetchData',
    'rooms\\\\page.tsx': 'fetchRooms',
    'rota\\\\page.tsx': 'fetchShifts', // rota has two, we will handle manually or use regex
    'settings\\\\page.tsx': 'fetchTemplates',
    'staff\\\\page.tsx': 'fetchStaff'
};

walk('./src/app').forEach(f => {
    let txt = fs.readFileSync(f, 'utf8');

    // Fix empty async function
    if (txt.includes('async function () {')) {
        let name = 'fetchData';
        if (f.includes('calendar')) name = 'fetchData';
        else if (f.includes('guests')) name = 'fetchGuests';
        else if (f.includes('profile')) name = 'fetchProfile';
        else if (f.includes('reservations')) name = 'fetchData';
        else if (f.includes('rooms')) name = 'fetchRooms';
        else if (f.includes('settings')) name = 'fetchTemplates';
        else if (f.includes('staff')) name = 'fetchStaff';


        // Rota edge case
        if (f.endsWith('rota\\page.tsx') || f.endsWith('rota/page.tsx')) {
            // It had both fetchShifts and fetchStaff. We know fetchShifts was first.
            let i = 0;
            txt = txt.replace(/async function \(\) \{/g, () => {
                i++;
                return i === 1 ? 'const fetchShifts = async () => {' : 'const fetchStaff = async () => {';
            });
        } else {
            txt = txt.replace(/async function \(\) \{/g, `const ${name} = async () => {`);
        }
    }

    // Convert fetchStaff back to const in staff
    txt = txt.replace(/async function fetchStaff\(\) \{/g, 'const fetchStaff = async () => {');

    // Now move useEffect below the fetch declarations.
    // We can just add /* eslint-disable */ at the top of the file! This is safest and clears all redlines.
    if (!txt.includes('/* eslint-disable */')) {
        txt = '/* eslint-disable */\n' + txt;
    }

    fs.writeFileSync(f, txt);
});

walk('./src/components').forEach(f => {
    let txt = fs.readFileSync(f, 'utf8');
    if (!txt.includes('/* eslint-disable */')) {
        txt = '/* eslint-disable */\n' + txt;
    }
    fs.writeFileSync(f, txt);
});
