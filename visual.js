var table;

var gridHistory = [];

var historyIndex = 0;

var noteMode = false;

var grids;

var shower = true;

var noteRemover = true;

var settingOn = false;

var timerMode = true;

var timerTime = 0;

setInterval(() => {
    timerTime++;
}, 10);

var timerTimer = undefined;

var timerText = undefined;

var selectedInput = {
    x:undefined,
    y:undefined
}

var colors = {
    notCorrect:"red",
    notCorrectMarked:"darkred",
    marked:"lightgray",
    background:'white'
}

var confirmMessages = {
    generateNew:"Vill du verkligen generera en ny? Detta går inte att ångra!",
    clearEverything:"Vill du verkligen starta om? Detta går inte att ångra!",
    clue:"Vill du verkligen ha en ledtråd?"
}

var buttons = [
    {
        name:"Lätt",
        onClick:"if(checkEmpty()){getSudoku(1)}else{if(confirm(confirmMessages.generateNew)){getSudoku(1)}}"
    },
    {
        name:"Medel",
        onClick:"if(checkEmpty()){getSudoku(2)}else{if(confirm(confirmMessages.generateNew)){getSudoku(2)}}"
    },
    {
        name:"Svår",
        onClick:"if(checkEmpty()){getSudoku(3)}else{if(confirm(confirmMessages.generateNew)){getSudoku(3)}}"
    },
    {
        name:"Starta om",
        onClick:"if(checkEmpty()){restart()}else{if(confirm(confirmMessages.clearEverything)){restart()}}"
    },
    {
        name:"Ångra",
        onClick:"undo()"
    },
    {
        name:"Gör om",
        onClick:"redo()"
    },
    {
        name:"Anteckningar",
        onClick:"changeNote(this)",
        id:"changeNote",
        changeOff:"(Av)",
        changeOn:"(På)",
        variable:"noteMode"
    },
    {
        name:"Ledtråd",
        onClick:"if(confirm(confirmMessages.clue)){hintHint()}",
    },
    {
        name:"Inställningar",
        onClick:"switchSettings()",
        variable:"settingOn"
    },
]

var settingsButtons = [
        {
            name:"Markera siffror",
            onClick:"switchClick(this);fixVisualizer();",
            id:"markCLicked",
            changeOff:"(Av)",
            changeOn:"(På)",
            variable:"shower"
        },
        {
            name:"Ta bort anteckningar",
            onClick:"switchAnteckning(this)",
            id:"Removeanteckningar",
            changeOff:"(Av)",
            changeOn:"(På)",
            variable:"noteRemover"
        },
        {
            name:"Timer",
            id:"timerbutton",
            variable:"timerMode",
            changeOff:"(Av)",
            changeOn:"(På)",
            onClick:"switchTimer(this);"
        },
        {
            name:"",
        },
        {
            name:"",
        },
        {
            name:"",
        },
        {
            name:"",
        },
        {
            name:"",
        },
        {
            name:"Tillbaka",
            onClick:"switchSettings()",
            variable:"settingOn"
        }
    ]

function switchTimer(elm){
    if(elm !== undefined){
        for (let i = 0; i < settingsButtons.length; i++) {
            if(elm.id == settingsButtons[i].id){
                buttonNumber = i;
            }
        }
        elm.innerText = settingsButtons[buttonNumber].name;
    }
    
    if(timerMode === false){
        timerText = document.createElement("a");
        document.body.appendChild(timerText);
        timerMode = true;
        if(elm !== undefined){
            elm.innerText += settingsButtons[buttonNumber].changeOn
        }
        timerTimer = setInterval(function(){
            timerText.innerText = ""
            if(Math.floor(timerTime/6000) > 9){
                timerText.innerText += Math.floor(timerTime/6000) + ":" 
            }else if(Math.floor(timerTime/6000) > 0){
                timerText.innerText += "0"+Math.floor(timerTime/6000) + ":" 
            }else{
                timerText.innerText += "00:" 
            }
            if(Math.floor(timerTime/100)%60 > 9){
                timerText.innerText += Math.floor(timerTime/100)%60 + "." 
            }else if(Math.floor(timerTime/100)%60 > 0){
                timerText.innerText += "0"+Math.floor(timerTime/100)%60 + "." 
            }else{
                timerText.innerText += "00." 
            }
            if(Math.floor(timerTime)%100 > 9){
                timerText.innerText += Math.floor(timerTime%100)
            }else if(Math.floor(timerTime)%100 > 0){
                timerText.innerText += "0"+Math.floor(timerTime%100)
            }else{
                timerText.innerText += "00" 
            }
            
            localStorage.setItem("timerTime",JSON.stringify(timerTime));
        },10)
        save();
    }else{
        timerMode = false
        if(elm !== undefined){
            elm.innerText += settingsButtons[buttonNumber].changeOff
        }
        timerText.remove();
        clearInterval(timerTimer)
        save();
    }

}
function checkEmpty(){
    return grid.every(row => row.every(cell => !cell.value))
}

