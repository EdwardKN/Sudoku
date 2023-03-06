var table;

var gridHistory = [];

var historyIndex = 0;

var noteMode = false;

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
});

window.addEventListener("load",function(e){
    load();
})

function save(){
    localStorage.setItem("gridHistory", JSON.stringify(gridHistory));
    console.log("save")
};

function load(){
    gridHistory = JSON.parse(localStorage.getItem("gridHistory"))
    historyIndex = gridHistory.length;
    undo();
    console.log("load")
};

function init(){
    table = document.createElement("table");
    table.className = "board"

    document.body.appendChild(table);

    for(let y = 0; y < 9; y++){
        let tmpTr = document.createElement("tr");
        tmpTr.className = "board"

        let tmpGrid = [];
        for(let x = 0; x < 9; x++){
            let tmpTd = document.createElement("td");
            tmpTd.className = "board"
            let tmpSelect = document.createElement("input");
            tmpSelect.type = "text";
            tmpSelect.setAttribute("onkeypress","return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 49 && event.charCode <= 57))")
            tmpSelect.setAttribute("onclick","this.focus();let length = this.value.length;this.setSelectionRange(length, length);")
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

            tmpNote.setAttribute("onclick","if(noteMode === true){if(this.className === 'selected'){for(let y = 0; y < 9; y++){for(let x = 0; x < 9; x++){grid[y][x].noteSelect = false;grid[y][x].noteElm.className = 'note';grid[y][x].td.style.backgroundColor = 'white'}};return;}for(let y = 0; y < 9; y++){for(let x = 0; x < 9; x++){grid[y][x].noteSelect = false;grid[y][x].noteElm.className = 'note';grid[y][x].td.style.backgroundColor = 'white'}};grid["+y+"]["+x+"].noteSelect = true;grid["+y+"]["+x+"].td.style.backgroundColor = 'lightgray';this.className = 'selected';}");
            
            tmpGrid.push({td:tmpTd,select:tmpSelect,possibleValues:[],locked:false,value:0,noteElm:tmpNote,noteSelect:false,possibleNotes:[]});
            tmpTd.appendChild(tmpSelect)
            tmpTd.appendChild(tmpNote)
            tmpTr.appendChild(tmpTd);

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
                if(grid[y][x].value === 0){
                    grid[y][x].select.style.zIndex = "0";
                    grid[y][x].select.disabled = true;
                }
            }
        }
        return;
    }else{
        for(let y = 0; y < 9; y++){for(let x = 0; x < 9; x++){grid[y][x].noteSelect = false;grid[y][x].noteElm.className = 'note';grid[y][x].td.style.backgroundColor = 'white'}}
        noteMode = false;
        elm.innerText = "Anteckningar(Av)"

        for(let y = 0; y < 9; y++){
            for(let x = 0; x < 9; x++){
                if(grid[y][x].value === 0){
                    grid[y][x].select.style.zIndex = "100";
                    grid[y][x].select.disabled = false;
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
                grid[x][y].td.style.backgroundColor = 'white';
            }
            if(temp !== true && grid[x][y].value !== 0){
                grid[x][y].td.style.backgroundColor = 'red';
                grid[temp.y][temp.x].td.style.backgroundColor = 'red'
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
    grid = await solve3(grid).then(e =>{
        updateTable()
        gridHistory.push(JSON.parse(JSON.stringify(grid)));
        historyIndex = gridHistory.length-1
        save()
    });
}


function setTestValues(difficulty){

    let grids = [
        [
            [
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 1
                },
                {
                    "value": 9
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 3
                }
            ],
            [
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 8
                },
                {
                    "value": 0
                },
                {
        
                    "value": 1
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 5
                },
                {
                    "value": 0
                }
            ],
            [
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 6
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 4
                }
            ],
            [
                {
        
                    "value": 8
                },
                {
                    "value": 0
                },
                {
        
                    "value": 6
                },
                {
        
                    "value": 2
                },
                {
        
                    "value": 5
                },
                {
        
                    "value": 7
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 1
                }
            ],
            [
                {
        
                    "value": 3
                },
                {
                    "value": 0
                },
                {
        
                    "value": 7
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 8
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
    
                }
            ],
            [
                {
                    "value": 0
                },
                {
        
                    "value": 2
                },
                {
                    "value": 0
                },
                {
        
                    "value": 1
                },
                {
                    "value": 0
                },
                {
        
                    "value": 3
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 9
                }
            ],
            [
                {
        
                    "value": 2
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 6
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 3
                },
                {
        
                    "value": 5
                }
            ],
            [
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 3
                },
                {
        
                    "value": 8
                },
                {
        
                    "value": 2
                },
                {
                    "value": 0
                },
                {
        
                    "value": 4
                },
                {
                    "value": 0
                },
                {
        
                    "value": 6
                }
            ],
            [
                {
                    "value": 0
                },
                {
        
                    "value": 7
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 3
                },
                {
        
                    "value": 4
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                }
            ]
        ],
        [
            [
                {
                    "value": 3
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 1
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 7
                }
            ],
            [
                {
                    "value": 7
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 9
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                }
            ],
            [
                {
                    "value": 0
                },
                {
                    "value": 6
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 3
                }
            ],
            [
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 7
                },
                {
        
                    "value": 2
                },
                {
                    "value": 8
                },
                {
                    "value": 4
                },
                {
                    "value": 0
    
                }
            ],
            [
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 2
    
                }
            ],
            [
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 6
                },
                {
        
                    "value": 5
                },
                {
                    "value": 0
                },
                {
        
                    "value": 4
                },
                {
                    "value": 0
                },
                {
                    "value": 3
                },
                {
        
                    "value": 0
                }
            ],
            [
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 8
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 0
                }
            ],
            [
                {
                    "value": 0
                },
                {
                    "value": 7
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 3
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 2
                },
                {
        
                    "value": 9
                }
            ],
            [
                {
                    "value": 0
                },
                {
        
                    "value": 9
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 6
                },
                {
                    "value": 1
                },
                {
                    "value": 0
                },
                {
                    "value": 5
                }
            ]
        ],
        [
            [
                {
                    "value": 2
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 7
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 3
                }
            ],
            [
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 1
                },
                {
                    "value": 6
                },
                {
        
                    "value": 8
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 9
                },
                {
                    "value": 0
                }
            ],
            [
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 1
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                }
            ],
            [
                {
        
                    "value": 5
                },
                {
                    "value": 3
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 4
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                }
            ],
            [
                {
        
                    "value": 0
                },
                {
                    "value": 9
                },
                {
        
                    "value": 0
                },
                {
                    "value": 1
                },
                {
                    "value": 6
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 7
                },
                {
                    "value": 0
    
                }
            ],
            [
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 6
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 2
                },
                {
                    "value": 0
                },
                {
                    "value": 4
                },
                {
        
                    "value": 0
                }
            ],
            [
                {
        
                    "value": 1
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 4
                },
                {
                    "value": 8
                },
                {
                    "value": 0
                },
                {
        
                    "value": 3
                },
                {
        
                    "value": 0
                }
            ],
            [
                {
                    "value": 0
                },
                {
                    "value": 2
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 9
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                }
            ],
            [
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 4
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                }
            ]
        ],
        [
            [
                {
                    "value": 6
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 4
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 5
                },
                {
        
                    "value": 0
                }
            ],
            [
                {
                    "value": 7
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 8
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                }
            ],
            [
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 5
                },
                {
        
                    "value": 0
                },
                {
                    "value": 6
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                }
            ],
            [
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 5
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 1
                },
                {
                    "value": 0
                },
                {
                    "value": 2
                },
                {
        
                    "value": 0
                }
            ],
            [
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 6
                },
                {
        
                    "value": 8
                },
                {
                    "value": 3
                },
                {
                    "value": 0
                },
                {
                    "value": 0
    
                }
            ],
            [
                {
                    "value": 0
                },
                {
        
                    "value": 9
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 6
                }
            ],
            [
                {
        
                    "value": 0
                },
                {
                    "value": 8
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 5
                },
                {
                    "value": 0
                },
                {
        
                    "value": 7
                },
                {
        
                    "value": 0
                }
            ],
            [
                {
                    "value": 2
                },
                {
                    "value": 4
                },
                {
        
                    "value": 7
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                }
            ],
            [
                {
                    "value": 1
                },
                {
        
                    "value": 0
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                },
                {
        
                    "value": 0
                },
                {
        
                    "value": 3
                },
                {
                    "value": 9
                },
                {
                    "value": 0
                },
                {
                    "value": 0
                }
            ]
        ]
    ]

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


