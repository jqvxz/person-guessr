const GOOGLE_API_KEY = 'KEY_PLACEHOLDER';
const GOOGLE_CX = 'CX_PLACEHOLDER';

const africanCountries = [
    'Algeria', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 
    'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros', 
    'Congo', "Cote d'Ivoire", 'Democratic Republic of Congo', 'Djibouti', 
    'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 
    'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 
    'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali',
    'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger',
    'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles',
    'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan',
    'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
];

const asianCountries = [
    'Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan',
    'Brunei', 'Cambodia', 'China', 'Cyprus', 'Georgia', 'India', 'Indonesia',
    'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait',
    'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia',
    'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Philippines',
    'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea', 'Sri Lanka',
    'Syria', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Turkey', 'Turkmenistan',
    'United Arab Emirates', 'Uzbekistan', 'Vietnam', 'Yemen'
];

const europeanCountries = [
    'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina',
    'Bulgaria', 'Croatia', 'Czech Republic', 'Denmark', 'Estonia', 'Finland',
    'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy',
    'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova',
    'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland',
    'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia',
    'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', 'Vatican City'
];

let currentCountry;
let score = 0;

function getSelectedCountries() {
    let countries = [];
    if (document.getElementById('africaCheckbox').checked) countries = countries.concat(africanCountries);
    if (document.getElementById('asiaCheckbox').checked) countries = countries.concat(asianCountries);
    if (document.getElementById('europeCheckbox').checked) countries = countries.concat(europeanCountries);
    return countries;
}

async function fetchTopImages() {
    const countries = getSelectedCountries();
    if (countries.length === 0) {
        alert("Please select at least one region.");
        return null;
    }
    const country = countries[Math.floor(Math.random() * countries.length)];
    
    try {
        const response = await fetch(
            `https://www.googleapis.com/customsearch/v1?q=An+image+of+a+"person"+from+the+country+${encodeURIComponent(country)}+-country+-statistic&cx=${GOOGLE_CX}&key=${GOOGLE_API_KEY}&searchType=image&num=2`
        );
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const validImages = data.items.filter(item => item.link && item.link.startsWith('http'));
            if (validImages.length > 0) {
                const randomImage = validImages[Math.floor(Math.random() * validImages.length)];
                return { imageUrl: randomImage.link, country };
            }
        }

        return { imageUrl: `https://via.placeholder.com/400x500?text=${encodeURIComponent(country)}+Person`, country };
        
    } catch (error) {
        console.error('Error fetching image:', error);
        return { imageUrl: `https://via.placeholder.com/400x500?text=${encodeURIComponent(country)}+Person`, country };
    }
}

async function newGame() {
    const person = await fetchTopImages();
    if (person) {
        currentCountry = person.country;
        document.getElementById('personImage').src = person.imageUrl;
        document.getElementById('result').textContent = '';
        document.getElementById('guessInput').value = '';
    }
}

function checkGuess() {
    const guess = document.getElementById('guessInput').value.trim().toLowerCase();
    
    if (guess === currentCountry.toLowerCase()) {
        score++;
        document.getElementById('score').textContent = score;
        document.getElementById('result').textContent = `Correct!`;
        setTimeout(newGame, 2000);
    } else {
        document.getElementById('result').textContent = `Wrong. The correct answer was ${currentCountry}.`;
        setTimeout(newGame, 2000);
    }
}

newGame()