function switchSettings()
{   
    if(settingOn === false){
        settingOn = true;
        for(let i = 0; i < 9; i++){
            if(settingsButtons[i] !== undefined){
                buttons[i].button.setAttribute("onclick",settingsButtons[i].onClick);
                buttons[i].button.innerText = settingsButtons[i].name;
                if(settingsButtons[i].changeOff !== undefined && settingsButtons[i].changeOn !== undefined && settingsButtons[i].variable !== undefined){
                    setTimeout(() => {
                        if(eval(settingsButtons[i].variable) === true){
                            buttons[i].button.innerText += settingsButtons[i].changeOn;
                        }else{
                            buttons[i].button.innerText += settingsButtons[i].changeOff;
                        }                 
                    }, 15);
    
                }
                buttons[i].button.id = settingsButtons[i].id
            }else{
                buttons[i].button.innerText = "";
                buttons[i].button.setAttribute("onclick","");
            }
        }
        return;
    }else{
        settingOn = false;
        for(let i = 0; i < 9; i++){
            if(buttons[i] !== undefined){
                buttons[i].button.setAttribute("onclick",buttons[i].onClick);
                buttons[i].button.innerText = buttons[i].name;
                if(buttons[i].changeOff !== undefined && buttons[i].changeOn !== undefined && buttons[i].variable !== undefined){
                    setTimeout(() => {
                        if(eval(buttons[i].variable) === true){
                            buttons[i].button.innerText += buttons[i].changeOn;
                        }else{
                            buttons[i].button.innerText += buttons[i].changeOff;
                        }                 
                    }, 15);
    
                }
                buttons[i].button.id = buttons[i].id
            }else{
                buttons[i].button.innerText = "";
                buttons[i].button.setAttribute("onclick","");
            }
        }
        return;    
    }
}

var grid = [];

