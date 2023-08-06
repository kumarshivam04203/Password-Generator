const inputSlider = document.querySelector("[data-lengthSlider]");
const indicator = document.querySelector("[data-indicator]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols")
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/'
const copyMsg = document.querySelector("[data-copymsg]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const copyBtn = document.querySelector("[data-copy");
const generateBtn = document.querySelector(".generateButton");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay");

// initially value
let password = "";
let passwordLength = 10;
let checkCount = 0;
handerSlider();

// ste strength circle color to grey
setIndicator("#ccc");

// set password length
function handerSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // ????????????????
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)* 100/ (max - min)) + "% 100%"
}

// set indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
// return random integer
function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}
// gen random number
function generateRandomNumber(){
    return getRndInteger(0,9);
}
// gen lowercase character
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
// gen uppercase
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
} 
// get Symbol
function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    // check karna box tick hai yaa nahi
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;
    // length ke according passwd set karna
    if(hasUpper && hasLower &&(hasNum || hasSym) && passwordLength >= 8){
        setIndicator('#0f0');
    }else if( (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >=6){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

// copy password  
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'copied';
    }
    catch(e) {
        copyMsg.innerText = 'Failed'
    }

    // to make copy pala span(text) visible
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}


// check box count
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    // spacial condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handerSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handerSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

function shufflePassword(array){
    // Fisher Yates Method (Algorithm)
    for (let i = array.length - 1; i > 0; i--){
        // j find the random value
        const j = Math.floor(Math.random() * (i + 1));
        // swap number at i index and j index
        const temp  = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// generate button all activity
generateBtn.addEventListener('click', () => {
    // none of the check box are selected
    if(checkCount == 0)
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handerSlider();
    }
    // start to find the new random password
    console.log("Starting the journey");
    // remove old passwd

    password = "";

    // let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }


    let funcArr =[];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);


    // compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("Compulsarry adddition done");

    // remaining addition
    for(let i = 0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    // show in UI

    passwordDisplay.value = password;
    console.log("UI adddition done");
    // calculate strength
    calcStrength();
});

