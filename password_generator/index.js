const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#number");
const symbolsCheck=document.querySelector("#symbol");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols=" ~`!@#$%^&*()_-+={[}|:;<,>.?/ "

let password="";
let passwordLength=10; 
let checkCount=0;
handleSlider();
// set strength color to grey
setIndicator("#ccc");
// set password length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    // or bhi kuch add krna hai for slider moving 
    const min=inputSlider.min;
    const max=inputSlider.max;

    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)) + '% 100%'
}

function setIndicator(color){
    indicator.style.backgroundcolor=color;
    // homework for indicator shadow
    indicator.style.boxShadow=`0px 0px 12px 2px ${color}`;
}

function getRandomInt(min,max){
    return Math.floor(Math.random()*(max-min)) + min;
}

function generateRandomNumber(){
    return getRandomInt(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInt(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInt(65,91));
}

function generateSymbol(){
    const randNum=getRandomInt(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if (uppercaseCheck.checked) hasUpper=true;
    if (lowercaseCheck.checked) hasLower=true;
    if (numbersCheck.checked) hasNum=true;
    if (symbolsCheck.checked) hasSym=true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator('#0f0');
    } else if(
        (hasLower || hasUpper)&&
        (hasNum || hasSym)&&
        passwordLength>=6
    ){
        setIndicator('#ff0');
    }else{
        setIndicator('#f00');
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied"
    }
    catch(e){
        copyMsg.innerText="Failed"
    }

    // To make copied msg visible
    copyMsg.classList.add("active")

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    // Fisher yates method
    for (let i=array.length-1; i > 0 ;i--){
        // random j find out
        const j = Math.floor(Math.random() * (i+1));
        // for swapping
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }   
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    });
    // special condition
    if (passwordLength < checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
});

generateBtn.addEventListener('click',()=>{
    // None of the checkbox are selected
    if (checkCount==0) 
        return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // let's start the journey to find new password
    console.log("Starting")
    // remove old password
    password="";

    // let's put the stuff mentioned by checkboxex

    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition

    for (let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    console.log("Compulsory addition done");
    // remaining addition
    for (let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRandomInt(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    };
    console.log("Remaining addition done");
    // shuffle the password
    password=shufflePassword(Array.from(password));
    console.log("Shuffling done");
    // show in UI
    passwordDisplay.value=password;
    console.log("UI addition done");
    // calculate strength
    calcStrength();
});