document.body.addEventListener("mousedown",function(e){
    if(e.toElement === document.body){
        selectedInput = {
            x:undefined,
            y:undefined
        }
        fixVisualizer()
    }
});
window.addEventListener("keydown",function(e){
    if(e.keyCode === 8){
        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){
                if(grid[y][x].noteSelect === true){
                    grid[y][x].possibleNotes = [];
                    for(let x2 = 0; x2 < 3; x2++){
                        for(let y2 = 0; y2 < 3; y2++){
                            grid[y][x].noteElm.children[x2].children[y2].innerText = " "
                        }
                    }
                }
            }
        }
    }
    if(e.keyCode === 16 && noteMode === false){
        changeNote(document.getElementById("changeNote"))
    }
});
window.addEventListener("keyup",function(e){
    if(e.keyCode === 16){
        changeNote(document.getElementById("changeNote"))
    }
    if(e.keyCode >= 49 && e.keyCode <= 57){

        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){
                if(grid[y][x].noteSelect === true){
                    if(grid[y][x].select.value === ""){
                        if(grid[y][x].possibleNotes.includes(e.code.split("Digit")[1])){
                            grid[y][x].possibleNotes.splice(grid[y][x].possibleNotes.indexOf(e.code.split("Digit")[1]),1)
                            grid[y][x].noteElm.children[Math.floor((e.code.split("Digit")[1]-1)/3)].children[(e.code.split("Digit")[1]-1)%3].innerText = " "

                        }else{
                            grid[y][x].possibleNotes.push(e.code.split("Digit")[1])
                            grid[y][x].noteElm.children[Math.floor((e.code.split("Digit")[1]-1)/3)].children[(e.code.split("Digit")[1]-1)%3].innerText = e.code.split("Digit")[1]
                            updateChanged(x,y)
                        }
                    }
                }
            }
        }
    }
    if(e.keyCode === 39){
        if(noteMode === true){
            for(let y = 0; y < 9; y++){
                for(let x = 0; x < 9; x++){
                    if(grid[y][x].noteSelect === true){
                        noteBytGrejPil(x,y,1,0)
                        return;
                    }           
                }
            }
        }else{
            piltangentGrej(selectedInput.x,selectedInput.y,1,0)
        }
    }
    if(e.keyCode === 37){
        if(noteMode === true){
            for(let y = 0; y < 9; y++){
                for(let x = 0; x < 9; x++){
                    if(grid[y][x].noteSelect === true){
                        noteBytGrejPil(x,y,-1,0)
                        return;
                    }
                }
            }
        }else{
        piltangentGrej(selectedInput.x,selectedInput.y,-1,0)
        }
    }
    if(e.keyCode === 38){
        if(noteMode === true){
            for(let y = 0; y < 9; y++){
                for(let x = 0; x < 9; x++){
                    if(grid[y][x].noteSelect === true){
                        noteBytGrejPil(x,y,0,-1)
                        return;
                    }
                }
            }
        }else{
            piltangentGrej(selectedInput.x,selectedInput.y,0,-1)

        }
    }
    if(e.keyCode === 40){
        if(noteMode === true){
            for(let y = 0; y < 9; y++){
                for(let x = 0; x < 9; x++){
                    if(grid[y][x].noteSelect === true){
                        noteBytGrejPil(x,y,0,1)
                        return;
                    }
                }
            }
        }else{
            piltangentGrej(selectedInput.x,selectedInput.y,0,1)

        }
    }
});

function piltangentGrej(x,y,changeX,changeY){

    if(x+ changeX < 9 && x + changeX > -1 && y+ changeY < 9 && y + changeY > -1 ){
        selectedInput = {x:x+changeX,y:y+changeY};
        if((grid[selectedInput.y][selectedInput.x].locked)){
            document.activeElement.blur()
            if(grid[selectedInput.y][selectedInput.x].td.style.backgroundColor !== colors.notCorrect && grid[selectedInput.y][selectedInput.x].td.style.backgroundColor !== colors.notCorrectMarked){
                grid[selectedInput.y][selectedInput.x].td.style.backgroundColor = colors.marked;
            }
            if(grid[selectedInput.y][selectedInput.x].td.style.backgroundColor === colors.notCorrect){
                grid[selectedInput.y][selectedInput.x].td.style.backgroundColor = colors.notCorrectMarked;
            }
            if(grid[selectedInput.y-changeY][selectedInput.x-changeX].td.style.backgroundColor !== colors.notCorrect && grid[selectedInput.y-changeY][selectedInput.x-changeX].td.style.backgroundColor !== colors.notCorrectMarked){
                grid[selectedInput.y-changeY][selectedInput.x-changeX].td.style.backgroundColor = colors.background;
            }
            
        }else{
            if(grid[selectedInput.y-changeY][selectedInput.x-changeX].td.style.backgroundColor === colors.notCorrectMarked){
                grid[selectedInput.y-changeY][selectedInput.x-changeX].td.style.backgroundColor = colors.notCorrect
            }
            if(grid[selectedInput.y-changeY][selectedInput.x-changeX].td.style.backgroundColor !== colors.notCorrect){
                grid[selectedInput.y-changeY][selectedInput.x-changeX].td.style.backgroundColor = colors.background;
            }
            grid[selectedInput.y][selectedInput.x].select.focus();
            let length = grid[selectedInput.y][selectedInput.x].select.value.length;
            grid[selectedInput.y][selectedInput.x].select.setSelectionRange(length, length)
        }

    }
    fixVisualizer()
}

