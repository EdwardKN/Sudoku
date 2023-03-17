var table;

var gridHistory = [];

var historyIndex = 0;

var noteMode = false;

var grids;

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

var buttons = [
    {
        name:"Lätt",
        onClick:"setTestValues(0)"
    },
    {
        name:"Medel",
        onClick:"setTestValues(1)"
    },
    {
        name:"Svår",
        onClick:"setTestValues(2)"
    },
    {
        name:"Expert",
        onClick:"setTestValues(3)"
    },
    {
        name:"Lös",
        onClick:"solveSolve(grid)"
    },
    {
        name:"Rensa",
        onClick:"clearThisShit()"
    },
    {
        name:"Anteckningar",
        onClick:"changeNote(this)",
        id:"changeNote",
        changeOff:"(Av)",
        changeOn:("(På)")
    },
    {
        name:"Undo",
        onClick:"undo()"
    },
    {
        name:"Redo",
        onClick:"redo()"
    }
]

readTextFile("testpussel.json", function(text){
    grids = JSON.parse(text);
});

var grid = [];
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
            if(grid[selectedInput.y][selectedInput.x].td.style.backgroundColor !== colors.notCorrect){
                grid[selectedInput.y][selectedInput.x].td.style.backgroundColor = colors.marked;
            }else{
                grid[selectedInput.y][selectedInput.x].td.style.backgroundColor = colors.notCorrectMarked;
            }
            
            if(grid[selectedInput.y-changeY][selectedInput.x-changeX].td.style.backgroundColor === colors.notCorrectMarked){
                grid[selectedInput.y-changeY][selectedInput.x-changeX].td.style.backgroundColor = colors.notCorrect
            }
            if(grid[selectedInput.y-changeY][selectedInput.x-changeX].td.style.backgroundColor !== colors.notCorrect){
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
                            grid[y+changeY][x+changeX].noteSelect.className = 'selected';
                        
            grid[y+changeY][x+changeX].noteSelect = true
        }
    }
}

window.addEventListener("load",function(e){
    load();
})

function save(){
    localStorage.setItem("gridHistory", JSON.stringify(gridHistory));
};

function load(){
    gridHistory = JSON.parse(localStorage.getItem("gridHistory"))
    historyIndex = gridHistory.length;
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
                tmpSelect.setAttribute("onclick","this.focus();let length = this.value.length;this.setSelectionRange(length, length);selectedInput = {x:"+x+",y:"+y+"};for(let y = 0; y < 9; y++){for(let x = 0; x < 9; x++){if(grid[y][x].td.style.backgroundColor === colors.notCorrectMarked){grid[y][x].td.style.backgroundColor = colors.notCorrect;}}};")
                tmpSelect.setAttribute("oninput","if(this.value.length > 1){this.value = this.value.split('')[this.value.split('').length-1]};grid["+y+"]["+x+"].possibleNotes = [];for(let y = 0; y < 3; y++){for(let x = 0; x < 3; x++){grid["+y+"]["+x+"].noteElm.children[x].children[y].innerText = ' '}};updateChanged("+y+","+x+");updateTable();");
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

                tmpNote.setAttribute("onclick","if(noteMode === true){if(this.className === 'selected'){for(let y = 0; y < 9; y++){for(let x = 0; x < 9; x++){grid[y][x].noteSelect = false;grid[y][x].noteElm.className = 'note';if(grid[y][x].td.style.backgroundColor === colors.notCorrectMarked){grid[y][x].td.style.backgroundColor = colors.notCorrect;}else{grid[y][x].td.style.backgroundColor = colors.background;}}};return;}for(let y = 0; y < 9; y++){for(let x = 0; x < 9; x++){grid[y][x].noteSelect = false;grid[y][x].noteElm.className = 'note';if(grid[y][x].td.style.backgroundColor === colors.notCorrectMarked){grid[y][x].td.style.backgroundColor = colors.notCorrect;};if(grid[y][x].td.style.backgroundColor === colors.marked){grid[y][x].td.style.backgroundColor = colors.background;}}};grid["+y+"]["+x+"].noteSelect = true;grid["+y+"]["+x+"].td.style.backgroundColor = colors.marked;this.className = 'selected';}");

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
                    tmpButton.innerText = buttons[y].name 
                    if(buttons[y].changeOff !== undefined){
                        tmpButton.innerText += buttons[y].changeOff;
                    }
                    tmpButton.className = "button-19"
                    tmpButton.id = buttons[y].id
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
    if(noteMode === false){
        noteMode = true;
        elm.innerText = "Anteckningar(På)"

        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){
                if(grid[y][x].select === document.activeElement){
                    grid[y][x].noteSelect = true;
                    noteBytGrejPil(x,y,0,0)
                    document.activeElement.blur();
                }
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
        elm.innerText = "Anteckningar(Av)"

        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){
                if(grid[y][x].td.style.backgroundColor === colors.notCorrectMarked  && grid[y][x].locked === false){
                    grid[y][x].td.style.backgroundColor = colors.notCorrect;
                }
                if(grid[y][x].td.style.backgroundColor !== colors.notCorrect && grid[y][x].locked === false){
                    grid[y][x].td.style.backgroundColor = colors.background;
                }
                if(grid[y][x].value === 0){
                    grid[y][x].select.style.zIndex = "100";
                    if(grid[y][x].locked !== true){
                        grid[y][x].select.disabled = false;
                    }else{
                        grid[y][x].select.disabled = true;
                    }
                }
            }
        }

        return;
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
    grid = await solve(grid).then(e =>{
        updateTable()
        gridHistory.push(JSON.parse(JSON.stringify(grid)));
        historyIndex = gridHistory.length-1
        save()
    });
}


function setTestValues(difficulty){


    if( noteMode == true){
        changeNote(document.getElementById("changeNote"))
    }
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            
            grid[y][x].value = grids[difficulty][y][x].value;
            if(grids[difficulty][y][x].value === 0){
                grid[y][x].locked = false
            }else{
                grid[y][x].locked = true
            }

        };
    };
    updateTable();
    gridHistory = []
    gridHistory.push(JSON.parse(JSON.stringify(grid)));
    save()
};

function clearThisShit(){
    if( noteMode == true){
        changeNote(document.getElementById("changeNote"))
    }
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            grid[y][x].value = 0;
            grid[y][x].locked = false;
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

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