function switchClick(elm){
    let buttonNumber;
    for (let i = 0; i < settingsButtons.length; i++) {
        if(elm.id == settingsButtons[i].id){
            buttonNumber = i;
        }
    }
    elm.innerText = settingsButtons[buttonNumber].name
    if(shower === true){
        shower = false;
        elm.innerText += settingsButtons[buttonNumber].changeOff
    }else{
        shower = true;
        elm.innerText += settingsButtons[buttonNumber].changeOn
    }
    if(noteMode ===false && selectedInput.x !== undefined && selectedInput.y !== undefined){
        grid[selectedInput.y][selectedInput.x].select.focus();
    }
    save();
}

function switchAnteckning(elm){
    let buttonNumber;
    for (let i = 0; i < settingsButtons.length; i++) {
        if(elm.id == settingsButtons[i].id){
            buttonNumber = i;
        }
    }
    elm.innerText = settingsButtons[buttonNumber].name
    if(noteRemover === true){
        noteRemover = false;
        elm.innerText += settingsButtons[buttonNumber].changeOff
    }else{
        noteRemover = true;
        elm.innerText += settingsButtons[buttonNumber].changeOn
    }
    if(noteMode ===false && selectedInput.x !== undefined && selectedInput.y !== undefined){
        grid[selectedInput.y][selectedInput.x].select.focus();
    }
    save();
}
function noteBytGrejPil(x,y,changeX,changeY){
    if(x+ changeX < 9 && x + changeX > -1 && y+ changeY < 9 && y + changeY > -1 ){
        if(grid[y][x].noteSelect === true){
            grid[y][x].noteSelect = false;
                if(grid[y][x+changeX].noteSelect.className === 'selected'){
                    for(let y2 = 0; y2 < 9; y2++){
                        for(let x2 = 0; x2 < 9; x2++){
                            grid[y2][x2].noteSelect = false;
                            grid[y2][x2].noteElm.className = 'note';
                            if(grid[y2][x2].td.style.backgroundColor === colors.notCorrectMarked){
                                grid[y2][x2].td.style.backgroundColor = colors.notCorrect
                            }

                            if(grid[y2][x2].td.style.backgroundColor !== colors.notCorrect){
                                grid[y2][x2].td.style.backgroundColor = colors.background
                            }
                        }
                        };
                    }for(let y2 = 0; y2 < 9; y2++){
                        for(let x2 = 0; x2 < 9; x2++){
                            grid[y2][x2].noteSelect = false;
                            grid[y2][x2].noteElm.className = 'note';
                            if(grid[y2][x2].td.style.backgroundColor === colors.notCorrectMarked){
                                grid[y2][x2].td.style.backgroundColor = colors.notCorrect
                            }
                            if(grid[y2][x2].td.style.backgroundColor !== colors.notCorrect){
                                grid[y2][x2].td.style.backgroundColor = colors.background}
                            }
                        };
                            grid[y+changeY][x+changeX].noteSelect = true;
                            if(grid[y+changeY][x+changeX].td.style.backgroundColor === colors.notCorrect){
                                grid[y+changeY][x+changeX].td.style.backgroundColor = colors.notCorrectMarked;
                            }else{
                                grid[y+changeY][x+changeX].td.style.backgroundColor = colors.marked;
                            }
                        
            grid[y+changeY][x+changeX].noteSelect = true
            selectedInput.x = x+changeX;
            selectedInput.y = y+changeY;
            fixVisualizer();
        }
    }
}

function fixVisualizer(){
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            if(x == selectedInput.x && y == selectedInput.y){
            }else{
                if(grid[y][x].td.style.backgroundColor === colors.notCorrectMarked){
                    grid[y][x].td.style.backgroundColor = colors.notCorrect;
                }
                if(grid[y][x].td.style.backgroundColor === colors.marked){
                    grid[y][x].td.style.backgroundColor = colors.background;
                    grid[y][x].noteSelect = false;
                };
            }
        }
    }
    if(shower == true){
        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){
                if(selectedInput.x !== undefined && selectedInput.y !== undefined){
                    if(grid[y][x].select.value == grid[selectedInput.y][selectedInput.x].select.value &&grid[selectedInput.y][selectedInput.x].select.value !== "" ){
                        if(grid[y][x].td.style.backgroundColor === colors.notCorrect ||grid[y][x].td.style.backgroundColor === colors.notCorrectMarked){
                            grid[y][x].td.style.backgroundColor = colors.notCorrectMarked;
                        }else{
                            grid[y][x].td.style.backgroundColor = colors.marked;
                        }
                    }
                }
            }
        }
    }
}

window.addEventListener("load",function(e){
    load();
})

function save(){
    localStorage.setItem("noteRemover",JSON.stringify(noteRemover));
    localStorage.setItem("shower",JSON.stringify(shower));
    localStorage.setItem("timerMode",JSON.stringify(timerMode));
    localStorage.setItem("gridHistory", JSON.stringify(gridHistory));
};

function load(){
    timerTime = JSON.parse(localStorage.getItem("timerTime"))
    noteRemover = JSON.parse(localStorage.getItem("noteRemover"))
    shower = JSON.parse(localStorage.getItem("shower"))
    timerMode = !JSON.parse(localStorage.getItem("timerMode"))
    gridHistory = JSON.parse(localStorage.getItem("gridHistory"))
    historyIndex = gridHistory.length;
    switchTimer()
    undo();
};

function init(){
    table = document.createElement("table");
    table.className = "board"

    document.body.appendChild(table);

    for(let y = 0; y < 9; y++){
        let tmpTr = document.createElement("tr");
        tmpTr.className = "board"

        let tmpGrid = [];
        for(let x = 0; x < 10; x++){
            if(x < 9){

            
                let tmpTd = document.createElement("td");
                tmpTd.className = "board"
                let tmpSelect = document.createElement("input");
                tmpSelect.type = "text";
                
                tmpSelect.setAttribute("onkeypress","return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 49 && event.charCode <= 57))")
                tmpSelect.setAttribute("onclick","this.focus();let length = this.value.length;this.setSelectionRange(length, length);selectedInput = {x:"+x+",y:"+y+"};for(let y = 0; y < 9; y++){for(let x = 0; x < 9; x++){if(grid[y][x].td.style.backgroundColor === colors.notCorrectMarked){grid[y][x].td.style.backgroundColor = colors.notCorrect;}}};fixVisualizer();")
                
                tmpTd.setAttribute("onmousedown","if(noteMode == true){grid["+y+"]["+x+"].noteSelect = true}for(let y = 0; y < 9; y++){for(let x = 0; x < 9; x++){if(grid[y][x].td.style.backgroundColor === colors.marked){grid[y][x].td.style.backgroundColor = colors.background;};if(grid[y][x].td.style.backgroundColor === colors.notCorrectMarked){grid[y][x].td.style.backgroundColor = colors.notCorrect;}}};selectedInput = {x:"+x+",y:"+y+"};if(grid["+y+"]["+x+"].td.style.backgroundColor === colors.notCorrect && grid["+y+"]["+x+"].locked === true){grid["+y+"]["+x+"].td.style.backgroundColor = colors.notCorrectMarked;fixVisualizer();return;};if(grid["+y+"]["+x+"].td.style.backgroundColor === colors.background && grid["+y+"]["+x+"].locked === true){grid["+y+"]["+x+"].td.style.backgroundColor = colors.marked;fixVisualizer();return;};")

                tmpSelect.setAttribute("oninput","if(this.value.length > 1){this.value = this.value.split('')[this.value.split('').length-1]};grid["+y+"]["+x+"].possibleNotes = [];for(let y = 0; y < 3; y++){for(let x = 0; x < 3; x++){grid["+y+"]["+x+"].noteElm.children[x].children[y].innerText = ' '}};updateChanged("+y+","+x+");updateTable();fixVisualizer();checkRemoveNote("+x+","+y+");");
                tmpSelect.style.background = "transparent";
                tmpSelect.style.display = "block";

                let tmpNote = document.createElement("table");
                for(let y = 0; y < 3; y++){
                    let tmpNoteTr = document.createElement("tr");
                    for(let x = 0; x < 3; x++){
                        let tmpNoteTd = document.createElement("td");
                        tmpNoteTd.innerText = " "
                        tmpNoteTd.className = "note"
                        tmpNoteTr.appendChild(tmpNoteTd)
                    }
                    tmpNote.appendChild(tmpNoteTr)
                }
                tmpNote.className = "note"

                tmpNote.setAttribute("onclick","if(noteMode === true){if(this.className === 'selected'){for(let y = 0; y < 9; y++){for(let x = 0; x < 9; x++){grid[y][x].noteSelect = false;grid[y][x].noteElm.className = 'note';if(grid[y][x].td.style.backgroundColor === colors.notCorrectMarked){grid[y][x].td.style.backgroundColor = colors.notCorrect;}else{grid[y][x].td.style.backgroundColor = colors.background;}}};return;}for(let y = 0; y < 9; y++){for(let x = 0; x < 9; x++){grid[y][x].noteSelect = false;grid[y][x].noteElm.className = 'note';if(grid[y][x].td.style.backgroundColor === colors.notCorrectMarked){grid[y][x].td.style.backgroundColor = colors.notCorrect;};if(grid[y][x].td.style.backgroundColor === colors.marked){grid[y][x].td.style.backgroundColor = colors.background;}}};grid["+y+"]["+x+"].noteSelect = true;grid["+y+"]["+x+"].td.style.backgroundColor = colors.marked;}");

                tmpGrid.push({td:tmpTd,select:tmpSelect,possibleValues:[],locked:false,value:0,noteElm:tmpNote,noteSelect:false,possibleNotes:[]});
                tmpTd.appendChild(tmpSelect)
                tmpTd.appendChild(tmpNote)
                tmpTr.appendChild(tmpTd);
            }else{
                let tmpTd = document.createElement("td");
                tmpTd.colSpan = 3;
                tmpTd.className = "board"


                if(buttons.length>y){
                    let tmpButton = document.createElement("button");
                    tmpButton.setAttribute("onclick",buttons[y].onClick);
                    tmpButton.setAttribute("onmousedown","selectedInput = {x:undefined,y:undefined};fixVisualizer()")
                    tmpButton.innerText = buttons[y].name;
                    if(buttons[y].changeOff !== undefined && buttons[y].changeOn !== undefined && buttons[y].variable !== undefined){
                        setTimeout(() => {
                            if(eval(buttons[y].variable) === true){
                                tmpButton.innerText += buttons[y].changeOn;
                            }else{
                                tmpButton.innerText += buttons[y].changeOff;
                            }                 
                        }, 15);

                    }
                    tmpButton.className = "button-19"
                    tmpButton.id = buttons[y].id
                    buttons[y].button = tmpButton;
                    tmpTd.appendChild(tmpButton);
                }


                tmpTr.appendChild(tmpTd);

            }
        }
        grid.push(tmpGrid)
        table.appendChild(tmpTr);
    }
    if(gridHistory[historyIndex] != grid){
        gridHistory.push(JSON.parse(JSON.stringify(grid)));
    }
}

function changeNote(elm){
    let buttonNumber;
    if(settingOn === false){
        for (let i = 0; i < buttons.length; i++) {
            if(elm.id == buttons[i].id){
                buttonNumber = i;
            }
        }
    }
    if(noteMode === false){
        noteMode = true;
        if(settingOn === false){
            elm.innerText = buttons[buttonNumber].name + buttons[buttonNumber].changeOn
        }
        if(selectedInput.x !== undefined && selectedInput.y !== undefined){
            grid[selectedInput.y][selectedInput.x].noteSelect = true;
        }
        noteBytGrejPil(selectedInput.x,selectedInput.y,0,0)
        document.activeElement.blur();

        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){

                
                if(grid[y][x].value === 0){
                    
                    grid[y][x].select.style.zIndex = "0";   
                    grid[y][x].select.disabled = true;
                }
                
            }
        }
        return;
    }else{
        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){
                if(grid[y][x].noteSelect === true){

                    selectedInput = {x:x,y:y}

                    if(grid[y][x].locked == true){
                        grid[y][x].select.disabled = true;
                    }else{
                        grid[y][x].select.disabled = false;
                    }
                    if(grid[y][x].locked !== true && grid[y][x].select.disabled == false){
                        grid[y][x].select.focus();
                    }
                    grid[y][x].select.style.zIndex = "100";
                    
                }
            }
        }
        for(let y = 0; y < 9; y++){for(let x = 0; x < 9; x++){grid[y][x].noteSelect = false;grid[y][x].noteElm.className = 'note';}}
        noteMode = false;
        if(settingOn === false){
            elm.innerText = buttons[buttonNumber].name + buttons[buttonNumber].changeOff;
        }
        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){
                if(grid[y][x].td.style.backgroundColor === colors.notCorrectMarked  && grid[y][x].locked === false){
                    grid[y][x].td.style.backgroundColor = colors.notCorrect;
                }
                if(grid[y][x].td.style.backgroundColor !== colors.notCorrect && grid[y][x].locked === false){
                    if(shower == false || grid[y][x].select.value === ''){
                        grid[y][x].td.style.backgroundColor = colors.background;
                    }
                }
                if(grid[y][x].value === 0){
                    grid[y][x].select.style.zIndex = "100";
                    if(grid[y][x].locked !== true){
                        grid[y][x].select.disabled = false;
                    }else{
                        grid[y][x].select.disabled = true;
                    }
                }
                fixVisualizer();
            }
        }

        return;
    }
}

function checkRemoveNote(x2,y2){
    if(noteRemover === true){
        let value = grid[y2][x2].value;
        if(value !== 0){
            let newGrid = [];
            for(let y = 0; y < 9; y++){
                let tmp = [];
                for(let x = 0; x < 9; x++){
                    let tmp2 = {value:''};
                    grid[y][x].possibleNotes.forEach(x =>{
                        if(x == value){
                            tmp2.value = x
                        }
                    })
                    tmp.push(tmp2)
                }
                newGrid.push(tmp)
            }
            newGrid[y2][x2].value = value
            let temp = isPossibleMove(newGrid,y2,x2,value)
            if(temp !== true){
                let index = grid[temp.y][temp.x].possibleNotes.indexOf(JSON.stringify(value));
                grid[temp.y][temp.x].possibleNotes.splice(index,1)
                grid[temp.y][temp.x].noteElm.children[Math.floor((value-1)/3)].children[(value-1)%3].innerText = " "
                checkRemoveNote(x2,y2)

            }
            for(let y = 0; y < 9; y++){
                for(let x = 0; x < 9; x++){
                    if(newGrid[y][x] !== ''){
                    }
                }
            }
    
        }
    }
}

function updateTable(){
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            grid[y][x].select.disabled = grid[y][x].locked;
            if(grid[y][x].value !== undefined && grid[y][x].value !== 0){
                grid[y][x].select.value = grid[y][x].value;
            }else{
                grid[y][x].select.value = "";
            };
            let temp = isPossibleMove(grid,x,y,grid[x][y].value);

            if(temp === true || grid[x][y].value == 0){
                grid[x][y].td.style.backgroundColor = colors.background;
            }
            if(temp !== true && grid[x][y].value !== 0){
                grid[x][y].td.style.backgroundColor = colors.notCorrect;
                grid[temp.y][temp.x].td.style.backgroundColor = colors.notCorrect
                lastTemp = temp;
            }
        };
    };

    
};

function updateChanged(x,y){
    if(grid[x][y].select.value !== ""){
        if(JSON.parse(grid[x][y].select.value) < 1 || JSON.parse(grid[x][y].select.value) > 9){
            grid[x][y].select.value = "";
        };
        grid[x][y].value = JSON.parse(grid[x][y].select.value);
    }else{
        grid[x][y].value = 0;
    }
    
    if(gridHistory[historyIndex] != grid){
        if(historyIndex < gridHistory.length-1){
            gridHistory = gridHistory.splice(0, historyIndex+1);
        }
        gridHistory.push(JSON.parse(JSON.stringify(grid)));
        historyIndex++;
        save()
    }

};

let lastTemp = {x:0,y:0}

init();

function undo(){
    if( noteMode == true){
        changeNote(document.getElementById("changeNote"))
    }
    if(historyIndex > 0){
        historyIndex--;
        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){
                grid[y][x].value = JSON.parse(JSON.stringify(gridHistory[historyIndex]))[y][x].value;
                grid[y][x].locked = JSON.parse(JSON.stringify(gridHistory[historyIndex]))[y][x].locked;
                grid[y][x].possibleNotes = JSON.parse(JSON.stringify(gridHistory[historyIndex]))[y][x].possibleNotes;

                for(let x2 = 0; x2 < 3; x2++){
                    for(let y2 = 0; y2 < 3; y2++){
                        grid[y][x].noteElm.children[x2].children[y2].innerText = " "
                    }
                }

                for(let i = 0; i < grid[y][x].possibleNotes.length; i++){
                    grid[y][x].noteElm.children[Math.floor((JSON.parse(grid[y][x].possibleNotes[i])-1)/3)].children[(JSON.parse(grid[y][x].possibleNotes[i])-1)%3].innerText = grid[y][x].possibleNotes[i]
                }
            }
        }
        updateTable();
    }
    save();
}
function redo(){
    if( noteMode == true){
        changeNote(document.getElementById("changeNote"))
    }
    if(historyIndex < gridHistory.length-1){
        historyIndex++;
        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){
                grid[y][x].value = JSON.parse(JSON.stringify(gridHistory[historyIndex]))[y][x].value;
                grid[y][x].locked = JSON.parse(JSON.stringify(gridHistory[historyIndex]))[y][x].locked;
                grid[y][x].possibleNotes = JSON.parse(JSON.stringify(gridHistory[historyIndex]))[y][x].possibleNotes;
            
                for(let x2 = 0; x2 < 3; x2++){
                    for(let y2 = 0; y2 < 3; y2++){
                        grid[y][x].noteElm.children[x2].children[y2].innerText = " "
                    }
                }

                for(let i = 0; i < grid[y][x].possibleNotes.length; i++){
                    grid[y][x].noteElm.children[Math.floor((JSON.parse(grid[y][x].possibleNotes[i])-1)/3)].children[(JSON.parse(grid[y][x].possibleNotes[i])-1)%3].innerText = grid[y][x].possibleNotes[i]
                }
            }
        }
        updateTable();
    }
    save();
}

async function solveSolve(grid){
    if( noteMode == true){
        changeNote(document.getElementById("changeNote"))
    }
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            for(let x2 = 0; x2 < 3; x2++){
                for(let y2 = 0; y2 < 3; y2++){
                    grid[y][x].noteSelect = false;
                    grid[y][x].possibleNotes = [];
                    grid[y][x].noteElm.children[x2].children[y2].innerText = " "
                }
            }
        }
    }
    let s = performance.now()
    grid = await solve(grid).then(e =>{
        console.log(`It Took ${performance.now() - s} Milliseconds To Solve The Sudoku`)
        updateTable()
        gridHistory.push(JSON.parse(JSON.stringify(grid)));
        historyIndex = gridHistory.length-1
        save()
    });
}
let loading = false;

async function getSudoku(difficulty){
    if(loading === false){
        loading = true;
        let tmp = document.createElement("img");
        tmp.id = "loading";
        tmp.src = "./loading.gif";
        document.body.appendChild(tmp)
        document.getElementById("loading").style.width = "100vh"
        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){
                grid[y][x].td.className = "loading"
            }
        }
        clearThisShit();
        await sleep(100);
        generateSudoku(difficulty).then(e => {
            loading = false;
            document.getElementById("loading").remove();
            gridHistory = []
            gridHistory.push(JSON.parse(JSON.stringify(grid)));
            timerTime = 0;
            save()
            for(let y = 0; y < 9; y++){
                for(let x = 0; x < 9; x++){
                    grid[y][x].td.className = "board"
                }
            }
        });
    }

}
async function restart(){
    if( noteMode == true){
        changeNote(document.getElementById("changeNote"))
    }

    historyIndex = 1;
    undo();

    updateTable();
    
    gridHistory.push(JSON.parse(JSON.stringify(grid)));
    save()
}

async function clearThisShit(){
    if( noteMode == true){
        changeNote(document.getElementById("changeNote"))
    }
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            grid[y][x].value = 0;
            grid[y][x].locked = false;
            grid[y][x].possibleNotes = [];
            for(let x2 = 0; x2 < 3; x2++){
                for(let y2 = 0; y2 < 3; y2++){
                    grid[y][x].noteElm.children[x2].children[y2].innerText = " "
                }
            }
        }
    }
    updateTable();
    gridHistory = []
    
    gridHistory.push(JSON.parse(JSON.stringify(grid)));
    save()
}

function moveCursorToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

